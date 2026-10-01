// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { createLimiter } from '@/modules/payments/rateLimit'

describe('createLimiter', () => {
  it('blocks after max hits and resets after the window', () => {
    const allowed = createLimiter(2, 1000)
    expect([allowed('a', 0), allowed('a', 1), allowed('a', 2)]).toEqual([true, true, false])
    expect(allowed('b', 2)).toBe(true)
    expect(allowed('a', 1000)).toBe(true)
  })
  it('stays bounded by evicting the oldest key', () => {
    const allowed = createLimiter(1, 1000, 2)
    allowed('a', 0)
    allowed('b', 0)
    allowed('c', 0) // evicts a
    expect(allowed('a', 0)).toBe(true)
  })
})
