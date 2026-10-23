import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

import { SITE_NAME } from '@/client/site'
import { getCachedSiteSettings } from '@/utilities/getGlobals'
import type { Locale } from '@/utilities/getLocalizedPath'
import { getMediaUrl } from '@/utilities/getMediaUrl'

interface Props {
  className?: string
  locale: Locale
  priority?: boolean
}

// Server component: site-settings logo (alt from the media), else the site name as text.
export const Logo = async ({ className, locale, priority }: Props) => {
  const settings = await getCachedSiteSettings(locale)()
  const logo = typeof settings?.logo === 'object' ? settings.logo : null

  if (logo?.url && logo.width && logo.height) {
    return (
      <Image
        alt={logo.alt}
        className={clsx('h-[34px] w-auto', className)}
        height={logo.height}
        priority={priority}
        src={getMediaUrl(logo.url, logo.updatedAt)}
        unoptimized={logo.mimeType === 'image/svg+xml'}
        width={logo.width}
      />
    )
  }

  return (
    <span
      className={clsx(
        'h-[34px] flex items-center whitespace-nowrap font-serif text-2xl text-foreground',
        className,
      )}
    >
      {settings?.siteName || SITE_NAME}
    </span>
  )
}
