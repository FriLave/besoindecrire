/**
 * Client-owned zone: typography.
 *
 * This is the file a client fork edits to swap the site's typeface.
 * Geist is the neutral default. Any replacement MUST stay `next/font`
 * -based (self-hosted, no blocking external request) — this project's
 * rendering/SEO requirements rule out `next/font/google` or any other
 * remote font fetch (see CLAUDE.md section 8, "Performance / Core Web
 * Vitals"). The `geist` package itself wraps `next/font/local`, so it is
 * already self-hosted.
 *
 * Export the font objects (and/or their `.variable` class names); the
 * root layout only imports from here.
 */

import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

export { GeistMono, GeistSans }
