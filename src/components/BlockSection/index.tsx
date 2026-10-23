import React from 'react'

import { cn } from '@/utilities/ui'

type Spacing = 'none' | 'sm' | 'md' | 'lg' | null | undefined

// Static maps so Tailwind can see every class.
const pt = { none: 'pt-0', sm: 'pt-10', md: 'pt-16 md:pt-24', lg: 'pt-24 md:pt-32' }
const pb = { none: 'pb-0', sm: 'pb-10', md: 'pb-16 md:pb-24', lg: 'pb-24 md:pb-32' }
const bg = {
  none: '',
  muted: 'bg-muted',
  brand: 'bg-brand text-brand-foreground',
  // Inverted surface: the dark theme scoped to the section, so every token (text, muted, borders) follows.
  inverted: 'bg-background text-foreground',
}

export const BlockSection: React.FC<{
  background?: keyof typeof bg | null
  children: React.ReactNode
  paddingBottom?: Spacing
  paddingTop?: Spacing
}> = ({ background, children, paddingBottom, paddingTop }) => (
  <section
    className={cn(pt[paddingTop || 'md'], pb[paddingBottom || 'md'], bg[background || 'none'])}
    {...(background === 'inverted' ? { 'data-theme': 'dark' } : {})}
  >
    {children}
  </section>
)
