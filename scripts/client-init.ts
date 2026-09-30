/**
 * Client bootstrap: `pnpm client:init [--yes] [--force]`.
 * Rewrites src/client/*, .env and package.json `name` for a new client fork.
 * Transforms are pure (string in, string out) and idempotent; a missing
 * marker throws instead of being silently skipped.
 */
import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { pathToFileURL } from 'node:url'

export type Oklch = { L: number; C: number; H: number }

const replaceOnce = (src: string, re: RegExp, to: string, label: string): string => {
  if (!re.test(src)) throw new Error(`client:init: marker not found (${label})`)
  return src.replace(re, () => to)
}

// Mirrors prettier: single quotes unless the text has more single than double quotes.
const quote = (s: string) => {
  const q = (s.match(/'/g) ?? []).length > (s.match(/"/g) ?? []).length ? '"' : "'"
  return q + s.replaceAll('\\', '\\\\').replaceAll(q, '\\' + q) + q
}
const STR = String.raw`(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")`
const LINE_MAX = 100

const constLine = (name: string, value: string) => {
  const line = `export const ${name} = ${quote(value)}`
  return line.length > LINE_MAX ? `export const ${name} =\n  ${quote(value)}` : line
}

export const setSiteCopy = (
  src: string,
  { name, description }: { name: string; description: string },
) => {
  const out = replaceOnce(
    src,
    new RegExp(String.raw`export const SITE_NAME =\s*${STR}`),
    constLine('SITE_NAME', name),
    'SITE_NAME',
  )
  return replaceOnce(
    out,
    new RegExp(String.raw`export const SITE_DESCRIPTION =\s*${STR}`),
    constLine('SITE_DESCRIPTION', description),
    'SITE_DESCRIPTION',
  )
}

export const readSiteCopy = (src: string) => {
  const unq = (s: string) => s.slice(1, -1).replace(/\\(.)/g, '$1')
  const get = (n: string) => {
    const m = new RegExp(String.raw`export const ${n} =\s*(${STR})`).exec(src)
    if (!m) throw new Error(`client:init: marker not found (${n})`)
    return unq(m[1]!)
  }
  return { name: get('SITE_NAME'), description: get('SITE_DESCRIPTION') }
}

// --- colors -----------------------------------------------------------

const round = (n: number, d: number) => Math.round(n * 10 ** d) / 10 ** d

export const parseOklch = (s: string): Oklch => {
  const m = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*\)$/i.exec(s.trim())
  if (!m) throw new Error(`Invalid oklch color: ${s}`)
  return { L: m[2] ? Number(m[1]) / 100 : Number(m[1]), C: Number(m[3]), H: Number(m[4]) }
}

export const formatOklch = ({ L, C, H }: Oklch) =>
  `oklch(${round(L * 100, 1)}% ${round(C, 3)} ${round(H, 1)}deg)`

/** `#rgb` / `#rrggbb` -> `oklch(L% C Hdeg)`; an `oklch(...)` string is normalized and passed through. */
export const hexToOklch = (input: string): string => {
  const v = input.trim()
  if (/^oklch\(/i.test(v)) return formatOklch(parseOklch(v))
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v)
  if (!m) throw new Error(`Invalid color (expected #rgb, #rrggbb or oklch(...)): ${input}`)
  let h = m[1]!
  if (h.length === 3) h = [...h].map((c) => c + c).join('')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const mm = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * mm - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * mm + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * mm - 0.808675766 * s
  const C = Math.hypot(A, B)
  const achromatic = C < 0.0004
  const H = achromatic ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360
  return formatOklch({ L: Math.min(1, Math.max(0, L)), C: achromatic ? 0 : C, H })
}

const DARK_TEXT = 'oklch(20.5% 0 0deg)'
const LIGHT_TEXT = 'oklch(98.5% 0 0deg)'
const fgFor = (c: Oklch) => (c.L > 0.65 ? DARK_TEXT : LIGHT_TEXT)

/** Light `:root` gets the color as given; the dark theme gets the same hue lifted to L >= 0.74. */
export const setBrand = (css: string, color: string): string => {
  const light = parseOklch(hexToOklch(color))
  const dark = { ...light, L: Math.max(light.L, 0.74) }
  const pairs = [light, dark]
  let i = 0
  const re = /^(\s*)--brand:\s*[^;]+;(\s*\n\s*)--brand-foreground:\s*[^;]+;/gm
  if ((css.match(re) ?? []).length !== 2) {
    throw new Error('client:init: expected 2 --brand/--brand-foreground pairs in theme.css')
  }
  return css.replace(re, (_m, indent: string, sep: string) => {
    const c = pairs[i++]!
    return `${indent}--brand: ${formatOklch(c)};${sep}--brand-foreground: ${fgFor(c)};`
  })
}

export const readBrand = (css: string): string => {
  const m = /^\s*--brand:\s*([^;]+);/m.exec(css)
  if (!m) throw new Error('client:init: marker not found (--brand)')
  return m[1]!.trim()
}

// --- modules / env / package ------------------------------------------

const MODULES_RE = /const installed = \{[^}]*\}/

