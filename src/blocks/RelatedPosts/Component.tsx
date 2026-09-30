import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { Card } from '../../components/Card'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { isFeatureEnabled } from '@/utilities/features'
import type { Locale } from '@/utilities/getLocalizedPath'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
  locale: Locale
}

export const RelatedPosts = async (props: RelatedPostsProps) => {
  const { className, docs, introContent, locale } = props

  if (!(await isFeatureEnabled('blog'))) return null

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} locale={locale} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} doc={doc} locale={locale} relationTo="posts" showCategories />
        })}
      </div>
    </div>
  )
}
