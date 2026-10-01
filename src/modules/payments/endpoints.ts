import type { Endpoint, PayloadHandler, PayloadRequest } from 'payload'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'

import { privateFilesDir } from '../../collections/PrivateFiles'
import { getUI } from '../../i18n/ui'
import { isFeatureEnabledForReq } from '../../utilities/features'
import {
  defaultLocale,
  getLocalizedPath,
  isLocale,
  type Locale,
} from '../../utilities/getLocalizedPath'
import { downloadUrl, sendDownloadEmail, siteUrlFor } from './email'
import { createLimiter } from './rateLimit'
import { getStripe } from './stripe'
import { DOWNLOAD_TTL_MS, verifyDownloadToken } from './token'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const HOUR = 60 * 60 * 1000
const MAX_BODY_BYTES = 4096
const toLocale = (v: unknown): Locale | null => (typeof v === 'string' && isLocale(v) ? v : null)
const json = (body: unknown, status = 200, headers?: HeadersInit) =>
  Response.json(body, { status, headers })
const off = () => json({ error: 'Not found' }, 404)

// JSON only (a text/plain "simple" cross-origin POST would otherwise be parsed too) and small.
const readBody = async (req: PayloadRequest): Promise<Record<string, unknown> | null> => {
  if (!req.headers.get('content-type')?.includes('application/json')) return null
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) return null
  try {
    const b = await req.json!()
    return b && typeof b === 'object' ? (b as Record<string, unknown>) : null
  } catch {
    return null
  }
}

// Wraps a handler so it answers 404 while the runtime `payments` flag is off.
const gated =
  (handler: PayloadHandler): PayloadHandler =>
  async (req) =>
    (await isFeatureEnabledForReq(req, 'payments')) ? handler(req) : off()

// Per email+product, plus a global ceiling so rotating emails cannot flood Stripe / the table.
const checkoutLimit = createLimiter(5, HOUR)
const checkoutGlobalLimit = createLimiter(300, HOUR)

