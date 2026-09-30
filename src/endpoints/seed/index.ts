import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { contactForm as contactFormData, contactFormTranslation } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { preserveIds } from './preserve-ids'
import { siteSettingsCopy } from './site-settings'
import { locales, type Locale } from '@/utilities/getLocalizedPath'

const collections: CollectionSlug[] = [
  'media',
  'pages',
  'forms',
  'form-submissions',
  'posts',
  'categories',
  'search',
]

// Kept as a literal tuple (not `GlobalSlug[]`) so `global` narrows to exactly
// 'header' | 'footer' below — both reset with the same `{ navItems: [] }`
// shape. Widening this to `GlobalSlug[]` pulls every registered global
// (e.g. `site-settings`, which has no `navItems`) into the union and breaks
// the object literal below.
const globals = ['header', 'footer'] as const satisfies readonly GlobalSlug[]

/**
 * Every locale after the first (`locales[0]`, the configured default). Payload
 * has no "create in every locale at once" call: a document is always created
 * in the default locale, then translated with one `update` per additional
 * locale. With exactly two locales configured (`fr`, `en`) this is a single
 * extra locale today, but written to scale to more without changes here.
 */
const additionalLocales = locales.slice(1)

type NavItem = {
  link: {
    label: string
    reference?: { relationTo: 'pages'; value: number }
    type: 'custom' | 'reference'
    url?: string
  }
}

const headerNavItems: Record<Locale, (contactPageId: number) => NavItem[]> = {
  fr: (contactPageId) => [
    {
      link: {
        type: 'reference',
        label: 'Contact',
        reference: { relationTo: 'pages', value: contactPageId },
      },
    },
  ],
  en: (contactPageId) => [
    {
      link: {
        type: 'reference',
        label: 'Contact us',
        reference: { relationTo: 'pages', value: contactPageId },
      },
    },
  ],
}

const footerNavItems: Record<Locale, (contactPageId: number) => NavItem[]> = {
  fr: (contactPageId) => [
    { link: { type: 'custom', label: 'Mentions légales', url: '#' } },
    {
      link: {
        type: 'reference',
        label: 'Contact',
        reference: { relationTo: 'pages', value: contactPageId },
      },
    },
  ],
  en: (contactPageId) => [
    { link: { type: 'custom', label: 'Legal notice', url: '#' } },
    {
      link: {
        type: 'reference',
        label: 'Contact us',
        reference: { relationTo: 'pages', value: contactPageId },
      },
    },
  ],
}

