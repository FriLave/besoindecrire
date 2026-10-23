import React from 'react'

import type { Page } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { Eyebrow } from '@/components/Eyebrow'
import RichText from '@/components/RichText'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      eyebrow?: never
      locale: Locale
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      locale: Locale
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({
  children,
  eyebrow,
  locale,
  richText,
}) => {
  return (
    <div className="container mt-10 md:mt-16">
      <div className="mx-auto max-w-3xl border-b border-border pb-12 text-center md:pb-16 [&_.hero-richtext_p]:mx-auto">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {children ||
          (richText && (
            <RichText
              className="hero-richtext"
              data={richText}
              enableGutter={false}
              locale={locale}
            />
          ))}
      </div>
    </div>
  )
}
