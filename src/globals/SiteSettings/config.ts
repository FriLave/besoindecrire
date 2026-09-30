import type { GlobalConfig } from 'payload'

import { adminOrAbove } from '@/access/roles'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

const mediaField = (
  name: string,
  label: { en: string; fr: string },
  description: { en: string; fr: string },
  mimeTypes?: string[],
) => ({
  name,
  type: 'upload' as const,
  relationTo: 'media' as const,
  label,
  admin: { description },
  ...(mimeTypes ? { filterOptions: { mimeType: { in: mimeTypes } } } : {}),
})

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: adminOrAbove,
  },
  admin: {
    description: {
      en: 'General site identity settings (name, description, logo, SEO, social networks) shown across the public site.',
      fr: "Réglages d'identité du site (nom, description, logo, SEO, réseaux sociaux) utilisés sur tout le site public.",
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'General', fr: 'Général' },
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              localized: true,
            },
            mediaField(
              'logo',
              { en: 'Logo', fr: 'Logo' },
              {
                en: 'Shown in the header and footer. If empty, the site name is displayed as text.',
                fr: "Affiché dans l'en-tête et le pied de page. Si vide, le nom du site est affiché en texte.",
              },
            ),
            mediaField(
              'favicon',
              { en: 'Favicon', fr: 'Favicon' },
              {
                en: 'Small icon shown in browser tabs (PNG or SVG, square).',
                fr: "Petite icône affichée dans les onglets du navigateur (PNG ou SVG, carrée).",
              },
              ['image/png', 'image/svg+xml'],
            ),
          ],
        },
        {
          label: { en: 'SEO', fr: 'SEO' },
          fields: [
            {
              name: 'siteUrl',
              type: 'text',
              label: { en: 'Canonical site URL', fr: 'URL canonique du site' },
              admin: {
                description: {
                  en: 'Public domain of the site, e.g. https://www.example.com (no trailing slash). Used for canonical URLs, sitemap and social previews. Falls back to the NEXT_PUBLIC_SERVER_URL environment variable when empty.',
                  fr: "Domaine public du site, ex. https://www.example.com (sans slash final). Utilisé pour les URLs canoniques, le sitemap et les aperçus de partage. Si vide, la variable d'environnement NEXT_PUBLIC_SERVER_URL est utilisée.",
                },
              },
              validate: (value: string | null | undefined) => {
                if (!value) return true
                try {
                  const url = new URL(value)
                  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
                    return 'The URL must start with https:// / L’URL doit commencer par https://'
                  }
                } catch {
                  return 'Invalid URL / URL invalide'
                }
                return value.endsWith('/') || new URL(value).pathname !== '/'
                  ? 'No trailing slash or path / Sans slash final ni chemin'
                  : true
              },
            },
            mediaField(
              'defaultOgImage',
              { en: 'Default share image', fr: 'Image de partage par défaut' },
              {
                en: 'Used on social networks when a page has no image of its own (recommended 1200×630).',
                fr: "Utilisée sur les réseaux sociaux quand une page n'a pas d'image propre (1200×630 recommandé).",
              },
            ),
            {
              name: 'noIndex',
              type: 'checkbox',
              defaultValue: false,
              label: { en: 'Block search engines (staging)', fr: 'Bloquer les moteurs de recherche (préprod)' },
              admin: {
                description: {
                  en: 'Tick on staging/preproduction sites: robots.txt then forbids crawling and pages are marked noindex. Untick before going live.',
                  fr: "À cocher sur un site de préproduction : le robots.txt interdit alors l'exploration et les pages sont marquées noindex. À décocher avant la mise en ligne.",
                },
              },
            },
          ],
        },
        {
          label: { en: 'Social networks', fr: 'Réseaux' },
          fields: [
            {
              name: 'socials',
              type: 'array',
              label: { en: 'Social networks', fr: 'Réseaux sociaux' },
              admin: {
                description: {
                  en: 'Official profiles, declared to search engines.',
                  fr: 'Profils officiels, déclarés aux moteurs de recherche.',
                },
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  label: { en: 'Platform', fr: 'Plateforme' },
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'X', value: 'x' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: { en: 'Profile URL', fr: 'URL du profil' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
