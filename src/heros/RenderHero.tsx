import React from 'react'

import type { Page } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'
import { stripDisabledPostLinks } from '@/utilities/stripDisabledPostLinks'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { SplitHero } from '@/heros/Split'

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  split: SplitHero,
}

export const RenderHero = async (rawProps: Page['hero'] & { locale: Locale }) => {
  const props = await stripDisabledPostLinks(rawProps)
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