export const setModules = (src: string, { blog, payments }: { blog: boolean; payments: boolean }) =>
  replaceOnce(
    src,
    MODULES_RE,
    `const installed = { blog: ${blog}, payments: ${payments} }`,
    'installed',
  )

export const readModules = (src: string) => {
  const m = /const installed = \{\s*blog: (true|false),\s*payments: (true|false)\s*\}/.exec(src)
  if (!m) throw new Error('client:init: marker not found (installed)')
  return { blog: m[1] === 'true', payments: m[2] === 'true' }
}

/** Sets only the keys provided; other keys and comments are kept. */
export const buildEnv = (
  example: string,
  { serverUrl, secrets }: { serverUrl: string; secrets: Record<string, string> },
) => {
  let out = example
  for (const [k, v] of Object.entries({ NEXT_PUBLIC_SERVER_URL: serverUrl, ...secrets })) {
    out = replaceOnce(out, new RegExp(`^${k}=.*$`, 'm'), `${k}=${v}`, k)
  }
  return out
}

export const setPackageName = (json: string, slug: string) =>
  replaceOnce(json, /"name":\s*"[^"]*"/, `"name": ${JSON.stringify(slug)}`, 'package name')

export const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'client-site'

// --- CLI ---------------------------------------------------------------

const readAll = async () => {
  let out = ''
  for await (const c of process.stdin) out += String(c)
  return out
}

const say = (s: string) => void process.stdout.write(s + '\n')

const main = async () => {
  const args = new Set(process.argv.slice(2))
  const yes = args.has('--yes')
  const force = args.has('--force')
  const p = (f: string) => resolve(process.cwd(), f)
  const read = (f: string) => readFileSync(p(f), 'utf8')

  const site = read('src/client/site.ts')
  const css = read('src/client/theme.css')
  const mods = read('src/client/modules.ts')
  const cur = { ...readSiteCopy(site), brand: readBrand(css), ...readModules(mods) }

  const rl = createInterface({ input: process.stdin, output: process.stdout })
  // readline drops buffered lines on piped stdin: pre-read them all when not a TTY.
  const piped = !yes && !process.stdin.isTTY ? (await readAll()).split('\n') : null
  const ask = async (q: string, def: string, validate?: (v: string) => void) => {
    if (yes) return def
    for (;;) {
      const raw = piped
        ? (process.stdout.write(`${q} [${def}]: \n`), piped.shift() ?? '')
        : await rl.question(`${q} [${def}]: `)
      const a = raw.trim() || def
      try {
        validate?.(a)
        return a
      } catch (e) {
        say(`  ${(e as Error).message}`)
      }
    }
  }
  const askBool = async (q: string, def: boolean) =>
    /^(y|o)/i.test(await ask(`${q} (y/n)`, def ? 'y' : 'n'))

  const name = await ask('Site name', cur.name)
  const description = await ask('Description', cur.description)
  const brand = await ask('Brand color (#hex or oklch(...))', cur.brand, (v) => void hexToOklch(v))
  const blog = await askBool('Install blog module?', cur.blog)
  const payments = await askBool('Install payments module?', cur.payments)
  const domain = await ask('Production domain (https://..., optional)', '', (v) => {
    if (v && !/^https:\/\/[^/\s]+$/.test(v))
      throw new Error('Expected https://example.com (no trailing slash)')
  })
  rl.close()

  writeFileSync(p('src/client/site.ts'), setSiteCopy(site, { name, description }))
  writeFileSync(p('src/client/theme.css'), setBrand(css, brand))
  writeFileSync(p('src/client/modules.ts'), setModules(mods, { blog, payments }))
  writeFileSync(p('package.json'), setPackageName(read('package.json'), slugify(name)))

  const secret = () => randomBytes(32).toString('hex')
  const serverUrl = 'http://localhost:3000'
  if (!existsSync(p('.env'))) {
    const env = buildEnv(read('.env.example'), {
      serverUrl,
      secrets: { PAYLOAD_SECRET: secret(), PREVIEW_SECRET: secret() },
    })
    writeFileSync(p('.env'), env)
    say('.env created: set PAYLOAD_SECRET, PREVIEW_SECRET, DATABASE_URL, NEXT_PUBLIC_SERVER_URL')
  } else if (force) {
    const env = buildEnv(read('.env'), {
      serverUrl,
      secrets: { PAYLOAD_SECRET: secret(), PREVIEW_SECRET: secret() },
    })
    writeFileSync(p('.env'), env)
    say(
      '.env updated (--force): regenerated PAYLOAD_SECRET, PREVIEW_SECRET; set NEXT_PUBLIC_SERVER_URL',
    )
  } else {
    say('.env exists: left untouched (use --force to regenerate the secrets)')
  }

  say(`
Done. Next steps:
  docker compose up -d
  pnpm dev
  open ${serverUrl}/admin/create-first-user
  (optional) pnpm seed:local   # DESTRUCTIVE: wipes the local DB
  In the admin, fill site-settings (siteUrl, legal tab).
  Module toggles need no generate:types (generated types include every module).${
    domain
      ? `\n  Production: set NEXT_PUBLIC_SERVER_URL=${domain} in the prod environment and siteUrl in site-settings.`
      : ''
  }`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e)
    process.exit(1)
  })
}
