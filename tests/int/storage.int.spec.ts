// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { storageImageHosts } from '@/storage/imageHosts'
import { buildStoragePlugins } from '@/storage'

const s3 = {
  S3_BUCKET: 'b',
  S3_ACCESS_KEY_ID: 'k',
  S3_SECRET_ACCESS_KEY: 's',
}
const blob = { BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_abc123_xyz' }
const build = (env: Record<string, string>, payments = true) =>
  buildStoragePlugins(env, { payments }).length

describe('buildStoragePlugins', () => {
  it('local: only the disabled schema-stabilising plugin, no error', () => {
    expect(build({})).toBe(1)
  })
  it('s3: one plugin for both collections in one bucket, two with a private bucket', () => {
    expect(build({ STORAGE_DRIVER: 's3', ...s3 })).toBe(1)
    expect(build({ STORAGE_DRIVER: 's3', ...s3, S3_PRIVATE_BUCKET: 'p' })).toBe(2)
  })
  it('s3: missing credentials throw', () => {
    expect(() => build({ STORAGE_DRIVER: 's3' })).toThrow(/S3_BUCKET/)
  })
  it('vercel-blob + payments without a private override throws (no private blobs)', () => {
    expect(() => build({ STORAGE_DRIVER: 'vercel-blob', ...blob })).toThrow(/private blobs/)
    expect(() =>
      build({ STORAGE_DRIVER: 'vercel-blob', STORAGE_DRIVER_PRIVATE: 'vercel-blob', ...blob }),
    ).toThrow(/private blobs/)
  })
  it('vercel-blob media + s3 private is fine; without payments too', () => {
    expect(
      build({ STORAGE_DRIVER: 'vercel-blob', STORAGE_DRIVER_PRIVATE: 's3', ...blob, ...s3 }),
    ).toBe(2)
    expect(build({ STORAGE_DRIVER: 'vercel-blob', ...blob }, false)).toBe(2)
  })
  it('vercel-blob needs its token; unknown driver throws', () => {
    expect(() =>
      build({ STORAGE_DRIVER: 'vercel-blob', STORAGE_DRIVER_PRIVATE: 's3', ...s3 }),
    ).toThrow(/BLOB_READ_WRITE_TOKEN/)
    expect(() => build({ STORAGE_DRIVER: 'ftp' })).toThrow(/invalid/)
  })
})

describe('storageImageHosts', () => {
  it('derives next/image hosts from S3_PUBLIC_URL and vercel-blob', () => {
    expect(storageImageHosts({ S3_PUBLIC_URL: 'https://cdn.example.com/' })).toEqual([
      { protocol: 'https', hostname: 'cdn.example.com' },
    ])
    expect(storageImageHosts({ STORAGE_DRIVER: 'vercel-blob' })).toEqual([
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ])
    expect(storageImageHosts({})).toEqual([])
  })
})
