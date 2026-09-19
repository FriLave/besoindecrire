/**
 * Payload's `array`/`blocks` fields are NOT deep-merged on `update`: each row
 * needs its own `id` to be recognized as "the same row". A row sent without
 * a matching `id` is treated as brand new - the old row (and its data in
 * EVERY OTHER locale) is deleted and replaced. This bit us seeding two
 * locales: translating a page's `layout` (or a form's `fields`, or a
 * global's `navItems`...) into `en` by re-sending freshly-built objects with
 * no `id` silently wiped the `fr` values for every localized field nested
 * inside those rows (verified empirically against the seeded DB - see the
 * pass 4d report).
 *
 * `preserveIds` walks the already-created (`fr`) document and the
 * newly-built translation in parallel and copies each row's `id` across by
 * position, at every nesting level (blocks within blocks, arrays within
 * blocks...). This only works because the seed intentionally keeps the same
 * structure across locales - same block order, same array lengths - so
 * positional matching is correct.
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function preserveIds<T>(created: unknown, translated: T): T {
  if (Array.isArray(translated)) {
    if (!Array.isArray(created)) return translated

    return translated.map((item, index) => preserveIds(created[index], item)) as T
  }

  if (isPlainObject(translated)) {
    if (!isPlainObject(created)) return translated

    const merged: Record<string, unknown> = { ...translated }
    for (const key of Object.keys(translated)) {
      merged[key] = preserveIds(created[key], translated[key])
    }
    if (typeof created.id !== 'undefined') {
      merged.id = created.id
    }

    return merged as T
  }

  return translated
}
