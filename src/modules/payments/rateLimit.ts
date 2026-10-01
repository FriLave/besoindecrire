/**
 * Fixed-window counter, in memory. Returns `allowed(key)`.
 * ponytail: per instance (useless across several instances / serverless); the DB cooldown on
 * purchases backs it up for resend. Use Redis if real throttling is needed. Bounded: when full the
 * oldest key (first inserted = first to expire, windows are equal) is evicted, O(1).
 */
export const createLimiter = (max: number, windowMs: number, maxKeys = 5000) => {
  const hits = new Map<string, { n: number; reset: number }>()
  return (key: string, now = Date.now()): boolean => {
    let h = hits.get(key)
    if (!h || h.reset <= now) {
      if (hits.size >= maxKeys) hits.delete(hits.keys().next().value!)
      h = { n: 0, reset: now + windowMs }
      hits.set(key, h)
    }
    return ++h.n <= max
  }
}
