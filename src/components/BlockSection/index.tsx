import React from 'react'

import { cn } from '@/utilities/ui'

type Spacing = 'none' | 'sm' | 'md' | 'lg' | null | undefined

// Static maps so Tailwind can see every class.
const pt = { none: 'pt-0', sm: 'pt-8', md: 'pt-16', lg: 'pt-24' }
const pb = { none: 'pb-0', sm: 'pb-8', md: 'pb-16', lg: 'pb-24' }
const bg = {
  none: '',
  muted: 'bg-muted',
  brand: 'bg-brand text-brand-foreground',
}

export const BlockSection: React.FC<{
  background?: keyof typeof bg | null
  children: React.ReactNode
  paddingBottom?: Spacing
  paddingTop?: Spacing
}> = ({ background, children, paddingBottom, paddingTop }) => (
  <section className={cn(pt[paddingTop || 'md'], pb[paddingBottom || 'md'], bg[background || 'none'])}>
    {children}
  </section>
)
