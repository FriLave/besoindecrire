import type { Form } from '@/payload-types'
import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Locale } from '@/utilities/getLocalizedPath'

import { heading, richText } from './lexical-helpers'

/**
 * The contact page's slug genuinely differs per locale (`contact` /
 * `contact-us`) so the localized routing is exercised by the default
 * dataset, not just theoretically supported.
 */
export const contactSlugs: Record<Locale, string> = {
  fr: 'contact',
  en: 'contact-us',
}

type ContactCopy = {
  heading: string
  metaDescription: string
  title: string
}

const copy: Record<Locale, ContactCopy> = {
  fr: {
    heading: 'Contactez-nous',
    metaDescription: 'Contactez-nous pour discuter de votre projet.',
    title: 'Contact',
  },
  en: {
    heading: 'Contact us',
    metaDescription: 'Contact us to discuss your project.',
    title: 'Contact',
  },
}

type ContactArgs = {
  contactForm: Form
  locale: Locale
}

export const contact: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  contactForm,
  locale,
}) => {
  const { heading: headingText, metaDescription, title } = copy[locale]

  return {
    slug: contactSlugs[locale],
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockType: 'formBlock',
        enableIntro: true,
        form: contactForm,
        introContent: richText([heading('h3', headingText)]),
      },
    ],
    meta: {
      description: metaDescription,
      title,
    },
    title,
  }
}
