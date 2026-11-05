import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { getPublishedServicePages } from '@/lib/service-pages'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const payload = await getPayloadClient()
    const [pages, homepage] = await Promise.all([
      getPublishedServicePages(),
      payload.findGlobal({ slug: 'homepage', depth: 0, overrideAccess: false }),
    ])
    return [
      { url: absoluteUrl('/'), lastModified: homepage.updatedAt ?? undefined, changeFrequency: 'monthly', priority: 1 },
      ...pages
        .filter((p) => p.slug)
        .map((p) => ({
          url: absoluteUrl(`/what-we-do/${p.slug}`),
          lastModified: p.updatedAt,
          changeFrequency: 'monthly' as const,
          priority: p.featured === false ? 0.6 : 0.8,
        })),
      { url: absoluteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
    ]
  } catch {
    // No database at build time: still publish the homepage.
    return [{ url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 }]
  }
}
