import type { RunJobAccess } from 'payload'

import { hasRole } from '@/access/roles'
import { isCronAuthorized } from '@/utilities/safeEqual'

// /api/payload-jobs/run: admins, or on Vercel the cron call (`Authorization: Bearer $CRON_SECRET`). Not editors.
export const jobsRunAccess: RunJobAccess = ({ req }) => {
  if (hasRole(req.user, 'superadmin', 'admin')) return true
  return Boolean(
    process.env.VERCEL &&
    isCronAuthorized(req.headers.get('authorization'), process.env.CRON_SECRET),
  )
}
