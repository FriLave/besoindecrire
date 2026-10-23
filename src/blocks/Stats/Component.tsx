import React from 'react'

import type { StatsBlock as Props } from '@/payload-types'

import { BlockHeader } from '@/components/BlockHeader'

/** Key figures in a row of equal cells. */
export const StatsBlock: React.FC<Props> = ({ eyebrow, heading, intro, items }) => (
  <div className="container">
    <BlockHeader eyebrow={eyebrow} heading={heading} intro={intro} />
    <dl className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {items?.map((item, i) => (
        <div
          className="flex flex-col-reverse items-center justify-end bg-card p-8 text-center"
          key={item.id ?? i}
        >
          <dt className="mt-2 max-w-[15rem] text-[0.9375rem] text-muted-foreground">
            {item.label}
          </dt>
          <dd className="font-serif text-5xl leading-none text-brand">{item.value}</dd>
        </div>
      ))}
    </dl>
  </div>
)
