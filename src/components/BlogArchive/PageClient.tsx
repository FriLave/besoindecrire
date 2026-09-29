'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useAlternateLocale, type AlternateLocaleLink } from '@/providers/AlternateLocale'
import React, { useEffect } from 'react'

type Props = {
  alternateLink?: AlternateLocaleLink | null
  /** Header theme forced while the page is shown ('dark' when an image sits behind the header). */
  headerTheme: 'light' | 'dark'
}

const PageClient: React.FC<Props> = ({ alternateLink = null, headerTheme }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const { setAlternateLink } = useAlternateLocale()

  useEffect(() => {
    setHeaderTheme(headerTheme)
  }, [setHeaderTheme, headerTheme])

  useEffect(() => {
    setAlternateLink(alternateLink)

    return () => setAlternateLink(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alternateLink?.locale, alternateLink?.slug, alternateLink?.collection, setAlternateLink])

  return <React.Fragment />
}

export default PageClient
