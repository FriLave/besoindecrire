import React from 'react'

import type { FeatureGridBlock as Props } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { BlockHeader } from '@/components/BlockHeader'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'
import { featureIcons } from './icons'

const cols = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

export const FeatureGridBlock: React.FC<Props & { locale: Locale }> = ({
  columns,
  eyebrow,
  heading,
  intro,
  items,
  locale,
  style,
}) => {
  const list = style === 'list'
  return (
    <div className="container">
      <BlockHeader eyebrow={eyebrow} heading={heading} intro={intro} />
      <ul
        className={cn(
          list
            ? 'mx-auto max-w-4xl border-b border-border'
            : ['grid gap-x-10 gap-y-12', cols[columns || '3'], style === 'cards' && 'gap-6'],
        )}
      >
        {items?.map((item, i) => {
          const Icon = (!style || style === 'icons' || style === 'cards') && item.icon
          const IconComponent = Icon ? featureIcons[Icon] : null
          const link = item.enableLink && item.link && (
            <CMSLink
              {...item.link}
              appearance="link"
              className="mt-auto self-start px-0"
              locale={locale}
            />
          )
          if (list)
            return (
              <li
                className="grid gap-x-10 gap-y-2 border-t border-border py-7 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
                key={item.id ?? i}
              >
                <h3 className="text-2xl leading-snug">{item.title}</h3>
                <div className="flex flex-col gap-2">
                  {item.text && <p className="text-muted-foreground">{item.text}</p>}
                  {link}
                </div>
              </li>
            )
          return (
            <li
              className={cn(
                'flex flex-col gap-3',
                style === 'numbered' && 'border-t border-border pt-6',
                style === 'cards' && 'rounded-sm border border-border bg-card p-8',
              )}
              key={item.id ?? i}
            >
              {style === 'numbered' && (
                <span aria-hidden className="font-serif text-4xl leading-none text-brand">
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              {IconComponent && (
                <IconComponent aria-hidden className="size-7 text-brand" strokeWidth={1.25} />
              )}
              <h3 className="text-2xl leading-snug">{item.title}</h3>
              {item.text && <p className="text-muted-foreground">{item.text}</p>}
              {link}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
