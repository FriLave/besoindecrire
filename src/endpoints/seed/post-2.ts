import { RequiredDataFromCollectionSlug } from 'payload'
import type { Locale } from '@/utilities/getLocalizedPath'
import type { PostArgs } from './post-1'

type Post2Copy = {
  bannerText: string
  disclaimer: string
  dynamicText: string
  metaDescription: string
  resilience1Heading: string
  resilience1Text: string
  resilience2Text: string
  slug: string
  title: string
}

const copy: Record<Locale, Post2Copy> = {
  fr: {
    bannerText: 'Ce contenu est fictif et destiné à des fins de démonstration uniquement. Pour éditer cet article, accédez au tableau de bord d\'administration.',
    disclaimer: 'Avertissement :',
    dynamicText: 'Le contenu ci-dessus est complètement dynamique en utilisant des blocs de mise en page personnalisée configurés dans le CMS. Cela peut être n\'importe quoi, du texte enrichi et des images aux composants complexes hautement conçus.',
    metaDescription: 'Explorez les histoires non racontées et négligées. Une vue agrandie des coins du monde, où chaque histoire mérite sa place sous les projecteurs.',
    resilience1Heading: 'La force de la résilience : histoires de rétablissement et d\'espoir',
    resilience1Text: 'Tout au long de l\'histoire, les régions du monde entier ont fait face aux impacts dévastateurs des catastrophes naturelles, des turbulences politiques et des défis économiques. Dans ces moments de crise profonde, une force souvent sous-estimée émerge : la résilience indomptable de l\'esprit humain. Ce ne sont pas simplement des histoires de survie, mais des récits de communautés qui forgent des liens, s\'unissent avec un objectif collectif et démontrent une capacité innée à surmonter.',
    resilience2Text: 'Des voisins formant des équipes de sauvetage improvisées pendant les inondations aux villes entières se rassemblant pour se reconstruire après un effondrement économique, l\'essence de l\'humanité est la plus évidente dans ces actes de solidarité. En explorant ces récits, nous témoignons du pouvoir transformateur de l\'esprit communautaire, où l\'adversité devient un catalyseur de croissance, d\'unité et d\'un avenir plus radieux et reconstruit.',
    slug: 'perspective-mondiale',
    title: 'Perspective mondiale : au-delà des gros titres',
  },
  en: {
    bannerText: 'This content is fabricated and for demonstration purposes only. To edit this post, navigate to the admin dashboard.',
    disclaimer: 'Disclaimer:',
    dynamicText: 'This content above is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you\'d like from rich text and images, to highly designed, complex components.',
    metaDescription: 'Explore the untold and overlooked. A magnified view into the corners of the world, where every story deserves its spotlight.',
    resilience1Heading: 'The Power of Resilience: Stories of Recovery and Hope',
    resilience1Text: 'Throughout history, regions across the globe have faced the devastating impact of natural disasters, the turbulence of political unrest, and the challenging ripples of economic downturns. In these moments of profound crisis, an often-underestimated force emerges: the indomitable resilience of the human spirit. These aren\'t just tales of mere survival, but stories of communities forging bonds, uniting with a collective purpose, and demonstrating an innate ability to overcome.',
    resilience2Text: 'From neighbors forming makeshift rescue teams during floods to entire cities rallying to rebuild after economic collapse, the essence of humanity is most evident in these acts of solidarity. As we delve into these narratives, we witness the transformative power of community spirit, where adversity becomes a catalyst for growth, unity, and a brighter, rebuilt future.',
    slug: 'global-gaze',
    title: 'Global Gaze: Beyond the Headlines',
  },
}

export const post2: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
  locale,
}) => {
  const c = copy[locale]
  return {
    slug: c.slug,
    _status: 'published',
    authors: [author],
    content: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: c.metaDescription,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Disclaimer',
              blockType: 'banner',
              content: {
                root: {
                  type: 'root',
                  children: [
                    {
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          detail: 0,
                          format: 1,
                          mode: 'normal',
                          style: '',
                          text: c.disclaimer,
                          version: 1,
                        },
                        {
                          type: 'text',
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: ' ' + c.bannerText,
                          version: 1,
                        },
                      ],
                      direction: 'ltr',
                      format: '',
                      indent: 0,
                      textFormat: 1,
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  version: 1,
                },
              },
              style: 'info',
            },
            format: '',
            version: 2,
          },
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: c.resilience1Heading,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: c.resilience1Text,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: '',
              blockType: 'mediaBlock',
              media: blockImage.id,
            },
            format: '',
            version: 2,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: c.resilience2Text,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Dynamic components',
              blockType: 'banner',
              content: {
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
                          text: c.dynamicText,
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
              style: 'info',
            },
            format: '',
            version: 2,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    heroImage: heroImage.id,
    meta: {
      description: c.metaDescription,
      image: heroImage.id,
      title: c.title,
    },
    relatedPosts: [], // this is populated by the seed script
    title: c.title,
  }
}
