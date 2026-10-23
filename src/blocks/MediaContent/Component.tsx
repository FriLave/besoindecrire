import React from 'react'

import type { MediaContentBlock as Props } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { CMSLink } from '@/components/Link'
import { Eyebrow } from '@/components/Eyebrow'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { lexicalToText } from '@/utilities/lexicalToText'

const shapes = {
  portrait: 'aspect-[4/5]',
  cover: 'aspect-[2/3] max-w-sm border border-border',
  landscape: 'aspect-[3/2]',
  square: 'aspect-square',
}

export const MediaContentBlock: React.FC<Props & { locale: Locale }> = ({
  eyebrow,
  links,
  locale,
  media,
  mediaPosition,
  mediaShape,
  richText,
}) => {
  const hasMedia = media && typeof media === 'object'
  const text = (
    <>
      <RichText className="max-w-[38em]" data={richText} enableGutter={false} locale={locale} />
      {Array.isArray(links) && links.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-4">
          {links.map(({ link }, i) => (
            <li key={i}>
              <CMSLink size="lg" {...link} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </>
  )

  // Text only: one readable centered column.
  if (!hasMedia)
    return (
      <div className="container max-w-3xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {text}
      </div>
    )

  const caption = media.caption ? lexicalToText(media.caption) : null
  return (
    <div className="container">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <figure
          className={cn(
            'mx-auto w-full',
            mediaShape === 'cover' && 'max-w-sm',
            mediaPosition === 'right' && 'lg:order-last',
          )}
        >
          <div
            className={cn(
              'relative w-full overflow-hidden rounded-sm bg-muted',
              shapes[mediaShape || 'portrait'],
            )}
          >
            <Media
              fill
              imgClassName="object-cover"
              resource={media}
              size="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {caption && (
            <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>
          )}
        </figure>
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {text}
        </div>
      </div>
    </div>
  )
}
