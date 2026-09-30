import type { RequiredDataFromCollectionSlug } from 'payload'
import type { Locale } from '@/utilities/getLocalizedPath'
import type { PostArgs } from './post-1'

type Post3Copy = {
  bannerText: string
  disclaimer: string
  dynamicText: string
  financeText: string
  metaDescription: string
  moneyHeading1: string
  moneyHeading2: string
  moneyHeading3: string
  stockHeading: string
  stockText1: string
  stockText2: string
  slug: string
  title: string
}

const copy: Record<Locale, Post3Copy> = {
  fr: {
    bannerText:
      "Ce contenu est fictif et destiné à des fins de démonstration uniquement. Pour éditer cet article, accédez au tableau de bord d'administration.",
    disclaimer: 'Avertissement : ',
    dynamicText:
      "Le contenu ci-dessus est complètement dynamique en utilisant des blocs de mise en page personnalisée configurés dans le CMS. Cela peut être n'importe quoi, du texte enrichi et des images aux composants complexes hautement conçus.",
    financeText:
      "L'argent, dans son essence, transcende le simple concept de pièces et de billets ; il devient un langage profond qui parle de valeur, de confiance et de structures sociétales. Comme tout langage, il possède des nuances et subtilités intriquées qui nécessitent une compréhension discernante. C'est dans ces profondeurs que le monde calculé de la stratégie financière rencontre la nature brute et instinctive de l'intuition humaine. Tout comme un linguiste chevronné pourrait analyser la syntaxe et la sémantique d'une phrase, un expert financier navigue dans le vaste et tumultueux océan de la finance, guidé non seulement par la logique et les données, mais aussi par des sensations et des prévisions. Chaque transaction, investissement et décision financière devient un dialogue dans ce vaste lexique du commerce et de la valeur.",
    metaDescription:
      "L'argent n'est pas seulement une devise ; c'est un langage. Plongez dans ses nuances, où la stratégie rencontre l'intuition dans le vaste océan des finances.",
    moneyHeading1: "L'argent n'est pas seulement une devise ; ",
    moneyHeading2: "c'est un langage. ",
    moneyHeading3:
      "Plongez dans ses nuances, où la stratégie rencontre l'intuition dans le vaste océan des finances.",
    stockHeading: 'Dynamique du marché boursier : haussiers, baissiers et le terrain incertain',
    stockText1:
      "Le marché boursier est un domaine de vastes opportunités mais pose aussi des risques. Découvrez les forces qui animent les tendances du marché et les stratégies employées par les meilleurs traders pour naviguer dans cet écosystème complexe. De l'analyse du marché à la compréhension de la psychologie des investisseurs, obtenez un aperçu complet du monde des actions.",
    stockText2:
      "Le marché boursier, souvent visualisé comme une arène animée de chiffres et de tapes de cotations, concerne autant le comportement humain que l'économie. C'est un lieu où l'optimisme, représenté par le rassemblement haussier, rencontre la prudence des ralentissements baissiers, chacun s'efforçant de dicter la direction du marché. Mais entre ces deux extrêmes se situe un terrain incertain, une zone peuplée de traders et d'investisseurs qui pèsent constamment l'espoir contre la peur. Une navigation réussie nécessite bien plus qu'une simple acuité financière ; elle exige une compréhension des sentiments collectifs et la capacité de prédire non seulement les mouvements du marché, mais aussi les réactions des autres participants du marché. Dans cette danse complexe de chiffres et de nerfs, les acteurs les plus avisés sont ceux qui maîtrisent à la fois les données concrètes et les nuances subtiles du comportement humain.",
    slug: 'dollars-et-sens',
    title: 'Dollars et sens : la prévision financière',
  },
  en: {
    bannerText:
      'This content is fabricated and for demonstration purposes only. To edit this post, navigate to the admin dashboard.',
    disclaimer: 'Disclaimer: ',
    dynamicText:
      "This content above is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
    financeText:
      "Money, in its essence, transcends the mere concept of coins and paper notes; it becomes a profound language that speaks of value, trust, and societal structures. Like any language, it possesses intricate nuances and subtleties that require a discerning understanding. It's in these depths where the calculated world of financial strategy collides with the raw, instinctive nature of human intuition. Just as a seasoned linguist might dissect the syntax and semantics of a sentence, a financial expert navigates the vast and tumultuous ocean of finance, guided not only by logic and data but also by gut feelings and foresight. Every transaction, investment, and financial decision becomes a dialogue in this expansive lexicon of commerce and value.",
    metaDescription:
      "Money isn't just currency; it's a language. Dive deep into its nuances, where strategy meets intuition in the vast sea of finance.",
    moneyHeading1: "Money isn't just currency; ",
    moneyHeading2: "it's a language. ",
    moneyHeading3:
      'Dive deep into its nuances, where strategy meets intuition in the vast sea of finance.',
    stockHeading: 'Stock Market Dynamics: Bulls, Bears, and the Uncertain Middle',
    stockText1:
      'The stock market is a realm of vast opportunity but also poses risks. Discover the forces that drive market trends and the strategies employed by top traders to navigate this complex ecosystem. From market analysis to understanding investor psychology, get a comprehensive insight into the world of stocks.',
    stockText2:
      "The stock market, often visualized as a bustling arena of numbers and ticker tapes, is as much about human behavior as it is about economics. It's a place where optimism, represented by the bullish rally, meets the caution of bearish downturns, with each vying to dictate the market's direction. But between these two extremes lies an uncertain middle ground, a zone populated by traders and investors who constantly weigh hope against fear. Successful navigation requires more than just financial acumen; it demands an understanding of collective sentiments and the ability to predict not just market movements, but also the reactions of other market participants. In this intricate dance of numbers and nerves, the most astute players are those who master both the hard data and the soft nuances of human behavior.",
    slug: 'dollar-and-sense-the-financial-forecast',
    title: 'Dollar and Sense: The Financial Forecast',
  },
}

export const post3: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
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
                          text: c.bannerText,
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
                text: c.moneyHeading1,
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 2,
                mode: 'normal',
                style: '',
                text: c.moneyHeading2,
                version: 1,
              },
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: c.moneyHeading3,
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
                text: c.financeText,
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
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: c.stockHeading,
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
                text: c.stockText1,
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
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: c.stockText2,
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
