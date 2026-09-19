import type { GlobalConfig } from 'payload'

import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'General site identity settings (name, description) shown across the public site.',
  },
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
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
