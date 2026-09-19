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
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import '../globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { defaultLocale, getLocalizedPath, locales, type Locale } from '@/utilities/getLocalizedPath'

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
  // fetch); it redirects to the default locale root rather than calling
  // `notFound()`, since this is the root layout providing `<html>`/`<body>`
  // and there is no outer layout for a not-found boundary to render into.
  if (!(locales as string[]).includes(localeParam)) {
    redirect(getLocalizedPath(defaultLocale, 'home'))
  }

  const locale = localeParam as Locale

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
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header locale={locale} />
          {children}
          <Footer locale={locale} />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
