import React from 'react'

import { cn } from '@/utilities/ui'

/** Short label above a heading (section name). */
export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => <p className={cn('mb-3 text-sm font-semibold text-brand', className)}>{children}</p>
