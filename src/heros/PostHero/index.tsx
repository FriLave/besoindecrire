import { formatDateTime } from '@/utilities/formatDateTime'
import { getUI } from '@/i18n/ui'
import type { Locale } from '@/utilities/getLocalizedPath'
import React from 'react'

import type { Post } from '@/payload-types'

import { Eyebrow } from '@/components/Eyebrow'
import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

/** Chapter opening of a post: categories as label, large title, author and date, then the image. */
export const PostHero: React.FC<{
  locale: Locale
  post: Post
}> = ({ locale, post }) => {
  const ui = getUI(locale)
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const categoryNames = (categories ?? [])
    .map((c) => (typeof c === 'object' && c !== null ? c.title || ui.blog.untitledCategory : null))
    .filter(Boolean)
  const authors =
    populatedAuthors && populatedAuthors.length > 0 ? formatAuthors(populatedAuthors) : ''

  return (
    <header className="container mt-6 md:mt-12">
      <div className="mx-auto max-w-3xl text-center">
        {categoryNames.length > 0 && <Eyebrow>{categoryNames.join(', ')}</Eyebrow>}
        <h1 className="text-4xl leading-tight md:text-5xl">{title}</h1>
        {(publishedAt || authors) && (
          <p className="mt-5 text-[0.9375rem] text-muted-foreground">
            {authors && <span>{authors}, </span>}
            {publishedAt && (
              <time dateTime={publishedAt}>{formatDateTime(publishedAt, locale)}</time>
            )}
          </p>
        )}
      </div>
      {heroImage && typeof heroImage === 'object' && (
        <div className="relative mx-auto mt-10 aspect-[3/2] max-w-5xl overflow-hidden rounded-sm bg-muted md:mt-14">
          <Media
            fill
            imgClassName="object-cover"
            priority
            resource={heroImage}
            size="(max-width: 1024px) 100vw, 64rem"
          />
        </div>
      )}
    </header>
  )
}
