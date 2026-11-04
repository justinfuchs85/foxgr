import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { ServicePageView } from './ServicePageView'
import {
  getServicePageBySlug,
  getServicePageDraft,
  getServicePageNavigation,
} from '@/lib/service-pages'

type PageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateStaticParams() {
  // Tolerate a missing/empty database at build time; pages render on demand instead.
  try {
    const services = await getServicePageNavigation()
    return services.filter(({ slug }) => slug).map(({ slug }) => ({ slug: slug as string }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await getServicePageBySlug(slug)

  if (!service) return {}

  return {
    title: `${service.title} | Fox Consulting Group`,
    description: service.heroSummary,
    alternates: {
      canonical: `/what-we-do/${service.slug}`,
    },
    openGraph: {
      title: service.title,
      description: service.heroSummary,
      type: 'website',
    },
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  // Draft mode is only switched on by /next/preview after a signed-in CMS check.
  const { isEnabled: preview } = await draftMode()
  const [service, navigation] = await Promise.all([
    preview ? getServicePageDraft(slug) : getServicePageBySlug(slug),
    getServicePageNavigation(),
  ])

  if (!service) notFound()

  return (
    <ServicePageView
      initialData={service}
      navigation={navigation}
      preview={preview}
      serverURL={process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}
    />
  )
}
