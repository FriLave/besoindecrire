import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import type { Block, Field, Plugin } from 'payload'
import { editorOrAbove } from '@/access/roles'
import { whenBlog } from '@/access/blogEnabled'
import { modules } from '@/client/modules'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { revalidateRedirects, revalidateRedirectsAfterDelete } from '@/hooks/revalidateRedirects'
import { validateFormSubmission } from '@/hooks/validateFormSubmission'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { buildStoragePlugins } from '@/storage'
import { privacyNoticeDefaults } from '@/i18n/legal'
import type { Page, Post } from '@/payload-types'
import { groups } from '@/utilities/adminGroups'
import { getServerSideURL } from '@/utilities/getURL'
import { defaultLocale, getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'

// Bare title: generateMeta appends the site name once.
const generateTitle: GenerateTitle<Page | Post> = ({ doc }) => doc?.title ?? ''

const generateURL: GenerateURL<Page | Post> = ({ collectionConfig, doc, locale }) => {
  const url = getServerSideURL()
  const collection = collectionConfig?.slug === 'posts' ? 'posts' : 'pages'

  return `${url}${getLocalizedPath((locale as Locale) || defaultLocale, doc?.slug, collection)}`
}

/**
 * Form-builder generates each form field's own config (text, textarea,
 * select, radio, etc.) as blocks nested inside the `fields` blocks field.
 * Their `label` and `placeholder` text fields (and, inside a nested
 * `options` array, each option's `label`) are recursively localized here so
 * the labels shown to end users on the public form can be translated
 * per-locale, independently of the submitted data (never localized).
 */
const localizeFormFieldLabels = (fields: Field[]): Field[] =>
  fields.map((field) => {
    if ('name' in field && field.type === 'text' && ['label', 'placeholder'].includes(field.name)) {
      return { ...field, localized: true }
    }

    if ('fields' in field && Array.isArray(field.fields)) {
      return { ...field, fields: localizeFormFieldLabels(field.fields) }
    }

    if ('blocks' in field && Array.isArray(field.blocks)) {
      return {
        ...field,
        blocks: field.blocks.map((block: Block) => ({
          ...block,
          fields: localizeFormFieldLabels(block.fields),
        })),
      }
    }

    return field
  })

export const plugins: Plugin[] = [
  ...buildStoragePlugins(process.env, { payments: modules.payments }),
  redirectsPlugin({
    collections: modules.blog ? ['pages', 'posts'] : ['pages'],
    overrides: {
      access: { create: editorOrAbove, delete: editorOrAbove, update: editorOrAbove },
      admin: { group: groups.administration },
      labels: {
        singular: { en: 'Redirect', fr: 'Redirection' },
        plural: { en: 'Redirects', fr: 'Redirections' },
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: {
                  en: 'You will need to rebuild the website when changing this field.',
                  fr: 'Il faudra reconstruire le site après modification de ce champ.',
                },
              },
              // Paths differ per locale (e.g. /a-propos vs /about)
              localized: true,
            }
          }
          if ('name' in field && field.name === 'to' && 'fields' in field) {
            return {
              ...field,
              fields: field.fields.map((toField) => {
                if ('name' in toField && toField.name === 'url') {
                  // Custom redirect URLs differ per locale
                  return { ...toField, localized: true }
                }
                return toField
              }),
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
        afterDelete: [revalidateRedirectsAfterDelete],
      },
    },
  }),
  ...(modules.blog
    ? [
        nestedDocsPlugin({
          collections: ['categories'],
          generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
        }),
      ]
    : []),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      // create stays public (anonymous submissions, guarded by validateFormSubmission); update stays false
      access: { delete: editorOrAbove },
      hooks: { beforeValidate: [validateFormSubmission] },
      admin: { group: groups.forms },
      labels: {
        singular: { en: 'Form submission', fr: 'Réponse de formulaire' },
        plural: { en: 'Form submissions', fr: 'Réponses de formulaires' },
      },
    },
    formOverrides: {
      access: { create: editorOrAbove, delete: editorOrAbove, update: editorOrAbove },
      admin: { group: groups.forms },
      labels: {
        singular: { en: 'Form', fr: 'Formulaire' },
        plural: { en: 'Forms', fr: 'Formulaires' },
      },
      fields: ({ defaultFields }) => {
        const privacyNotice: Field = {
          name: 'privacyNotice',
          type: 'textarea',
          localized: true,
          label: { en: 'Privacy notice', fr: 'Mention RGPD' },
          defaultValue: ({ locale }: { locale?: string }) =>
            privacyNoticeDefaults[locale === 'en' ? 'en' : 'fr'],
          admin: {
            description: {
              en: 'Small text shown under the submit button, with a link to the privacy policy. Keep it consistent with the retention period (3 years).',
              fr: "Petit texte affiché sous le bouton d'envoi, avec un lien vers la politique de confidentialité. À garder cohérent avec la durée de conservation (3 ans).",
            },
          },
        }
        return [...defaultFields, privacyNotice].map((field) => {
          if ('name' in field && field.name === 'title') {
            return { ...field, localized: true }
          }
          if ('name' in field && field.name === 'submitButtonLabel') {
            return { ...field, localized: true }
          }
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  ]
                },
              }),
              localized: true,
            }
          }
          if ('name' in field && field.name === 'fields' && 'blocks' in field) {
            return {
              ...field,
              blocks: field.blocks.map((block) => ({
                ...block,
                fields: localizeFormFieldLabels(block.fields),
              })),
            }
          }
          return field
        })
      },
    },
  }),
  ...(modules.blog
    ? [
        searchPlugin({
          collections: ['posts'],
          beforeSync: beforeSyncWithSearch,
          searchOverrides: {
            access: { read: whenBlog(() => true) },
            admin: { group: groups.administration },
            labels: {
              singular: { en: 'Search result', fr: 'Résultat de recherche' },
              plural: { en: 'Search results', fr: 'Résultats de recherche' },
            },
            fields: ({ defaultFields }) => [...defaultFields, ...searchFields],
          },
        }),
      ]
    : []),
]