// Next.js revalidation errors are normal when seeding the database without a server running
// i.e. running `yarn seed` locally instead of using the admin UI within an active app
// The app is not running to revalidate the pages and so the API routes are not available
// These error messages can be ignored: `Error hitting revalidate route for...`
export const seed = async ({
  payload,
  req,
}: {
  payload: Payload
  req: PayloadRequest
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  // we need to clear the media directory before seeding
  // as well as the collections and globals
  // this is because while `yarn seed` drops the database
  // the custom `/api/seed` endpoint does not
  payload.logger.info(`— Clearing collections and globals...`)

  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  // Sequential: parallel deletes of FK-linked tables (pages/media/forms...) deadlock (Postgres 40P01).
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
  }

  for (const collection of collections) {
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  payload.logger.info(`— Seeding demo author...`)

  // Idempotent re-seed. Editor only: the real superadmin is the first registered user.
  await payload.delete({
    collection: 'users',
    depth: 0,
    where: { email: { equals: 'demo-author@example.com' } },
  })

  const demoAuthor = await payload.create({
    collection: 'users',
    data: {
      name: 'Demo Author',
      email: 'demo-author@example.com',
      password: 'password',
      role: 'editor',
    },
  })

  payload.logger.info(`— Seeding media (${locales[0]})...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    readLocalFile('image-post1.webp'),
    readLocalFile('image-post2.webp'),
    readLocalFile('image-post3.webp'),
    readLocalFile('image-hero1.webp'),
  ])

  const [image1Doc, image2Doc, image3Doc, imageHomeDoc] = await Promise.all([
    payload.create({
      collection: 'media',
      data: image1(locales[0]),
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2(locales[0]),
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2(locales[0]),
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1(locales[0]),
      file: hero1Buffer,
    }),
  ])

  payload.logger.info(`— Seeding categories (${locales[0]})...`)

  const categoryNames = [
    { fr: 'Technologie', en: 'Technology' },
    { fr: 'Innovation', en: 'Innovation' },
    { fr: 'Finance', en: 'Finance' },
  ]

  const categories = await Promise.all(
    categoryNames.map((cat) =>
      payload.create({
        collection: 'categories',
        depth: 0,
        data: {
          title: cat[locales[0] as Locale],
          slug: cat[locales[0] as Locale].toLowerCase().replace(/\s+/g, '-'),
        },
      }),
    ),
  )

  payload.logger.info(`— Seeding contact form (${locales[0]})...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: contactFormData(locales[0]),
  })

  payload.logger.info(`— Seeding posts (${locales[0]})...`)

  // Create posts in order so they have predictable createdAt
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post1({
      heroImage: image1Doc,
      blockImage: image2Doc,
      author: demoAuthor,
      locale: locales[0],
    }),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post2({
      heroImage: image2Doc,
      blockImage: image3Doc,
      author: demoAuthor,
      locale: locales[0],
    }),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: post3({
      heroImage: image3Doc,
      blockImage: image1Doc,
      author: demoAuthor,
      locale: locales[0],
    }),
  })

  // Update posts with related posts
  // Sequential: parallel updates deadlock, the posts reference each other.
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    context: { disableRevalidate: true },
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
      categories: [categories[0].id, categories[1].id],
    },
  })
  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    context: { disableRevalidate: true },
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
      categories: [categories[1].id, categories[2].id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    context: { disableRevalidate: true },
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
      categories: [categories[2].id],
    },
  })

  payload.logger.info(`— Seeding pages (${locales[0]})...`)

  const homeImages = [image1Doc, image2Doc, image3Doc, imageHomeDoc]

  const [homePage, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: home({
        heroImage: imageHomeDoc,
        images: homeImages,
        locale: locales[0],
        metaImage: image2Doc,
      }),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: contactPageData({ contactForm, locale: locales[0] }),
    }),
  ])

  payload.logger.info(`— Seeding globals (${locales[0]})...`)

  const [headerDoc, footerDoc] = await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: headerNavItems[locales[0]](contactPage.id),
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: footerNavItems[locales[0]](contactPage.id),
      },
    }),
    payload.updateGlobal({
      slug: 'site-settings',
      data: siteSettingsCopy[locales[0]],
    }),
  ])

  for (const locale of additionalLocales) {
    payload.logger.info(`— Translating media into ${locale}...`)

    await Promise.all([
      payload.update({
        collection: 'media',
        id: image1Doc.id,
        locale,
        data: image1(locale),
      }),
      payload.update({
        collection: 'media',
        id: image2Doc.id,
        locale,
        data: image2(locale),
      }),
      payload.update({
        collection: 'media',
        id: image3Doc.id,
        locale,
        data: image2(locale),
      }),
      payload.update({
        collection: 'media',
        id: imageHomeDoc.id,
        locale,
        data: imageHero1(locale),
      }),
    ])

    payload.logger.info(`— Translating categories into ${locale}...`)

    await Promise.all(
      categories.map((cat, idx) =>
        payload.update({
          collection: 'categories',
          id: cat.id,
          locale,
          data: {
            title: categoryNames[idx][locale],
            slug: categoryNames[idx][locale].toLowerCase().replace(/\s+/g, '-'),
          },
        }),
      ),
    )

    payload.logger.info(`— Translating posts into ${locale}...`)

    // Sequential: parallel updates deadlock, the posts reference each other.
    await payload.update({
      collection: 'posts',
      context: { disableRevalidate: true },
      id: post1Doc.id,
      locale,
      data: preserveIds(
        post1Doc,
        post1({
          heroImage: image1Doc,
          blockImage: image2Doc,
          author: demoAuthor,
          locale,
        }),
      ),
    })
    await payload.update({
      collection: 'posts',
      context: { disableRevalidate: true },
      id: post2Doc.id,
      locale,
      data: preserveIds(
        post2Doc,
        post2({
          heroImage: image2Doc,
          blockImage: image3Doc,
          author: demoAuthor,
          locale,
        }),
      ),
    })
    await payload.update({
      collection: 'posts',
      context: { disableRevalidate: true },
      id: post3Doc.id,
      locale,
      data: preserveIds(
        post3Doc,
        post3({
          heroImage: image3Doc,
          blockImage: image1Doc,
          author: demoAuthor,
          locale,
        }),
      ),
    })

    payload.logger.info(`— Translating contact form into ${locale}...`)

    // `fields` is a `blocks` array (each field is its own row with an
    // auto-generated `id`) - `preserveIds` reuses the `fr` row ids so this
    // `update` translates the existing rows' localized `label` instead of
    // replacing them with brand-new, `fr`-less rows. See `preserve-ids.ts`.
    await payload.update({
      collection: 'forms',
      id: contactForm.id,
      locale,
      data: preserveIds(contactForm, contactFormTranslation(locale)),
    })

    payload.logger.info(`— Translating pages into ${locale}...`)

    // Same reasoning for `hero.links` and `layout` (and `layout[].columns`
    // for the Content block) - all `array`/`blocks` fields.
    await Promise.all([
      payload.update({
        collection: 'pages',
        id: homePage.id,
        locale,
        data: preserveIds(
          homePage,
          home({ heroImage: imageHomeDoc, images: homeImages, locale, metaImage: image2Doc }),
        ),
      }),
      payload.update({
        collection: 'pages',
        id: contactPage.id,
        locale,
        data: preserveIds(contactPage, contactPageData({ contactForm, locale })),
      }),
    ])

    payload.logger.info(`— Translating globals into ${locale}...`)

    // Same reasoning for `navItems`.
    await Promise.all([
      payload.updateGlobal({
        slug: 'header',
        locale,
        data: preserveIds(headerDoc, {
          navItems: headerNavItems[locale](contactPage.id),
        }),
      }),
      payload.updateGlobal({
        slug: 'footer',
        locale,
        data: preserveIds(footerDoc, {
          navItems: footerNavItems[locale](contactPage.id),
        }),
      }),
      payload.updateGlobal({
        slug: 'site-settings',
        locale,
        data: siteSettingsCopy[locale],
      }),
    ])
  }

  payload.logger.info(`— Enabling blog feature flag...`)

  await payload.updateGlobal({
    slug: 'feature-flags',
    data: {
      blog: true,
    },
    context: {
      disableRevalidate: true,
    },
  })

  payload.logger.info('Seeded database successfully!')
}

// Seed media ships alongside this module as local .webp files, so seeding
// never depends on network access to a third party.
async function readLocalFile(filename: string): Promise<File> {
  const dirname = path.dirname(fileURLToPath(import.meta.url))
  const filePath = path.join(dirname, filename)
  const data = await fs.readFile(filePath)

  return {
    name: filename,
    data,
    mimetype: `image/${filename.split('.').pop()}`,
    size: data.byteLength,
  }
}
