import React from 'react'

import type { TestimonialsBlock as Props } from '@/payload-types'

import { BlockHeader } from '@/components/BlockHeader'
import { Media } from '@/components/Media'
import { Card, CardContent } from '@/components/ui/card'

export const TestimonialsBlock: React.FC<Props> = ({ heading, intro, items }) => (
  <div className="container">
    <BlockHeader heading={heading} intro={intro} />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items?.map((item, i) => (
        <Card key={item.id ?? i}>
          <CardContent className="p-6">
            <figure className="flex h-full flex-col gap-4">
              <blockquote className="flex-1">&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption className="flex items-center gap-3">
                {item.photo && typeof item.photo === 'object' && (
                  <Media
                    imgClassName="size-12 rounded-full object-cover"
                    resource={item.photo}
                    size="48px"
                  />
                )}
                <span>
                  <span className="block font-semibold">{item.author}</span>
                  {item.role && <span className="block text-sm text-muted-foreground">{item.role}</span>}
                </span>
              </figcaption>
            </figure>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)
