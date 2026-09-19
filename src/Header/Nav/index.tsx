'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType; locale: Locale }> = ({ data, locale }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" locale={locale} />
      })}
    </nav>
  )
}
