import { getLocalizedPath, locales, type Locale, type LocalizedValue } from './getLocalizedPath'

export type SitemapDoc = { slug?: unknown; updatedAt?: string | null }

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const xml = (body: string) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })

/**
 * One `<url>` per locale a doc has a slug in, each carrying the full set of
 * hreflang alternates (itself included, as Google recommends). Docs come from
 * a `locale: 'all'` query, so `slug` is `{ fr, en }`.
 */
export const urlsetResponse = (
  docs: SitemapDoc[],
  collection: 'pages' | 'posts',
  siteUrl: string,
) => {
  const entries: string[] = []

  for (const doc of docs) {
    const slugs = doc.slug as LocalizedValue<string | null | undefined>
    const urls: Partial<Record<Locale, string>> = {}
    for (const locale of locales) {
      if (slugs?.[locale])
        urls[locale] = siteUrl + getLocalizedPath(locale, slugs[locale], collection)
    }
    const available = locales.filter((l) => urls[l])
    const alternates = available
      .map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${esc(urls[l]!)}"/>`)
      .join('')
    const lastmod = doc.updatedAt ? `<lastmod>${esc(doc.updatedAt)}</lastmod>` : ''
    for (const l of available) {
      entries.push(`<url><loc>${esc(urls[l]!)}</loc>${lastmod}${alternates}</url>`)
    }
  }

  return xml(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`,
  )
}

export const sitemapIndexResponse = (locs: string[]) =>
  xml(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locs
      .map((l) => `<sitemap><loc>${esc(l)}</loc></sitemap>`)
      .join('')}</sitemapindex>`,
  )
