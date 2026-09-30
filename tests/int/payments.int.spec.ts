// @vitest-environment node
import { getPayload, type Payload, type PayloadRequest } from 'payload'
import Stripe from 'stripe'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { checkout, download, resend, stripeWebhook } from '@/modules/payments/endpoints'
import { signDownloadToken, verifyDownloadToken } from '@/modules/payments/token'

const secret = 's3cret'
const PDF = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\nxref\n0 1\ntrailer<</Root 1 0 R>>\n%%EOF\n'

describe('download token', () => {
  it('signs and verifies', () => {
    expect(verifyDownloadToken(signDownloadToken(42, secret), secret)).toBe('42')
  })
  it('rejects expired, tampered and wrong-secret tokens', () => {
    const now = Date.now()
    const t = signDownloadToken(42, secret, 1000, now)
    expect(verifyDownloadToken(t, secret, now + 2000)).toBeNull()
    expect(verifyDownloadToken(t, 'other', now)).toBeNull()
    const [data, sig] = t.split('.')
    const forged = Buffer.from(`43.${now + 1000}`).toString('base64url')
    expect(verifyDownloadToken(`${forged}.${sig}`, secret, now)).toBeNull()
    expect(verifyDownloadToken(`${data}.x${sig}`, secret, now)).toBeNull()
    expect(verifyDownloadToken('garbage', secret)).toBeNull()
  })
})

describe('payments endpoints', () => {
  let payload: Payload
  let originalFlag: boolean
  const context = { disableRevalidate: true }
  const webhookSecret = 'whsec_test_fake'
  const cleanup: { collection: 'purchases' | 'paid-downloads' | 'private-files'; id: number | string }[] = []
  const sendEmail = vi.fn(async () => ({}))

  const setFlag = (payments: boolean) =>
    payload.updateGlobal({ slug: 'feature-flags', data: { payments }, overrideAccess: true, context })
  const mkReq = (url: string, init: RequestInit = {}, extra: object = {}) =>
    Object.assign(new Request(url, init), {
      payload,
      context: {},
      searchParams: new URL(url).searchParams,
      ...extra,
    }) as unknown as PayloadRequest
  const post = (path: string, body: unknown) =>
    mkReq(`http://localhost/api${path}`, { method: 'POST', body: JSON.stringify(body) })

  beforeAll(async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_fake'
    process.env.STRIPE_WEBHOOK_SECRET = webhookSecret
    payload = await getPayload({ config: await config })
    originalFlag = Boolean((await payload.findGlobal({ slug: 'feature-flags' })).payments)
    await setFlag(true)
    payload.sendEmail = sendEmail as unknown as Payload['sendEmail']
  })

  afterAll(async () => {
    for (const { collection, id } of cleanup.reverse())
      await payload.delete({ collection, id, overrideAccess: true }).catch(() => {})
    await setFlag(originalFlag)
  })

  it('checkout: 400 without waiver, 404 when flag off', async () => {
    const body = { paidDownloadId: 1, email: 'a@b.co', locale: 'fr', waiverText: 'x' }
    expect((await checkout(post('/checkout', { ...body, waiverAccepted: false }))).status).toBe(400)
    expect((await checkout(post('/checkout', { ...body }))).status).toBe(400)
    expect((await checkout(post('/checkout', { ...body, waiverAccepted: true, email: 'nope' }))).status).toBe(400)
    await setFlag(false)
    expect((await checkout(post('/checkout', { ...body, waiverAccepted: true }))).status).toBe(404)
    await setFlag(true)
  })

  it('webhook -> paid + email; idempotent; bad signature 400; download gated by token + paid', async () => {
    const file = await payload.create({
      collection: 'private-files',
      overrideAccess: true,
      data: {},
      file: { data: Buffer.from(PDF), mimetype: 'application/pdf', name: `t-${Date.now()}.pdf`, size: PDF.length },
    })
    cleanup.push({ collection: 'private-files', id: file.id })
    const dl = await payload.create({
      collection: 'paid-downloads',
      overrideAccess: true,
      data: { title: 'Guide', slug: `guide-${Date.now()}`, price: 990, currency: 'eur', file: file.id },
    })
    cleanup.push({ collection: 'paid-downloads', id: dl.id })
    const sessionId = `cs_test_${Date.now()}`
    const purchase = await payload.create({
      collection: 'purchases',
      overrideAccess: true,
      data: { email: 'buyer@example.com', paidDownload: dl.id, stripeSessionId: sessionId, status: 'pending', locale: 'en' },
    })
    cleanup.push({ collection: 'purchases', id: purchase.id })

    // Anonymous can neither read the private file doc nor the file relation.
    await expect(
      payload.find({ collection: 'private-files', overrideAccess: false }),
    ).rejects.toThrow(/not allowed/i)
    const anon = await payload.findByID({ collection: 'paid-downloads', id: dl.id, overrideAccess: false })
    expect(anon.file).toBeUndefined()

    const event = JSON.stringify({
      id: 'evt_1',
      object: 'event',
      type: 'checkout.session.completed',
      data: { object: { id: sessionId, object: 'checkout.session', payment_status: 'paid', amount_total: 990 } },
    })
    const hook = (sig: string) =>
      mkReq('http://localhost/api/webhooks/stripe', { method: 'POST', body: event, headers: { 'stripe-signature': sig } })
    const good = Stripe.webhooks.generateTestHeaderString({ payload: event, secret: webhookSecret })

    expect((await stripeWebhook(hook('t=1,v1=bad'))).status).toBe(400)
    expect(sendEmail).not.toHaveBeenCalled()
    expect((await stripeWebhook(hook(good))).status).toBe(200)
    expect((await payload.findByID({ collection: 'purchases', id: purchase.id })).status).toBe('paid')
    expect(sendEmail).toHaveBeenCalledTimes(1)
    const mail = sendEmail.mock.calls[0] as unknown as [{ to: string; text: string }]
    expect(mail[0].to).toBe('buyer@example.com')
    const link = mail[0].text.match(/\/api\/downloads\/([\w.-]+)/)!
    expect((await stripeWebhook(hook(good))).status).toBe(200)
    expect(sendEmail).toHaveBeenCalledTimes(1)

    const get = (token: string) =>
      download(mkReq(`http://localhost/api/downloads/${token}`, {}, { routeParams: { token } }))
    const ok = await get(link[1])
    expect(ok.status).toBe(200)
    expect(ok.headers.get('cache-control')).toBe('private, no-store')
    expect(ok.headers.get('content-disposition')).toMatch(/^attachment/)
    expect(await ok.text()).toBe(PDF)
    expect((await get('bogus.token')).status).toBe(403)

    // resend: same body whether or not a purchase exists; only real one emails.
    const r1 = await resend(post('/downloads/resend', { email: 'nobody@example.com', paidDownloadId: dl.id, locale: 'fr' }))
    expect(await r1.json()).toEqual({ ok: true })
    expect(sendEmail).toHaveBeenCalledTimes(1)
    const r2 = await resend(post('/downloads/resend', { email: 'buyer@example.com', paidDownloadId: dl.id, locale: 'fr' }))
    expect(await r2.json()).toEqual({ ok: true })
    expect(sendEmail).toHaveBeenCalledTimes(2)
  })
})
