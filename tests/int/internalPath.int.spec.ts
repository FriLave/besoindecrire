import { describe, expect, it } from 'vitest'

import { getInternalPath } from '@/utilities/getLocalizedPath'

describe('getInternalPath', () => {
  it('prefixes the default locale with /fr (proxy rewrite destination)', () => {
    expect(getInternalPath('fr', 'home')).toBe('/fr')
    expect(getInternalPath('fr', 'contact')).toBe('/fr/contact')
    expect(getInternalPath('fr', null, 'posts')).toBe('/fr/blog')
    expect(getInternalPath('fr', 'a', 'posts')).toBe('/fr/blog/a')
  })

  it('matches the public path for other locales', () => {
    expect(getInternalPath('en', 'home')).toBe('/en')
    expect(getInternalPath('en', 'about')).toBe('/en/about')
    expect(getInternalPath('en', 'a', 'posts')).toBe('/en/blog/a')
  })
})
