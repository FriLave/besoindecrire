'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'

type Props = {
  /** Header theme forced while the page is shown ('dark' when an image sits behind the header). */
  headerTheme: 'light' | 'dark'
}

const PageClient: React.FC<Props> = ({ headerTheme }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme(headerTheme)
  }, [setHeaderTheme, headerTheme])

  return <React.Fragment />
}

export default PageClient
