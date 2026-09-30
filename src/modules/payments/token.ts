import { createHmac, timingSafeEqual } from 'node:crypto'

export const DOWNLOAD_TTL_MS = 72 * 60 * 60 * 1000

const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64url')
// Domain-separated key: never reuse PAYLOAD_SECRET as-is for another purpose.
const mac = (data: string, secret: string) =>
  createHmac('sha256', `${secret}:download-token`).update(data).digest()

/** Signed, expiring download token: base64url("purchaseId.expiresAt") + "." + base64url(hmac). */
export const signDownloadToken = (
  purchaseId: string | number,
  secret: string,
  ttlMs = DOWNLOAD_TTL_MS,
  now = Date.now(),
): string => {
  const data = b64(`${purchaseId}.${now + ttlMs}`)
  return `${data}.${b64(mac(data, secret))}`
}

/** Returns the purchase id if the token is authentic and unexpired, else null. */
export const verifyDownloadToken = (
  token: string,
  secret: string,
  now = Date.now(),
): string | null => {
  const [data, sig, extra] = token.split('.')
  if (!data || !sig || extra !== undefined) return null
  const given = Buffer.from(sig, 'base64url')
  const expected = mac(data, secret)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null
  const [id, exp] = Buffer.from(data, 'base64url').toString().split('.')
  if (!id || !exp || !(Number(exp) > now)) return null
  return id
}
