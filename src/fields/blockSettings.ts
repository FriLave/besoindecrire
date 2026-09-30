import type { Field, Option } from 'payload'

const spacing: Option[] = [
  { label: { en: 'None', fr: 'Aucun' }, value: 'none' },
  { label: { en: 'Small', fr: 'Petit' }, value: 'sm' },
  { label: { en: 'Medium', fr: 'Moyen' }, value: 'md' },
  { label: { en: 'Large', fr: 'Grand' }, value: 'lg' },
]

/** Shared spacing/background settings, appended to every layout block. */
export const blockSettings = (): Field => ({
  type: 'collapsible',
  label: { en: 'Block settings', fr: 'Réglages du bloc' },
  admin: { initCollapsed: true },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'paddingTop',
          type: 'select',
          defaultValue: 'md',
          label: { en: 'Top spacing', fr: 'Espacement haut' },
          options: spacing,
        },
        {
          name: 'paddingBottom',
          type: 'select',
          defaultValue: 'md',
          label: { en: 'Bottom spacing', fr: 'Espacement bas' },
          options: spacing,
        },
        {
          name: 'background',
          type: 'select',
          defaultValue: 'none',
          label: { en: 'Background', fr: 'Fond' },
          options: [
            { label: { en: 'None', fr: 'Aucun' }, value: 'none' },
            { label: { en: 'Muted', fr: 'Discret' }, value: 'muted' },
            { label: { en: 'Brand color', fr: 'Couleur de marque' }, value: 'brand' },
          ],
        },
      ],
    },
  ],
})
