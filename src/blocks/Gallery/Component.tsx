import React from 'react'

import type { GalleryBlock as Props } from '@/payload-types'

import { BlockHeader } from '@/components/BlockHeader'
import { Media } from '@/components/Media'

const cols = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
}
const sizes = {
  '2': '(min-width: 640px) 50vw, 100vw',
  '3': '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  '4': '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw',
}

export const GalleryBlock: React.FC<Props> = ({ columns, heading, images, intro }) => {
  const c = columns || '3'
  return (
    <div className="container">
      <BlockHeader heading={heading} intro={intro} />
      <ul className={`grid gap-4 ${cols[c]}`}>
        {images?.map((item, i) => (
          <li key={item.id ?? i}>
            <figure>
              <Media
                imgClassName="aspect-[4/3] w-full rounded-lg object-cover"
                loading="lazy"
                resource={item.image}
                size={sizes[c]}
              />
              {item.caption && (
                <figcaption className="mt-2 text-sm text-muted-foreground">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}
