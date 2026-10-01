import { describe, expect, it } from 'vitest'

import { absoluteUrl } from '@/utilities/absoluteUrl'

describe('absoluteUrl', () => {
  it('prefixes a relative path with the site url', () => {
    expect(absoluteUrl('https://site.com', '/api/media/file/a.jpg')).toBe(
      'https://site.com/api/media/file/a.jpg',
    )
  })

  it('keeps an already absolute url untouched', () => {
    expect(absoluteUrl('https://site.com', 'https://cdn.example.com/a.jpg')).toBe(
      'https://cdn.example.com/a.jpg',
    )
  })
})
