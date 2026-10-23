// @vitest-environment node
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { heading, paragraph, richText, text } from '@/endpoints/seed/lexical-helpers'
import { countH1 } from '@/utilities/countH1'

describe('countH1', () => {
  it('counts h1 headings only, anywhere in the data', () => {
    expect(countH1(null)).toBe(0)
    expect(
      countH1({ hero: { richText: richText([heading('h1', 'A'), heading('h2', 'B')]) } }),
    ).toBe(1)
    expect(
      countH1([
        { hero: richText([heading('h1', 'A')]) },
        {
          layout: [
            { columns: [{ richText: richText([heading('h1', 'B'), paragraph([text('x')])]) }] },
          ],
        },
      ]),
    ).toBe(2)
    expect(countH1({ hero: richText([heading('h3', 'A')]) })).toBe(0)
  })
})

describe('publishing a page requires exactly one H1', () => {
  let payload: Payload
  const suffix = Date.now()
  const context = { disableRevalidate: true }

  const create = (n: number, status: 'draft' | 'published', locale: 'fr' | 'en' = 'fr', tag = '') =>
    payload.create({
      collection: 'pages',
      locale,
      draft: status === 'draft',
      context,
      data: {
        title: `h1-test-${suffix}-${n}-${status}${tag}`,
        slug: `h1-test-${suffix}-${n}-${status}${tag}`,
        _status: status,
        hero: {
          type: 'lowImpact',
          richText: richText(Array.from({ length: n }, (_, i) => heading('h1', `T${i}`))),
        },
        layout: [
          {
            blockType: 'content',
            columns: [{ size: 'full', richText: richText([paragraph([text('x')])]) }],
          },
        ],
      },
    })

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    await payload.delete({
      collection: 'pages',
      where: { title: { contains: `h1-test-${suffix}` } },
      context,
    })
  })

  it('rejects 0 and 2 H1 on publish', async () => {
    await expect(create(0, 'published')).rejects.toThrow(/H1/)
    await expect(create(2, 'published')).rejects.toThrow(/H1/)
  })

  it('accepts 1 H1 on publish', async () => {
    expect((await create(1, 'published')).id).toBeDefined()
  })

  it('accepts a draft with 0 H1', async () => {
    const doc = await create(0, 'draft')
    expect(doc._status).toBe('draft')
  })

  it('error message follows the locale', async () => {
    await expect(create(0, 'published', 'fr')).rejects.toThrow(/exactement un H1/)
  })

  it('also checks the other locales that have content', async () => {
    const page = await create(1, 'published', 'fr', '-locales')
    await payload.update({
      collection: 'pages',
      id: page.id,
      locale: 'en',
      draft: true,
      context,
      data: { title: `h1-test-${suffix}-en`, hero: { type: 'lowImpact', richText: richText([]) } },
    })
    await expect(
      payload.update({
        collection: 'pages',
        id: page.id,
        locale: 'fr',
        context,
        data: { _status: 'published' },
      }),
    ).rejects.toThrow(/\(en\)/)
  })

  it('publishing in one locale leaves the other locale untouched', async () => {
    // Regression: the cross-locale check used to leave req.locale on the last locale it read,
    // so publishing in `en` wrote the English title over the French one.
    const page = await create(1, 'published', 'fr', '-keep-fr')
    await payload.update({
      collection: 'pages',
      id: page.id,
      locale: 'en',
      context,
      data: {
        _status: 'published',
        title: `h1-test-${suffix}-en-title`,
        hero: { type: 'lowImpact', richText: richText([heading('h1', 'EN')]) },
      },
    })
    const fr = await payload.findByID({ collection: 'pages', id: page.id, locale: 'fr', depth: 0 })
    const en = await payload.findByID({ collection: 'pages', id: page.id, locale: 'en', depth: 0 })
    expect(fr.title).toBe(page.title)
    expect(en.title).toBe(`h1-test-${suffix}-en-title`)
  })
})
