import React from 'react'

import { AlternateLocaleProvider } from './AlternateLocale'
import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <AlternateLocaleProvider>{children}</AlternateLocaleProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
