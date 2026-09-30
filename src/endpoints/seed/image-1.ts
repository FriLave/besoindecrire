import type { Media } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

type Image1Copy = {
  alt: string
}

const copy: Record<Locale, Image1Copy> = {
  fr: {
    alt: 'Formes abstraites courbes avec un dégradé orange et bleu',
  },
  en: {
    alt: 'Curving abstract shapes with an orange and blue gradient',
  },
}

export const image1 = (locale: Locale): Omit<Media, 'createdAt' | 'id' | 'updatedAt'> => {
  const c = copy[locale]
  return {
    alt: c.alt,
    caption: {
      root: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Photo by ',
                version: 1,
              },
              {
                type: 'link',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Andrew Kliatskyi',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                fields: {
                  linkType: 'custom',
                  newTab: true,
                  url: 'https://unsplash.com/@kirp',
                },
                format: '',
                indent: 0,
                version: 2,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: ' on Unsplash.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  }
}
