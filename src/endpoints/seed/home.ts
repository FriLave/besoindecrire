import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

import type { Locale } from '@/utilities/getLocalizedPath'
import { getLocalizedPath } from '@/utilities/getLocalizedPath'

import { contactSlugs } from './contact-page'
import { heading, link, paragraph, richText, text } from './lexical-helpers'

type HomeCopy = {
  cta: {
    heading: string
    linkLabel: string
    para1: string
    para2: string
  }
  hero: {
    ctaLabel: string
    heading: string
    linkLabel: string
    para1: string
    para2: string
  }
  meta: {
    description: string
    title: string
  }
  pageTitle: string
  services: {
    custom: { heading: string; text: string }
    easy: { heading: string; text: string }
    fast: { heading: string; text: string }
    heading: string
    seo: { heading: string; text: string }
    support: { heading: string; text: string }
  }
}

const copy: Record<Locale, HomeCopy> = {
  fr: {
    cta: {
      heading: "Envie d'en savoir plus ?",
      linkLabel: 'Contactez-nous',
      para1: 'Ce bloc est un exemple de mise en page personnalisable. ',
      para2: ' pour en discuter.',
    },
    hero: {
      ctaLabel: 'Contact',
      heading: 'Site Vitrine',
      linkLabel: 'Contactez-nous',
      para1: 'Un site vitrine simple, rapide et facile à mettre à jour. ',
      para2: ' pour discuter de votre projet.',
    },
    meta: {
      description: 'Un site vitrine simple, rapide et facile à mettre à jour.',
      title: 'Site Vitrine',
    },
    pageTitle: 'Accueil',
    services: {
      custom: {
        heading: 'Sur mesure',
        text: 'Chaque site est conçu pour répondre aux besoins spécifiques de votre activité.',
      },
      easy: {
        heading: 'Facile à mettre à jour',
        text: 'Modifiez vos textes et vos images en toute autonomie, sans écrire une ligne de code.',
      },
      fast: {
        heading: 'Rapide et fiable',
        text: 'Des pages optimisées pour offrir la meilleure expérience à vos visiteurs.',
      },
      heading: 'Nos services',
      seo: {
        heading: 'Référencement',
        text: 'Un site pensé dès le départ pour être bien référencé sur les moteurs de recherche.',
      },
      support: {
        heading: 'Assistance',
        text: 'Une équipe disponible pour vous accompagner à chaque étape de votre projet.',
      },
    },
  },
  en: {
    cta: {
      heading: 'Want to know more?',
      linkLabel: 'Contact us',
      para1: 'This block is an example of customizable layout. ',
      para2: ' to talk about it.',
    },
    hero: {
      ctaLabel: 'Contact',
      heading: 'Showcase Site',
      linkLabel: 'Contact us',
      para1: 'A simple, fast, and easy-to-update showcase website. ',
      para2: ' to discuss your project.',
    },
    meta: {
      description: 'A simple, fast, and easy-to-update showcase website.',
      title: 'Showcase Site',
    },
    pageTitle: 'Home',
    services: {
      custom: {
        heading: 'Tailor-made',
        text: 'Every site is designed to meet the specific needs of your business.',
      },
      easy: {
        heading: 'Easy to update',
        text: 'Edit your text and images independently, without writing a single line of code.',
      },
      fast: {
        heading: 'Fast and reliable',
        text: 'Pages optimized to give your visitors the best possible experience.',
      },
      heading: 'Our services',
      seo: {
        heading: 'Search engine optimization',
        text: 'A site designed from the ground up to rank well on search engines.',
      },
      support: {
        heading: 'Support',
        text: 'A team available to help you at every step of your project.',
      },
    },
  },
}

type HomeArgs = {
  heroImage: Media
  locale: Locale
  metaImage: Media
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  locale,
  metaImage,
}) => {
  const c = copy[locale]
  const contactHref = getLocalizedPath(locale, contactSlugs[locale])

  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'highImpact',
      links: [
        {
          link: {
            type: 'custom',
            appearance: 'outline',
            label: c.hero.ctaLabel,
            url: contactHref,
          },
        },
      ],
      media: heroImage.id,
      richText: richText([
        heading('h1', c.hero.heading),
        paragraph([
          text(c.hero.para1),
          link(c.hero.linkLabel, contactHref),
          text(c.hero.para2),
        ]),
      ]),
    },
    layout: [
      {
        blockName: 'Content Block',
        blockType: 'content',
        columns: [
          {
            richText: richText([heading('h2', c.services.heading)]),
            size: 'full',
          },
          {
            enableLink: false,
            richText: richText([
              heading('h3', c.services.custom.heading),
              paragraph([text(c.services.custom.text)]),
            ]),
            size: 'oneThird',
          },
          {
            enableLink: false,
            richText: richText([
              heading('h3', c.services.fast.heading),
              paragraph([text(c.services.fast.text)]),
            ]),
            size: 'oneThird',
          },
          {
            enableLink: false,
            richText: richText([
              heading('h3', c.services.easy.heading),
              paragraph([text(c.services.easy.text)]),
            ]),
            size: 'oneThird',
          },
          {
            enableLink: false,
            richText: richText([
              heading('h3', c.services.seo.heading),
              paragraph([text(c.services.seo.text)]),
            ]),
            size: 'oneThird',
          },
          {
            enableLink: false,
            richText: richText([
              heading('h3', c.services.support.heading),
              paragraph([text(c.services.support.text)]),
            ]),
            size: 'oneThird',
          },
        ],
      },
      {
        blockName: 'Media Block',
        blockType: 'mediaBlock',
        media: metaImage.id,
      },
      {
        blockName: 'CTA',
        blockType: 'cta',
        richText: richText([
          heading('h3', c.cta.heading),
          paragraph([text(c.cta.para1), link(c.cta.linkLabel, contactHref), text(c.cta.para2)]),
        ]),
      },
    ],
    meta: {
      description: c.meta.description,
      image: heroImage.id,
      title: c.meta.title,
    },
    title: c.pageTitle,
  }
}
