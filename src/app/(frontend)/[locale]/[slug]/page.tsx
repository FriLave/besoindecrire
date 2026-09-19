import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { locales, type Locale } from '@/utilities/getLocalizedPath'
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
    locale: Locale
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale, slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/' + decodedSlug
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects locale={locale} url={url} />
  }

  const { hero, layout } = page

  const otherLocale = locales.find((candidate) => candidate !== locale) ?? locale
  let alternateSlug = 'home'
  if (page !== homeStatic && typeof page.id === 'number') {
    alternateSlug = await queryAlternateSlug({ id: page.id, locale: otherLocale })
  }
  const alternateLink: AlternateLocaleLink = { locale: otherLocale, slug: alternateSlug }

  return (
    <article className="pt-16 pb-24">
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
  const { locale, slug = 'home' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryPageBySlug({
    slug: decodedSlug,
    locale,
  })

  return generateMeta({ doc: page })
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
