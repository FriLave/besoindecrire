import type { Media } from '@/payload-types'

import type { Locale } from '@/utilities/getLocalizedPath'

import { link, paragraph, richText, text } from './lexical-helpers'

type Image2Copy = {
  alt: string
  creditLinkLabel: string
  creditPrefix: string
  creditSuffix: string
}

const copy: Record<Locale, Image2Copy> = {
  fr: {
    alt: 'Formes abstraites courbes avec un dégradé orange et bleu',
    creditLinkLabel: 'Andrew Kliatskyi',
    creditPrefix: 'Photo par ',
    creditSuffix: ' sur Unsplash.',
  },
  en: {
    alt: 'Curving abstract shapes with an orange and blue gradient',
    creditLinkLabel: 'Andrew Kliatskyi',
    creditPrefix: 'Photo by ',
    creditSuffix: ' on Unsplash.',
  },
}

export const image2 = (locale: Locale): Omit<Media, 'createdAt' | 'id' | 'updatedAt'> => {
  const c = copy[locale]

  return {
    alt: c.alt,
    caption: richText([
      paragraph([
        text(c.creditPrefix),
        link(c.creditLinkLabel, 'https://unsplash.com/@kirp', true),
        text(c.creditSuffix),
      ]),
    ]),
  }
}
