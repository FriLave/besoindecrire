import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import React from 'react'

import { modules } from '@/client/modules'
import { BlogArchive } from '@/components/BlogArchive'
import { getUI } from '@/i18n/ui'
import { generateMeta } from '@/utilities/generateMeta'
import { isFeatureEnabled } from '@/utilities/features'
import { isLocale, locales } from '@/utilities/getLocalizedPath'

export const revalidate = 600

type Args = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return modules.blog ? locales.map((locale) => ({ locale })) : []
}

export default async function Page({ params }: Args) {
  const { locale } = await params
  if (!isLocale(locale) || !(await isFeatureEnabled('blog'))) notFound()

  return <BlogArchive locale={locale} page={1} />
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale) || !(await isFeatureEnabled('blog'))) return {}

  return generateMeta({
    doc: { meta: { title: getUI(locale).blog.title } },
    locale,
    slug: '',
    collection: 'posts',
  })
}
