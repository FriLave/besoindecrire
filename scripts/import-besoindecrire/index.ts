/**
 * Besoin d'Écrire: initial content import (pages, posts, media, navigation, redirects).
 *
 * Usage: pnpm import:site
 * DESTRUCTIVE: empties pages, posts, media, forms, redirects and resets header/footer first.
 * Meant to run once on a fresh database, before the client starts editing in the admin.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import config from '@payload-config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import { getPayload, type CollectionSlug, type File } from 'payload'

import { contactForm, contactFormTranslation } from '@/endpoints/seed/contact-form'
import { legalPage, type LegalKind } from '@/endpoints/seed/legal-pages'
import { preserveIds } from '@/endpoints/seed/preserve-ids'
import { type Locale } from '@/utilities/getLocalizedPath'

import {
  mediaFiles,
  navigation,
  pageRedirects,
  pages,
  siteCopy,
  type Ctx,
  type MediaKey,
  type PageKey,
} from './content'

const dir = path.dirname(fileURLToPath(import.meta.url))
const payload = await getPayload({ config })
const editorConfig = await editorConfigFactory.default({ config: payload.config })
const context = { disableRevalidate: true }
const log = (m: string) => payload.logger.info(`— ${m}`)

const toLexical = (source: string) =>
  convertHTMLToLexical({ editorConfig, html: source.replace(/\n/g, ''), JSDOM })

/** Replaces every `html()` marker (see content.ts) with Lexical JSON. */
const convert = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map(convert) as T
  if (value && typeof value === 'object') {
    if ('__html' in value) return toLexical((value as { __html: string }).__html) as T
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, convert(v)])) as T
  }
  return value
}

const file = async (rel: string, name = path.basename(rel)): Promise<File> => {
  const data = await fs.readFile(path.join(dir, rel))
  return { name, data, mimetype: 'image/webp', size: data.byteLength }
}

// 1. Wipe ------------------------------------------------------------------------
log('Clearing content...')
for (const global of ['header', 'footer'] as const) {
  await payload.updateGlobal({ slug: global, data: { navItems: [] }, context })
}
// Sequential: parallel deletes of FK-linked tables deadlock (Postgres 40P01).
const wipe: CollectionSlug[] = [
  'redirects',
  'search',
  'form-submissions',
  'pages',
  'posts',
  'forms',
  'categories',
]
for (const collection of wipe) {
  await payload.db.deleteMany({ collection, where: {} })
  if (payload.collections[collection].config.versions) {
    await payload.db.deleteVersions({ collection, where: {} })
  }
}
await payload.delete({ collection: 'media', where: {}, depth: 0, context }) // also removes the files

// 2. Media -------------------------------------------------------------------------
log('Uploading media...')
const mediaIds = {} as Record<MediaKey, number>
for (const [key, m] of Object.entries(mediaFiles) as [MediaKey, (typeof mediaFiles)[MediaKey]][]) {
  const caption = 'caption' in m ? m.caption : undefined
  const doc = await payload.create({
    collection: 'media',
    data: { alt: m.alt.fr, ...(caption ? { caption: toLexical(`<p>${caption.fr}</p>`) } : {}) },
    file: await file(`media/${m.file}`),
  })
  await payload.update({
    collection: 'media',
    id: doc.id,
    locale: 'en',
    data: { alt: m.alt.en, ...(caption ? { caption: toLexical(`<p>${caption.en}</p>`) } : {}) },
  })
  mediaIds[key] = doc.id
}

// 3. Contact form ------------------------------------------------------------------
log('Creating contact form...')
const form = await payload.create({ collection: 'forms', depth: 0, data: contactForm('fr') })
await payload.update({
  collection: 'forms',
  id: form.id,
  locale: 'en',
  data: preserveIds(form, contactFormTranslation('en')),
})

// 4. Legal pages (boilerplate templates; the facts come from site-settings) --------------
log('Creating legal pages...')
// No CGV (termsOfSale): its block needs the payments module, still off (books sold via Stripe links).
const legalKinds: LegalKind[] = ['legalNotice', 'privacyPolicy', 'terms']
const legalIds: Partial<Record<LegalKind, number>> = {}
for (const kind of legalKinds) {
  const doc = await payload.create({
    collection: 'pages',
    depth: 0,
    context,
    data: legalPage(kind, 'fr'),
  })
  await payload.update({
    collection: 'pages',
    id: doc.id,
    locale: 'en',
    depth: 0,
    context,
    data: preserveIds(doc, legalPage(kind, 'en')),
  })
  legalIds[kind] = doc.id
}

// 5. Pages ---------------------------------------------------------------------------
const pageIds = {} as Record<PageKey, number>
const ctx = (locale: Locale): Ctx => ({
  locale,
  form: form.id,
  media: (k) => mediaIds[k],
  page: (k) => {
    if (!pageIds[k])
      throw new Error(`Page "${k}" is linked before it is created: reorder content.ts`)
    return pageIds[k]
  },
})

