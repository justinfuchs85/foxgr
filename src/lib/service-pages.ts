import { unstable_cache } from 'next/cache'
import type { ServicePage } from '@/payload-types'
import { findBySlug, getPayloadClient } from '@/lib/payload'
import { SERVICE_PAGES_TAG } from '@/hooks/revalidateServicePages'

export type ServiceNavItem = Pick<ServicePage, 'slug' | 'navigationLabel' | 'featured'>

export const getServicePageNavigation = unstable_cache(
  async (): Promise<ServiceNavItem[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'service-pages',
      depth: 0,
      limit: 20,
      overrideAccess: false,
      sort: 'order',
      select: { navigationLabel: true, slug: true, featured: true },
    })
    return result.docs
  },
  ['service-page-navigation-v2'],
  { tags: [SERVICE_PAGES_TAG] },
)

export async function getServicePageBySlug(slug: string) {
  return unstable_cache(
    () => findBySlug('service-pages', slug),
    ['service-page-v3', slug],
    { tags: [SERVICE_PAGES_TAG, `service-page:${slug}`] },
  )()
}

/** Latest draft of a page, uncached. Only called in draft mode, after an admin sign-in check. */
export async function getServicePageDraft(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: slug } },
    draft: true,
    depth: 1,
    limit: 1,
    overrideAccess: true,
  })
  return result.docs[0] ?? null
}

/** Every published service page with full copy, for the sitemap, llms.txt and structured data. */
export const getPublishedServicePages = unstable_cache(
  async (): Promise<ServicePage[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'service-pages',
      depth: 0,
      limit: 50,
      overrideAccess: false,
      sort: 'order',
    })
    return result.docs
  },
  ['service-pages-full-v1'],
  { tags: [SERVICE_PAGES_TAG] },
)
