import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Locale } from '@/utilities/getLocalizedPath'
import { HeaderNav } from './Nav'
import { Logo } from '@/components/Logo/Logo'
import React from 'react'

export async function Header({ locale }: { locale: Locale }) {
  const headerData = await getCachedGlobal('header', locale, 1)()

  return (
    <HeaderClient locale={locale} logo={<Logo locale={locale} priority />}>
      <HeaderNav data={headerData} locale={locale} />
    </HeaderClient>
  )
}
