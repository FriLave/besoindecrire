import React from 'react'

import type { LogoCloudBlock as Props } from '@/payload-types'

import { BlockHeader } from '@/components/BlockHeader'
import { Media } from '@/components/Media'

export const LogoCloudBlock: React.FC<Props> = ({ heading, intro, logos }) => (
  <div className="container">
    <BlockHeader heading={heading} intro={intro} />
    <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
      {logos?.map((item, i) => {
        if (typeof item.logo !== 'object') return null
        const img = (
          <Media
            alt={item.name}
            imgClassName="h-12 w-auto object-contain grayscale transition hover:grayscale-0"
            resource={item.logo}
            size="160px"
          />
        )
        return (
          <li key={item.id ?? i}>
            {item.url ? (
              <a aria-label={item.name} href={item.url} rel="noopener noreferrer" target="_blank">
                {img}
              </a>
            ) : (
              img
            )}
          </li>
        )
      })}
    </ul>
  </div>
)
