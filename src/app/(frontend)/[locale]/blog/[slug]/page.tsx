import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import { modules } from '@/client/modules'
import { PostHero } from '@/heros/PostHero'
import { JsonLd } from '@/components/JsonLd'
import { getUI } from '@/i18n/ui'
import { getCachedSiteSettings } from '@/utilities/getGlobals'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { article, breadcrumbs } from '@/utilities/jsonLd'
import { SITE_NAME } from '@/client/site'
import { generateMeta } from '@/utilities/generateMeta'
import { isFeatureEnabled } from '@/utilities/features'
import { getLocalizedPath, isLocale, locales, type Locale, type LocalizedValue } from '@/utilities/getLocalizedPath'
import PageClient from '@/components/BlogArchive/PageClient'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { AlternateLocaleLink } from '@/providers/AlternateLocale'

export async function generateStaticParams({
  params,
}: {
  params: { locale: string; slug: string }
}) {
  // Only `locale` is populated here (see `[locale]/[slug]/page.tsx`).
  if (!modules.blog || !(await isFeatureEnabled('blog'))) return []

  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    locale: params.locale as Locale,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    locale: string
    slug?: string
  }>
}

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale: localeParam, slug = '' } = await paramsPromise
  if (!isLocale(localeParam) || !(await isFeatureEnabled('blog'))) notFound()
  const locale = localeParam
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/blog/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug, locale })

  if (!post) return <PayloadRedirects locale={locale} url={url} />

  const otherLocale = locales.find((candidate) => candidate !== locale) ?? locale
  const alternateSlug = await queryAlternateSlug({ id: post.id, locale: otherLocale })
  const alternateLink: AlternateLocaleLink = {
    collection: 'posts',
    locale: otherLocale,
    slug: alternateSlug,
  }

  const ui = getUI(locale)
  const siteUrl = await getSiteUrl()
  const settings = await getCachedSiteSettings(locale)()
  const postUrl = siteUrl + getLocalizedPath(locale, decodedSlug, 'posts')
  const logo = settings?.logo
  const logoUrl = typeof logo === 'object' && logo?.url ? siteUrl + logo.url : undefined

  return (
    <article className="pt-16 pb-16">
      <JsonLd
        data={breadcrumbs([
          { name: ui.breadcrumb.home, url: siteUrl + getLocalizedPath(locale, 'home') },
          { name: ui.blog.title, url: siteUrl + getLocalizedPath(locale, '', 'posts') },
          { name: post.title, url: postUrl },
        ])}
      />
      <JsonLd
        data={article(post, postUrl, locale, settings?.siteName || SITE_NAME, siteUrl, logoUrl)}
      />
      <PageClient alternateLink={alternateLink} headerTheme="dark" />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound locale={locale} url={url} />

      {draft && <LivePreviewListener />}

      <PostHero locale={locale} post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText
            className="max-w-[48rem] mx-auto"
            data={post.content}
            enableGutter={false}
            locale={locale}
          />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
              locale={locale}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam, slug = '' } = await paramsPromise
  if (!isLocale(localeParam) || !(await isFeatureEnabled('blog'))) return {}
  const locale = localeParam
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug, locale })

  const localizedSlugs = post ? await queryPostLocalizedSlugs({ id: post.id }) : undefined

  return generateMeta({
    doc: post,
    locale,
    slug: decodedSlug,
    localizedSlugs,
    collection: 'posts',
  })
}

const queryPostBySlug = cache(async ({ slug, locale }: { slug: string; locale: Locale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    locale,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

/** The post's slug in every locale (`locale: 'all'`), for hreflang alternates. */
const queryPostLocalizedSlugs = cache(async ({ id }: { id: number }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    const doc = await payload.findByID({
      collection: 'posts',
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

/** The post's slug in the other locale, for the locale switcher (`''` = blog index fallback). */
const queryAlternateSlug = cache(async ({ id, locale }: { id: number; locale: Locale }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  try {
    const doc = await payload.findByID({
      collection: 'posts',
      id,
      depth: 0,
      draft,
      locale,
      overrideAccess: draft,
      select: { slug: true },
    })

    return doc?.slug || ''
  } catch {
    return ''
  }
})
