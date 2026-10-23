import React from 'react'

import type { TestimonialsBlock as Props } from '@/payload-types'

import { BlockHeader } from '@/components/BlockHeader'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Item = NonNullable<Props['items']>[number]

const Author: React.FC<{ item: Item }> = ({ item }) => (
  <figcaption className="flex items-center gap-4">
    {item.photo && typeof item.photo === 'object' && (
      <Media imgClassName="size-12 rounded-full object-cover" resource={item.photo} size="48px" />
    )}
    <span>
      <span className="block font-semibold">{item.author}</span>
      {item.role && <span className="block text-sm text-muted-foreground">{item.role}</span>}
    </span>
  </figcaption>
)

export const TestimonialsBlock: React.FC<Props> = ({ eyebrow, heading, intro, items, style }) => (
  <div className="container">
    <BlockHeader eyebrow={eyebrow} heading={heading} intro={intro} />
    {style === 'featured' ? (
      // One quote after another in a single readable column, the first one larger.
      <div className="mx-auto flex max-w-3xl flex-col divide-y divide-border">
        {items?.map((item, i) => (
          <figure className="flex flex-col gap-5 py-10 first:pt-0" key={item.id ?? i}>
            <blockquote
              className={cn(
                'font-serif',
                i === 0 ? 'text-2xl leading-snug md:text-3xl' : 'text-xl leading-relaxed',
              )}
            >
              &laquo;&nbsp;{item.quote}&nbsp;&raquo;
            </blockquote>
            <Author item={item} />
          </figure>
        ))}
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items?.map((item, i) => (
          <figure
            className="flex flex-col gap-6 rounded-sm border border-border bg-card p-8"
            key={item.id ?? i}
          >
            <span aria-hidden className="font-serif text-5xl leading-none text-gold">
              &ldquo;
            </span>
            <blockquote className="-mt-4 flex-1 font-serif text-lg leading-relaxed">
              {item.quote}
            </blockquote>
            <div className="border-t border-border pt-5">
              <Author item={item} />
            </div>
          </figure>
        ))}
      </div>
    )}
  </div>
)
