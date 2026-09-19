'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useAlternateLocale, type AlternateLocaleLink } from '@/providers/AlternateLocale'
import React, { useEffect } from 'react'

type Props = {
  alternateLink?: AlternateLocaleLink | null
}

const PageClient: React.FC<Props> = ({ alternateLink = null }) => {
  /* Force the header to be dark mode while we have an image behind it */
  const { setHeaderTheme } = useHeaderTheme()
  const { setAlternateLink } = useAlternateLocale()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  useEffect(() => {
    setAlternateLink(alternateLink)

    return () => setAlternateLink(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alternateLink?.locale, alternateLink?.slug, setAlternateLink])

  return <React.Fragment />
}

export default PageClient
