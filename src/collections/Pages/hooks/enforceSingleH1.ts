import type { CollectionBeforeChangeHook } from 'payload'

import { APIError, type TypedLocale } from 'payload'

import { countH1 } from '../../../utilities/countH1'

const messages = {
  en: (n: number) =>
    `A published page must contain exactly one H1 (hero title), found ${n}. Use H2-H4 for other headings.`,
  fr: (n: number) =>
    `Une page publiée doit contenir exactement un H1 (titre du hero), ${n} trouvé(s). Utilisez H2-H4 pour les autres titres.`,
}

// Drafts stay free; only publishing is checked. SEO: exactly one H1 per page.
// `data`/`originalDoc` only carry req.locale for localized fields, and publishing is per document,
// so every other locale is loaded from the DB and checked too (when it has content).
export const enforceSingleH1: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  if (data._status !== 'published') return data

  const lang = req.i18n?.language === 'fr' || req.locale === 'fr' ? 'fr' : 'en'
  const fail = (count: number, locale?: string) => {
    throw new APIError(
      `${messages[lang](count)}${locale ? ` (${locale})` : ''}`,
      400,
      undefined,
      true,
    )
  }

  const merged = { ...originalDoc, ...data }
  const count = countH1([merged.hero, merged.layout])
  if (count !== 1) fail(count)

  const { localization } = req.payload.config
  if (!originalDoc?.id || !localization) return data
  const others = (localization.localeCodes as TypedLocale[]).filter((code) => code !== req.locale)

  // The Local API overwrites `req.locale` / `req.fallbackLocale` with the locale it is asked for
  // (createLocalReq). Restore them, or the save in progress is written to the last locale checked
  // (publishing in `en` would overwrite the `fr` content).
  const { fallbackLocale, locale: reqLocale } = req
  try {
    for (const locale of others) {
      const doc = await req.payload.findByID({
        collection: 'pages',
        id: originalDoc.id,
        locale,
        fallbackLocale: false,
        draft: true,
        depth: 0,
        req,
      })
      // An untranslated locale (no title) is not published content yet.
      if (!doc.title) continue
      const n = countH1([doc.hero, doc.layout])
      if (n !== 1) fail(n, locale)
    }
  } finally {
    req.locale = reqLocale
    req.fallbackLocale = fallbackLocale
  }

  return data
}
