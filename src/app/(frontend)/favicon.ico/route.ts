import { NextResponse, type NextRequest } from 'next/server'

/**
 * Browsers request `/favicon.ico` unconditionally, regardless of the
 * `<link rel="icon">` tag in `<head>` (which already points at the only
 * icon asset this project ships, `public/favicon.svg` - see
 * `[locale]/layout.tsx`). Without an explicit route here, that request has
 * no matching static file or route, so it falls through to the `[locale]`
 * dynamic segment with `locale = "favicon.ico"` - guarded elsewhere to a
 * clean 404 rather than a Payload query, but still a 404 on every page
 * load in practice.
 *
 * Redirect to the existing SVG rather than shipping a redundant binary
 * `.ico` file: modern browsers happily use an SVG favicon served this way,
 * and this keeps a single icon asset to maintain.
 */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/favicon.svg', request.url), 308)
}
