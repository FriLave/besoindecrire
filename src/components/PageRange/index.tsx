import React from 'react'

import { getUI } from '@/i18n/ui'
import type { Locale } from '@/utilities/getLocalizedPath'

export const PageRange: React.FC<{
  className?: string
  currentPage?: number
  limit?: number
  locale: Locale
  totalDocs?: number
}> = (props) => {
  const { className, currentPage, limit, locale, totalDocs } = props
  const ui = getUI(locale)

  const perPage = limit || 1
  const start = ((currentPage || 1) - 1) * perPage + 1
  const end = Math.min((currentPage || 1) * perPage, totalDocs ?? 0)

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {!totalDocs && ui.blog.noResults}
      {totalDocs !== undefined &&
        totalDocs > 0 &&
        start <= totalDocs &&
        ui.blog.range(start, end, totalDocs)}
    </div>
  )
}
