import type { Media, User } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'
import type { RequiredDataFromCollectionSlug } from 'payload'

export type PostArgs = {
  heroImage: Media
  blockImage: Media
  author: User
  locale: Locale
}

type Post1Copy = {
  aiHeading: string
  aiText: string
  bannerText: string
  codeHeading: string
  disclaimer: string
  dynamicText: string
  iotHeading: string
  iotText1: string
  iotText2: string
  metaDescription: string
  slug: string
  title: string
}

const copy: Record<Locale, Post1Copy> = {
  fr: {
    aiHeading: "L'essor de l'IA et de l'apprentissage automatique",
    aiText:
      "Nous vivons une ère transformatrice où l'intelligence artificielle (IA) est au cœur de l'évolution technologique. Les effets de ses avancées transforment les industries à un rythme sans précédent. Les entreprises ne sont plus limitées par les processus manuels fastidieux. Les machines sophistiquées, alimentées par des quantités massives de données, prennent désormais des décisions autrefois réservées à l'intuition humaine. Ces systèmes intelligents optimisent les opérations et pionnent de nouvelles approches, annonçant une nouvelle ère de transformation numérique.",
    bannerText:
      "Avertissement : Ce contenu est fictif et destiné à des fins de démonstration uniquement. Pour éditer cet article, naviguez vers le tableau de bord d'administration.",
    codeHeading:
      "Pour démontrer la fonctionnalité de base de l'IA, voici un extrait JavaScript qui envoie une requête POST à une API d'IA générique pour générer du texte basé sur une invite.",
    disclaimer: 'Avertissement :',
    dynamicText:
      "Le contenu ci-dessus est complètement dynamique en utilisant des blocs de mise en page personnalisée configurés dans le CMS. Cela peut être n'importe quoi, du texte enrichi et des images aux composants complexes hautement conçus.",
    iotHeading: "L'IoT : Connecter le monde autour de nous",
    iotText1:
      "Dans le paysage technologique en évolution rapide d'aujourd'hui, l'Internet des objets (IoT) se distingue comme une force révolutionnaire. Du déploiement de systèmes de maison intelligente à la redéfinition du transport par les voitures connectées, l'influence de l'IoT est palpable dans presque tous les domaines de notre vie quotidienne.",
    iotText2:
      "Cette technologie repose sur l'intégration transparente des appareils et systèmes, leur permettant de communiquer et de collaborer sans effort. Avec chaque appareil connecté, nous nous rapprochons d'un monde où la commodité et l'efficacité sont intégrées dans le tissu même de notre existence. En conséquence, nous entrons dans une ère où notre environnement répond intuitivement à nos besoins, annonçant une communauté mondiale plus intelligente et interconnectée.",
    metaDescription:
      "Plongez dans les merveilles de l'innovation moderne, où le seul constant est le changement. Un voyage où les pixels et les données convergent pour façonner l'avenir.",
    slug: 'horizons-numeriques',
    title: 'Horizons numériques : Un aperçu de demain',
  },
  en: {
    aiHeading: 'The Rise of AI and Machine Learning',
    aiText:
      'We find ourselves in a transformative era where artificial intelligence (AI) stands at the forefront of technological evolution. The ripple effects of its advancements are reshaping industries at an unprecedented pace. No longer are businesses bound by the limitations of tedious, manual processes. Instead, sophisticated machines, fueled by vast amounts of historical data, are now capable of making decisions previously left to human intuition. These intelligent systems are not only optimizing operations but also pioneering innovative approaches, heralding a new age of business transformation worldwide.',
    bannerText:
      'This content is fabricated and for demonstration purposes only. To edit this post, navigate to the admin dashboard.',
    codeHeading:
      'To demonstrate basic AI functionality, here is a javascript snippet that makes a POST request to a generic AI API in order to generate text based on a prompt.',
    disclaimer: 'Disclaimer:',
    dynamicText:
      "This content above is completely dynamic using custom layout building blocks configured in the CMS. This can be anything you'd like from rich text and images, to highly designed, complex components.",
    iotHeading: 'IoT: Connecting the World Around Us',
    iotText1:
      "In today's rapidly evolving technological landscape, the Internet of Things (IoT) stands out as a revolutionary force. From transforming our residences with smart home systems to redefining transportation through connected cars, IoT's influence is palpable in nearly every facet of our daily lives.",
    iotText2:
      "This technology hinges on the seamless integration of devices and systems, allowing them to communicate and collaborate effortlessly. With each connected device, we move a step closer to a world where convenience and efficiency are embedded in the very fabric of our existence. As a result, we're transitioning into an era where our surroundings intuitively respond to our needs, heralding a smarter and more interconnected global community.",
    metaDescription:
      'Dive into the marvels of modern innovation, where the only constant is change. A journey where pixels and data converge to craft the future.',
    slug: 'digital-horizons',
    title: 'Digital Horizons: A Glimpse into Tomorrow',
  },
}

export const post1: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
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
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: c.aiHeading,
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
                text: c.aiText,
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
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: c.codeHeading,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h3',
            version: 1,
          },
          {
            type: 'block',
            fields: {
              blockName: 'Generate Text',
              blockType: 'code',
              code: "async function generateText(prompt) {\n    const apiKey = 'your-api-key';\n    const apiUrl = 'https://api.example.com/generate-text';\n\n    const response = await fetch(apiUrl, {\n        method: 'POST',\n        headers: {\n            'Content-Type': 'application/json',\n            'Authorization': `Bearer ${apiKey}`\n        },\n        body: JSON.stringify({\n            model: 'text-generation-model',\n            prompt: prompt,\n            max_tokens: 50\n        })\n    });\n\n    const data = await response.json();\n    console.log(data.choices[0].text.trim());\n}\n\n// Example usage\ngenerateText(\"Once upon a time in a faraway land,\");\n",
              language: 'javascript',
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
                text: c.iotHeading,
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
                text: c.iotText1,
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
                text: c.iotText2,
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
            type: 'block',
            fields: {
              blockName: 'Dynamic Components',
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
