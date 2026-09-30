import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Media } from '@/payload-types'

import type { Locale } from '@/utilities/getLocalizedPath'
import { getLocalizedPath } from '@/utilities/getLocalizedPath'

import { contactSlugs } from './contact-page'
import { heading, link, paragraph, richText, text } from './lexical-helpers'

type HomeCopy = {
  archiveIntro: string
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
    archiveIntro: 'Découvrez nos derniers articles',
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
    archiveIntro: 'Discover our latest posts',
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

type CatalogCopy = {
  faq: { heading: string; intro: string; items: { a: string; q: string }[] }
  features: {
    heading: string
    intro: string
    items: { text: string; title: string }[]
    more: string
  }
  gallery: { captions: string[]; heading: string }
  logos: { heading: string; names: string[] }
  pricing: {
    cta: string
    heading: string
    intro: string
    period: string
    plans: { description: string; features: string[]; name: string; price: string }[]
  }
  stats: { items: { label: string; value: string }[] }
  testimonials: {
    heading: string
    items: { author: string; quote: string; role: string }[]
  }
}

const catalog: Record<Locale, CatalogCopy> = {
  fr: {
    faq: {
      heading: 'Questions fréquentes',
      intro: 'Les réponses aux questions que l’on nous pose le plus souvent.',
      items: [
        {
          q: 'Puis-je modifier mon site moi-même ?',
          a: 'Oui. Tous les textes, images et sections se modifient depuis l’espace d’administration, sans écrire de code.',
        },
        {
          q: 'Le site est-il bien référencé ?',
          a: 'Chaque page dispose de ses balises SEO, d’un plan de site et de données structurées, pour un référencement soigné dès le départ.',
        },
        {
          q: 'Combien de temps faut-il pour mettre le site en ligne ?',
          a: 'Comptez quelques semaines selon le nombre de pages et le contenu à fournir.',
        },
      ],
    },
    features: {
      heading: 'Pourquoi nous choisir',
      intro: 'Tout ce qu’il faut pour un site qui vous ressemble et qui travaille pour vous.',
      more: 'En savoir plus',
      items: [
        { title: 'Rapide', text: 'Des pages légères qui s’affichent instantanément.' },
        { title: 'Sécurisé', text: 'Une base saine, mise à jour et sauvegardée régulièrement.' },
        {
          title: 'Simple à gérer',
          text: 'Un espace d’administration clair, pensé pour les non-techniciens.',
        },
      ],
    },
    gallery: {
      heading: 'Galerie',
      captions: ['Un projet récent', 'En coulisses', 'Notre équipe au travail', 'Résultat final'],
    },
    logos: {
      heading: 'Ils nous font confiance',
      names: ['Partenaire un', 'Partenaire deux', 'Partenaire trois'],
    },
    pricing: {
      cta: 'Choisir cette offre',
      heading: 'Nos offres',
      intro: 'Des tarifs clairs, sans surprise.',
      period: '/ mois',
      plans: [
        {
          name: 'Essentiel',
          price: '49 €',
          description: 'Pour démarrer.',
          features: ['Jusqu’à 5 pages', 'Formulaire de contact', 'Assistance par email'],
        },
        {
          name: 'Pro',
          price: '99 €',
          description: 'Pour les activités en croissance.',
          features: ['Pages illimitées', 'Blog intégré', 'Assistance prioritaire'],
        },
        {
          name: 'Sur mesure',
          price: '199 €',
          description: 'Pour les besoins spécifiques.',
          features: [
            'Fonctionnalités dédiées',
            'Accompagnement personnalisé',
            'Hébergement inclus',
          ],
        },
      ],
    },
    stats: {
      items: [
        { value: '120+', label: 'Sites livrés' },
        { value: '98 %', label: 'Clients satisfaits' },
        { value: '10 ans', label: 'd’expérience' },
        { value: '24 h', label: 'Délai de réponse' },
      ],
    },
    testimonials: {
      heading: 'Ce que disent nos clients',
      items: [
        {
          quote:
            'Un site rapide et surtout très simple à mettre à jour. Je ne dépends plus de personne.',
          author: 'Claire Martin',
          role: 'Gérante, Atelier Martin',
        },
        {
          quote:
            'Notre trafic a nettement progressé depuis la refonte. Le référencement est irréprochable.',
          author: 'Thomas Lefèvre',
          role: 'Directeur, Lefèvre Conseil',
        },
        {
          quote: 'Une équipe à l’écoute, des délais tenus et un résultat à la hauteur.',
          author: 'Sophie Durand',
          role: 'Fondatrice, Studio Durand',
        },
      ],
    },
  },
  en: {
    faq: {
      heading: 'Frequently asked questions',
      intro: 'Answers to the questions we hear the most.',
      items: [
        {
          q: 'Can I edit my site myself?',
          a: 'Yes. All texts, images and sections are edited from the admin area, without writing any code.',
        },
        {
          q: 'Is the site search-engine friendly?',
          a: 'Every page has its SEO tags, a sitemap and structured data, for solid search visibility from day one.',
        },
        {
          q: 'How long does it take to go live?',
          a: 'Allow a few weeks depending on the number of pages and the content to provide.',
        },
      ],
    },
    features: {
      heading: 'Why choose us',
      intro: 'Everything you need for a site that looks like you and works for you.',
      more: 'Learn more',
      items: [
        { title: 'Fast', text: 'Lightweight pages that load instantly.' },
        { title: 'Secure', text: 'A healthy foundation, regularly updated and backed up.' },
        { title: 'Easy to manage', text: 'A clear admin area designed for non-technical users.' },
      ],
    },
    gallery: {
      heading: 'Gallery',
      captions: ['A recent project', 'Behind the scenes', 'Our team at work', 'Final result'],
    },
    logos: { heading: 'They trust us', names: ['Partner one', 'Partner two', 'Partner three'] },
    pricing: {
      cta: 'Choose this plan',
      heading: 'Our plans',
      intro: 'Clear pricing, no surprises.',
      period: '/ month',
      plans: [
        {
          name: 'Essential',
          price: '$49',
          description: 'To get started.',
          features: ['Up to 5 pages', 'Contact form', 'Email support'],
        },
        {
          name: 'Pro',
          price: '$99',
          description: 'For growing businesses.',
          features: ['Unlimited pages', 'Built-in blog', 'Priority support'],
        },
        {
          name: 'Custom',
          price: '$199',
          description: 'For specific needs.',
          features: ['Dedicated features', 'Personal guidance', 'Hosting included'],
        },
      ],
    },
    stats: {
      items: [
        { value: '120+', label: 'Sites delivered' },
        { value: '98%', label: 'Happy clients' },
        { value: '10 yrs', label: 'of experience' },
        { value: '24 h', label: 'Response time' },
      ],
    },
    testimonials: {
      heading: 'What our clients say',
      items: [
        {
          quote: 'A fast site and, above all, very easy to update. I no longer depend on anyone.',
          author: 'Claire Martin',
          role: 'Manager, Atelier Martin',
        },
        {
          quote: 'Our traffic has clearly grown since the redesign. The SEO is impeccable.',
          author: 'Thomas Lefèvre',
          role: 'Director, Lefèvre Consulting',
        },
        {
          quote: 'An attentive team, deadlines met and a result that lives up to expectations.',
          author: 'Sophie Durand',
          role: 'Founder, Studio Durand',
        },
      ],
    },
  },
}

type HomeArgs = {
  heroImage: Media
  images: Media[]
  locale: Locale
  metaImage: Media
  /** Set when the payments module is on: adds a paid download block before the CTA. */
  paidDownloadId?: number
}

const paidCopy: Record<Locale, { heading: string; intro: string }> = {
  fr: { heading: 'Notre guide pratique', intro: 'Téléchargez le guide au format PDF.' },
  en: { heading: 'Our practical guide', intro: 'Download the guide as a PDF.' },
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  images,
  locale,
  metaImage,
  paidDownloadId,
}) => {
  const c = copy[locale]
  const k = catalog[locale]
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
        paragraph([text(c.hero.para1), link(c.hero.linkLabel, contactHref), text(c.hero.para2)]),
      ]),
    },
    layout: [
      {
        blockType: 'featureGrid',
        heading: k.features.heading,
        intro: k.features.intro,
        columns: '3',
        items: k.features.items.map((item, i) => ({
          ...item,
          icon: (['zap', 'shield', 'settings'] as const)[i],
          enableLink: i === 0,
          ...(i === 0
            ? { link: { type: 'custom' as const, label: k.features.more, url: contactHref } }
            : {}),
        })),
      },
      {
        blockType: 'stats',
        background: 'muted',
        items: k.stats.items,
      },
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
        blockType: 'testimonials',
        heading: k.testimonials.heading,
        items: k.testimonials.items.map((item, i) => ({ ...item, photo: images[i]?.id })),
      },
      {
        blockType: 'logoCloud',
        heading: k.logos.heading,
        background: 'muted',
        logos: k.logos.names.map((name, i) => ({
          logo: images[i].id,
          name,
          url: 'https://example.com',
        })),
      },
      {
        blockType: 'pricingTable',
        heading: k.pricing.heading,
        intro: k.pricing.intro,
        plans: k.pricing.plans.map((plan, i) => ({
          ...plan,
          period: k.pricing.period,
          features: plan.features.map((feature) => ({ feature })),
          highlighted: i === 1,
          link: { type: 'custom' as const, label: k.pricing.cta, url: contactHref },
        })),
      },
      {
        blockType: 'gallery',
        heading: k.gallery.heading,
        columns: '2',
        images: k.gallery.captions.map((caption, i) => ({ image: images[i].id, caption })),
      },
      {
        blockType: 'faq',
        heading: k.faq.heading,
        intro: k.faq.intro,
        items: k.faq.items.map(({ a, q }) => ({
          question: q,
          answer: richText([paragraph([text(a)])]),
        })),
      },
      {
        blockName: 'Latest Posts',
        blockType: 'archive',
        populateBy: 'collection',
        relationTo: 'posts',
        limit: 3,
        introContent: richText([heading('h2', c.archiveIntro)]),
      },
      ...(paidDownloadId === undefined
        ? []
        : [
            {
              blockName: 'Paid download',
              blockType: 'paidDownload' as const,
              heading: paidCopy[locale].heading,
              intro: paidCopy[locale].intro,
              download: paidDownloadId,
            },
          ]),
      {
        blockName: 'CTA',
        blockType: 'cta',
        background: 'brand',
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
