import type { FieldHook } from 'payload'

// Field-level beforeChange on `publishedAt`: stamps the date when a document is published
// (admin, Local API or scheduled job), never on drafts/autosaves.
// previousValue: a partial update (e.g. a scheduled publish) must not overwrite an existing date.
export const populatePublishedAt: FieldHook = ({ previousValue, siblingData, value }) =>
  siblingData._status === 'published' && !value && !previousValue ? new Date() : value
