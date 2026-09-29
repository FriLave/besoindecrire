'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { useAlternateLocale, type AlternateLocaleLink } from '@/providers/AlternateLocale'
import React, { useEffect } from 'react'

const PageClient: React.FC<{ alternateLink: AlternateLocaleLink }> = ({ alternateLink }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const { setAlternateLink } = useAlternateLocale()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  useEffect(() => {
    setAlternateLink(alternateLink)

    return () => setAlternateLink(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alternateLink.locale, alternateLink.slug, setAlternateLink])

  return <React.Fragment />
}

export default PageClient
