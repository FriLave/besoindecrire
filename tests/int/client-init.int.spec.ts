import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  buildEnv,
  hexToOklch,
  parseOklch,
  readBrand,
  readModules,
  readSiteCopy,
  setBrand,
  setModules,
  setPackageName,
  setSiteCopy,
  slugify,
} from '../../scripts/client-init'

const f = (p: string) => readFileSync(p, 'utf8')
const site = f('src/client/site.ts')
const css = f('src/client/theme.css')
const mods = f('src/client/modules.ts')
const example = f('.env.example')

describe('hexToOklch', () => {
  it('white / black', () => {
    expect(parseOklch(hexToOklch('#ffffff')).L).toBeCloseTo(1, 2)
    expect(parseOklch(hexToOklch('#000'))).toEqual({ L: 0, C: 0, H: 0 })
  })
  it('mid blue (#0071c7 ~ oklch 54% 0.16 250)', () => {
    const { L, C, H } = parseOklch(hexToOklch('#0071c7'))
    expect(L).toBeCloseTo(0.54, 1)
    expect(C).toBeCloseTo(0.16, 1)
    expect(H).toBeGreaterThan(245)
    expect(H).toBeLessThan(255)
  })
  it('expands #rgb and passes oklch through', () => {
    expect(hexToOklch('#f00')).toBe(hexToOklch('#ff0000'))
    expect(hexToOklch('oklch(60% 0.2 30deg)')).toBe('oklch(60% 0.2 30deg)')
    expect(() => hexToOklch('blue')).toThrow()
  })
})

describe('transforms', () => {
  it('setSiteCopy escapes, round-trips and is idempotent', () => {
    const v = { name: "L'Atelier", description: 'Un site \\ simple' }
    const once = setSiteCopy(site, v)
    expect(readSiteCopy(once)).toEqual(v)
    expect(setSiteCopy(once, v)).toBe(once)
    expect(() => setSiteCopy('nothing', v)).toThrow(/marker/)
  })

  it('setBrand sets light + dark pairs with readable foreground', () => {
    const light = setBrand(css, '#ffe600')
    expect(readBrand(light)).toMatch(/^oklch\(9/)
    expect(light.match(/--brand-foreground: oklch\(20\.5%/g)).toHaveLength(2)
    const dark = setBrand(css, 'oklch(40% 0.1 20deg)')
    expect(dark).toContain(
      '--brand: oklch(40% 0.1 20deg);\n  --brand-foreground: oklch(98.5% 0 0deg);',
    )
    expect(dark).toContain('--brand: oklch(74% 0.1 20deg);')
    expect(setBrand(dark, 'oklch(40% 0.1 20deg)')).toBe(dark)
    expect(() => setBrand('a{}', '#fff')).toThrow(/pairs/)
  })

  it('setModules', () => {
    const out = setModules(mods, { blog: false, payments: true })
    expect(readModules(out)).toEqual({ blog: false, payments: true })
    expect(setModules(out, { blog: false, payments: true })).toBe(out)
  })

  it('buildEnv fills secrets, keeps the rest', () => {
    const out = buildEnv(example, {
      serverUrl: 'http://localhost:3000',
      secrets: { PAYLOAD_SECRET: 'a'.repeat(64), PREVIEW_SECRET: 'b'.repeat(64) },
    })
    expect(out).toContain(`PAYLOAD_SECRET=${'a'.repeat(64)}`)
    expect(out).toContain(`PREVIEW_SECRET=${'b'.repeat(64)}`)
    expect(out).toContain('DATABASE_URL=postgres://payload:payload@127.0.0.1:5432/payload')
    expect(out).toContain('# Used to encrypt JWT tokens')
    expect(out).not.toContain('YOUR_SECRET_HERE')
    expect(() => buildEnv('X=1', { serverUrl: 'u', secrets: {} })).toThrow(/marker/)
  })

  it('setPackageName / slugify', () => {
    const json = '{\n  "name": "old",\n  "version": "1.0.0"\n}\n'
    const out = setPackageName(json, slugify('Café Été !'))
    expect(JSON.parse(out).name).toBe('cafe-ete')
    expect(setPackageName(out, 'cafe-ete')).toBe(out)
  })
})
