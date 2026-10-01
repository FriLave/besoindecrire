import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { isFeatureEnabled } from '@/utilities/features'
import type { Locale } from '@/utilities/getLocalizedPath'
import type { CardPostData } from '@/components/Card'
import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
    locale: Locale
  }
> = async (props) => {
  const {
    id,
    locale,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
  } = props

  if (!(await isFeatureEnabled('blog'))) return null

  const limit = limitFromProps || 3

  let posts: CardPostData[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      locale,
      limit,
      sort: '-publishedAt',
      overrideAccess: false,
      draft: false,
      select: { title: true, slug: true, categories: true, meta: true },
      ...(flattenedCategories && flattenedCategories.length > 0
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      // Never surface a post that is not published (draft-only main row).
      posts = selectedDocs.flatMap((post) =>
        typeof post.value === 'object' && post.value._status === 'published' ? [post.value] : [],
      )
    }
  }

  return (
    <div id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText
            className="ms-0 max-w-[48rem]"
            data={introContent}
            enableGutter={false}
            locale={locale}
          />
        </div>
      )}
      <CollectionArchive locale={locale} posts={posts} />
    </div>
  )
}
