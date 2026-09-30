export type Env = Record<string, string | undefined>

export const publicBase = (env: Env) => env.S3_PUBLIC_URL?.replace(/\/+$/, '')

/** Hosts next/image may fetch from, derived from the same env (see next.config.ts). */
export const storageImageHosts = (
  env: Env,
): { protocol: 'http' | 'https'; hostname: string; port?: string }[] => {
  const out: { protocol: 'http' | 'https'; hostname: string; port?: string }[] = []
  const base = publicBase(env)
  if (base) {
    const u = new URL(base)
    out.push({
      protocol: u.protocol.replace(':', '') as 'http' | 'https',
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
    })
  }
  if (env.STORAGE_DRIVER === 'vercel-blob')
    out.push({ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' })
  return out
}
