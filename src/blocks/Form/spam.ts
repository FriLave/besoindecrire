// Shared by the Form block (client) and the form-submissions hook (server): keep it dependency-free.

/** Hidden input humans never fill; bots that fill every input do. Sent as a submissionData row. */
export const HONEYPOT_FIELD = 'contact_url_confirm'
/** Ms between render and submit, measured on the client clock (no client/server clock skew). */
export const FILL_MS_FIELD = '_fillMs'
export const MIN_FILL_MS = 2000
export const MAX_VALUE_LENGTH = 5000

type Row = { field?: string | null; value?: unknown }

export type SubmissionVerdict = 'honeypot' | 'tooFast' | 'unknownField' | 'tooLong' | 'duplicate'

/**
 * Checks raw submissionData rows against the form's field names.
 * Returns the cleaned rows (control rows removed) or the reason it was rejected.
 */
export const inspectSubmission = (
  rows: Row[],
  allowedNames: ReadonlySet<string>,
): { rows: Row[] } | { reject: SubmissionVerdict } => {
  const seen = new Set<string>()
  const kept: Row[] = []
  let fillMs = NaN

  for (const row of rows) {
    const name = String(row?.field ?? '')
    if (name === HONEYPOT_FIELD) {
      if (row.value) return { reject: 'honeypot' }
      continue
    }
    if (name === FILL_MS_FIELD) {
      fillMs = Number(row.value)
      continue
    }
    if (!allowedNames.has(name)) return { reject: 'unknownField' }
    if (seen.has(name)) return { reject: 'duplicate' }
    seen.add(name)
    if (String(row.value ?? '').length > MAX_VALUE_LENGTH) return { reject: 'tooLong' }
    kept.push(row)
  }

  // Missing/invalid duration counts as too fast: a real browser always sends it.
  if (!(fillMs >= MIN_FILL_MS)) return { reject: 'tooFast' }
  return { rows: kept }
}
