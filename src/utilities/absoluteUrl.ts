/**
 * Absolute URL for a site path or a media URL. Storage drivers (S3 public URL,
 * Vercel Blob) already return absolute URLs; local ones return a path.
 */
export const absoluteUrl = (siteUrl: string, url: string): string =>
  /^https?:\/\//i.test(url) ? url : siteUrl + url
