const installed = { blog: true, payments: true }

export type ModuleKey = keyof typeof installed

// `generate:types` / `generate:importmap` set PAYLOAD_ALL_MODULES=1 so the
// generated types always cover every module, whatever a fork installs.
export const modules: Record<ModuleKey, boolean> =
  process.env.PAYLOAD_ALL_MODULES === '1'
    ? (Object.fromEntries(Object.keys(installed).map((k) => [k, true])) as Record<ModuleKey, boolean>)
    : installed
