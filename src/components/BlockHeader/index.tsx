import React from 'react'

import { Eyebrow } from '@/components/Eyebrow'

/** Section heading: label, title and intro, centered above the block content. */
export const BlockHeader: React.FC<{
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
}> = ({ eyebrow, heading, intro }) => {
  if (!eyebrow && !heading && !intro) return null
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {heading && <h2 className="text-3xl md:text-[2.75rem]">{heading}</h2>}
      {intro && <p className="mt-4 text-lg text-pretty text-muted-foreground">{intro}</p>}
    </div>
  )
}
