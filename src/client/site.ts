/**
 * Client-owned zone.
 *
 * Everything under `src/client/` belongs to the client fork of this
 * boilerplate, not to the upstream boilerplate itself. Upstream (this
 * repo's own maintenance) never modifies files in this directory: when a
 * new client project is forked from the boilerplate, this is the place to
 * edit to give the site its identity, instead of inlining new hardcoded
 * strings into upstream-owned code (components, utilities, plugins...).
 *
 * NOTE: the `site-settings` Payload global (`src/globals/SiteSettings/`) now
 * exists and is the editable, localized source of truth for the site's name
 * and description from the admin UI. `SITE_NAME` / `SITE_DESCRIPTION` below
 * are the build-time fallback: the value used before the global is ever
 * populated, and by any code that isn't (yet) reading from the global.
 * Routing/SEO passes will rewire consumers to read the global instead; this
 * file keeps exporting the same names so nothing breaks until they do.
 */

export const SITE_NAME = "Besoin d'Écrire"
export const SITE_DESCRIPTION =
  'Accompagnement autobiographique depuis 2012 par Paulin Hassika. Écrire sa vie, comprendre son histoire, devenir auteur.'
