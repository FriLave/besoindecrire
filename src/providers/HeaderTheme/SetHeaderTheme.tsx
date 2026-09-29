'use client'
import { useEffect } from 'react'

import { useHeaderTheme } from '@/providers/HeaderTheme'

/** Tiny client island so heroes themselves can stay Server Components. */
export const SetHeaderTheme = ({ theme }: { theme: 'light' | 'dark' }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme(theme)
  }, [setHeaderTheme, theme])

  return null
}
