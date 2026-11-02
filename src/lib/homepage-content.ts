import { unstable_cache } from 'next/cache'
import type { CaseStudy, Homepage, Insight, Service, Testimonial } from '@/payload-types'
import type { ServiceNavItem } from '@/lib/service-pages'
import { HOMEPAGE_TAG } from '@/hooks/revalidateHomepage'
import { getPayloadClient } from '@/lib/payload'

export type HomepageContent = {
  homepage: Homepage
  services: Service[]
  caseStudies: CaseStudy[]
  insights: Insight[]
  testimonials: Testimonial[]
  servicePages: ServiceNavItem[]
}

export const getHomepageContent = unstable_cache(
  async (): Promise<HomepageContent> => {
    const payload = await getPayloadClient()
    const [homepage, services, caseStudies, insights, testimonials, servicePages] =
      await Promise.all([
        payload.findGlobal({ slug: 'homepage', depth: 2, overrideAccess: false }),
        payload.find({ collection: 'services', limit: 12, sort: 'order', overrideAccess: false }),
        payload.find({ collection: 'case-studies', limit: 6, sort: 'order', overrideAccess: false }),
        payload.find({ collection: 'insights', limit: 6, sort: 'order', overrideAccess: false }),
        payload.find({ collection: 'testimonials', limit: 6, sort: 'order', overrideAccess: false }),
        payload.find({
          collection: 'service-pages',
          depth: 0,
          limit: 20,
          overrideAccess: false,
          sort: 'order',
          select: { navigationLabel: true, slug: true },
        }),
      ])

    return {
      homepage,
      services: services.docs,
      caseStudies: caseStudies.docs,
      insights: insights.docs,
      testimonials: testimonials.docs,
      servicePages: servicePages.docs,
    }
  },
  ['homepage-content-v2'],
  { tags: [HOMEPAGE_TAG] },
)
