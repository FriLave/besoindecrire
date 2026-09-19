import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

export const CallToActionBlock: React.FC<CTABlockProps & { locale: Locale }> = ({
  links,
  locale,
  richText,
}) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          {richText && (
            <RichText className="mb-0" data={richText} enableGutter={false} locale={locale} />
          )}
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            return <CMSLink key={i} size="lg" {...link} locale={locale} />
          })}
        </div>
      </div>
    </div>
  )
}
