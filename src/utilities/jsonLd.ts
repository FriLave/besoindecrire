import type { Media, Post, SiteSetting } from '@/payload-types'

import { getLocalizedPath, type Locale } from './getLocalizedPath'

type JsonLdObject = Record<string, unknown>

const ctx = 'https://schema.org'

const mediaUrl = (media: unknown, siteUrl: string): string | undefined => {
  if (!media || typeof media !== 'object') return undefined
  const m = media as Media
  const url = m.sizes?.og?.url || m.url
  return url ? siteUrl + url : undefined
}

export const organization = (settings: SiteSetting | null, siteName: string, siteUrl: string): JsonLdObject => ({
  '@context': ctx,
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: mediaUrl(settings?.logo, siteUrl),
  sameAs: settings?.socials?.map((s) => s.url).filter(Boolean),
})

export const website = (
  siteName: string,
  siteUrl: string,
  locale: Locale,
  { search }: { search: boolean },
): JsonLdObject => ({
  '@context': ctx,
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  inLanguage: locale,
  ...(search
    ? {
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}${getLocalizedPath(locale, 'search')}?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }
    : {}),
})

/** `items` in order, each with an absolute URL. */
export const breadcrumbs = (items: { name: string; url: string }[]): JsonLdObject => ({
  '@context': ctx,
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
})

export const article = (
  post: Post,
  url: string,
  locale: Locale,
  siteName: string,
  siteUrl: string,
  logoUrl?: string,
): JsonLdObject => ({
  '@context': ctx,
  '@type': 'Article',
  headline: post.meta?.title || post.title,
  description: post.meta?.description || undefined,
  datePublished: post.publishedAt || post.createdAt,
  dateModified: post.updatedAt,
  inLanguage: locale,
  mainEntityOfPage: url,
  author: post.populatedAuthors?.filter((a) => a.name).map((a) => ({ '@type': 'Person', name: a.name })),
  image: mediaUrl(post.meta?.image, siteUrl) ?? mediaUrl(post.heroImage, siteUrl),
  publisher: {
    '@type': 'Organization',
    name: siteName,
    logo: logoUrl ? { '@type': 'ImageObject', url: logoUrl } : undefined,
  },
})

/** For the FAQ block (lot B). `answer` is plain text. */
export const faqPage = (items: { question: string; answer: string }[]): JsonLdObject => ({
  '@context': ctx,
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({
    '@type': 'Question',
    name: i.question,
    acceptedAnswer: { '@type': 'Answer', text: i.answer },
  })),
})
