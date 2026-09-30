// @vitest-environment node
import path from 'path'
import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { RETENTION_YEARS, retentionCutoff } from '@/utilities/retention'

let payload: Payload
let formId: number
const created: number[] = []
const context = { disableRevalidate: true }

describe('retention', () => {
  it('cutoff is exactly 3 years before now', () => {
    expect(RETENTION_YEARS).toBe(3)
    expect(retentionCutoff(new Date('2026-09-30T12:00:00Z')).toISOString()).toBe(
      '2023-09-30T12:00:00.000Z',
    )
  })
})

describe('purgeFormSubmissions + media alt', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    // Reuses the seeded contact form (a form requires a confirmation message).
    const form = (await payload.find({ collection: 'forms', limit: 1, depth: 0 })).docs[0]
    formId = form.id
  })

  afterAll(async () => {
    await payload.delete({ collection: 'form-submissions', where: { id: { in: created } } })
  })

  it('deletes submissions older than 3 years and keeps recent ones', async () => {
    const old = new Date(retentionCutoff().getTime() - 86_400_000).toISOString()
    const oldSub = await payload.create({
      collection: 'form-submissions',
      data: { form: formId, submissionData: [], createdAt: old },
    })
    const recentSub = await payload.create({
      collection: 'form-submissions',
      data: { form: formId, submissionData: [] },
    })
    created.push(oldSub.id, recentSub.id)

    await payload.jobs.queue({ task: 'purgeFormSubmissions', input: {}, queue: 'maintenance' })
    await payload.jobs.run({ queue: 'maintenance' })

    const left = await payload.find({
      collection: 'form-submissions',
      where: { id: { in: created } },
      pagination: false,
    })
    expect(left.docs.map((d) => d.id)).toEqual([recentSub.id])
  })

  it('rejects media uploads without alt text', async () => {
    await expect(
      payload.create({
        collection: 'media',
        data: {} as { alt: string },
        filePath: path.resolve(process.cwd(), 'src/endpoints/seed/image-hero1.webp'),
        context,
      }),
    ).rejects.toThrow(/alt/i)
  })
})
