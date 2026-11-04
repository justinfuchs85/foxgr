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
    ['service-page-v2', slug],
    { tags: [SERVICE_PAGES_TAG, `service-page:${slug}`] },
  )()
}
