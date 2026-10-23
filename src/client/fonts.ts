/**
 * Client-owned zone: typography.
 *
 * This is the file a client fork edits to swap the site's typefaces. Any
 * replacement MUST stay `next/font`-based and self-hosted (no blocking
 * external request, see CLAUDE.md section 8).
 *
 * Contract with the layout and `globals.css`: export `fontVariables`, the
 * class names that define three CSS variables:
 * - `--font-body`    -> Tailwind `font-sans` (body text)
 * - `--font-display` -> Tailwind `font-serif` (headings)
 * - `--font-geist-mono` -> Tailwind `font-mono` (Geist Mono, kept from upstream)
 *
 * Besoin d'Écrire: Newsreader (headings, with optical sizes) + Hanken Grotesk
 * (body), both OFL, variable woff2 files from Fontsource in `./fonts/`.
 */

import { GeistMono } from 'geist/font/mono'
import localFont from 'next/font/local'

const display = localFont({
  src: [
    { path: './fonts/newsreader-latin-standard-normal.woff2', style: 'normal', weight: '200 800' },
    { path: './fonts/newsreader-latin-standard-italic.woff2', style: 'italic', weight: '200 800' },
  ],
  variable: '--font-display',
  display: 'swap',
})

const body = localFont({
  src: [
    { path: './fonts/hanken-grotesk-latin-wght-normal.woff2', style: 'normal', weight: '100 900' },
  ],
  variable: '--font-body',
  display: 'swap',
})

export const fontVariables = [display.variable, body.variable, GeistMono.variable].join(' ')
