import type { Slugify } from 'payload/shared'

/**
 * Payload's default `slugify` (from `payload/dist/utilities/slugify.js`) is:
 *
 *   val.trim().replace(/ /g, '-').replace(/[^\w-]+/g, '').toLowerCase()
 *
 * `\w` only matches ASCII word characters, so accented letters are treated as
 * "not a word character" and stripped outright rather than folded to their
 * base letter: "À propos" becomes "-propos", "Où nous trouver" becomes
 * "o-nous-trouver". With French as the default locale this breaks slug
 * generation independently of localization.
 *
 * This function normalises the input to NFD (decomposing accented letters
 * into a base letter + combining diacritical marks), strips the combining
 * marks, and only then applies the same transform as upstream, plus a final
 * collapse of repeated/leading/trailing hyphens (which can appear once
 * symbols such as "&" are stripped out).
 *
 * Passed to `slugField({ slugify })`, which stores it as `field.custom.slugify`
 * for its server function — hence a plain, module-level named function with
 * no closure over request state.
 */
export function slugify({ valueToSlugify }: Parameters<Slugify>[0]): string | undefined {
  if (typeof valueToSlugify !== 'string') {
    return valueToSlugify
  }

  return valueToSlugify
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
