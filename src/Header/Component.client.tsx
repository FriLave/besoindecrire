'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useSyncExternalStore } from 'react'

import type { Locale } from '@/utilities/getLocalizedPath'

import { getLocalizedPath } from '@/utilities/getLocalizedPath'

interface HeaderClientProps {
  children: React.ReactNode
  /** Server-rendered `<Logo />`. */
  logo: React.ReactNode
  locale: Locale
}

const noopSubscribe = () => () => {}

export const HeaderClient: React.FC<HeaderClientProps> = ({ children, locale, logo }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Only adopt headerTheme after hydration (it is read from the DOM on the client).
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
  if (hydrated && headerTheme && headerTheme !== theme) setTheme(headerTheme)

  return (
    <header
      className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container relative flex h-18 items-center justify-between gap-6">
        <Link href={getLocalizedPath(locale, 'home')}>{logo}</Link>
        {/* Keyed on the path: remounting closes the mobile menu after a navigation. */}
        <div className="contents" key={pathname}>
          {children}
        </div>
      </div>
    </header>
  )
}
