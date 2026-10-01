import type { CollectionSlug, PayloadRequest, Where } from 'payload'

const BATCH_SIZE = 100

type Page = { docs: { id: number | string }[] }

/**
 * Deletes matching docs `BATCH_SIZE` at a time (bounded memory/transaction) and returns the count.
 * `payload.delete` has no `limit` (it loads every match), so the batch is picked with `find` first.
 */
export const purgeInBatches = async (
  req: PayloadRequest,
  collection: CollectionSlug,
  where: Where,
): Promise<number> => {
  // Generic over every collection slug, so the result types collapse: narrow by hand.
  const find = req.payload.find.bind(req.payload) as (args: unknown) => Promise<Page>
  const del = req.payload.delete.bind(req.payload) as (args: unknown) => Promise<Page>
  let total = 0
  for (;;) {
    const { docs } = await find({
      collection,
      where,
      limit: BATCH_SIZE,
      depth: 0,
      pagination: false,
      select: { id: true },
      req,
    })
    if (docs.length === 0) return total
    const deleted = await del({
      collection,
      where: { id: { in: docs.map((d) => d.id) } },
      depth: 0,
      select: { id: true },
      req,
    })
    total += deleted.docs.length
    // Short batch = done; nothing deleted = the same docs would be picked forever (e.g. locked docs).
    if (docs.length < BATCH_SIZE || deleted.docs.length === 0) return total
  }
}
