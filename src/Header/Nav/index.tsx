import React from 'react'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { getUI } from '@/i18n/ui'
import { isFeatureEnabled } from '@/utilities/features'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'

// Server Component (rendered as children of the client header) so it can read
// the runtime blog flag.
export const HeaderNav = async ({ data, locale }: { data: HeaderType; locale: Locale }) => {
  const blogEnabled = await isFeatureEnabled('blog')
  const navItems = (data?.navItems || []).filter(
    ({ link }) => blogEnabled || link?.reference?.relationTo !== 'posts',
  )

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" locale={locale} />
      })}
      {blogEnabled && (
        <Link href={getLocalizedPath(locale, 'search')}>
          <span className="sr-only">{getUI(locale).search.title}</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
      )}
    </nav>
  )
}
