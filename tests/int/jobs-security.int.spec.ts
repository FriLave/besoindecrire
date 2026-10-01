import { describe, expect, it, vi } from 'vitest'
import type { PayloadRequest } from 'payload'

import { purgeInBatches } from '@/jobs/purgeInBatches'
import { pendingPurchaseCutoff } from '@/jobs/purgePendingPurchases'
import { isCronAuthorized, isValidPreviewSecret } from '@/utilities/safeEqual'

describe('preview secret', () => {
  it('fails closed on empty, missing or placeholder secrets', () => {
    expect(isValidPreviewSecret('', '')).toBe(false)
    expect(isValidPreviewSecret(null, 'abc')).toBe(false)
    expect(isValidPreviewSecret('YOUR_SECRET_HERE', 'YOUR_SECRET_HERE')).toBe(false)
    expect(isValidPreviewSecret('abc', undefined)).toBe(false)
  })
  it('accepts only the exact secret', () => {
    expect(isValidPreviewSecret('s3cret', 's3cret')).toBe(true)
    expect(isValidPreviewSecret('s3cre', 's3cret')).toBe(false)
  })
})

describe('cron authorization', () => {
  it('requires the exact bearer secret', () => {
    expect(isCronAuthorized('Bearer abc', 'abc')).toBe(true)
    expect(isCronAuthorized('Bearer abd', 'abc')).toBe(false)
    expect(isCronAuthorized(null, 'abc')).toBe(false)
    expect(isCronAuthorized('Bearer ', '')).toBe(false)
  })
})

describe('purgeInBatches', () => {
  const batch = (n: number) => ({ docs: Array.from({ length: n }, (_, i) => ({ id: i })) })

  it('picks batches with find (delete has no limit) and sums the deleted docs', async () => {
    const find = vi
      .fn()
      .mockResolvedValueOnce(batch(100))
      .mockResolvedValueOnce(batch(100))
      .mockResolvedValueOnce(batch(7))
    const del = vi
      .fn()
      .mockResolvedValueOnce(batch(100))
      .mockResolvedValueOnce(batch(100))
      .mockResolvedValueOnce(batch(7))
    const req = { payload: { find, delete: del } } as unknown as PayloadRequest
    expect(await purgeInBatches(req, 'purchases', {})).toBe(207)
    expect(find).toHaveBeenCalledTimes(3)
    expect(find.mock.calls[0][0]).toMatchObject({ limit: 100, pagination: false })
    expect(del.mock.calls[2][0].where.id.in).toHaveLength(7)
  })

  it('stops when a full batch deletes nothing instead of looping forever', async () => {
    const find = vi.fn().mockResolvedValue(batch(100))
    const del = vi.fn().mockResolvedValue(batch(0))
    const req = { payload: { find, delete: del } } as unknown as PayloadRequest
    expect(await purgeInBatches(req, 'purchases', {})).toBe(0)
    expect(find).toHaveBeenCalledTimes(1)
  })
})

describe('pendingPurchaseCutoff', () => {
  it('is 7 days before now', () => {
    const now = new Date('2026-01-08T00:00:00Z')
    expect(pendingPurchaseCutoff(now).toISOString()).toBe('2026-01-01T00:00:00.000Z')
  })
})
