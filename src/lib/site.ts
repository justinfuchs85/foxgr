/** Facts about the business used in metadata, structured data and llms.txt. */
export const SITE = {
  name: 'Fox Consulting Group',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  email: 'hello@foxgr.com',
  foundingYear: '2016',
  founder: { name: 'Justin Fuchs', jobTitle: 'Founder' },
  locality: 'Grand Rapids',
  region: 'MI',
  country: 'US',
  defaultTitle: 'Fox Consulting Group | Marketing Operations & Analytics Consulting',
  description:
    'Consulting for marketing leaders on digital strategy, marketing operations, MarTech and analytics. Based in Grand Rapids, MI. 30+ engagements since 2016.',
  sameAs: [
    'https://www.linkedin.com/company/fox-digital-consulting-group',
    'https://www.instagram.com/foxconsultinggroup/',
  ],
  logo: '/brand/fox-logo-square.png',
  knowsAbout: [
    'Digital strategy',
    'Marketing operations',
    'Marketing governance',
    'Marketing technology (MarTech) strategy',
    'Marketing analytics',
    'Google Analytics 4',
    'Google Tag Manager',
    'Privacy-first measurement and consent',
    'KPI frameworks',
    'Marketing dashboards and reporting',
    'Content strategy',
  ],
} as const

export const absoluteUrl = (path = '/') => `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`

/** Per-page metadata with the shared share image, card type and llms.txt pointer kept intact. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }) {
  const image = { url: '/brand/og-default.png', width: 1200, height: 630, alt: `${SITE.name}: ${SITE.description}` }
  return {
    description,
    alternates: {
      canonical: path,
      types: { 'text/plain': [{ url: '/llms.txt', title: `${SITE.name} for AI assistants` }] },
    },
    openGraph: { type: 'website' as const, siteName: SITE.name, locale: 'en_US', title, description, url: path, images: [image] },
    twitter: { card: 'summary_large_image' as const, title, description, images: [image.url] },
  }
}
