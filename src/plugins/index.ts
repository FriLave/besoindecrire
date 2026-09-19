import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Block, Field, Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { Page } from '@/payload-types'
import { SITE_NAME } from '@/client/site'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | ${SITE_NAME}` : SITE_NAME
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
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
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
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
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
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
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
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
]
