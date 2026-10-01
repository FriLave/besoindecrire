import { describe, expect, it } from 'vitest'

import { urlsetResponse } from '@/utilities/sitemapXml'

describe('urlsetResponse', () => {
  it('emits alternates only for translated locales, plus x-default', async () => {
    const body = await urlsetResponse(
      [{ slug: { fr: 'a-propos', en: null } }],
      'pages',
      'https://s.com',
    ).text()

    expect(body).toContain('<loc>https://s.com/a-propos</loc>')
    expect(body).not.toContain('/en/')
    expect(body).toContain('hreflang="x-default" href="https://s.com/a-propos"')
  })

  it('lists the blog index for an empty slug', async () => {
    const body = await urlsetResponse(
      [{ slug: { fr: '', en: '' } }],
      'posts',
      'https://s.com',
    ).text()

    expect(body).toContain('<loc>https://s.com/blog</loc>')
    expect(body).toContain('<loc>https://s.com/en/blog</loc>')
  })
})
