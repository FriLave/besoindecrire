import type { RequiredDataFromCollectionSlug } from 'payload'

import { SITE_DESCRIPTION, SITE_NAME } from '@/client/site'
import type { Locale } from '@/utilities/getLocalizedPath'

import { heading, link, paragraph, richText, text } from './lexical-helpers'

type HomeStaticCopy = {
  linkLabel: string
  para: string
}

const copy: Record<Locale, HomeStaticCopy> = {
  fr: {
    linkLabel: "Accédez à l'espace d'administration",
    para: ' pour créer votre compte et générer le contenu de démonstration de votre site.',
  },
  en: {
    linkLabel: 'Go to the admin panel',
    para: ' to create your account and generate your site’s demo content.',
  },
}

/**
 * Used for pre-seeded content so that the homepage is not empty. Locale-aware
 * because this is the fallback rendered directly at `/` and `/en` whenever no
 * `home` page exists yet in Payload - a French-only fallback would render
 * French copy at `/en`.
 */
export const homeStatic = (locale: Locale): RequiredDataFromCollectionSlug<'pages'> => {
  const c = copy[locale]

  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'lowImpact',
      richText: richText([
        heading('h1', SITE_NAME),
        paragraph([link(c.linkLabel, '/admin'), text(c.para)]),
      ]),
    },
    meta: {
      description: SITE_DESCRIPTION,
      title: SITE_NAME,
    },
    title: 'Home',
    layout: [],
  }
}
