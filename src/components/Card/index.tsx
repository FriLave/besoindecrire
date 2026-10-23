'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { getUI } from '@/i18n/ui'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'

export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  locale: Locale
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { cardRef, linkRef } = useClickableCard({})
  const { className, doc, locale, showCategories, title: titleFromProps } = props
  const ui = getUI(locale)

  const { slug, categories, meta, title } = doc || {}
  const { description, image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = getLocalizedPath(locale, slug, 'posts')

  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-sm border border-border bg-card transition-colors hover:cursor-pointer hover:border-brand/50',
        className,
      )}
      ref={cardRef}
    >
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-muted">
        {!metaImage && <div className="p-4 text-muted-foreground">{ui.blog.noImage}</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media fill imgClassName="object-cover" resource={metaImage} size="33vw" />
        )}
      </div>
      <div className="p-6">
        {showCategories && hasCategories && (
          <div className="mb-2 text-sm font-semibold text-brand">
            {categories?.map((category, index) => {
              if (typeof category === 'object') {
                const { title: titleFromCategory } = category

                const categoryTitle = titleFromCategory || ui.blog.untitledCategory

                const isLast = index === categories.length - 1

                return (
                  <Fragment key={index}>
                    {categoryTitle}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }

              return null
            })}
          </div>
        )}
        {titleToUse && (
          <h3 className="text-xl leading-snug">
            <Link
              className="decoration-1 underline-offset-4 group-hover:underline"
              href={href}
              ref={linkRef}
            >
              {titleToUse}
            </Link>
          </h3>
        )}
        {description && (
          <p className="mt-3 text-[0.9375rem] text-muted-foreground">{sanitizedDescription}</p>
        )}
      </div>
    </article>
  )
}
