/**
 * Besoin d'Écrire: page content for the initial import (FR + EN side by side).
 *
 * Source: besoindecrire.com (WordPress) as of 2026-10-09, lightly edited (typos fixed,
 * sections reorganised; no fact added). See docs/site-audit/ for the original text.
 * Rich text is authored as HTML via `html()` and converted to Lexical by the runner.
 */
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { RequiredDataFromCollectionSlug } from 'payload'

import type { Locale } from '@/utilities/getLocalizedPath'

export const CALENDLY = 'https://calendly.com/bdecrire/30min'
export const EDITIONS_BEL = 'https://editionsbesoindecrireetdelire.over-blog.com/'

/** Marker replaced by real Lexical JSON in the runner (`convertHTMLToLexical`). */
export const html = (source: string) => ({ __html: source }) as unknown as DefaultTypedEditorState

type PageData = Omit<RequiredDataFromCollectionSlug<'pages'>, 'slug'>
type Block = PageData['layout'][number]
type Appearance = 'default' | 'outline'

export type Ctx = {
  locale: Locale
  media: (key: MediaKey) => number
  page: (key: PageKey) => number
  form: number
}

// --- media -----------------------------------------------------------------

export const mediaFiles = {
  paulinTableau: {
    file: 'paulin-tableau.webp',
    alt: {
      fr: 'Paulin Hassika au tableau, devant une classe',
      en: 'Paulin Hassika at the blackboard, teaching a class',
    },
    caption: {
      fr: 'Paulin Hassika · Physicien, auteur, éditeur, accompagnant',
      en: 'Paulin Hassika · Physicist, author, publisher, writing coach',
    },
  },
  salleDeClasse: {
    file: 'premiere-salle-de-classe.webp',
    alt: {
      fr: 'Ma première salle de classe, village d’Acadjamin',
      en: 'My first classroom, in the village of Acadjamin',
    },
  },
  ecole: {
    file: 'ecole-chemin-de-la-vie.webp',
    alt: {
      fr: 'Portique « L’école, c’est le chemin de la vie » à Acadjamin',
      en: 'Gateway reading “L’école, c’est le chemin de la vie” (school is the path of life) in Acadjamin',
    },
  },
  routeKinta: {
    file: 'route-vers-kinta.webp',
    alt: { fr: 'La route vers Kinta', en: 'The road to Kinta' },
  },
  routeCroisements: {
    file: 'route-croisements.webp',
    alt: {
      fr: 'Piste de terre rouge bordée d’arbres : il faut prendre la route pour voir des croisements',
      en: 'Red dirt track lined with trees: you have to take the road to see crossroads',
    },
  },
  coverJeanne: {
    file: 'couverture-jeanne.webp',
    alt: {
      fr: 'Couverture du roman « Jeanne, entre plaines et gâtines » de Paulin Hassika',
      en: 'Cover of the novel “Jeanne, entre plaines et gâtines” by Paulin Hassika',
    },
  },
  coverKinta: {
    file: 'couverture-kinta.webp',
    alt: {
      fr: 'Couverture du roman « Kinta, et la sentence des 7 » de Paulin Hassika',
      en: 'Cover of the novel “Kinta, et la sentence des 7” by Paulin Hassika',
    },
  },
  coverSennami: {
    file: 'couverture-sennami.webp',
    alt: {
      fr: 'Couverture du roman historique « Sénnami, l’amazone du roi » de Paulin Hassika',
      en: 'Cover of the historical novel “Sénnami, l’amazone du roi” by Paulin Hassika',
    },
  },
  coverHordain: {
    file: 'couverture-hordain.webp',
    alt: {
      fr: 'Couverture du roman « Les mots japonais à Hordain » de Paulin Hassika',
      en: 'Cover of the novel “Les mots japonais à Hordain” by Paulin Hassika',
    },
  },
  livreLaurence: {
    file: 'livre-laurence-abare.webp',
    alt: {
      fr: 'Couverture du recueil « Fulgurances d’un instant » de Laurence Abare, Éditions B.E.L.',
      en: 'Cover of the poetry collection “Fulgurances d’un instant” by Laurence Abare, Éditions B.E.L.',
    },
  },
} satisfies Record<
  string,
  { file: string; alt: Record<Locale, string>; caption?: Record<Locale, string> }
>

export type MediaKey = keyof typeof mediaFiles

// --- helpers ----------------------------------------------------------------

const pick = (c: Ctx) => (fr: string, en: string) => (c.locale === 'fr' ? fr : en)

const pageLink = (c: Ctx, key: PageKey, label: string, appearance: Appearance = 'default') => ({
  link: {
    type: 'reference' as const,
    reference: { relationTo: 'pages' as const, value: c.page(key) },
    label,
    appearance,
  },
})

const urlLink = (
  url: string,
  label: string,
  appearance: Appearance = 'default',
  newTab = true,
) => ({
  link: { type: 'custom' as const, url, newTab, label, appearance },
})

const calendly = (c: Ctx, appearance: Appearance = 'default') =>
  urlLink(
    CALENDLY,
    pick(c)('Réserver un premier échange offert', 'Book a free first call'),
    appearance,
  )

/** The closing call to action shared by most pages. */
const closingCta = (c: Ctx, title: string, text: string): Block => ({
  blockType: 'cta',
  richText: html(`<h2>${title}</h2><p>${text}</p>`),
  links: [
    calendly(c),
    pageLink(c, 'contact', pick(c)('Écrire un message', 'Send a message'), 'outline'),
  ],
  background: 'muted',
  paddingTop: 'lg',
  paddingBottom: 'lg',
})

const formulas = (c: Ctx, detailed: boolean): Block => {
  const t = pick(c)
  const link = detailed
    ? calendly(c, 'outline').link
    : pageLink(c, 'accompagnements', t('Voir le détail', 'See the details'), 'outline').link
  return {
    blockType: 'pricingTable',
    eyebrow: t('Les accompagnements', 'Coaching programmes'),
    heading: t('Trois formules, selon où vous en êtes', 'Three programmes, wherever you are'),
    intro: t(
      'Si vous hésitez entre les formules, un premier échange de 30 minutes suffit pour y voir clair.',
      'If you are unsure which one to choose, a 30-minute first call is enough to see clearly.',
    ),
    plans: [
      {
        name: t('Découverte', 'Discovery'),
        price: t('1 mois', '1 month'),
        description: t(
          'Pour clarifier votre intention narrative et comprendre comment commencer.',
          'To clarify your narrative intention and understand how to begin.',
        ),
        features: detailed
          ? [
              { feature: t('Lecture d’un extrait', 'Reading of an excerpt') },
              { feature: t('Retour narratif', 'Narrative feedback') },
              { feature: t('Questions d’ouverture', 'Opening questions') },
              { feature: t('Orientation du projet', 'Direction for your project') },
            ]
          : [],
        audience: t(
          'Pour ceux qui sentent l’appel, mais ne savent pas encore par où entrer.',
          'For those who feel the call but don’t yet know where to begin.',
        ),
        link,
      },
      {
        name: t('Trajectoire', 'Trajectory'),
        price: t('6 mois', '6 months'),
        highlighted: true,
        badge: t('La plus suivie', 'Most chosen'),
        description: t(
          'Pour écrire vraiment, structurer votre récit et avancer avec régularité.',
          'To really write, structure your story and move forward steadily.',
        ),
        features: detailed
          ? [
              { feature: t('Retours narratifs réguliers', 'Regular narrative feedback') },
              { feature: t('Analyse de cohérence', 'Coherence review') },
              {
                feature: t(
                  'Sécurisation émotionnelle du processus',
                  'Emotional safety throughout the process',
                ),
              },
            ]
          : [],
        audience: t(
          'Pour ceux qui ont commencé, mais n’arrivent pas à tenir seuls sur la durée.',
          'For those who have started but struggle to keep going on their own.',
        ),
        link: detailed ? calendly(c).link : { ...link, appearance: 'default' as const },
      },
      {
        name: 'Premium',
        price: t('12 mois', '12 months'),
        description: t(
          'Du premier mot à la publication : l’accompagnement complet, sans exception.',
          'From the first word to publication: the complete programme, no exceptions.',
        ),
        features: detailed
          ? [
              { feature: t('Écriture et structuration', 'Writing and structuring') },
              { feature: t('Relecture profonde', 'In-depth reading') },
              { feature: t('Mise en page et ISBN', 'Layout and ISBN') },
              { feature: t('Présence d’auteur et lancement', 'Author presence and book launch') },
            ]
          : [],
        audience: t(
          'Pour ceux qui veulent aller jusqu’au bout, et devenir auteur.',
          'For those who want to go all the way, and become an author.',
        ),
        link,
      },
    ],
  }
}

