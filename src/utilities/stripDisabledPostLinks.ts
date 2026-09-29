import { isFeatureEnabled } from './features'
import { stripPostLinks } from './stripPostLinks'

/**
 * While the blog is switched off, links to posts would dangle (404). Runs
 * `stripPostLinks` over server-loaded data (page hero/layout incl. their rich
 * text, footer); returns `data` untouched when the blog is on.
 */
export async function stripDisabledPostLinks<T>(data: T): Promise<T> {
  return (await isFeatureEnabled('blog')) ? data : stripPostLinks(data)
}
