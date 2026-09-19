import React from 'react'

import type { Page } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      locale: Locale
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      locale: Locale
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, locale, richText }) => {
  return (
    <div className="container mt-16">
      <div className="max-w-[48rem]">
        {children || (richText && <RichText data={richText} enableGutter={false} locale={locale} />)}
      </div>
    </div>
  )
}
