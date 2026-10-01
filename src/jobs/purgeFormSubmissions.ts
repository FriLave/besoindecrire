import type { TaskConfig } from 'payload'

import { retentionCutoff } from '@/utilities/retention'
import { purgeInBatches } from './purgeInBatches'

export const purgeFormSubmissions: TaskConfig<'purgeFormSubmissions'> = {
  slug: 'purgeFormSubmissions',
  schedule: [{ cron: '0 3 * * *', queue: 'maintenance' }],
  retries: 2,
  handler: async ({ req }) => {
    const deleted = await purgeInBatches(req, 'form-submissions', {
      createdAt: { less_than: retentionCutoff().toISOString() },
    })
    req.payload.logger.info(`purgeFormSubmissions: deleted ${deleted} submission(s)`)
    return { output: { deleted } }
  },
  outputSchema: [{ name: 'deleted', type: 'number' }],
}