const testimonialsAll = (c: Ctx) => {
  const t = pick(c)
  const premium = t('Accompagnement Premium', 'Premium programme')
  return {
    laurence: {
      author: 'Laurence Abare',
      role: `${t('Recueil de poésies', 'Poetry collection')} « Fulgurances d’un instant » · Martinique · ${premium}`,
      quote: t(
        'Grâce à l’accompagnement de Paulin Hassika, j’ai pu transformer mes émotions en poèmes vivants. Ce coaching m’a permis de libérer ma voix, de structurer mes textes et d’oser enfin partager mes mots. Aujourd’hui, mes poèmes circulent, touchent, se vendent — et surtout, ils me ressemblent.',
        'Thanks to Paulin Hassika’s support, I was able to turn my emotions into living poems. The coaching freed my voice, helped me structure my texts and finally dare to share my words. Today my poems travel, move people, sell — and above all, they are like me.',
      ),
    },
    marieNoelle: {
      author: 'Marie-Noëlle Albert',
      role: `${t('Recueil autobiographique', 'Autobiographical collection')} « Au fil des maux, au fil de l’eau » · Bordeaux · ${premium}`,
      quote: t(
        'J’avais des textes épars, des fragments de vie, des mots qui cherchaient leur place. J’ai pu leur donner une cohérence, une structure, et surtout une force intérieure. Je suis fière d’avoir mené mon recueil jusqu’au bout — et de m’être enfin reconnue dans mes propres pages.',
        'I had scattered texts, fragments of life, words looking for their place. I was able to give them coherence, structure and, above all, inner strength. I am proud to have taken my collection all the way — and to have finally recognised myself in my own pages.',
      ),
    },
    jeanLouis: {
      author: 'Jean-Louis Gausserand',
      role: `${t('Récit de vie', 'Life story')} « Louis, ses passions et les autres » · Landes · ${premium}`,
      quote: t(
        'Plus de soixante années à raconter… mais comment les mettre en mots ? J’ai pu structurer mon récit, trouver le ton juste et donner une véritable cohérence à mon histoire. Mon livre est devenu une mémoire vivante.',
        'More than sixty years to tell… but how to put them into words? I was able to structure my story, find the right tone and give my life real coherence. My book has become a living memory.',
      ),
    },
    paulValerie: {
      author: 'Paul Blazek & Valérie',
      role: `${t('Livre de photographies', 'Photography book')} « Regards de femmes » · Aquitaine · ${premium}`,
      quote: t(
        'Nous voulions mêler photographie et écriture, trouver l’équilibre juste entre l’image et le texte. Nous avons découvert une manière harmonieuse de faire dialoguer nos deux langages. Notre projet est devenu une invitation au voyage, sensible et poétique.',
        'We wanted to combine photography and writing, to find the right balance between image and text. We discovered a harmonious way for our two languages to speak to each other. Our project became an invitation to travel, sensitive and poetic.',
      ),
    },
    jacqueline: {
      author: 'Jacqueline Denamiel',
      role: `${t('Récit de vie', 'Life story')} « C’est ma vie… » · Saint-Émilion · ${premium}`,
      quote: t(
        'Écrire son histoire, c’est parfois douloureux. J’ai trouvé la confiance et les outils nécessaires pour transformer mes souvenirs en un récit clair, structuré et apaisé. Aujourd’hui, je peux dire : c’est ma vie, et elle est écrite.',
        'Writing your own story can be painful. I found the confidence and the tools to turn my memories into a clear, structured and peaceful narrative. Today I can say: this is my life, and it is written.',
      ),
    },
    laurin: {
      author: 'Laurin Myrrian',
      role: `${t('Récit de vie', 'Life story')} « Mon temps est précieux » · Aquitaine · ${premium}`,
      quote: t(
        'J’étais au bord de l’épuisement. L’écriture m’a permis de poser mes émotions, de retrouver un souffle et de me recentrer. J’ai pu transformer cette fragilité en force créative. Aujourd’hui, je peux dire que l’écriture m’a relevée — et qu’elle m’appartient pleinement.',
        'I was on the verge of exhaustion. Writing let me set my emotions down, catch my breath and refocus. I turned that fragility into creative strength. Today I can say that writing lifted me up — and that it fully belongs to me.',
      ),
    },
  }
}

// --- pages -------------------------------------------------------------------

export type PageKey =
  'home' | 'accompagnements' | 'auteurs' | 'quiSuisJe' | 'livres' | 'ressources' | 'contact'

type PageDef = { key: PageKey; slug: Record<Locale, string>; build: (c: Ctx) => PageData }