for (const def of pages) {
  log(`Page ${def.slug.fr}...`)
  const fr = convert({ ...def.build(ctx('fr')), slug: def.slug.fr, _status: 'published' as const })
  const doc = await payload.create({ collection: 'pages', depth: 0, context, data: fr })
  pageIds[def.key] = doc.id
  const en = convert({ ...def.build(ctx('en')), slug: def.slug.en, _status: 'published' as const })
  await payload.update({
    collection: 'pages',
    id: doc.id,
    locale: 'en',
    depth: 0,
    context,
    data: preserveIds(doc, en),
  })
}

// 6. Posts -----------------------------------------------------------------------------
type PostMeta = { slug: string; title: string; date: string; excerpt: string; image: string }
type PostMetaEn = { frSlug: string; slug: string; title: string; excerpt: string }
const readJson = async <T>(rel: string): Promise<T> =>
  JSON.parse(await fs.readFile(path.join(dir, rel), 'utf8')) as T

const postsFr = await readJson<PostMeta[]>('posts/fr/posts.json')
const postsEn = [
  ...(await readJson<PostMetaEn[]>('posts/en/meta-1.json')),
  ...(await readJson<PostMetaEn[]>('posts/en/meta-2.json')),
]
// The WordPress excerpts repeat the title and stop mid-sentence: describe the post with its first
// paragraph instead, cut at a word boundary.
const describe = (source: string) => {
  const first = /<p>(.*?)<\/p>/s.exec(source)?.[1] ?? ''
  const s = first
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return s.length <= 155 ? s : s.slice(0, s.lastIndexOf(' ', 152)) + '…'
}

const postIds: Record<string, number> = {}
for (const p of postsFr) {
  log(`Post ${p.slug}...`)
  const en = postsEn.find((e) => e.frSlug === p.slug)
  if (!en) throw new Error(`Missing English translation for post ${p.slug}`)
  const image = await payload.create({
    collection: 'media',
    data: { alt: p.title },
    file: await file(`media/posts/${p.slug}.webp`),
  })
  await payload.update({ collection: 'media', id: image.id, locale: 'en', data: { alt: en.title } })

  const source = (locale: Locale) =>
    fs.readFile(path.join(dir, `posts/${locale}/${p.slug}.html`), 'utf8')
  const content = async (locale: Locale) => toLexical(await source(locale))

  const doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context,
    data: {
      title: p.title,
      slug: p.slug,
      heroImage: image.id,
      content: await content('fr'),
      meta: { title: p.title, description: describe(await source('fr')), image: image.id },
      publishedAt: p.date,
      _status: 'published',
    },
  })
  await payload.update({
    collection: 'posts',
    id: doc.id,
    locale: 'en',
    depth: 0,
    context,
    data: {
      title: en.title,
      slug: en.slug,
      content: await content('en'),
      meta: { title: en.title, description: en.excerpt, image: image.id },
      _status: 'published',
    },
  })
  postIds[p.slug] = doc.id
}

// 7. Navigation & site settings -------------------------------------------------------------
log('Navigation and site settings...')
await payload.updateGlobal({ slug: 'feature-flags', context, data: { blog: true } })
const navFr = navigation(ctx('fr'))
const header = await payload.updateGlobal({ slug: 'header', context, depth: 0, data: navFr.header })
const footer = await payload.updateGlobal({ slug: 'footer', context, depth: 0, data: navFr.footer })
const navEn = navigation(ctx('en'))
await payload.updateGlobal({
  slug: 'header',
  locale: 'en',
  context,
  data: preserveIds(header, navEn.header),
})
await payload.updateGlobal({
  slug: 'footer',
  locale: 'en',
  context,
  data: preserveIds(footer, navEn.footer),
})

await payload.updateGlobal({
  slug: 'site-settings',
  context,
  data: {
    ...siteCopy.fr,
    // Only the facts known for sure: the admin shows a warning in preview for the missing ones.
    legal: { publicationDirector: 'Paulin Hassika' },
    legalPages: legalIds,
  },
})
await payload.updateGlobal({ slug: 'site-settings', locale: 'en', context, data: siteCopy.en })

// 8. Redirects from the old WordPress URLs (FR) -----------------------------------------------
log('Redirects...')
const redirect = (from: string, to: Record<string, unknown>) =>
  payload.create({ collection: 'redirects', context, data: { from, to } as never })

for (const r of pageRedirects) {
  await redirect(r.from, {
    type: 'reference',
    reference: { relationTo: 'pages', value: pageIds[r.to] },
  })
}
for (const [slug, id] of Object.entries(postIds)) {
  // WordPress served posts at the site root.
  await redirect(`/${slug}`, { type: 'reference', reference: { relationTo: 'posts', value: id } })
}

log(`Done: ${pages.length + legalKinds.length} pages, ${postsFr.length} posts.`)
// Writes skip revalidation (no Next server here): a running `pnpm dev` keeps serving cached data.
log('Restart `pnpm dev` after `rm -rf .next/dev/cache` to see the imported content.')
process.exit(0)
