/** Retention of contact-form submissions (CNIL: 3 years after the last contact for prospects). */
export const RETENTION_YEARS = 3

/** Submissions created before the returned date must be purged. Pure, for testing. */
export const retentionCutoff = (now: Date = new Date(), years: number = RETENTION_YEARS): Date => {
  const d = new Date(now)
  d.setUTCFullYear(d.getUTCFullYear() - years)
  return d
}
