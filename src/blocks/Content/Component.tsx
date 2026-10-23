import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { CMSLink } from '../../components/Link'

export const ContentBlock: React.FC<ContentBlockProps & { locale: Locale }> = (props) => {
  const { columns, dropCap, locale } = props

  const colsSpanClasses = {
    full: 'lg:col-span-12',
    half: 'lg:col-span-6',
    oneThird: 'lg:col-span-4',
    twoThirds: 'lg:col-span-8',
  }

  return (
    <div className="container">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn('col-span-4', colsSpanClasses[size!], {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                {richText && (
                  <RichText
                    className={cn(dropCap && index === 0 && 'lettrine')}
                    data={richText}
                    enableGutter={false}
                    locale={locale}
                  />
                )}

                {enableLink && <CMSLink {...link} locale={locale} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}
