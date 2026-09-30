/**
 * Seeds the demo content through the Local API, without a running server.
 * Usage: pnpm seed:local   (destructive: empties collections first)
 *
 * Used by CI (Lighthouse) and locally. It bypasses the `/next/seed` route on
 * purpose, so that route stays disabled in production with no escape hatch.
 * Every seeded write sets `context.disableRevalidate`, so no Next context is needed.
 */
import { createLocalReq, getPayload } from 'payload'
import config from '@payload-config'
import { seed } from '@/endpoints/seed'

const payload = await getPayload({ config })
await seed({ payload, req: await createLocalReq({}, payload) })
process.exit(0)