const home: PageDef = {
  key: 'home',
  slug: { fr: 'home', en: 'home' },
  build: (c) => {
    const t = pick(c)
    const tm = testimonialsAll(c)
    return {
      title: t('Accueil', 'Home'),
      meta: {
        title: t(
          'Besoin d’Écrire — Accompagnement autobiographique par Paulin Hassika',
          'Besoin d’Écrire — Autobiographical writing coaching with Paulin Hassika',
        ),
        description: t(
          'Depuis 2012, Paulin Hassika accompagne celles et ceux qui veulent écrire leur histoire, de l’intention à la publication. Premier échange offert.',
          'Since 2012, Paulin Hassika has helped people write their life story, from first intention to publication. Your first call is free.',
        ),
        image: c.media('paulinTableau'),
      },
      hero: {
        type: 'split',
        eyebrow: t(
          'Accompagnement autobiographique depuis 2012',
          'Autobiographical writing coaching since 2012',
        ),
        richText: html(
          t(
            '<h1>Écrire ce qui a été vécu. Avec quelqu’un <em>à vos côtés.</em></h1><p>Il y a une histoire en vous qui attend. Pas une histoire parfaite : une histoire vraie, qui cherche une forme juste pour exister.</p><p>Je crée l’espace où votre récit peut se déposer, se clarifier, se construire — jusqu’à la publication, si c’est là où vous voulez aller.</p>',
            '<h1>Write what you have lived. With someone <em>by your side.</em></h1><p>There is a story in you that is waiting. Not a perfect story: a true one, looking for the right form to exist.</p><p>I create the space where your story can settle, become clear and take shape — all the way to publication, if that is where you want to go.</p>',
          ),
        ),
        links: [
          calendly(c),
          pageLink(
            c,
            'accompagnements',
            t('Découvrir les accompagnements', 'Explore the programmes'),
            'outline',
          ),
        ],
        media: c.media('paulinTableau'),
      },
      layout: [
        {
          blockType: 'quote',
          quote: t(
            'Vous portez peut-être des souvenirs sans forme. Une époque que vous ne voulez pas laisser disparaître. Une transmission à faire. Ou simplement le sentiment persistant que votre vie mérite d’être racontée.',
            'Perhaps you carry memories without a shape. An era you don’t want to let disappear. Something to pass on. Or simply the persistent feeling that your life deserves to be told.',
          ),
          attribution: t('Vous êtes au bon endroit.', 'You are in the right place.'),
          style: 'centered',
          background: 'muted',
          paddingTop: 'lg',
          paddingBottom: 'lg',
        },
        {
          blockType: 'featureGrid',
          style: 'cards',
          columns: '3',
          eyebrow: t('Ce qui me distingue', 'What sets me apart'),
          heading: t(
            'Trois réalités rares dans l’accompagnement autobiographique',
            'Three things rarely found in autobiographical coaching',
          ),
          items: [
            {
              title: t('L’accompagnement le plus complet', 'The most complete support'),
              text: t(
                'De l’intention narrative à la publication : écriture, structuration, relecture profonde, mise en page, ISBN, présence d’auteur. Un seul interlocuteur, du premier mot à la dernière page.',
                'From narrative intention to publication: writing, structuring, in-depth reading, layout, ISBN, author presence. One single person, from the first word to the last page.',
              ),
            },
            {
              title: t('Une posture non directive', 'A non-directive approach'),
              text: t(
                'Je ne réécris pas. Je ne corrige pas votre style. Je rends votre voix plus claire, plus cohérente, plus juste — sans jamais la recouvrir de la mienne.',
                'I don’t rewrite. I don’t correct your style. I make your voice clearer, more coherent, more accurate — without ever covering it with mine.',
              ),
            },
            {
              title: t('Un accompagnant qui est d’abord auteur', 'A coach who is an author first'),
              text: t(
                'J’ai écrit, publié, fondé une maison d’édition. Je connais les deux côtés du processus : celui qui traverse l’écriture, et celui qui guide.',
                'I have written, published and founded a publishing house. I know both sides of the process: the one who goes through writing, and the one who guides.',
              ),
            },
          ],
        },
        {
          blockType: 'content',
          background: 'muted',
          columns: [
            {
              size: 'half',
              richText: html(
                t(
                  '<h2>Espace, regard, justesse</h2><p>Écrire sa vie, ce n’est pas produire un document. C’est traverser quelque chose — parfois des décennies entières — et trouver une forme à ce qui n’en avait pas encore.</p><p>Mon rôle n’est pas de vous dire comment écrire. Mon rôle est de créer les conditions pour que votre écriture devienne possible.</p><blockquote>Je crois que chaque voix est unique, et qu’elle n’a pas besoin d’être corrigée pour être entendue.</blockquote>',
                  '<h2>Space, attention, accuracy</h2><p>Writing your life is not about producing a document. It is about going through something — sometimes whole decades — and giving a shape to what did not have one yet.</p><p>My role is not to tell you how to write. My role is to create the conditions in which your writing becomes possible.</p><blockquote>I believe every voice is unique, and that it does not need to be corrected to be heard.</blockquote>',
                ),
              ),
            },
            {
              size: 'half',
              richText: html(
                t(
                  '<h3>Mon approche</h3><ul><li>J’écoute ce que vous voulez dire — et ce que vous ne savez pas encore que vous voulez dire.</li><li>Je lis vos textes avec une attention narrative : ce qui fonctionne, ce qui résiste, ce qui cherche à émerger.</li><li>Je pose des questions qui ouvrent, jamais des jugements qui ferment.</li><li>Je respecte votre rythme. Toujours. Sans pression, sans agenda caché.</li><li>Je ne corrige pas votre style, je ne réécris pas à votre place : je ne prends jamais la main sur votre voix.</li></ul>',
                  '<h3>My approach</h3><ul><li>I listen to what you want to say — and to what you don’t yet know you want to say.</li><li>I read your texts with narrative attention: what works, what resists, what is trying to emerge.</li><li>I ask questions that open things up, never judgements that close them down.</li><li>I respect your pace. Always. No pressure, no hidden agenda.</li><li>I don’t correct your style or rewrite in your place: I never take over your voice.</li></ul>',
                ),
              ),
            },
          ],
        },
        {
          blockType: 'stats',
          items: [
            {
              value: '2012',
              label: t(
                'premiers accompagnements autobiographiques',
                'first autobiographical coaching',
              ),
            },
            { value: '3', label: t('formules, de 1 à 12 mois', 'programmes, from 1 to 12 months') },
            {
              value: '4',
              label: t('romans publiés par l’auteur', 'novels published by the author'),
            },
            {
              value: '1',
              label: t(
                'seul interlocuteur, du premier mot à l’ISBN',
                'single contact, from first word to ISBN',
              ),
            },
          ],
        },
        formulas(c, false),
        {
          blockType: 'testimonials',
          eyebrow: t('Auteurs accompagnés', 'Our authors'),
          heading: t('Ce que disent ceux qui l’ont fait', 'In the words of those who did it'),
          items: [tm.marieNoelle, tm.jeanLouis, tm.jacqueline],
          background: 'muted',
        },
        {
          blockType: 'mediaContent',
          eyebrow: t('Qui suis-je', 'About me'),
          media: c.media('ecole'),
          mediaShape: 'landscape',
          mediaPosition: 'right',
          richText: html(
            t(
              '<h2>Paulin Hassika — physicien, auteur, éditeur, accompagnant</h2><p>Physicien de formation, écrivain par nécessité, accompagnant par vocation : ces trois identités ne s’opposent pas, elles se nourrissent.</p><p>Depuis 2012, j’aide des hommes et des femmes à écrire, structurer et publier leur histoire. Des mémoires de famille aux romans autobiographiques, des recueils de poèmes aux récits de vie.</p><p>Mon ancrage au Bénin et en Polynésie française m’a appris ce que transmettre signifie vraiment : non pas reproduire, mais faire vivre.</p>',
              '<h2>Paulin Hassika — physicist, author, publisher, writing coach</h2><p>A physicist by training, a writer by necessity, a coach by vocation: these three identities don’t compete, they nourish each other.</p><p>Since 2012, I have helped men and women write, structure and publish their story. From family memoirs to autobiographical novels, from poetry collections to life stories.</p><p>My roots in Benin and French Polynesia taught me what passing on truly means: not reproducing, but bringing to life.</p>',
            ),
          ),
          links: [pageLink(c, 'quiSuisJe', t('Mon parcours', 'My story'), 'outline')],
        },
        {
          blockType: 'archive',
          populateBy: 'collection',
          relationTo: 'posts',
          limit: 3,
          introContent: html(
            t(
              '<h2>Le blog</h2><p>Réflexions et conseils pour écrire son histoire.</p>',
              '<h2>The blog</h2><p>Thoughts and advice on writing your story.</p>',
            ),
          ),
        },
        closingCta(
          c,
          t(
            'Votre histoire attend <em>un espace pour s’écrire.</em>',
            'Your story is waiting <em>for a space to be written.</em>',
          ),
          t(
            'Un premier échange de 30 minutes pour comprendre ce que vous portez, et voir si je peux vous aider à avancer. Sans engagement. Sans script. Juste une conversation.',
            'A 30-minute first call to understand what you carry, and to see whether I can help you move forward. No commitment. No script. Just a conversation.',
          ),
        ),
      ],
    }
  },
}

