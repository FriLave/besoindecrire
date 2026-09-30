import type { TaskConfig } from 'payload'

import { retentionCutoff } from '@/utilities/retention'

export const purgeFormSubmissions: TaskConfig<'purgeFormSubmissions'> = {
  slug: 'purgeFormSubmissions',
  schedule: [{ cron: '0 3 * * *', queue: 'default' }],
  handler: async ({ req }) => {
    const res = await req.payload.delete({
      collection: 'form-submissions',
      where: { createdAt: { less_than: retentionCutoff().toISOString() } },
      req,
    })
    req.payload.logger.info(`purgeFormSubmissions: deleted ${res.docs.length} submission(s)`)
    return { output: { deleted: res.docs.length } }
  },
  outputSchema: [{ name: 'deleted', type: 'number' }],
}
