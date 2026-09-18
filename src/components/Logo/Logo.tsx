import clsx from 'clsx'
import React from 'react'

import { SITE_NAME } from '@/client/site'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

// Neutral text wordmark placeholder. No external network request.
// The theme pass owns real visual design for this component.
export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span
      className={clsx(
        'max-w-[9.375rem] w-full h-[34px] flex items-center font-semibold text-xl tracking-tight',
        className,
      )}
    >
      {SITE_NAME}
    </span>
  )
}
