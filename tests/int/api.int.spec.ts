import type { Payload } from 'payload'
import { getPayload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })

  it('fetches the French homepage with French title', async () => {
    const result = await payload.find({
      collection: 'pages',
      locale: 'fr',
      where: {
        slug: {
          equals: 'home',
        },
      },
    })

    expect(result.docs).toHaveLength(1)
    expect(result.docs[0]?.title).toBe('Accueil')
  })

  it('fetches the English homepage with English title', async () => {
    const result = await payload.find({
      collection: 'pages',
      locale: 'en',
      where: {
        slug: {
          equals: 'home',
        },
      },
    })

    expect(result.docs).toHaveLength(1)
    expect(result.docs[0]?.title).toBe('Home')
  })

  it('returns different titles for fr and en for the same document', async () => {
    const [fr, en] = await Promise.all([
      payload.find({
        collection: 'pages',
        locale: 'fr',
        where: { slug: { equals: 'home' } },
      }),
      payload.find({
        collection: 'pages',
        locale: 'en',
        where: { slug: { equals: 'home' } },
      }),
    ])

    const frDoc = fr.docs[0]
    const enDoc = en.docs[0]

    expect(frDoc?.id).toBe(enDoc?.id)
    expect(frDoc?.title).not.toBe(enDoc?.title)
  })

  it('resolves the English contact page under its own localized slug', async () => {
    const result = await payload.find({
      collection: 'pages',
      locale: 'en',
      where: {
        slug: {
          equals: 'contact-us',
        },
      },
    })

    expect(result.docs).toHaveLength(1)
    expect(result.docs[0]?.title).toBe('Contact')
  })
})
