import { NextResponse, type NextRequest } from 'next/server'

/**
 * French is the default locale and is served unprefixed (`/`, `/contact`).
 * English is served under the `/en` prefix (`/en`, `/en/contact`).
 *
 * Internally, every request is routed through the `[locale]` segment in
 * `src/app/(frontend)/[locale]`, so the default locale still needs an
 * internal `/fr` prefix - added here via a rewrite that leaves the public
 * URL untouched.
 *
 * `/fr` and `/fr/*` are explicitly redirected to their unprefixed
 * equivalent so the default locale never has two valid public URLs for the
 * same content (would be duplicate content for SEO).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/fr' || pathname.startsWith('/fr/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice('/fr'.length) || '/'
    return NextResponse.redirect(url, 308)
  }

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/fr${pathname === '/' ? '' : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!admin|api|next/|_next/|media/|favicon\\.svg|robots\\.txt|sitemap\\.xml|pages-sitemap\\.xml|.*\\..*).*)',
  ],
}
