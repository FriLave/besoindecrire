// @vitest-environment node
import { getPayload, type Payload, type PayloadRequest } from 'payload'
import Stripe from 'stripe'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { stripeWebhook } from '@/modules/payments/endpoints'

const whsec = 'whsec_test_fake'

describe('stripe webhook: fallback, expiry, atomic paid transition', () => {
  let payload: Payload
  const sendEmail = vi.fn(async () => ({}))
  const created: (number | string)[] = []
  const cleanup: { collection: 'paid-downloads' | 'private-files'; id: number | string }[] = []
  const PDF =
    '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[]/Count 0>>endobj\nxref\n0 1\ntrailer<</Root 1 0 R>>\n%%EOF\n'

  const send = (type: string, session: object) => {
    const body = JSON.stringify({
      id: `evt_${Date.now()}`,
      object: 'event',
      type,
      data: { object: { object: 'checkout.session', ...session } },
    })
    const sig = Stripe.webhooks.generateTestHeaderString({ payload: body, secret: whsec })
    return stripeWebhook(
      Object.assign(
        new Request('http://localhost/api/webhooks/stripe', {
          method: 'POST',
          body,
          headers: { 'stripe-signature': sig },
        }),
        { payload, context: {} },
      ) as unknown as PayloadRequest,
    )
  }

  beforeAll(async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_fake'
    process.env.STRIPE_WEBHOOK_SECRET = whsec
    payload = await getPayload({ config: await config })
    payload.sendEmail = sendEmail
  })

  afterAll(async () => {
    for (const id of created)
      await payload.delete({ collection: 'purchases', id, overrideAccess: true }).catch(() => {})
    for (const { collection, id } of cleanup.reverse())
      await payload.delete({ collection, id, overrideAccess: true }).catch(() => {})
  })

  it('500 when no purchase matches, so Stripe retries', async () => {
    const res = await send('checkout.session.completed', {
      id: 'cs_unknown',
      payment_status: 'paid',
    })
    expect(res.status).toBe(500)
  })

  it('expired session deletes the pending purchase; unknown is a no-op', async () => {
    const file = await payload.create({
      collection: 'private-files',
      overrideAccess: true,
      data: {},
      file: {
        data: Buffer.from(PDF),
        mimetype: 'application/pdf',
        name: `w-${Date.now()}.pdf`,
        size: PDF.length,
      },
    })
    cleanup.push({ collection: 'private-files', id: file.id })
    const dl = await payload.create({
      collection: 'paid-downloads',
      overrideAccess: true,
      data: {
        title: 'Guide',
        slug: `w-${Date.now()}`,
        price: 990,
        currency: 'eur',
        file: file.id,
      },
    })
    cleanup.push({ collection: 'paid-downloads', id: dl.id })
    const p = await payload.create({
      collection: 'purchases',
      overrideAccess: true,
      data: {
        email: 'x@example.com',
        paidDownload: dl.id,
        status: 'pending',
        stripeSessionId: 'cs_exp',
      },
    })
    created.push(p.id)
    expect((await send('checkout.session.expired', { id: 'cs_exp' })).status).toBe(200)
    await expect(
      payload.findByID({ collection: 'purchases', id: p.id, overrideAccess: true }),
    ).rejects.toThrow()
    expect((await send('checkout.session.expired', { id: 'cs_none' })).status).toBe(200)
  })
})
