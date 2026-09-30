import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import type { CardPostData } from '@/components/Card'
import { CollectionArchive } from '@/components/CollectionArchive'
import { getUI } from '@/i18n/ui'
import { Search } from '@/search/Component'
import { isFeatureEnabled } from '@/utilities/features'
import { isLocale, locales } from '@/utilities/getLocalizedPath'
import PageClient from './page.client'

type Args = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    q?: string
  }>
}

export default async function Page({ params, searchParams: searchParamsPromise }: Args) {
  const { locale } = await params
  if (!isLocale(locale) || !(await isFeatureEnabled('blog'))) notFound()

  const ui = getUI(locale)
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    locale,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              { title: { like: query } },
              { 'meta.description': { like: query } },
              { 'meta.title': { like: query } },
              { slug: { like: query } },
            ],
          },
        }
      : {}),
  })

  const otherLocale = locales.find((candidate) => candidate !== locale) ?? locale

  return (
    <div className="pt-24 pb-24">
      <PageClient alternateLink={{ locale: otherLocale, slug: 'search' }} />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">{ui.search.title}</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search locale={locale} />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive locale={locale} posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">{ui.search.noResults}</div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale) || !(await isFeatureEnabled('blog'))) return {}

  return { robots: { index: false }, title: getUI(locale).search.title }
}