export const checkout: PayloadHandler = gated(async (req) => {
  const b = await readBody(req)
  if (!b) return json({ error: 'Invalid body' }, 400)
  const { paidDownloadId, email: rawEmail, waiverAccepted } = b
  if (typeof rawEmail !== 'string' || rawEmail.length > 254 || !EMAIL_RE.test(rawEmail))
    return json({ error: 'Invalid email' }, 400)
  if (waiverAccepted !== true) return json({ error: 'Withdrawal waiver must be accepted' }, 400)
  const locale = toLocale(b.locale)
  if (!locale) return json({ error: 'Invalid locale' }, 400)
  if (typeof paidDownloadId !== 'string' && typeof paidDownloadId !== 'number')
    return json({ error: 'Invalid paidDownloadId' }, 400)

  const email = rawEmail.toLowerCase()
  if (!checkoutLimit(`${email}|${paidDownloadId}`) || !checkoutGlobalLimit('all'))
    return json({ error: 'Too many requests' }, 429)

  const { payload } = req
  const doc = await payload
    .findByID({
      collection: 'paid-downloads',
      id: paidDownloadId,
      locale,
      depth: 0,
      overrideAccess: true,
    })
    .catch(() => null)
  if (!doc) return json({ error: 'Product not found' }, 404)

  const purchase = await payload.create({
    collection: 'purchases',
    overrideAccess: true,
    data: {
      email,
      paidDownload: doc.id,
      status: 'pending',
      amount: doc.price,
      currency: doc.currency,
      locale,
      // The proof of consent is the server-side text the buyer was shown, never client input.
      withdrawalWaiver: {
        acceptedAt: new Date().toISOString(),
        text: getUI(locale).payments.waiver,
      },
    },
  })

  try {
    const siteUrl = await siteUrlFor(payload)
    const referer = req.headers.get('referer')
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      locale,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: doc.currency,
            unit_amount: doc.price,
            product_data: { name: doc.title },
          },
        },
      ],
      metadata: { purchaseId: String(purchase.id) },
      success_url: `${siteUrl}${getLocalizedPath(locale, 'paiement/succes')}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: referer?.startsWith(siteUrl) ? referer : siteUrl,
    })
    await payload.update({
      collection: 'purchases',
      id: purchase.id,
      data: { stripeSessionId: session.id },
      overrideAccess: true,
    })
    return json({ url: session.url })
  } catch (err) {
    // No orphan pending row when Stripe (or the follow-up update) fails.
    payload.logger.error({ err, msg: 'Checkout session creation failed' })
    await payload
      .delete({ collection: 'purchases', id: purchase.id, overrideAccess: true })
      .catch(() => {})
    return json({ error: 'Checkout unavailable' }, 502)
  }
})

// Not gated by the `payments` flag: Stripe must still be able to record a payment made before the
// flag was turned off (a 404 would stop its retries and lose the payment).
export const stripeWebhook: PayloadHandler = async (req) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const sig = req.headers.get('stripe-signature')
  if (!secret || !sig) return json({ error: 'Bad request' }, 400)

  let event
  try {
    event = getStripe().webhooks.constructEvent(await req.text!(), sig, secret)
  } catch {
    return json({ error: 'Invalid signature' }, 400)
  }

  if (event.type !== 'checkout.session.completed' && event.type !== 'checkout.session.expired')
    return json({ received: true })

  const { payload } = req
  const session = event.data.object
  // Set at checkout before the session id is saved: covers a webhook racing that update.
  const purchaseId = session.metadata?.purchaseId
  const bySession = { stripeSessionId: { equals: session.id } }

  if (event.type === 'checkout.session.expired') {
    await payload.delete({
      collection: 'purchases',
      where: {
        and: [
          { status: { equals: 'pending' } },
          { or: [bySession, ...(purchaseId ? [{ id: { equals: purchaseId } }] : [])] },
        ],
      },
      overrideAccess: true,
    })
    return json({ received: true })
  }

  if (session.payment_status !== 'paid') return json({ received: true })

  const found = (
    await payload.find({
      collection: 'purchases',
      where: bySession,
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
  ).docs[0]
  const purchase =
    found ??
    (purchaseId
      ? await payload
          .findByID({ collection: 'purchases', id: purchaseId, depth: 0, overrideAccess: true })
          .catch(() => null)
      : null)
  if (!purchase) {
    // 500 so Stripe retries instead of dropping a payment we cannot attach.
    payload.logger.error({ msg: 'Stripe webhook: purchase not found', sessionId: session.id })
    return json({ error: 'Purchase not found' }, 500)
  }

  // Conditional update: only the delivery that flips pending -> paid gets a doc back and emails.
  // ponytail: Payload's update-many is find + update, not one SQL statement; a truly simultaneous
  // double delivery could still email twice (same valid link). A row lock would be needed to close it.
  const { docs } = await payload.update({
    collection: 'purchases',
    where: { and: [{ id: { equals: purchase.id } }, { status: { not_equals: 'paid' } }] },
    data: {
      status: 'paid',
      paidAt: new Date().toISOString(),
      amount: session.amount_total ?? purchase.amount,
      stripeSessionId: session.id,
    },
    depth: 0,
    overrideAccess: true,
  })
  const paid = docs[0]
  if (!paid) return json({ received: true })

  if (!(await isFeatureEnabledForReq(req, 'payments'))) {
    payload.logger.warn({ msg: 'Payments disabled: purchase recorded, no email sent', id: paid.id })
    return json({ received: true })
  }
  try {
    const dl = await payload.findByID({
      collection: 'paid-downloads',
      id: paid.paidDownload as number | string,
      locale: toLocale(paid.locale) ?? defaultLocale,
      depth: 0,
      overrideAccess: true,
    })
    await sendDownloadEmail(payload, paid, dl.title)
  } catch (err) {
    // Payment is recorded; the buyer can still use the success page or resend.
    payload.logger.error({ err, msg: 'Failed to send download email' })
  }
  return json({ received: true })
}

export const download: PayloadHandler = gated(async (req) => {
  const token = (req.routeParams?.token as string | undefined) ?? ''
  const id = verifyDownloadToken(token, process.env.PAYLOAD_SECRET)
  if (!id) return json({ error: 'Invalid or expired link' }, 403)

  const { payload } = req
  const purchase = await payload
    .findByID({ collection: 'purchases', id, depth: 0, overrideAccess: true })
    .catch(() => null)
  if (!purchase || purchase.status !== 'paid')
    return json({ error: 'Invalid or expired link' }, 403)

  const dl = await payload
    .findByID({
      collection: 'paid-downloads',
      id: purchase.paidDownload as number | string,
      depth: 0,
      overrideAccess: true,
    })
    .catch(() => null)
  const file = dl
    ? await payload
        .findByID({
          collection: 'private-files',
          id: dl.file as number | string,
          depth: 0,
          overrideAccess: true,
        })
        .catch(() => null)
    : null
  if (!file?.filename || path.basename(file.filename) !== file.filename)
    return json({ error: 'File not found' }, 404)

  const headers = {
    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
    'Cache-Control': 'private, no-store',
  }

  // Remote storage (S3...): the storage plugin registers a read handler on the collection.
  const handlers = payload.collections['private-files'].config.upload.handlers ?? []
  for (const handler of handlers) {
    const res = await handler(req, {
      doc: file,
      headers: new Headers(headers),
      params: { collection: 'private-files', filename: file.filename },
    })
    if (res instanceof Response) return res.ok ? res : json({ error: 'File not found' }, 404)
  }

  // Local disk (no storage plugin).
  const full = path.join(privateFilesDir, file.filename)
  const size = (await stat(full).catch(() => null))?.size
  if (size === undefined) return json({ error: 'File not found' }, 404)

  return new Response(Readable.toWeb(createReadStream(full)) as ReadableStream, {
    headers: {
      ...headers,
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Length': String(size),
    },
  })
})

const resendLimit = createLimiter(3, HOUR)
const RESEND_COOLDOWN_MS = 10 * 60 * 1000

// Same answer whatever happens, so it cannot be used to probe which emails bought what.
// Keyed on email+product (not the IP: X-Forwarded-For is client-controlled), with a DB cooldown
// on the purchase that holds across restarts and instances.
export const resend: PayloadHandler = gated(async (req) => {
  const same = () => json({ ok: true })
  const b = await readBody(req)
  if (!b || typeof b.email !== 'string' || b.email.length > 254 || !EMAIL_RE.test(b.email))
    return json({ error: 'Invalid email' }, 400)
  const { paidDownloadId } = b
  if (typeof paidDownloadId !== 'string' && typeof paidDownloadId !== 'number')
    return json({ error: 'Invalid paidDownloadId' }, 400)

  const email = b.email.toLowerCase()
  if (!resendLimit(`${email}|${paidDownloadId}`)) return same()

  const { payload } = req
  const { docs } = await payload
    .find({
      collection: 'purchases',
      where: {
        and: [
          { email: { equals: email } },
          { paidDownload: { equals: paidDownloadId } },
          { status: { equals: 'paid' } },
        ],
      },
      sort: '-createdAt',
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    .catch(() => ({ docs: [] }))
  const purchase = docs[0]
  if (purchase) {
    // Claim the cooldown first; no doc back means another resend happened recently.
    const now = Date.now()
    const claimed = await payload
      .update({
        collection: 'purchases',
        where: {
          and: [
            { id: { equals: purchase.id } },
            {
              or: [
                { lastResentAt: { exists: false } },
                { lastResentAt: { less_than: new Date(now - RESEND_COOLDOWN_MS).toISOString() } },
              ],
            },
          ],
        },
        data: { lastResentAt: new Date(now).toISOString() },
        depth: 0,
        overrideAccess: true,
      })
      .catch(() => ({ docs: [] }))
    if (!claimed.docs.length) return same()

    const locale = toLocale(b.locale) ?? toLocale(purchase.locale) ?? defaultLocale
    try {
      const dl = await payload.findByID({
        collection: 'paid-downloads',
        id: paidDownloadId,
        locale,
        depth: 0,
        overrideAccess: true,
      })
      await sendDownloadEmail(payload, { ...purchase, locale }, dl.title)
    } catch (err) {
      payload.logger.error({ err, msg: 'Failed to resend download email' })
    }
  }
  return same()
})

export const checkoutStatus: PayloadHandler = gated(async (req) => {
  const sessionId = req.searchParams?.get('session_id')
  // The session id is a bearer secret: keep it (and the minted link) out of Referer and caches.
  const headers = { 'Referrer-Policy': 'no-referrer', 'Cache-Control': 'private, no-store' }
  if (!sessionId) return json({ error: 'Missing session_id' }, 400, headers)
  const { docs } = await req.payload.find({
    collection: 'purchases',
    where: { stripeSessionId: { equals: sessionId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const p = docs[0]
  if (!p) return json({ error: 'Not found' }, 404, headers)
  if (p.status !== 'paid') return json({ status: p.status }, 200, headers)
  // Stop minting links once the 72h window since payment is over (the email resend still works).
  const paidAt = new Date(p.paidAt ?? p.updatedAt).getTime()
  if (Date.now() - paidAt > DOWNLOAD_TTL_MS) return json({ status: 'expired' }, 200, headers)
  return json(
    { status: 'paid', downloadUrl: downloadUrl(await siteUrlFor(req.payload), p.id) },
    200,
    headers,
  )
})

export const paymentsEndpoints: Endpoint[] = [
  { path: '/checkout', method: 'post', handler: checkout },
  { path: '/checkout/status', method: 'get', handler: checkoutStatus },
  { path: '/webhooks/stripe', method: 'post', handler: stripeWebhook },
  { path: '/downloads/resend', method: 'post', handler: resend },
  { path: '/downloads/:token', method: 'get', handler: download },
]
