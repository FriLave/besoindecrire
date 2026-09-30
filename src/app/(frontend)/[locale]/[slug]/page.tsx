import type { Metadata } from 'next'

import { skipBuildDb } from '@/utilities/skipBuildDb'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { JsonLd } from '@/components/JsonLd'
import { getUI } from '@/i18n/ui'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { breadcrumbs, organization, website } from '@/utilities/jsonLd'
import { getCachedSiteSettings } from '@/utilities/getGlobals'
import { isFeatureEnabled } from '@/utilities/features'
import { SITE_NAME } from '@/client/site'
import { generateMeta } from '@/utilities/generateMeta'
import {
  getLocalizedPath,
  isLocale,
  locales,
  type Locale,
  type LocalizedValue,
} from '@/utilities/getLocalizedPath'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { AlternateLocaleLink } from '@/providers/AlternateLocale'

export async function generateStaticParams({
  params,
}: {
  params: { locale: string; slug: string }
}) {
  // Next's generated route type always includes the full route's params
  // (parent + own segment) here, even though only `locale` (resolved by
  // the parent `[locale]/layout.tsx`) is actually populated when this is
  // called - `slug` is what this function itself is generating.
  if (skipBuildDb()) return []
  const locale = params.locale as Locale
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    locale,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params_ = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params_ ?? []
}

type Args = {
  params: Promise<{
    // Raw route param, always an unvalidated string at this boundary - see
    // `isLocale` for why. Narrowed to `Locale` via the `isLocale` guard
    // below before it's used anywhere, in particular before any Payload
    // query.
    locale: string
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: localeParam, slug = 'home' } = await paramsPromise
  if (!isLocale(localeParam)) {
    notFound()
  }
  const locale = localeParam
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  let usingStaticFallback = false

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic(locale)
    usingStaticFallback = true
  }

  if (!page) {
    return <PayloadRedirects locale={locale} url={url} />
  }

  const { hero, layout } = page

  const otherLocale = locales.find((candidate) => candidate !== locale) ?? locale
  let alternateSlug = 'home'
  if (!usingStaticFallback && typeof page.id === 'number') {
    alternateSlug = await queryAlternateSlug({ id: page.id, locale: otherLocale })
  }
  const alternateLink: AlternateLocaleLink = { locale: otherLocale, slug: alternateSlug }

  const siteUrl = await getSiteUrl()
  const isHome = decodedSlug === 'home'
  const settings = isHome ? await getCachedSiteSettings(locale)() : null
  const siteName = settings?.siteName || SITE_NAME

  return (
    <article className="pt-16 pb-24">
      {/* Site-wide schemas live on the home page, not in the layout: Next client-renders the
          layout on 404s, where React warns about <script> elements. */}
      {isHome && (
        <>
          <JsonLd data={organization(settings, siteName, siteUrl)} />
          <JsonLd
            data={website(siteName, siteUrl, locale, { search: await isFeatureEnabled('blog') })}
          />
        </>
      )}
      {decodedSlug !== 'home' && (
        <JsonLd
          data={breadcrumbs([
            {
              name: getUI(locale).breadcrumb.home,
              url: siteUrl + getLocalizedPath(locale, 'home'),
            },
            { name: page.title, url: siteUrl + getLocalizedPath(locale, decodedSlug) },
          ])}
        />
      )}
      <PageClient alternateLink={alternateLink} />
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound locale={locale} url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} locale={locale} />
      <RenderBlocks blocks={layout} locale={locale} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam, slug = 'home' } = await paramsPromise
  if (!isLocale(localeParam)) {
    notFound()
  }
  const locale = localeParam
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  const localizedSlugs =
    page && typeof page.id === 'number' ? await queryPageLocalizedSlugs({ id: page.id }) : undefined

  return generateMeta({ doc: page, locale, slug: decodedSlug, localizedSlugs })
}

const queryPageBySlug = cache(async ({ slug, locale }: { slug: string; locale: Locale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    locale,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

/**
 * Resolves a page's slug in EVERY locale in a single query, for building
 * hreflang alternates in `generateMetadata`. Uses `locale: 'all'`, which
 * changes the shape of every localized field on the returned doc (`slug`
 * becomes `{ fr, en }` instead of a plain string) - kept as its own query,
 * separate from `queryPageBySlug`, so that shape never leaks into the
 * page-render path.
 */
const queryPageLocalizedSlugs = cache(async ({ id }: { id: number }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    const doc = await payload.findByID({
      collection: 'pages',
      id,
      depth: 0,
      draft,
      locale: 'all',
      overrideAccess: draft,
      select: {
        slug: true,
      },
    })

    return doc?.slug as unknown as LocalizedValue<string | null | undefined>
  } catch {
    return undefined
  }
})

/**
 * Resolves the current page's slug in the other locale, for the Footer's
 * locale switcher (see `AlternateLocale` provider / `PageClient`). Falls
 * back to `'home'` (never a broken link) when the document has no
 * equivalent - e.g. not yet translated - in that locale.
 */
const queryAlternateSlug = cache(async ({ id, locale }: { id: number; locale: Locale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    const doc = await payload.findByID({
      collection: 'pages',
      id,
      depth: 0,
      draft,
      locale,
      overrideAccess: draft,
    })

    return doc?.slug || 'home'
  } catch {
    return 'home'
  }
})
