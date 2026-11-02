import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  // These use dynamic requires/imports (e.g. file-type's import('node:fs/promises'))
  // that the bundler turns into always-throwing stubs, which breaks serving uploaded
  // media. Load them from node_modules at runtime instead.
  serverExternalPackages: ['@payloadcms/transformer-sharp', 'sharp', 'file-type'],
  images: {
    // Media is served from Payload's own /api/media routes (or the storage bucket
    // through them), so no remote patterns are needed.
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/brand/**' }],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