const accompagnements: PageDef = {
  key: 'accompagnements',
  slug: { fr: 'accompagnement-ecriture', en: 'writing-coaching' },
  build: (c) => {
    const t = pick(c)
    const faq = (q: string, a: string) => ({ question: q, answer: html(`<p>${a}</p>`) })
    return {
      title: t('Accompagnements', 'Coaching'),
      meta: {
        title: t(
          'Accompagnement autobiographique : 3 formules, de 1 à 12 mois',
          'Autobiographical writing coaching: 3 programmes, from 1 to 12 months',
        ),
        description: t(
          'Découverte, Trajectoire ou Premium : un accompagnement sur mesure pour écrire, structurer et publier votre histoire, à votre rythme.',
          'Discovery, Trajectory or Premium: tailored support to write, structure and publish your story, at your own pace.',
        ),
      },
      hero: {
        type: 'lowImpact',
        eyebrow: t('Accompagnements', 'Coaching'),
        richText: html(
          t(
            '<h1>Écrire sa vie. Comprendre son histoire. <em>Devenir auteur.</em></h1><p>Il y a quelque chose que vous portez depuis longtemps. Des souvenirs, une trajectoire, une époque, une transmission à faire. Quelque chose qui mérite d’être dit, et qui attend encore d’être écrit.</p><p>L’accompagnement autobiographique, c’est le cadre que j’ai construit pour que vous puissiez aller au bout de ce projet. Pas à ma façon : à la vôtre. Avec un regard juste et stable à vos côtés.</p>',
            '<h1>Write your life. Understand your story. <em>Become an author.</em></h1><p>There is something you have carried for a long time. Memories, a path, an era, something to pass on. Something that deserves to be said, and is still waiting to be written.</p><p>Autobiographical coaching is the framework I have built so that you can see this project through. Not my way: yours. With a steady, accurate eye by your side.</p>',
          ),
        ),
      },
      layout: [
        {
          blockType: 'featureGrid',
          style: 'numbered',
          columns: '4',
          eyebrow: t('Ce que recouvre l’accompagnement', 'What the coaching covers'),
          heading: t('Un chemin sur mesure', 'A tailor-made path'),
          intro: t(
            'Ni un atelier d’écriture collectif, ni une correction de manuscrit, ni une formation générique. Selon votre besoin, l’accompagnement couvre :',
            'Not a group writing workshop, not manuscript editing, not a generic course. Depending on your needs, the coaching covers:',
          ),
          items: [
            {
              icon: 'compass',
              title: t('L’intention narrative', 'Narrative intention'),
              text: t(
                'Pourquoi vous écrivez, pour qui, avec quelle voix.',
                'Why you write, for whom, in what voice.',
              ),
            },
            {
              icon: 'pen',
              title: t('L’écriture et la structure', 'Writing and structure'),
              text: t(
                'Ce qui se dit, dans quel ordre, avec quelle cohérence.',
                'What is said, in what order, with what coherence.',
              ),
            },
            {
              icon: 'book',
              title: t('La relecture profonde', 'In-depth reading'),
              text: t(
                'Des retours narratifs réguliers sur vos textes.',
                'Regular narrative feedback on your texts.',
              ),
            },
            {
              icon: 'feather',
              title: t('La publication', 'Publication'),
              text: t(
                'Autoédition, mise en page, ISBN, puis présence d’auteur : page auteur, présentation du livre, lancement.',
                'Self-publishing, layout, ISBN, then author presence: author page, book presentation, launch.',
              ),
            },
          ],
        },
        { ...formulas(c, true), background: 'muted' },
        {
          blockType: 'quote',
          quote: t(
            'La plupart des accompagnements se limitent à l’écriture ou à la technique. J’accompagne l’ensemble du processus : l’écriture, la structure, la relecture, la publication, la présence d’auteur et le lancement.',
            'Most coaching stops at the writing or at the technical side. I support the whole process: writing, structure, reading, publication, author presence and launch.',
          ),
          attribution: t(
            'Un parcours complet, pour écrire son livre — et devenir auteur',
            'A complete journey, to write your book — and become an author',
          ),
          style: 'centered',
          paddingTop: 'lg',
          paddingBottom: 'lg',
        },
        {
          blockType: 'faq',
          eyebrow: t('Questions fréquentes', 'Frequently asked questions'),
          heading: t('Avant de commencer', 'Before you start'),
          items: [
            faq(
              t('Allez-vous réécrire mon texte ?', 'Will you rewrite my text?'),
              t(
                'Non. Je ne réécris pas et je ne corrige pas votre style. Je rends votre voix plus claire, plus cohérente, plus juste, sans jamais la recouvrir de la mienne.',
                'No. I don’t rewrite and I don’t correct your style. I make your voice clearer, more coherent, more accurate, without ever covering it with mine.',
              ),
            ),
            faq(
              t('Je n’ai jamais écrit. Est-ce pour moi ?', 'I have never written. Is this for me?'),
              t(
                'Oui. J’accompagne des personnes qui n’avaient jamais écrit, et d’autres qui écrivaient depuis longtemps sans parvenir à aller au bout.',
                'Yes. I work with people who had never written, and with others who had been writing for years without managing to finish.',
              ),
            ),
            faq(
              t('Quels projets accompagnez-vous ?', 'What kinds of projects do you support?'),
              t(
                'Mémoires de famille, récits de vie, recueils de poèmes, romans autobiographiques, et même des livres qui mêlent texte et photographie.',
                'Family memoirs, life stories, poetry collections, autobiographical novels, and even books that combine text and photography.',
              ),
            ),
            faq(
              t('Pourrai-je publier mon livre ?', 'Will I be able to publish my book?'),
              t(
                'Si c’est votre souhait, oui. La formule Premium couvre la préparation à la publication (autoédition, mise en page, ISBN) et la présence d’auteur (page auteur, présentation du livre, lancement).',
                'If you wish to, yes. The Premium programme covers preparing for publication (self-publishing, layout, ISBN) and author presence (author page, book presentation, launch).',
              ),
            ),
            faq(
              t('Comment choisir ma formule ?', 'How do I choose a programme?'),
              t(
                'Un premier échange de 30 minutes, offert et sans engagement, suffit pour y voir clair.',
                'A 30-minute first call, free and with no commitment, is enough to see clearly.',
              ),
            ),
            faq(
              t('À quel rythme avance-t-on ?', 'At what pace do we work?'),
              t(
                'Le vôtre. Toujours. Sans pression, sans agenda caché.',
                'Yours. Always. No pressure, no hidden agenda.',
              ),
            ),
          ],
        },
        closingCta(
          c,
          t('Commençons par <em>en parler.</em>', 'Let’s start by <em>talking.</em>'),
          t(
            'Un premier échange autour de votre récit : offert, sans engagement, pour savoir quelle formule vous correspond.',
            'A first conversation about your story: free, with no commitment, to find out which programme suits you.',
          ),
        ),
      ],
    }
  },
}

