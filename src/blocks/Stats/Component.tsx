import React from 'react'

import type { StatsBlock as Props } from '@/payload-types'

import { BlockHeader } from '@/components/BlockHeader'

export const StatsBlock: React.FC<Props> = ({ heading, intro, items }) => (
  <div className="container">
    <BlockHeader heading={heading} intro={intro} />
    <dl className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
      {items?.map((item, i) => (
        <div className="flex flex-col-reverse" key={item.id ?? i}>
          <dt className="mt-1 opacity-80">{item.label}</dt>
          <dd className="text-4xl font-bold">{item.value}</dd>
        </div>
      ))}
    </dl>
  </div>
)
