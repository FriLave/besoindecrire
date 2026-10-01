import type { CollectionBeforeChangeHook } from 'payload'

import { APIError } from 'payload'

import { countH1 } from '../../../utilities/countH1'

const messages = {
  en: (n: number) =>
    `A published page must contain exactly one H1 (hero title), found ${n}. Use H2-H4 for other headings.`,
  fr: (n: number) =>
    `Une page publiée doit contenir exactement un H1 (titre du hero), ${n} trouvé(s). Utilisez H2-H4 pour les autres titres.`,
}

// Drafts stay free; only publishing is checked. SEO: exactly one H1 per page.
export const enforceSingleH1: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  if (data._status !== 'published') return data
  const merged = { ...originalDoc, ...data }
  const count = countH1([merged.hero, merged.layout])
  if (count !== 1) {
    const lang = req.i18n?.language === 'fr' || req.locale === 'fr' ? 'fr' : 'en'
    throw new APIError(messages[lang](count), 400, undefined, true)
  }
  return data
}
