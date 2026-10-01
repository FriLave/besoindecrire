import type { CollectionBeforeValidateHook } from 'payload'

import { APIError } from 'payload'

import { inspectSubmission } from '@/blocks/Form/spam'

const message = {
  en: 'Your submission could not be accepted. Please reload the page and try again.',
  fr: "Votre message n'a pas pu être envoyé. Rechargez la page et réessayez.",
}

// Anonymous public endpoint: honeypot, minimum fill time, field names must exist in the form,
// length caps. Local API calls (seed, scripts, tests) are trusted.
// ponytail: no per-IP rate limit, add one (trusted proxy hop) if bots get past the honeypot.
export const validateFormSubmission: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data || req.payloadAPI === 'local') return data

  const reject = () => {
    const lang = req.i18n?.language === 'fr' || req.locale === 'fr' ? 'fr' : 'en'
    return new APIError(message[lang], 400, undefined, true)
  }

  const formID = typeof data.form === 'object' ? data.form?.id : data.form
  const form = formID
    ? await req.payload.findByID({
        collection: 'forms',
        id: formID,
        depth: 0,
        req,
        disableErrors: true,
      })
    : null
  // Unknown form: let the plugin's own `form` validation report it.
  if (!form) return data

  const allowed = new Set(
    (form.fields ?? []).flatMap((f) => ('name' in f && f.name ? [f.name] : [])),
  )
  const result = inspectSubmission(data.submissionData ?? [], allowed)
  if ('reject' in result) throw reject()

  return { ...data, submissionData: result.rows }
}
