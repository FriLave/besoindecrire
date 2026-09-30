import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import type { Plugin } from 'payload'

import { publicBase, type Env } from './imageHosts'

type Driver = 'local' | 's3' | 'vercel-blob'

const DRIVERS: Driver[] = ['local', 's3', 'vercel-blob']

const driver = (name: string, value: string | undefined): Driver => {
  const v = (value || 'local') as Driver
  if (!DRIVERS.includes(v))
    throw new Error(`${name}="${value}" is invalid. Expected one of: ${DRIVERS.join(', ')}.`)
  return v
}

const need = (env: Env, keys: string[], why: string) => {
  const missing = keys.filter((k) => !env[k])
  if (missing.length) throw new Error(`${why} requires env: ${missing.join(', ')}.`)
}

/**
 * Pure env -> storage plugins. `local` (default) returns nothing: Payload keeps
 * writing to disk. `media` is public; `private-files` is never public, so it is
 * always read through Payload (access control) and never gets a direct URL.
 */
export const buildStoragePlugins = (env: Env, { payments }: { payments: boolean }): Plugin[] => {
  const mediaDriver = driver('STORAGE_DRIVER', env.STORAGE_DRIVER)
  const privateDriver = driver('STORAGE_DRIVER_PRIVATE', env.STORAGE_DRIVER_PRIVATE || mediaDriver)

  // Vercel Blob only supports public blobs (access?: 'public'): an unguessable but
  // public URL would leak paid files. Refuse instead of silently exposing them.
  if (privateDriver === 'vercel-blob' && payments)
    throw new Error(
      'Vercel Blob has no private blobs, so it cannot hold paid files (private-files). ' +
        'Set STORAGE_DRIVER_PRIVATE=s3 (with the S3_* env) or remove the payments module.',
    )

  const useS3 = mediaDriver === 's3' || privateDriver === 's3'
  const plugins: Plugin[] = []

  if (mediaDriver === 'vercel-blob') {
    need(env, ['BLOB_READ_WRITE_TOKEN'], 'STORAGE_DRIVER=vercel-blob')
    plugins.push(
      vercelBlobStorage({
        alwaysInsertFields: true,
        collections: { media: { disablePayloadAccessControl: true } },
        token: env.BLOB_READ_WRITE_TOKEN,
      }),
    )
  }

  if (useS3) {
    need(env, ['S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY'], 'The s3 storage driver')
    const config = {
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID!,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
      },
      endpoint: env.S3_ENDPOINT || undefined,
      forcePathStyle: env.S3_FORCE_PATH_STYLE === 'true',
      region: env.S3_REGION || 'us-east-1',
    }
    const base = publicBase(env)
    const bucket = env.S3_BUCKET!
    const privateBucket = env.S3_PRIVATE_BUCKET || bucket
    // Same bucket => keep paid files under a prefix so they stay distinct from media.
    const privateOpts = env.S3_PRIVATE_BUCKET ? true : { prefix: 'private-files' }

    const mediaOpts = base
      ? {
          disablePayloadAccessControl: true as const,
          generateFileURL: ({ filename, prefix }: { filename: string; prefix?: string }) =>
            `${base}/${prefix ? `${prefix}/` : ''}${encodeURIComponent(filename)}`,
        }
      : (true as const)
    const media = mediaDriver === 's3'
    const priv = privateDriver === 's3'
    if (media && priv && privateBucket === bucket) {
      plugins.push(
        s3Storage({
          alwaysInsertFields: true,
          bucket,
          config,
          collections: { media: mediaOpts, 'private-files': privateOpts },
        }),
      )
    } else {
      if (media)
        plugins.push(
          s3Storage({
            alwaysInsertFields: true,
            bucket,
            config,
            collections: { media: mediaOpts },
          }),
        )
      if (priv)
        plugins.push(
          s3Storage({
            alwaysInsertFields: true,
            bucket: privateBucket,
            config,
            collections: { 'private-files': privateOpts },
            clientCacheKey: `s3:${privateBucket}:private`,
          }),
        )
    }
  }

  // Collections left on local disk still get the storage fields, so the DB schema and
  // generated types are identical whatever the driver (switching needs no migration).
  const uncovered = {
    ...(mediaDriver === 'local' ? { media: true as const } : {}),
    ...(privateDriver === 'local' || (privateDriver === 'vercel-blob' && !payments)
      ? { 'private-files': true as const }
      : {}),
  }
  if (Object.keys(uncovered).length)
    plugins.push(
      s3Storage({
        alwaysInsertFields: true,
        enabled: false,
        bucket: '',
        config: {},
        collections: uncovered,
      }),
    )

  return plugins
}
