import { stripDisabledPostLinks } from '@/utilities/stripDisabledPostLinks'
import { SITE_NAME } from '@/client/site'
import { isFeatureEnabled } from '@/utilities/features'
import { getCachedGlobal, getCachedSiteSettings } from '@/utilities/getGlobals'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { LocaleSwitcher, type AlternateLocaleLink } from '@/components/LocaleSwitcher'

export async function Footer({
  alternateLink,
  locale,
}: {
  alternateLink?: AlternateLocaleLink
  locale: Locale
}) {
  const footerData = await stripDisabledPostLinks(await getCachedGlobal('footer', locale, 1)())

  const navItems = footerData?.navItems || []
  const settings = await getCachedSiteSettings(locale)()
  const siteName = settings?.siteName || SITE_NAME
  const kinds = ['legalNotice', 'privacyPolicy', 'terms', 'termsOfSale'] as const
  const payments = await isFeatureEnabled('payments')
  const legalLinks = kinds
    .filter((k) => k !== 'termsOfSale' || payments)
    .map((k) => settings?.legalPages?.[k])
    .filter((p): p is Exclude<typeof p, number | null | undefined> => typeof p === 'object' && !!p)

  return (
    <footer className="mt-auto bg-background text-foreground" data-theme="dark">
      <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_1fr] md:py-20">
        <div className="max-w-md">
          <Link className="inline-flex" href={getLocalizedPath(locale, 'home')}>
            <Logo locale={locale} />
          </Link>
          {settings?.siteDescription && (
            <p className="mt-5 font-serif text-xl leading-relaxed text-muted-foreground italic">
              {settings.siteDescription}
            </p>
          )}
        </div>

        {navItems.length > 0 && (
          <nav className="grid content-start gap-x-8 gap-y-3 sm:grid-cols-2">
            {navItems.map(({ link }, i) => {
              return (
                <CMSLink
                  className="text-sm text-muted-foreground hover:text-foreground"
                  key={i}
                  {...link}
                  locale={locale}
                />
              )
            })}
          </nav>
        )}
      </div>
      <div className="border-t border-border">
        <div className="container flex flex-col gap-6 py-8 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {new Date().getFullYear()} {siteName}
          </p>
          {legalLinks.length > 0 && (
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((p) => (
                <Link
                  className="underline-offset-4 hover:text-foreground hover:underline"
                  href={getLocalizedPath(locale, p.slug)}
                  key={p.id}
                >
                  {p.title}
                </Link>
              ))}
            </nav>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <ThemeSelector locale={locale} />
            <LocaleSwitcher alternateLink={alternateLink} locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  )
}
