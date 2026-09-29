import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
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
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  const otherLocale = locales.find((candidate) => candidate !== locale) ?? locale
  const alternatePath = page > 1 ? `page/${page}` : ''

  return (
    <div className="pt-24 pb-24">
      <PageClient
        alternateLink={{ collection: 'posts', locale: otherLocale, slug: alternatePath }}
        headerTheme="light"
      />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{ui.blog.title}</h1>
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
  )
}
