'use client'

import React, { createContext, useCallback, use, useEffect, useSyncExternalStore } from 'react'

import type { Theme, ThemeContextType } from './types'

import {
  defaultTheme,
  getImplicitPreference,
  notifyThemeChange,
  subscribeTheme,
  themeLocalStorageKey,
} from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

const getSnapshot = () => document.documentElement.getAttribute('data-theme') as Theme | null
const getServerSnapshot = () => undefined

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // The `data-theme` attribute on <html> is the source of truth (also set by /theme-init.js).
  const theme = useSyncExternalStore(subscribeTheme, getSnapshot, getServerSnapshot) || undefined

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      const implicitPreference = getImplicitPreference()
      document.documentElement.setAttribute('data-theme', implicitPreference || '')
    } else {
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    }
    notifyThemeChange()
  }, [])

  useEffect(() => {
    let themeToSet: Theme = defaultTheme
    const preference = window.localStorage.getItem(themeLocalStorageKey)

    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      const implicitPreference = getImplicitPreference()

      if (implicitPreference) {
        themeToSet = implicitPreference
      }
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
    notifyThemeChange()
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
