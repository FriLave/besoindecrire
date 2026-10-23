import React from 'react'
import Link from 'next/link'
import { MenuIcon, SearchIcon, XIcon } from 'lucide-react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { getUI } from '@/i18n/ui'
import { isFeatureEnabled } from '@/utilities/features'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'

// Server Component (rendered as children of the client header) so it can read
// the runtime blog flag. The mobile menu is a native <details>: no client JS.
export const HeaderNav = async ({ data, locale }: { data: HeaderType; locale: Locale }) => {
  const blogEnabled = await isFeatureEnabled('blog')
  const navItems = (data?.navItems || []).filter(
    ({ link }) => blogEnabled || link?.reference?.relationTo !== 'posts',
  )
  const cta = data?.enableCta && data.cta ? data.cta : null
  const ui = getUI(locale)

  const links = navItems.map(({ link }, i) => (
    <CMSLink
      className="text-muted-foreground hover:text-foreground hover:no-underline"
      key={i}
      {...link}
      appearance="link"
      locale={locale}
    />
  ))

  return (
    <>
      <nav className="hidden items-center gap-6 lg:flex">
        {links}
        {blogEnabled && (
          <Link
            className="text-muted-foreground hover:text-foreground"
            href={getLocalizedPath(locale, 'search')}
          >
            <span className="sr-only">{ui.search.title}</span>
            <SearchIcon aria-hidden className="w-4" />
          </Link>
        )}
        {cta && <CMSLink {...cta} appearance="default" locale={locale} size="sm" />}
      </nav>

      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-[0.9375rem] font-medium [&::-webkit-details-marker]:hidden">
          <MenuIcon aria-hidden className="size-5 group-open:hidden" />
          <XIcon aria-hidden className="hidden size-5 group-open:block" />
          {ui.nav.menu}
        </summary>
        <nav className="absolute inset-x-0 top-full flex flex-col items-start gap-5 border-b border-border bg-background px-6 py-8">
          {links}
          {cta && <CMSLink {...cta} appearance="default" locale={locale} size="lg" />}
        </nav>
      </details>
    </>
  )
}
