import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono, GeistSans } from '@/client/fonts'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getCachedSiteSettings } from '@/utilities/getGlobals'
import { SITE_DESCRIPTION, SITE_NAME } from '@/client/site'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import '../globals.css'
import { getSiteUrl } from '@/utilities/getSiteUrl'
import { getImageURL } from '@/utilities/generateMeta'
import { defaultLocale, getLocalizedPath, isLocale, locales } from '@/utilities/getLocalizedPath'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

type Args = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: Args) {
  const { isEnabled } = await draftMode()
  const { locale: localeParam } = await params

  // The proxy only ever routes valid locales here. This guard only
  // matters for requests that somehow bypass it (e.g. a direct internal
  // fetch, or a static asset path like `/favicon.ico` that the proxy's
  // matcher deliberately excludes and that Next then falls through to this
  // single-segment dynamic route). It redirects to the default locale root
  // rather than calling `notFound()`, since this is the root layout
  // providing `<html>`/`<body>` and there is no outer layout for a
  // not-found boundary to render into - either way, no Payload query runs
  // with an unvalidated locale value.
  if (!isLocale(localeParam)) {
    redirect(getLocalizedPath(defaultLocale, 'home'))
  }

  const locale = localeParam


  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        {/* Anti-flash: globals.css hides <html> until InitTheme sets
            data-theme. If JS is disabled (or that script fails), that
            hide would be permanent. This restores visibility in that
            case without touching the anti-flash mechanism itself. */}
        <noscript>
          <style>{`html { opacity: initial; }`}</style>
        </noscript>
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
            locale={locale}
          />

          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = isLocale(localeParam) ? localeParam : defaultLocale

  const siteSettings = await getCachedSiteSettings(locale)()
  const siteName = siteSettings?.siteName || SITE_NAME
  const siteDescription = siteSettings?.siteDescription || SITE_DESCRIPTION
  const siteUrl = await getSiteUrl()
  const ogImage = getImageURL(siteSettings?.defaultOgImage, siteUrl)
  const favicon = siteSettings?.favicon
  const faviconUrl = typeof favicon === 'object' && favicon?.url ? favicon.url : '/favicon.svg'

  return {
    metadataBase: new URL(siteUrl),
    icons: { icon: [{ url: faviconUrl, ...(faviconUrl.endsWith('.svg') ? { type: 'image/svg+xml' } : {}) }] },
    openGraph: mergeOpenGraph(
      { images: ogImage ? [{ url: ogImage }] : undefined },
      { locale, siteName, siteDescription },
    ),
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description: siteDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    ...(siteSettings?.noIndex ? { robots: { index: false, follow: false } } : {}),
  }
}
