'use client'

import type { PayloadAdminBarProps, PayloadMeUser } from '@payloadcms/admin-bar'

import { cn } from '@/utilities/ui'
import { useSelectedLayoutSegments } from 'next/navigation'
import { PayloadAdminBar } from '@payloadcms/admin-bar'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import './index.scss'

import { getClientSideURL } from '@/utilities/getURL'
import { getUI } from '@/i18n/ui'
import { defaultLocale, type Locale } from '@/utilities/getLocalizedPath'

const baseClass = 'admin-bar'

export const AdminBar: React.FC<{
  adminBarProps?: PayloadAdminBarProps
  locale?: Locale
}> = (props) => {
  const { adminBarProps, locale = defaultLocale } = props || {}
  const ui = getUI(locale)
  const collectionLabels = {
    pages: {
      plural: ui.adminBar.pagesPlural,
      singular: ui.adminBar.pagesSingular,
    },
    posts: {
      plural: ui.adminBar.postsPlural,
      singular: ui.adminBar.postsSingular,
    },
    categories: {
      plural: ui.adminBar.categoriesPlural,
      singular: ui.adminBar.categoriesSingular,
    },
  }
  const segments = useSelectedLayoutSegments()
  const [show, setShow] = useState(false)
  // The public URL segment for posts is `/blog`, not the collection slug.
  const segment = segments?.[1] === 'blog' ? 'posts' : segments?.[1]
  const collection = (
    collectionLabels[segment as keyof typeof collectionLabels] ? segment : 'pages'
  ) as keyof typeof collectionLabels
  const router = useRouter()

  const onAuthChange = React.useCallback((user: PayloadMeUser) => {
    setShow(Boolean(user?.id))
  }, [])

  return (
    <div
      className={cn(baseClass, 'py-2 bg-black text-white', {
        block: show,
        hidden: !show,
      })}
    >
      <div className="container">
        <PayloadAdminBar
          {...adminBarProps}
          className="py-2 text-white"
          classNames={{
            controls: 'font-medium text-white',
            logo: 'text-white',
            user: 'text-white',
          }}
          cmsURL={getClientSideURL()}
          collectionSlug={collection}
          collectionLabels={{
            plural: collectionLabels[collection]?.plural || ui.adminBar.pagesPlural,
            singular: collectionLabels[collection]?.singular || ui.adminBar.pagesSingular,
          }}
          logo={<span>{ui.adminBar.dashboard}</span>}
          onAuthChange={onAuthChange}
          onPreviewExit={() => {
            void fetch('/next/exit-preview').then(() => {
              router.push('/')
              router.refresh()
            })
          }}
          style={{
            backgroundColor: 'transparent',
            padding: 0,
            position: 'relative',
            zIndex: 'unset',
          }}
        />
      </div>
    </div>
  )
}