const auteurs: PageDef = {
  key: 'auteurs',
  slug: { fr: 'temoignages', en: 'testimonials' },
  build: (c) => {
    const t = pick(c)
    const tm = testimonialsAll(c)
    return {
      title: t('Auteurs accompagnés', 'Our authors'),
      meta: {
        title: t('Auteurs accompagnés : leurs témoignages', 'Our authors: their testimonials'),
        description: t(
          'Recueils de poésie, récits de vie, livre de photographies : les auteurs accompagnés par Paulin Hassika racontent leur parcours d’écriture.',
          'Poetry collections, life stories, a photography book: authors coached by Paulin Hassika describe their writing journey.',
        ),
      },
      hero: {
        type: 'lowImpact',
        eyebrow: t('Auteurs accompagnés', 'Our authors'),
        richText: html(
          t(
            '<h1>Des histoires <em>devenues livres.</em></h1><p>Recueils de poèmes, récits de vie, livre de photographies : chacun de ces projets a trouvé sa forme juste. Voici ce qu’en disent celles et ceux qui les ont écrits.</p>',
            '<h1>Stories that <em>became books.</em></h1><p>Poetry collections, life stories, a photography book: each of these projects found its true form. Here is what the people who wrote them say.</p>',
          ),
        ),
      },
      layout: [
        {
          blockType: 'testimonials',
          items: [
            tm.laurence,
            tm.marieNoelle,
            tm.jeanLouis,
            tm.paulValerie,
            tm.jacqueline,
            tm.laurin,
          ],
        },
        {
          blockType: 'mediaContent',
          eyebrow: t('Éditions B.E.L.', 'Éditions B.E.L.'),
          background: 'muted',
          media: c.media('livreLaurence'),
          mediaShape: 'cover',
          richText: html(
            t(
              '<h2>Besoin d’Écrire et de Lire</h2><p>Plusieurs de ces livres sont publiés par les Éditions B.E.L., la maison d’édition associative que j’ai fondée pour que d’autres puissent, à leur tour, publier leur histoire.</p>',
              '<h2>Besoin d’Écrire et de Lire</h2><p>Several of these books are published by Éditions B.E.L., the non-profit publishing house I founded so that others could, in turn, publish their story.</p>',
            ),
          ),
          links: [
            urlLink(
              EDITIONS_BEL,
              t('Découvrir les Éditions B.E.L.', 'Discover Éditions B.E.L.'),
              'outline',
            ),
          ],
        },
        closingCta(
          c,
          t(
            'Chaque vie est une histoire <em>qui mérite d’être racontée.</em>',
            'Every life is a story <em>worth telling.</em>',
          ),
          t(
            'En 12 mois, l’accompagnement Premium vous mène jusqu’au livre publié, avec une présence d’auteur solide.',
            'In 12 months, the Premium programme takes you all the way to a published book, with a solid author presence.',
          ),
        ),
      ],
    }
  },
}

const quiSuisJe: PageDef = {
  key: 'quiSuisJe',
  slug: { fr: 'qui-suis-je', en: 'about' },
  build: (c) => {
    const t = pick(c)
    return {
      title: t('Qui suis-je', 'About me'),
      meta: {
        title: t(
          'Qui suis-je : Paulin Hassika, physicien, auteur et accompagnant',
          'About Paulin Hassika: physicist, author and writing coach',
        ),
        description: t(
          'Physicien de formation, romancier, fondateur des Éditions B.E.L. : le parcours de Paulin Hassika, accompagnant autobiographique depuis 2012.',
          'Physicist by training, novelist, founder of Éditions B.E.L.: the story of Paulin Hassika, autobiographical writing coach since 2012.',
        ),
        image: c.media('paulinTableau'),
      },
      hero: {
        type: 'split',
        eyebrow: t('Qui suis-je', 'About me'),
        richText: html(
          t(
            '<h1>Paulin Hassika — <em>être à côté, pas devant.</em></h1><p>Physicien de formation, écrivain par passion et enseignant-formateur par vocation, j’ai toujours eu à cœur de transmettre, d’accompagner et de créer des ponts entre les savoirs et les personnes.</p>',
            '<h1>Paulin Hassika — <em>beside you, not in front.</em></h1><p>A physicist by training, a writer by passion and a teacher-trainer by vocation, I have always cared about passing on knowledge, supporting people and building bridges between knowledge and people.</p>',
          ),
        ),
        links: [
          pageLink(c, 'accompagnements', t('Voir les accompagnements', 'See the programmes')),
        ],
        media: c.media('paulinTableau'),
      },
      layout: [
        {
          blockType: 'mediaContent',
          media: c.media('salleDeClasse'),
          mediaShape: 'landscape',
          richText: html(
            t(
              '<h2>De l’écriture à l’accompagnement</h2><p>Au fil des années, j’ai publié plusieurs romans en autoédition et fondé la maison d’édition associative <a href="https://editionsbesoindecrireetdelire.over-blog.com/">Besoin d’Écrire et de Lire (B.E.L.)</a>, pour que d’autres puissent faire de même. J’ai animé des ateliers d’écriture : ils m’ont montré que la créativité et la pédagogie ne s’opposent pas, elles se nourrissent mutuellement.</p><p>Puis j’ai compris ce qui m’animait le plus profondément : être à côté, pas devant, pendant que quelqu’un écrit sa propre histoire. Depuis 2012, c’est ce que je fais.</p>',
              '<h2>From writing to coaching</h2><p>Over the years, I have self-published several novels and founded the non-profit publishing house <a href="https://editionsbesoindecrireetdelire.over-blog.com/">Besoin d’Écrire et de Lire (B.E.L.)</a>, so that others could do the same. I ran writing workshops: they showed me that creativity and teaching are not opposites, they feed each other.</p><p>Then I understood what drives me most deeply: being beside someone, not in front, while they write their own story. Since 2012, that is what I do.</p>',
            ),
          ),
        },
        {
          blockType: 'featureGrid',
          style: 'cards',
          columns: '3',
          background: 'muted',
          eyebrow: t('Ce qui nourrit mon regard', 'What shapes the way I read'),
          heading: t('Trois ancrages', 'Three anchors'),
          items: [
            {
              title: t('Le Bénin et les Marquises', 'Benin and the Marquesas'),
              text: t(
                'Mon ancrage au Bénin et aux îles Marquises, en Polynésie française, m’a appris ce que transmettre signifie : non pas reproduire, mais faire vivre. Chaque récit, même intime, même ordinaire en apparence, porte quelque chose d’universel.',
                'My roots in Benin and in the Marquesas Islands, in French Polynesia, taught me what passing on means: not reproducing, but bringing to life. Every story, however intimate or ordinary it may seem, carries something universal.',
              ),
            },
            {
              title: t('Le journalisme', 'Journalism'),
              text: t(
                'Mon expérience de correspondant de presse pour Sud Ouest m’a appris la précision, l’écoute et la portée des mots.',
                'My experience as a press correspondent for the newspaper Sud Ouest taught me precision, listening and the weight of words.',
              ),
            },
            {
              title: t('La recherche', 'Research'),
              text: t(
                'Mon parcours de chercheur m’a appris à ne pas aller vite là où il faut aller juste.',
                'My background as a researcher taught me not to rush where accuracy matters.',
              ),
            },
          ],
        },
        {
          blockType: 'quote',
          quote: t(
            'Je crois que chaque vie mérite d’être racontée avec justesse. Que votre voix est unique, et qu’elle n’a pas besoin d’être corrigée pour être entendue. Que l’écriture peut transformer, éclairer, relier ce qui semblait dispersé.',
            'I believe every life deserves to be told with accuracy. That your voice is unique, and does not need to be corrected to be heard. That writing can transform, illuminate and connect what seemed scattered.',
          ),
          attribution: t('Ce que je crois', 'What I believe'),
          style: 'centered',
          paddingTop: 'lg',
          paddingBottom: 'lg',
        },
        {
          blockType: 'mediaContent',
          media: c.media('ecole'),
          mediaShape: 'landscape',
          mediaPosition: 'right',
          richText: html(
            t(
              '<h2>Mon style de transmission</h2><p>Je privilégie une communication claire, chaleureuse et explicite.</p><ul><li><strong>Clarté</strong> : chaque étape est expliquée simplement.</li><li><strong>Chaleur</strong> : l’accompagnement se fait dans un esprit de confiance et de partage.</li><li><strong>Explicite</strong> : rien n’est laissé dans l’ombre, pour que vous avanciez sereinement et en autonomie.</li></ul><p>Mon style est celui d’un compagnon de route : je ne vous impose pas un chemin, je vous aide à tracer le vôtre.</p>',
              '<h2>How I pass things on</h2><p>I favour clear, warm and explicit communication.</p><ul><li><strong>Clarity</strong>: every step is explained simply.</li><li><strong>Warmth</strong>: the coaching is built on trust and sharing.</li><li><strong>Explicitness</strong>: nothing is left in the shadows, so that you move forward calmly and independently.</li></ul><p>My style is that of a travelling companion: I don’t impose a path on you, I help you trace your own.</p>',
            ),
          ),
        },
        {
          blockType: 'mediaContent',
          background: 'muted',
          eyebrow: t('Pourquoi Besoin d’Écrire', 'Why Besoin d’Écrire'),
          richText: html(
            t(
              '<h2>Toutes les histoires ne sont pas racontées</h2><p>Besoin d’Écrire est né d’une conviction simple : beaucoup de ceux qui portent une histoire ne savent pas comment la mettre en mots seuls.</p><p>Ce site est l’espace que j’ai construit pour accueillir ces histoires. Pas pour les corriger. Pas pour les uniformiser. Pour les aider à exister, dans leur forme la plus juste.</p><p>Ce que je propose, c’est un cadre humain, rigoureux et non directif, de la première phrase à la publication.</p>',
              '<h2>Not every story gets told</h2><p>Besoin d’Écrire (“the need to write”) was born from a simple conviction: many people who carry a story don’t know how to put it into words on their own.</p><p>This site is the space I built to welcome those stories. Not to correct them. Not to standardise them. To help them exist, in their truest form.</p><p>What I offer is a human, rigorous and non-directive framework, from the first sentence to publication.</p>',
            ),
          ),
          links: [pageLink(c, 'livres', t('Découvrir mes livres', 'Discover my books'), 'outline')],
        },
        closingCta(
          c,
          t(
            'Clarté, authenticité, <em>empowerment.</em>',
            'Clarity, authenticity, <em>empowerment.</em>',
          ),
          t(
            'Parce que chacun mérite de voir ses idées prendre forme et de trouver sa place dans le monde créatif, personnel comme professionnel.',
            'Because everyone deserves to see their ideas take shape and to find their place in the creative world, personal as well as professional.',
          ),
        ),
      ],
    }
  },
}

