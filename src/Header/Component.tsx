import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Locale } from '@/utilities/getLocalizedPath'
import { HeaderNav } from './Nav'
import React from 'react'

export async function Header({ locale }: { locale: Locale }) {
  const headerData = await getCachedGlobal('header', locale, 1)()

  return <HeaderClient locale={locale}>
      <HeaderNav data={headerData} locale={locale} />
    </HeaderClient>
}
