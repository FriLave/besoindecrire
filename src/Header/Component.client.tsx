'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Locale } from '@/utilities/getLocalizedPath'

import { getLocalizedPath } from '@/utilities/getLocalizedPath'

interface HeaderClientProps {
  children: React.ReactNode
  /** Server-rendered `<Logo />`. */
  logo: React.ReactNode
  locale: Locale
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ children, locale, logo }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header className="container relative z-20   " {...(theme ? { 'data-theme': theme } : {})}>
      <div className="py-8 flex justify-between">
        <Link href={getLocalizedPath(locale, 'home')}>
          {logo}
        </Link>
        {children}
      </div>
    </header>
  )
}
