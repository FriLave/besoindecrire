import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { getUI } from '@/i18n/ui'
import { defaultLocale, getLocalizedPath, locales, type Locale } from '@/utilities/getLocalizedPath'

type Args = {
  params: Promise<{ locale?: string }>
}

/**
 * KNOWN LIMITATION (verified empirically, not guessed - see final report):
 * for a slug that isn't part of `generateStaticParams` (i.e. a genuine
 * unknown-URL 404), Next 16.3.3 does NOT deliver the `[locale]` route
 * param to this file when the boundary is reached via a nested
 * `notFound()` call - `params` resolves to `undefined`, so this falls
 * back to `defaultLocale` and renders French copy even under `/en/*`.
 *
 * The alternative (reading `headers()`/`x-locale` here) is reliable, but
 * because `not-found.tsx` shares its parent `[locale]` segment's render
 * tree, using ANY dynamic API here forces the whole `[locale]` tree
 * (including the normal, successfully-matched pages) out of static
 * generation - verified with `pnpm build`: `● /fr`, `● /en`, etc. became
 * `ƒ /[locale]`. That regresses the non-negotiable SSG/ISR requirement
 * for every page to fix text on a 404. Kept the SSG-preserving, degraded
 * fallback here; flagged for a decision rather than silently regressed
 * either requirement.
 */
export default async function NotFound({ params }: Args) {
  const resolved = await params
  const locale = ((locales as string[]).includes(resolved?.locale ?? '')
    ? resolved?.locale
    : defaultLocale) as Locale

  const { cta, description, title } = getUI(locale).notFound

  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>{title}</h1>
        <p className="mb-4">{description}</p>
      </div>
      <Button asChild variant="default">
        <Link href={getLocalizedPath(locale, 'home')}>{cta}</Link>
      </Button>
    </div>
  )
}
