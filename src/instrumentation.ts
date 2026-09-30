// Payload only starts its job crons (autoRun) when getPayload is called with `cron: true`,
// which otherwise happens only on the first admin/REST request. Start them at boot (not on Vercel: serverless, crons run via vercel.json).
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.VERCEL) return
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ])
  const payload = await getPayload({ config, cron: true })
  payload.logger.info('Payload job crons started (autoRun)')
}
