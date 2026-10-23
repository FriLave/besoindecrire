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
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        {richText && (
          <RichText
            className="cta-richtext mb-0"
            data={richText}
            enableGutter={false}
            locale={locale}
          />
        )}
        {(links || []).length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {(links || []).map(({ link }, i) => {
              return <CMSLink key={i} size="lg" {...link} locale={locale} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}
