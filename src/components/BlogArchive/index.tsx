import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { Footer } from '@/Footer/Component'
import { getUI } from '@/i18n/ui'
import { locales, type Locale } from '@/utilities/getLocalizedPath'
import PageClient from './PageClient'

export const BLOG_PAGE_SIZE = 12

/** Paginated post listing, shared by `/blog` and `/blog/page/[pageNumber]`. */
export async function BlogArchive({ locale, page }: { locale: Locale; page: number }) {
  const payload = await getPayload({ config: configPromise })
  const ui = getUI(locale)

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: BLOG_PAGE_SIZE,
    locale,
    page,
    sort: '-publishedAt',
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  // Out-of-range page (e.g. posts deleted since): a real 404, not an empty 200.
  if (page > 1 && page > posts.totalPages) notFound()

  const otherLocale = locales.find((candidate) => candidate !== locale) ?? locale
  const alternatePath = page > 1 ? `page/${page}` : ''

  return (
    <>
      <div className="pt-16 pb-24 md:pt-24">
        <PageClient headerTheme="light" />
        <div className="container mb-12">
          <div className="max-w-3xl border-b border-border pb-12">
            <h1 className="text-5xl">{ui.blog.title}</h1>
          </div>
        </div>

        <div className="container mb-8">
          <PageRange
            currentPage={posts.page}
            limit={BLOG_PAGE_SIZE}
            locale={locale}
            totalDocs={posts.totalDocs}
          />
        </div>

        <CollectionArchive locale={locale} posts={posts.docs} />

        <div className="container">
          {posts.totalPages > 1 && posts.page && (
            <Pagination locale={locale} page={posts.page} totalPages={posts.totalPages} />
          )}
        </div>
      </div>
      <Footer
        alternateLink={{ collection: 'posts', locale: otherLocale, slug: alternatePath }}
        locale={locale}
      />
    </>
  )
}
