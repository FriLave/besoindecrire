import type { Metadata } from 'next/types'
import { skipBuildDb } from '@/utilities/skipBuildDb'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound, permanentRedirect } from 'next/navigation'
import React from 'react'

import { modules } from '@/client/modules'
import { BLOG_PAGE_SIZE, BlogArchive } from '@/components/BlogArchive'
import { getUI } from '@/i18n/ui'
import { generateMeta } from '@/utilities/generateMeta'
import { isFeatureEnabled } from '@/utilities/features'
import { getLocalizedPath, isLocale, type Locale } from '@/utilities/getLocalizedPath'

export const revalidate = 600

type Args = { params: Promise<{ locale: string; pageNumber: string }> }

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (skipBuildDb() || !modules.blog || !(await isFeatureEnabled('blog'))) return []

  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    locale: params.locale as Locale,
    overrideAccess: false,
  })

  // Page 1 is `/blog` itself, so numbering starts at 2.
  return Array.from({ length: Math.max(Math.ceil(totalDocs / BLOG_PAGE_SIZE) - 1, 0) }, (_, i) => ({
    pageNumber: String(i + 2),
  }))
}

export default async function Page({ params }: Args) {
  const { locale, pageNumber } = await params
  const page = Number(pageNumber)
  if (!isLocale(locale) || !Number.isInteger(page) || page < 1) notFound()
  if (!(await isFeatureEnabled('blog'))) notFound()
  if (page === 1) permanentRedirect(getLocalizedPath(locale, '', 'posts'))

  return <BlogArchive locale={locale} page={page} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale, pageNumber } = await params
  if (!isLocale(locale) || !(await isFeatureEnabled('blog'))) return {}

  const ui = getUI(locale)
  return generateMeta({
    doc: { meta: { title: `${ui.blog.title} - ${ui.blog.pageNumber(Number(pageNumber))}` } },
    locale,
    slug: `page/${pageNumber}`,
    collection: 'posts',
  })
}
