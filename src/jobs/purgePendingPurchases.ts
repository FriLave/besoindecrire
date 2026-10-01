import type { TaskConfig } from 'payload'

import { purgeInBatches } from './purgeInBatches'

// Stripe Checkout sessions expire after 24h: a pending purchase older than this will never be paid.
export const PENDING_PURCHASE_TTL_DAYS = 7

export const pendingPurchaseCutoff = (now: Date = new Date()): Date =>
  new Date(now.getTime() - PENDING_PURCHASE_TTL_DAYS * 24 * 60 * 60 * 1000)

// Inline input/output types on purpose: the payments module is optional, so this slug is absent from the
// generated types of a fork without it and a `TaskConfig<'purgePendingPurchases'>` would not compile there.
export const purgePendingPurchases: TaskConfig<{ input: object; output: { deleted: number } }> = {
  slug: 'purgePendingPurchases',
  schedule: [{ cron: '30 3 * * *', queue: 'maintenance' }],
  retries: 2,
  handler: async ({ req }) => {
    const deleted = await purgeInBatches(req, 'purchases', {
      and: [
        { status: { equals: 'pending' } },
        { createdAt: { less_than: pendingPurchaseCutoff().toISOString() } },
      ],
    })
    req.payload.logger.info(`purgePendingPurchases: deleted ${deleted} purchase(s)`)
    return { output: { deleted } }
  },
  outputSchema: [{ name: 'deleted', type: 'number' }],
}
