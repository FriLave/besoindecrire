'use client'

import type { Locale } from '@/utilities/getLocalizedPath'

import React, { createContext, useCallback, use, useState } from 'react'

export interface AlternateLocaleLink {
  locale: Locale
  slug: string
}

export interface ContextType {
  alternateLink?: AlternateLocaleLink | null
  setAlternateLink: (link: AlternateLocaleLink | null) => void
}

const initialContext: ContextType = {
  alternateLink: undefined,
  setAlternateLink: () => null,
}

const AlternateLocaleContext = createContext(initialContext)

/**
 * Lets the current page (via `PageClient`) tell the Footer's locale
 * switcher which document/slug is the equivalent of the page being viewed
 * in the *other* locale, so the switcher can link to that exact page
 * instead of always falling back to the other locale's homepage.
 *
 * Mirrors the `HeaderTheme` provider pattern used elsewhere in this app:
 * the page (a client component) sets state that a sibling in the shared
 * root layout (the Footer) reads back out.
 */
export const AlternateLocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [alternateLink, setLinkState] = useState<AlternateLocaleLink | null | undefined>(undefined)

  const setAlternateLink = useCallback((link: AlternateLocaleLink | null) => {
    setLinkState(link)
  }, [])

  return (
    <AlternateLocaleContext value={{ alternateLink, setAlternateLink }}>
      {children}
    </AlternateLocaleContext>
  )
}

export const useAlternateLocale = (): ContextType => use(AlternateLocaleContext)
