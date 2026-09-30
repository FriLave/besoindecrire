import { stripDisabledPostLinks } from '@/utilities/stripDisabledPostLinks'
import { SITE_NAME } from '@/client/site'
import { getCachedGlobal, getCachedSiteSettings } from '@/utilities/getGlobals'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'
import Link from 'next/link'
import React from 'react'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

export async function Footer({ locale }: { locale: Locale }) {
  const footerData = await stripDisabledPostLinks(await getCachedGlobal('footer', locale, 1)())

  const navItems = footerData?.navItems || []
  const settings = await getCachedSiteSettings(locale)()
  const siteName = settings?.siteName || SITE_NAME
  const legalLinks = (['legalNotice', 'privacyPolicy', 'terms'] as const)
    .map((k) => settings?.legalPages?.[k])
    .filter((p): p is Exclude<typeof p, number | null | undefined> => typeof p === 'object' && !!p)

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <Link className="flex items-center" href={getLocalizedPath(locale, 'home')}>
          <Logo locale={locale} />
        </Link>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <ThemeSelector locale={locale} />
          <LocaleSwitcher locale={locale} />
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} locale={locale} />
            })}
          </nav>
        </div>
      </div>
      <div className="container flex flex-col gap-2 pb-8 text-sm md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} {siteName}
        </p>
        {legalLinks.length > 0 && (
          <nav className="flex flex-col gap-2 md:flex-row md:gap-4">
            {legalLinks.map((p) => (
              <Link className="underline-offset-4 hover:underline" href={getLocalizedPath(locale, p.slug)} key={p.id}>
                {p.title}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </footer>
  )
}