type Book = {
  media: MediaKey
  stripe: string
  genre: [string, string]
  title: string
  intention: [string, string]
  heart: [string, string]
  learned: [string, string]
  audience: [string, string]
}

const books: Book[] = [
  {
    media: 'coverJeanne',
    stripe: 'https://buy.stripe.com/7sY9AT1uib4a9YBaiZ4F206',
    genre: ['Roman', 'Novel'],
    title: 'Jeanne, entre plaines et gâtines',
    intention: [
      'Ce livre est né d’un besoin de revenir à l’origine des sentiments : l’amour, la lignée, la paternité et la présence d’un enfant. Il explore ce qui se transmet sans se dire, ce qui se perd, ce qui revient.',
      'This book was born from a need to return to where feelings begin: love, lineage, fatherhood and the presence of a child. It explores what is passed on without being said, what is lost, what comes back.',
    ],
    heart: [
      '<em>Jeanne</em> raconte le combat intérieur d’une femme partagée entre un désir d’enfant qui la dévore et une passion amoureuse qui la dépasse. À travers un échange de mails brûlants, le roman dévoile ses doutes, ses élans, ses contradictions. Face à elle, deux hommes, François et Nicolas, incarnent les zones d’ombre du masculin : désir, fuite, loyauté fragile.',
      '<em>Jeanne</em> tells the inner struggle of a woman torn between a consuming desire for a child and a love affair that overwhelms her. Through an exchange of burning emails, the novel reveals her doubts, her impulses, her contradictions. Facing her, two men, François and Nicolas, embody the shadowy sides of masculinity: desire, flight, fragile loyalty.',
    ],
    learned: [
      'La nécessité de respecter les zones sensibles. La force des silences dans toute relation. La puissance des récits qui ne cherchent pas à plaire, mais à être vrais.',
      'The need to respect sensitive areas. The power of silence in every relationship. The strength of stories that don’t try to please, but to be true.',
    ],
    audience: [
      'Pour celles et ceux qui aiment les récits d’amour, de lignée et de mémoire.',
      'For readers who love stories of love, lineage and memory.',
    ],
  },
  {
    media: 'coverKinta',
    stripe: 'https://buy.stripe.com/6oUeVddd0gou7QtgHn4F205',
    genre: ['Roman policier', 'Crime novel'],
    title: 'Kinta, et la sentence des 7',
    intention: [
      'Ce livre est né d’un besoin de comprendre ce qui se joue dans les zones d’ombre : celles des trajectoires brisées, des identités en tension, des vies qui se déploient loin des regards.',
      'This book was born from a need to understand what happens in the shadows: broken paths, identities under strain, lives that unfold far from view.',
    ],
    heart: [
      'À Nancy, un homme d’origine africaine est retrouvé mort, apparemment sans histoire. Mais l’enquête révèle une réalité bien plus complexe. De la Lorraine à Paris, de Marseille à l’Afrique de l’Ouest, <em>Kinta</em> traverse les zones grises d’une vie éclatée et les ramifications d’un crime organisé où se mêlent grand banditisme, migrations brisées et identités en tension.',
      'In Nancy, a man of African origin is found dead, apparently with no story to tell. But the investigation reveals a far more complex reality. From Lorraine to Paris, from Marseille to West Africa, <em>Kinta</em> crosses the grey areas of a shattered life and the ramifications of organised crime, where gangsterism, broken migrations and conflicted identities meet.',
    ],
    learned: [
      'La nécessité de regarder les zones sensibles sans les simplifier. La force des trajectoires invisibles. Et combien les histoires humaines sont toujours plus vastes que ce qu’elles montrent.',
      'The need to look at sensitive areas without simplifying them. The power of invisible paths. And how human stories are always larger than what they show.',
    ],
    audience: [
      'Pour les lecteurs qui aiment les récits ancrés dans le réel, traversés par la tension, la mémoire et les identités multiples.',
      'For readers who enjoy stories rooted in reality, charged with tension, memory and multiple identities.',
    ],
  },
  {
    media: 'coverSennami',
    stripe: 'https://buy.stripe.com/28EeVd1ui4FM7QtaiZ4F207',
    genre: ['Roman historique', 'Historical novel'],
    title: 'Sénnami, l’amazone du roi',
    intention: [
      'Ce livre est né d’un besoin de revenir aux origines : celles d’un royaume, d’une lignée, d’un corps en marche dans l’Histoire. Il interroge la place d’une femme au cœur d’un monde en transformation, là où pouvoir, filiation et survie s’entremêlent.',
      'This book was born from a need to return to origins: those of a kingdom, a lineage, a body moving through History. It questions the place of a woman at the heart of a changing world, where power, descent and survival intertwine.',
    ],
    heart: [
      'Au Dahomey, Sénnami avance dans un royaume où chaque conquête redessine les lignages et où chaque naissance devient un acte politique. Le roman traverse les coulisses d’un Dahomey vibrant : alliances fragiles, loyautés mouvantes, dominations qui s’inscrivent dans les corps et les familles.',
      'In Dahomey, Sénnami moves through a kingdom where every conquest redraws the lineages and every birth becomes a political act. The novel explores the hidden side of a vibrant Dahomey: fragile alliances, shifting loyalties, forms of domination written into bodies and families.',
    ],
    learned: [
      'La nécessité de regarder l’Histoire non pas comme un décor, mais comme une force vivante qui traverse les êtres. La profondeur des voix féminines dans des mondes façonnés par la guerre et le pouvoir.',
      'The need to see History not as a backdrop, but as a living force that runs through people. The depth of women’s voices in worlds shaped by war and power.',
    ],
    audience: [
      'Pour les amateurs de récits historiques incarnés, où l’intime rencontre la stratégie.',
      'For lovers of vivid historical fiction, where the intimate meets strategy.',
    ],
  },
  {
    media: 'coverHordain',
    stripe: 'https://buy.stripe.com/6oU4gzeh4a061s576N4F208',
    genre: ['Roman', 'Novel'],
    title: 'Les mots japonais à Hordain',
    intention: [
      'Ce livre est né d’un besoin de comprendre ce qui se joue quand l’amour déborde, déstabilise, fissure les certitudes. Il interroge ce que l’on cherche vraiment dans l’autre : refuge, réparation, ou simple illusion.',
      'This book was born from a need to understand what happens when love overflows, unsettles, cracks our certainties. It asks what we are really looking for in another person: refuge, repair, or mere illusion.',
    ],
    heart: [
      'Dans <em>Les mots japonais à Hordain</em>, l’amour n’est pas un refuge mais une fièvre qui dérègle tout. La rencontre entre deux êtres devient un jeu de projections et de miroirs déformants, où chacun se perd en croyant se sauver. Un roman intense et troublant sur les mirages du cœur.',
      'In <em>Les mots japonais à Hordain</em>, love is not a refuge but a fever that throws everything off balance. The meeting of two people becomes a game of projections and distorting mirrors, where each loses themselves while believing they are being saved. An intense, unsettling novel about the mirages of the heart.',
    ],
    learned: [
      'La nécessité de regarder l’amour sans le romantiser. La force des contradictions humaines. Et combien les relations révèlent toujours plus que ce qu’elles montrent.',
      'The need to look at love without romanticising it. The strength of human contradictions. And how relationships always reveal more than they show.',
    ],
    audience: [
      'Pour celles et ceux qui aiment les récits intimes, traversés par le désir, les illusions et les tensions du cœur.',
      'For readers who love intimate stories, charged with desire, illusion and the tensions of the heart.',
    ],
  },
]

