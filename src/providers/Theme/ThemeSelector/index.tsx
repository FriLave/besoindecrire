'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useSyncExternalStore } from 'react'

import type { Theme } from '../types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { useTheme } from '..'
import { subscribeTheme, themeLocalStorageKey } from '../shared'
import { getUI } from '@/i18n/ui'

const getSnapshot = () => window.localStorage.getItem(themeLocalStorageKey) ?? 'auto'
const getServerSnapshot = () => ''

export const ThemeSelector: React.FC<{ locale: Locale }> = ({ locale }) => {
  const { setTheme } = useTheme()
  const value = useSyncExternalStore(subscribeTheme, getSnapshot, getServerSnapshot)
  const ui = getUI(locale)

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    setTheme(themeToSet === 'auto' ? null : themeToSet)
  }

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label={ui.theme.selectLabel}
        className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none"
      >
        <SelectValue placeholder={ui.theme.auto} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">{ui.theme.auto}</SelectItem>
        <SelectItem value="light">{ui.theme.light}</SelectItem>
        <SelectItem value="dark">{ui.theme.dark}</SelectItem>
      </SelectContent>
    </Select>
  )
}
