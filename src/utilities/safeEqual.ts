import { createHash, timingSafeEqual } from 'node:crypto'

/** Constant-time string comparison (hashing first makes the lengths equal). */
export const safeEqual = (a: string, b: string): boolean =>
  timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest())

const PLACEHOLDER = 'YOUR_SECRET_HERE'

/** Fails closed when the expected secret is unset, empty or still the .env.example placeholder. */
export const isValidPreviewSecret = (
  given: string | null | undefined,
  expected: string | undefined,
): boolean => Boolean(given && expected && expected !== PLACEHOLDER && safeEqual(given, expected))

/** Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. */
export const isCronAuthorized = (header: string | null, secret: string | undefined): boolean =>
  Boolean(secret && header && safeEqual(header, `Bearer ${secret}`))
