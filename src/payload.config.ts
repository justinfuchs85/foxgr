import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { sharpTransformer } from '@payloadcms/transformer-sharp'
import { Admins } from './collections/Admins'
import { Media } from './collections/Media'
import { Folders } from './collections/Folders'
import { Tags } from './collections/Tags'
import { Services } from './collections/Services'
import { CaseStudies } from './collections/CaseStudies'
import { Insights } from './collections/Insights'
import { Testimonials } from './collections/Testimonials'
import { ServicePages } from './collections/ServicePages'
import { Homepage } from './globals/Homepage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Supabase Storage speaks S3. When these are set, uploads go to the bucket;
// otherwise they land on local disk in ./media (fine for local dev only —
// Vercel's filesystem is ephemeral).
const useS3 = Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID)

export default buildConfig({
  // No serverURL on purpose: it makes Payload emit absolute media URLs, which
  // next/image then rejects. Relative /api/media/... URLs work on any domain.
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Admins,
    Media,
    Folders,
    Tags,
    Services,
    CaseStudies,
    Insights,
    Testimonials,
    ServicePages,
  ],
  globals: [Homepage],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  upload: {
    transformers: [
      sharpTransformer({
        collections: {
          media: {
            // Cap originals so a 4K screenshot doesn't ship to every visitor.
            resizeOptions: { width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true },
            focalPoint: true,
          },
        },
      }),
    ],
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  storage: useS3
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET as string,
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION || 'us-east-1',
            forcePathStyle: true,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
            },
          },
        }),
      ]
    : [],
})