const livres: PageDef = {
  key: 'livres',
  slug: { fr: 'mes-livres', en: 'my-books' },
  build: (c) => {
    const t = pick(c)
    const l = c.locale === 'fr' ? 0 : 1
    return {
      title: t('Mes livres', 'My books'),
      meta: {
        title: t('Mes livres : les romans de Paulin Hassika', 'My books: novels by Paulin Hassika'),
        description: t(
          'Jeanne, Kinta, Sénnami, Les mots japonais à Hordain : les romans de Paulin Hassika, à télécharger en PDF.',
          'Jeanne, Kinta, Sénnami, Les mots japonais à Hordain: novels by Paulin Hassika, available as PDF downloads.',
        ),
        image: c.media('coverKinta'),
      },
      hero: {
        type: 'lowImpact',
        eyebrow: t('Mes livres', 'My books'),
        richText: html(
          t(
            '<h1>Écrire <em>pour traverser.</em></h1><p>Avant d’accompagner les autres, j’ai longtemps écrit pour comprendre ce qui me traversait. Mes livres sont nés de moments de bascule, de territoires intérieurs, de mémoires qui demandaient une forme. Ce ne sont pas des « produits », mais des fragments de chemin.</p>',
            '<h1>Writing <em>to get through.</em></h1><p>Before coaching others, I wrote for a long time to understand what I was going through. My books were born from turning points, inner territories, memories that needed a form. They are not “products”, but fragments of a path.</p>',
          ),
        ),
      },
      layout: [
        {
          blockType: 'quote',
          quote: t(
            'Accueillir sans corriger.\nÉclairer sans imposer.\nLaisser émerger ce qui cherche à se dire.',
            'Welcome without correcting.\nShed light without imposing.\nLet what wants to be said emerge.',
          ),
          attribution: t(
            'Ce que l’écriture m’a appris, et que j’apporte dans chaque accompagnement',
            'What writing taught me, and what I bring to every coaching',
          ),
          paddingTop: 'sm',
        },
        ...books.map((b, i): Block => ({
          blockType: 'mediaContent',
          eyebrow: b.genre[l],
          media: c.media(b.media),
          mediaShape: 'cover',
          mediaPosition: i % 2 ? 'right' : 'left',
          background: i % 2 ? 'muted' : 'none',
          richText: html(
            `<h2>${b.title}</h2><p>${b.intention[l]}</p><h3>${t('Le cœur du livre', 'The heart of the book')}</h3><p>${b.heart[l]}</p><blockquote>${b.learned[l]}</blockquote><p><em>${b.audience[l]}</em></p>`,
          ),
          links: [urlLink(b.stripe, t('Acheter le livre en PDF', 'Buy the PDF'))],
        })),
        {
          blockType: 'mediaContent',
          eyebrow: t('Pourquoi partager mes livres ici', 'Why I share my books here'),
          richText: html(
            t(
              '<h2>Avoir traversé l’écriture</h2><p>Chaque livre a ouvert un espace différent : mémoire, transmission, territoire, voix. Chacun a été un chemin pour comprendre, respirer, me tenir debout.</p><p>Lorsque vous confiez votre histoire à quelqu’un, vous méritez de savoir qu’il a lui aussi traversé l’écriture, pas seulement qu’il en parle. Ce que j’ai vécu en écrivant, je l’apporte dans chaque accompagnement.</p>',
              '<h2>Having been through writing</h2><p>Each book opened a different space: memory, transmission, territory, voice. Each one was a way to understand, to breathe, to stand tall.</p><p>When you entrust your story to someone, you deserve to know that they have been through writing themselves, not just that they talk about it. What I lived through as a writer, I bring to every coaching.</p>',
            ),
          ),
          links: [
            pageLink(
              c,
              'accompagnements',
              t('Voir les accompagnements', 'See the programmes'),
              'outline',
            ),
          ],
        },
        closingCta(
          c,
          t(
            'Et si le prochain livre <em>était le vôtre ?</em>',
            'What if the next book <em>were yours?</em>',
          ),
          t(
            'Transformer une histoire intérieure en un récit juste, vivant et libérateur : c’est ce que je vous propose d’explorer ensemble.',
            'Turning an inner story into a true, living and liberating narrative: that is what I invite you to explore together.',
          ),
        ),
      ],
    }
  },
}

