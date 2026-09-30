import React from 'react'

import type { FeatureGridBlock as Props } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { BlockHeader } from '@/components/BlockHeader'
import { CMSLink } from '@/components/Link'
import { featureIcons } from './icons'

const cols = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}

export const FeatureGridBlock: React.FC<Props & { locale: Locale }> = ({
  columns,
  heading,
  intro,
  items,
  locale,
}) => (
  <div className="container">
    <BlockHeader heading={heading} intro={intro} />
    <ul className={`grid gap-8 ${cols[columns || '3']}`}>
      {items?.map((item, i) => {
        const Icon = item.icon ? featureIcons[item.icon] : null
        return (
          <li className="flex flex-col gap-3" key={item.id ?? i}>
            {Icon && <Icon aria-hidden className="size-8 text-brand" />}
            <h3 className="text-xl font-semibold">{item.title}</h3>
            {item.text && <p className="opacity-80">{item.text}</p>}
            {item.enableLink && item.link && (
              <CMSLink {...item.link} appearance="inline" locale={locale} />
            )}
          </li>
        )
      })}
    </ul>
  </div>
)
