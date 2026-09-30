// Payload only starts its job crons (autoRun) when getPayload is called with `cron: true`,
// which otherwise happens only on the first admin/REST request. Start them at boot.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ])
  await getPayload({ config, cron: true })
}
