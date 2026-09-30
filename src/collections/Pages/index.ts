import type { CollectionConfig } from 'payload'

import { editorOrAbove } from '../../access/roles'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { modules } from '../../client/modules'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { FAQ } from '../../blocks/FAQ/config'
import { FeatureGrid } from '../../blocks/FeatureGrid/config'
import { LegalNotice } from '../../blocks/LegalNotice/config'
import { PrivacyPolicy } from '../../blocks/PrivacyPolicy/config'
import { PaidDownloadBlock } from '../../blocks/PaidDownloadBlock/config'
import { TermsOfSale } from '../../blocks/TermsOfSale/config'
import { Gallery } from '../../blocks/Gallery/config'
import { LogoCloud } from '../../blocks/LogoCloud/config'
import { PricingTable } from '../../blocks/PricingTable/config'
import { Stats } from '../../blocks/Stats/config'
import { Testimonials } from '../../blocks/Testimonials/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { slugify } from '../../utilities/slugify'
import {
  revalidateDelete,
  revalidatePage,
  revalidatePageBeforeDelete,
} from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: editorOrAbove,
    delete: editorOrAbove,
    read: authenticatedOrPublished,
    update: editorOrAbove,
  },
  // This config controls what's populated by default when a page is referenced
  // (see Payload's `defaultPopulate` collection config docs)
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                FormBlock,
                FeatureGrid,
                Stats,
                Testimonials,
                LogoCloud,
                PricingTable,
                Gallery,
                FAQ,
                LegalNotice,
                PrivacyPolicy,
                ...(modules.blog ? [Archive] : []),
                ...(modules.payments ? [PaidDownloadBlock, TermsOfSale] : []),
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
              overrides: {
                localized: true,
              },
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({
              overrides: {
                localized: true,
              },
            }),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField({ localized: true, slugify }),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    beforeDelete: [revalidatePageBeforeDelete],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
