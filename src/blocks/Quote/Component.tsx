import React from 'react'

import type { QuoteBlock as Props } from '@/payload-types'

export const QuoteBlock: React.FC<Props> = ({ attribution, quote, style }) =>
  style === 'epigraph' ? (
    <figure className="container max-w-3xl">
      <blockquote className="border-l-2 border-gold pl-6 font-serif text-2xl leading-snug whitespace-pre-line italic md:text-3xl">
        {quote}
      </blockquote>
      {attribution && (
        <figcaption className="mt-4 pl-6 text-muted-foreground">{attribution}</figcaption>
      )}
    </figure>
  ) : (
    <figure className="container max-w-4xl text-center">
      <span aria-hidden className="block font-serif text-6xl leading-none text-gold">
        &ldquo;
      </span>
      <blockquote className="font-serif text-2xl leading-snug text-balance whitespace-pre-line italic md:text-[2.5rem]">
        {quote}
      </blockquote>
      {attribution && (
        <figcaption className="mt-6 font-medium text-muted-foreground">{attribution}</figcaption>
      )}
    </figure>
  )
