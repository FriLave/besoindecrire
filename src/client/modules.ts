export const installed = { blog: true, payments: false }

export type ModuleKey = keyof typeof installed

// `generate:types` / `generate:importmap` / `migrate*` set PAYLOAD_ALL_MODULES=1 so the
// generated types and migrations always cover every module, whatever a fork installs.
// A fork that removes a module keeps its (inert) tables and never generates a migration dropping them.
export const modules: Record<ModuleKey, boolean> =
  process.env.PAYLOAD_ALL_MODULES === '1'
    ? (Object.fromEntries(Object.keys(installed).map((k) => [k, true])) as Record<
        ModuleKey,
        boolean
      >)
    : installed
