import type { Media } from '@/payload-types'

import type { Locale } from '@/utilities/getLocalizedPath'

const altCopy: Record<Locale, string> = {
  fr: 'Formes métalliques épurées avec un dégradé bleu',
  en: 'Straight metallic shapes with a blue gradient',
}

export const imageHero1 = (locale: Locale): Omit<Media, 'createdAt' | 'id' | 'updatedAt'> => ({
  alt: altCopy[locale],
})
