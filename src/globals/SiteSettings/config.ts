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
          label: { en: 'Legal', fr: 'Légal' },
          description: {
            en: 'Templates provided for guidance only, to be validated by the client. This is not legal advice.',
            fr: 'Modèles fournis à titre indicatif, à faire valider par le client. Ne constitue pas un conseil juridique.',
          },
          fields: [
            {
              name: 'legal',
              type: 'group',
              label: { en: 'Publisher', fr: 'Éditeur du site' },
              admin: {
                description: {
                  en: 'Facts used by the "Legal notice" and "Privacy policy" blocks. Enter them once here.',
                  fr: 'Informations utilisées par les blocs « Mentions légales » et « Politique de confidentialité ». À saisir une seule fois ici.',
                },
              },
              fields: [
                {
                  name: 'publisherType',
                  type: 'select',
                  defaultValue: 'company',
                  required: true,
                  label: { en: 'Publisher type', fr: "Type d'éditeur" },
                  options: [
                    { label: { en: 'Company', fr: 'Société' }, value: 'company' },
                    { label: { en: 'Sole proprietor (EI)', fr: 'Entrepreneur individuel (EI)' }, value: 'ei' },
                  ],
                },
                {
                  name: 'companyName',
                  type: 'text',
                  label: { en: 'Company name / Full name (EI)', fr: 'Dénomination sociale / Nom et prénom (EI)' },
                },
                {
                  type: 'row',
                  admin: { condition: (_d, s) => s?.publisherType === 'company' },
                  fields: [
                    {
                      name: 'legalForm',
                      type: 'text',
                      label: { en: 'Legal form', fr: 'Forme juridique' },
                      admin: { description: { en: 'e.g. SAS, SARL', fr: 'ex. SAS, SARL' } },
                    },
                    {
                      name: 'shareCapital',
                      type: 'text',
                      label: { en: 'Share capital', fr: 'Capital social' },
                      admin: { description: { en: 'e.g. 10 000 €', fr: 'ex. 10 000 €' } },
                    },
                  ],
                },
                {
                  name: 'address',
                  type: 'textarea',
                  label: { en: 'Registered office / Address', fr: 'Siège social / Adresse' },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'phone', type: 'text', label: { en: 'Phone', fr: 'Téléphone' } },
                    { name: 'email', type: 'email', label: { en: 'Email', fr: 'Email' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'siren', type: 'text', label: { en: 'SIREN', fr: 'SIREN' } },
                    {
                      name: 'registry',
                      type: 'text',
                      label: { en: 'Registry (RCS / RNE) and city', fr: 'Registre (RCS / RNE) et ville' },
                      admin: { description: { en: 'e.g. RCS Paris', fr: 'ex. RCS Paris' } },
                    },
                  ],
                },
                {
                  name: 'vatExempt',
                  type: 'checkbox',
                  defaultValue: false,
                  label: { en: 'VAT not applicable', fr: 'TVA non applicable' },
                  admin: {
                    description: {
                      en: 'Displays "TVA non applicable, art. 293 B du CGI" (micro-enterprise franchise).',
                      fr: 'Affiche « TVA non applicable, art. 293 B du CGI » (franchise en base).',
                    },
                  },
                },
                {
                  name: 'vatNumber',
                  type: 'text',
                  label: { en: 'Intra-EU VAT number', fr: 'N° de TVA intracommunautaire' },
                  admin: { condition: (_d, s) => !s?.vatExempt },
                },
                {
                  name: 'publicationDirector',
                  type: 'text',
                  label: { en: 'Publication director', fr: 'Directeur de la publication' },
                },
              ],
            },
            {
              name: 'host',
              type: 'group',
              label: { en: 'Hosting provider', fr: 'Hébergeur' },
              fields: [
                { name: 'name', type: 'text', label: { en: 'Name / company name', fr: 'Nom / raison sociale' } },
                { name: 'address', type: 'textarea', label: { en: 'Address', fr: 'Adresse' } },
                { name: 'phone', type: 'text', label: { en: 'Phone', fr: 'Téléphone' } },
              ],
            },
            {
              type: 'collapsible',
              label: { en: 'Regulated profession (optional)', fr: 'Profession réglementée (optionnel)' },
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'regulatedProfession',
                  type: 'group',
                  label: false,
                  fields: [
                    {
                      name: 'enabled',
                      type: 'checkbox',
                      defaultValue: false,
                      label: { en: 'Regulated profession', fr: 'Profession réglementée' },
                    },
                    {
                      type: 'row',
                      admin: { condition: (_d, s) => Boolean(s?.regulatedProfession?.enabled) },
                      fields: [
                        { name: 'body', type: 'text', label: { en: 'Professional body', fr: 'Ordre / organisme' } },
                        { name: 'title', type: 'text', label: { en: 'Professional title', fr: 'Titre professionnel' } },
                        { name: 'country', type: 'text', label: { en: 'Country that granted the title', fr: "État d'octroi du titre" } },
                      ],
                    },
                    {
                      name: 'rulesUrl',
                      type: 'text',
                      label: { en: 'Professional rules (link)', fr: 'Règles professionnelles (lien)' },
                      admin: { condition: (_d, s) => Boolean(s?.regulatedProfession?.enabled) },
                    },
                    {
                      name: 'insurer',
                      type: 'text',
                      label: { en: 'Professional liability insurance', fr: 'Assurance responsabilité civile professionnelle' },
                      admin: {
                        condition: (_d, s) => Boolean(s?.regulatedProfession?.enabled),
                        description: { en: 'Insurer name, address and coverage area.', fr: "Nom, adresse de l'assureur et couverture géographique." },
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'dpo',
              type: 'group',
              label: { en: 'Data protection officer (optional)', fr: 'Délégué à la protection des données (optionnel)' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', label: { en: 'Name', fr: 'Nom' } },
                    { name: 'email', type: 'email', label: { en: 'Email', fr: 'Email' } },
                  ],
                },
              ],
            },
            {
              name: 'legalPages',
              type: 'group',
              label: { en: 'Legal pages', fr: 'Pages légales' },
              admin: {
                description: {
                  en: 'Linked automatically in the footer and in the contact form notice.',
                  fr: 'Liées automatiquement dans le pied de page et dans la mention du formulaire de contact.',
                },
              },
              fields: [
                { name: 'legalNotice', type: 'relationship', relationTo: 'pages', label: { en: 'Legal notice', fr: 'Mentions légales' } },
                { name: 'privacyPolicy', type: 'relationship', relationTo: 'pages', label: { en: 'Privacy policy', fr: 'Politique de confidentialité' } },
                { name: 'terms', type: 'relationship', relationTo: 'pages', label: { en: 'Terms of use', fr: "Conditions d'utilisation (CGU)" } },
              ],
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
