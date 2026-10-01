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

  const create = (n: number, status: 'draft' | 'published', locale: 'fr' | 'en' = 'fr') =>
    payload.create({
      collection: 'pages',
      locale,
      draft: status === 'draft',
      context,
      data: {
        title: `h1-test-${suffix}-${n}-${status}`,
        slug: `h1-test-${suffix}-${n}-${status}`,
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
})
