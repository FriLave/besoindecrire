import React from 'react'

import type { Page } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { CMSLink } from '@/components/Link'
import { Eyebrow } from '@/components/Eyebrow'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { lexicalToText } from '@/utilities/lexicalToText'

/** Text on the left, portrait image on the right (stacked on mobile, text first). */
export const SplitHero: React.FC<Page['hero'] & { locale: Locale }> = ({
  eyebrow,
  links,
  locale,
  media,
  richText,
}) => {
  const hasMedia = media && typeof media === 'object'
  const caption = hasMedia && media.caption ? lexicalToText(media.caption) : null

  return (
    <div className="container py-12 md:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          {richText && (
            <RichText
              className="hero-richtext mb-10"
              data={richText}
              enableGutter={false}
              locale={locale}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex flex-wrap gap-4">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink size="lg" {...link} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </div>
        {hasMedia && (
          <figure className="mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-muted">
              <Media
                fill
                imgClassName="object-cover"
                priority
                resource={media}
                size="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            {caption && (
              <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption>
            )}
          </figure>
        )}
      </div>
    </div>
  )
}