const ressources: PageDef = {
  key: 'ressources',
  slug: { fr: 'debloquer-votre-ecriture', en: 'resources' },
  build: (c) => {
    const t = pick(c)
    const guide = (title: string, text: string, url: string, icon: string) => ({
      icon: icon as 'book',
      title,
      text,
      enableLink: true,
      link: {
        type: 'custom' as const,
        url,
        newTab: true,
        label: t('Télécharger le guide', 'Download the guide'),
      },
    })
    return {
      title: t('Ressources', 'Resources'),
      meta: {
        title: t('Débloquer votre écriture : guides gratuits', 'Unblock your writing: free guides'),
        description: t(
          'Six guides gratuits pour commencer à écrire son histoire, interviewer un proche, s’autoéditer et faire connaître son livre.',
          'Six free guides to start writing your story, interview a loved one, self-publish and promote your book.',
        ),
      },
      hero: {
        type: 'lowImpact',
        eyebrow: t('Ressources gratuites', 'Free resources'),
        richText: html(
          t(
            '<h1>Débloquer <em>votre écriture.</em></h1><p>Vous avez une idée de livre, un récit personnel, un projet d’écriture… mais vous ne savez pas par où commencer ? La page blanche, le manque de structure, les doutes, la dispersion : ces obstacles sont fréquents, et ils peuvent être dépassés.</p>',
            '<h1>Unblock <em>your writing.</em></h1><p>You have an idea for a book, a personal story, a writing project… but you don’t know where to start? The blank page, lack of structure, doubt, scattered focus: these obstacles are common, and they can be overcome.</p>',
          ),
        ),
      },
      layout: [
        {
          blockType: 'featureGrid',
          style: 'cards',
          columns: '3',
          eyebrow: t('Guides & modèles', 'Guides & templates'),
          heading: t('Six guides pratiques, offerts', 'Six practical guides, free'),
          intro: t(
            'Aucun spam, aucune relance agressive. Juste le guide, et de temps en temps, une lettre sur l’écriture.',
            'No spam, no pushy follow-ups. Just the guide, and now and then, a letter about writing.',
          ),
          items: [
            guide(
              t(
                '5 étapes pour commencer à écrire son histoire',
                '5 steps to start writing your story',
              ),
              t(
                'Tout ce qu’il faut savoir pour vous lancer dans votre premier récit. 7 pages.',
                'Everything you need to get started on your first story. 7 pages.',
              ),
              'https://k3hmbqygwr.zite.so/',
              'pen',
            ),
            guide(
              t(
                'Comment interviewer un proche pour recueillir sa mémoire',
                'How to interview a loved one to gather their memories',
              ),
              t(
                'Une méthode pour recueillir une mémoire familiale en toute autonomie. 4 pages.',
                'A method to collect a family memory on your own. 4 pages.',
              ),
              'https://2xpvuyu31n.zite.so',
              'message',
            ),
            guide(
              t('Le guide complet de l’autoédition', 'The complete guide to self-publishing'),
              t(
                'Tout ce qu’il faut savoir pour publier votre premier livre en toute indépendance. 7 pages.',
                'Everything you need to publish your first book independently. 7 pages.',
              ),
              'https://jnuhwxy8vl.zite.so',
              'book',
            ),
            guide(
              t('Comparatif des plateformes de publication', 'Comparison of publishing platforms'),
              t(
                'Analyse détaillée des principales plateformes d’autoédition et de leurs fonctionnalités. 3 pages.',
                'A detailed look at the main self-publishing platforms and their features. 3 pages.',
              ),
              'https://uk2t78aw3r.zite.so',
              'search',
            ),
            guide(
              t('Stratégies de marketing du livre', 'Book marketing strategies'),
              t(
                'Des tactiques éprouvées pour promouvoir votre livre et toucher vos lecteurs. 4 pages.',
                'Proven tactics to promote your book and reach your readers. 4 pages.',
              ),
              'https://j9fu6rprx2.zite.so',
              'sparkles',
            ),
            guide(
              t('Boîte à outils d’automatisation créative', 'Creative automation toolkit'),
              t(
                'Les outils et flux de travail essentiels pour alléger votre processus créatif. 4 pages.',
                'Essential tools and workflows to streamline your creative process. 4 pages.',
              ),
              'https://ocsf7xe56u.zite.so',
              'wrench',
            ),
          ],
        },
        {
          blockType: 'testimonials',
          background: 'muted',
          eyebrow: t('Le premier échange', 'The first call'),
          heading: t('Ils en parlent', 'What they say'),
          items: [
            {
              author: 'Claire',
              role: t('Participante au premier échange', 'First-call participant'),
              quote: t(
                'Je pensais que mon projet était trop flou. En 30 minutes, Paulin m’a aidée à y voir clair et à poser les premières étapes. Je suis repartie motivée et structurée.',
                'I thought my project was too vague. In 30 minutes, Paulin helped me see clearly and set out the first steps. I left motivated and organised.',
              ),
            },
            {
              author: 'Marc',
              role: t('Auteur en devenir', 'Author-to-be'),
              quote: t(
                'Ce rendez-vous m’a permis de débloquer mon écriture. J’ai enfin compris comment transformer mes idées en un vrai projet.',
                'This meeting unblocked my writing. I finally understood how to turn my ideas into a real project.',
              ),
            },
          ],
        },
        closingCta(
          c,
          t('Passez de l’idée <em>à l’action.</em>', 'Move from idea <em>to action.</em>'),
          t(
            'Le premier échange est une porte d’entrée simple, gratuite et sans engagement pour débloquer votre écriture et poser les fondations d’un projet solide.',
            'The first call is a simple, free, no-commitment way to unblock your writing and lay the foundations of a solid project.',
          ),
        ),
      ],
    }
  },
}

const contact: PageDef = {
  key: 'contact',
  slug: { fr: 'contact', en: 'contact' },
  build: (c) => {
    const t = pick(c)
    return {
      title: t('Contact', 'Contact'),
      meta: {
        title: t(
          'Contact : parlons de votre projet d’écriture',
          'Contact: let’s talk about your writing project',
        ),
        description: t(
          'Réservez un premier échange de 30 minutes, offert et sans engagement, ou envoyez un message à Paulin Hassika.',
          'Book a free, no-commitment 30-minute first call, or send a message to Paulin Hassika.',
        ),
      },
      hero: {
        type: 'lowImpact',
        eyebrow: t('Contact', 'Contact'),
        richText: html(
          t(
            '<h1>Parlons de <em>votre projet.</em></h1><p>Le plus simple est de réserver un premier échange de 30 minutes, offert et sans engagement. Vous préférez écrire ? Le formulaire ci-dessous est là pour ça.</p>',
            '<h1>Let’s talk about <em>your project.</em></h1><p>The simplest way is to book a free, no-commitment 30-minute first call. Prefer to write? The form below is here for that.</p>',
          ),
        ),
      },
      layout: [
        {
          blockType: 'cta',
          richText: html(
            t(
              '<h2>Un premier échange <em>de 30 minutes</em></h2><p>Pour poser vos questions et sentir si le cadre vous correspond. Sans engagement. Sans script. Juste une conversation.</p>',
              '<h2>A <em>30-minute</em> first call</h2><p>To ask your questions and feel whether the approach suits you. No commitment. No script. Just a conversation.</p>',
            ),
          ),
          links: [calendly(c)],
          background: 'muted',
        },
        {
          blockType: 'formBlock',
          form: c.form,
          enableIntro: true,
          introContent: html(t('<h2>Écrire un message</h2>', '<h2>Send a message</h2>')),
        },
      ],
    }
  },
}

/** Creation order: a page can only link to pages listed before it. */
export const pages: PageDef[] = [
  contact,
  accompagnements,
  livres,
  quiSuisJe,
  auteurs,
  ressources,
  home,
]

// --- globals -------------------------------------------------------------------

export const navigation = (c: Ctx) => {
  const t = pick(c)
  const blog = { link: { type: 'custom' as const, url: t('/blog', '/en/blog'), label: 'Blog' } }
  const items = [
    pageLink(c, 'accompagnements', t('Accompagnements', 'Coaching')),
    pageLink(c, 'auteurs', t('Auteurs accompagnés', 'Our authors')),
    pageLink(c, 'quiSuisJe', t('Qui suis-je', 'About')),
    pageLink(c, 'livres', t('Mes livres', 'My books')),
    pageLink(c, 'ressources', t('Ressources', 'Resources')),
  ].map(({ link }) => ({ link: { type: link.type, reference: link.reference, label: link.label } }))
  return {
    header: {
      navItems: [...items, blog],
      enableCta: true,
      cta: {
        type: 'custom' as const,
        url: CALENDLY,
        newTab: true,
        label: t('Premier échange', 'First call'),
      },
    },
    footer: {
      navItems: [
        ...items,
        blog,
        { link: { ...pageLink(c, 'contact', 'Contact').link, appearance: undefined } },
      ],
    },
  }
}

export const siteCopy: Record<Locale, { siteName: string; siteDescription: string }> = {
  fr: {
    siteName: 'Besoin d’Écrire',
    siteDescription:
      'Accompagnement autobiographique depuis 2012. Écrire sa vie, comprendre son histoire, devenir auteur.',
  },
  en: {
    siteName: 'Besoin d’Écrire',
    siteDescription:
      'Autobiographical writing coaching since 2012. Write your life, understand your story, become an author.',
  },
}

/** Old WordPress URLs (FR only) -> new pages, so links and search rankings survive the switch. */
export const pageRedirects: { from: string; to: PageKey }[] = [
  { from: '/bienvenue', to: 'home' },
  { from: '/accueil-2', to: 'home' },
  { from: '/a-propos', to: 'quiSuisJe' },
]
