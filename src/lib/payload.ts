import { getPayload } from 'payload'
import config from '@payload-config'
import type { Config } from '@/payload-types'

type CollectionSlug = keyof Config['collections']

/** Get the Payload instance. Use in server components and route handlers. */
export async function getPayloadClient() {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}

/** Find one published document by slug. Returns null when missing. */
export async function findBySlug<T extends CollectionSlug>(
  collection: T,
  slug: string,
  options?: { draft?: boolean; depth?: number },
): Promise<Config['collections'][T] | null> {
  const payload = await getPayloadClient()
  const { draft = false, depth = 2 } = options ?? {}

  const result = await payload.find({
    collection,
    overrideAccess: false,
    where: { slug: { equals: slug } },
    depth,
    limit: 1,
    draft,
  })

  return (result.docs[0] as Config['collections'][T]) ?? null
}
