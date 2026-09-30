import type { Endpoint, PayloadHandler, PayloadRequest } from 'payload'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { Readable } from 'node:stream'

import { privateFilesDir } from '../../collections/PrivateFiles'
import { isFeatureEnabledForReq } from '../../utilities/features'
import { downloadUrl, sendDownloadEmail, siteUrlFor } from './email'
import { getStripe } from './stripe'
import { verifyDownloadToken } from './token'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isLocale = (v: unknown): v is 'fr' | 'en' => v === 'fr' || v === 'en'
const json = (body: unknown, status = 200) => Response.json(body, { status })
const off = () => json({ error: 'Not found' }, 404)

const readBody = async (req: PayloadRequest): Promise<Record<string, unknown> | null> => {
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

export const checkout: PayloadHandler = gated(async (req) => {
  const b = await readBody(req)
  if (!b) return json({ error: 'Invalid body' }, 400)
  const { paidDownloadId, email, locale, waiverAccepted, waiverText } = b
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) return json({ error: 'Invalid email' }, 400)
  if (waiverAccepted !== true || typeof waiverText !== 'string' || !waiverText.trim())
    return json({ error: 'Withdrawal waiver must be accepted' }, 400)
  if (!isLocale(locale)) return json({ error: 'Invalid locale' }, 400)
  if (typeof paidDownloadId !== 'string' && typeof paidDownloadId !== 'number')
    return json({ error: 'Invalid paidDownloadId' }, 400)

  const { payload } = req
  const doc = await payload
    .findByID({ collection: 'paid-downloads', id: paidDownloadId, locale, depth: 0, overrideAccess: true })
    .catch(() => null)
  if (!doc) return json({ error: 'Product not found' }, 404)

  const purchase = await payload.create({
    collection: 'purchases',
    overrideAccess: true,
    data: {
      email: email.toLowerCase(),
      paidDownload: doc.id,
      status: 'pending',
      amount: doc.price,
      currency: doc.currency,
      locale,
      withdrawalWaiver: { acceptedAt: new Date().toISOString(), text: waiverText },
    },
  })

  const siteUrl = await siteUrlFor(payload)
  const prefix = locale === 'fr' ? '' : `/${locale}`
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
    success_url: `${siteUrl}${prefix}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: referer?.startsWith(siteUrl) ? referer : siteUrl,
  })

  await payload.update({
    collection: 'purchases',
    id: purchase.id,
    data: { stripeSessionId: session.id },
    overrideAccess: true,
  })
  return json({ url: session.url })
})

export const stripeWebhook: PayloadHandler = gated(async (req) => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  const sig = req.headers.get('stripe-signature')
  if (!secret || !sig) return json({ error: 'Bad request' }, 400)

  let event
  try {
    event = getStripe().webhooks.constructEvent(await req.text!(), sig, secret)
  } catch {
    return json({ error: 'Invalid signature' }, 400)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    if (session.payment_status === 'paid') {
      const { payload } = req
      const { docs } = await payload.find({
        collection: 'purchases',
        where: { stripeSessionId: { equals: session.id } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      const purchase = docs[0]
      // Idempotent: Stripe retries; only the first delivery flips the status and emails.
      if (purchase && purchase.status !== 'paid') {
        await payload.update({
          collection: 'purchases',
          id: purchase.id,
          data: { status: 'paid', amount: session.amount_total ?? purchase.amount },
          overrideAccess: true,
        })
        try {
          const dl = await payload.findByID({
            collection: 'paid-downloads',
            id: purchase.paidDownload as number | string,
            locale: purchase.locale === 'en' ? 'en' : 'fr',
            depth: 0,
            overrideAccess: true,
          })
          await sendDownloadEmail(payload, purchase, dl.title)
        } catch (err) {
          // Payment is recorded; the buyer can still use the success page or resend.
          payload.logger.error({ err, msg: 'Failed to send download email' })
        }
      }
    }
  }
  return json({ received: true })
})

export const download: PayloadHandler = gated(async (req) => {
  const token = (req.routeParams?.token as string | undefined) ?? ''
  const id = verifyDownloadToken(token, process.env.PAYLOAD_SECRET)
  if (!id) return json({ error: 'Invalid or expired link' }, 403)

  const { payload } = req
  const purchase = await payload
    .findByID({ collection: 'purchases', id, depth: 0, overrideAccess: true })
    .catch(() => null)
  if (!purchase || purchase.status !== 'paid') return json({ error: 'Invalid or expired link' }, 403)

  const dl = await payload
    .findByID({ collection: 'paid-downloads', id: purchase.paidDownload as number | string, depth: 0, overrideAccess: true })
    .catch(() => null)
  const file = dl
    ? await payload
        .findByID({ collection: 'private-files', id: dl.file as number | string, depth: 0, overrideAccess: true })
        .catch(() => null)
    : null
  // ponytail: local disk only; with an S3 adapter, read via the storage adapter/signed URL instead.
  if (!file?.filename || path.basename(file.filename) !== file.filename) return json({ error: 'File not found' }, 404)

  const full = path.join(privateFilesDir, file.filename)
  const size = (await stat(full).catch(() => null))?.size
  if (size === undefined) return json({ error: 'File not found' }, 404)

  return new Response(Readable.toWeb(createReadStream(full)) as ReadableStream, {
    headers: {
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Length': String(size),
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
      'Cache-Control': 'private, no-store',
    },
  })
})

// ponytail: in-memory, per instance; use Redis (or DB) if running several instances.
const hits = new Map<string, { n: number; reset: number }>()
const WINDOW_MS = 60 * 60 * 1000
const MAX_HITS = 3
const allowed = (key: string, now = Date.now()) => {
  for (const [k, v] of hits) if (v.reset < now) hits.delete(k)
  const h = hits.get(key) ?? { n: 0, reset: now + WINDOW_MS }
  h.n++
  hits.set(key, h)
  return h.n <= MAX_HITS
}

export const resend: PayloadHandler = gated(async (req) => {
  const same = () => json({ ok: true })
  const b = await readBody(req)
  if (!b || typeof b.email !== 'string' || !EMAIL_RE.test(b.email)) return json({ error: 'Invalid email' }, 400)
  const { paidDownloadId } = b
  if (typeof paidDownloadId !== 'string' && typeof paidDownloadId !== 'number') return json({ error: 'Invalid paidDownloadId' }, 400)

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const email = b.email.toLowerCase()
  if (!allowed(`${ip}|${email}`)) return same()

  const { payload } = req
  const { docs } = await payload.find({
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
  }).catch(() => ({ docs: [] }))
  const purchase = docs[0]
  if (purchase) {
    const locale = isLocale(b.locale) ? b.locale : purchase.locale === 'en' ? 'en' : 'fr'
    try {
      const dl = await payload.findByID({ collection: 'paid-downloads', id: paidDownloadId, locale, depth: 0, overrideAccess: true })
      await sendDownloadEmail(payload, { ...purchase, locale }, dl.title)
    } catch (err) {
      payload.logger.error({ err, msg: 'Failed to resend download email' })
    }
  }
  return same()
})

export const checkoutStatus: PayloadHandler = gated(async (req) => {
  const sessionId = req.searchParams?.get('session_id')
  if (!sessionId) return json({ error: 'Missing session_id' }, 400)
  const { docs } = await req.payload.find({
    collection: 'purchases',
    where: { stripeSessionId: { equals: sessionId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const p = docs[0]
  if (!p) return json({ error: 'Not found' }, 404)
  // The session id acts as a bearer secret (unguessable, known only to the buyer).
  return json(
    p.status === 'paid'
      ? { status: 'paid', downloadUrl: downloadUrl(await siteUrlFor(req.payload), p.id) }
      : { status: p.status },
  )
})

export const paymentsEndpoints: Endpoint[] = [
  { path: '/checkout', method: 'post', handler: checkout },
  { path: '/checkout/status', method: 'get', handler: checkoutStatus },
  { path: '/webhooks/stripe', method: 'post', handler: stripeWebhook },
  { path: '/downloads/resend', method: 'post', handler: resend },
  { path: '/downloads/:token', method: 'get', handler: download },
]
