import { describe, expect, it } from 'vitest'

import { stripPostLinks } from '@/utilities/stripPostLinks'

const lexLink = (relationTo: string) => ({
  type: 'link',
  fields: { linkType: 'internal', doc: { relationTo, value: { slug: 'x' } } },
  children: [{ type: 'text', text: 'read me' }],
})

describe('stripPostLinks', () => {
  it('turns a CMS reference link to posts into a plain custom link', () => {
    const out = stripPostLinks({ link: { type: 'reference', label: 'Blog', reference: { relationTo: 'posts', value: 1 } } })
    expect(out.link).toMatchObject({ type: 'custom', label: 'Blog', reference: null })
  })

  it('unwraps a Lexical post link, keeping its text', () => {
    const out = stripPostLinks({ root: { children: [{ type: 'paragraph', children: [lexLink('posts')] }] } })
    expect(out.root.children[0].children).toEqual([{ type: 'text', text: 'read me' }])
  })

  it('leaves links to pages untouched', () => {
    const data = {
      link: { type: 'reference', reference: { relationTo: 'pages', value: 1 } },
      root: { children: [{ type: 'paragraph', children: [lexLink('pages')] }] },
    }
    expect(stripPostLinks(data)).toEqual(data)
  })
})
