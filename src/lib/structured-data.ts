import type { Homepage, ServicePage } from '@/payload-types'
import { SITE, absoluteUrl } from '@/lib/site'

type Json = Record<string, unknown>

const ORG_ID = `${SITE.url}/#organization`
const PERSON_ID = `${SITE.url}/#founder`
const WEBSITE_ID = `${SITE.url}/#website`

type Block = Homepage['sections'][number]
type AboutBlock = Extract<Block, { blockType: 'about' }>
type EngagementsBlock = Extract<Block, { blockType: 'engagements' }>
type FaqBlock = Extract<Block, { blockType: 'faq' }>
type Faq = { question: string; answer: string }

function faqPage(pageUrl: string, faqs?: Faq[] | null): Json[] {
  if (!faqs?.length) return []
  return [
    {
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      url: pageUrl,
      isPartOf: { '@id': WEBSITE_ID },
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
  ]
}

function organization(services: ServicePage[], about?: AboutBlock, engagements?: EngagementsBlock): Json {
  return {
    '@type': ['ProfessionalService', 'Organization'],
    '@id': ORG_ID,
    name: SITE.name,
    url: absoluteUrl('/'),
    logo: absoluteUrl(SITE.logo),
    image: absoluteUrl('/brand/og-default.png'),
    email: SITE.email,
    description: SITE.description,
    foundingDate: SITE.foundingYear,
    founder: { '@id': PERSON_ID },
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.locality,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    areaServed: { '@type': 'Country', name: 'United States' },
    sameAs: SITE.sameAs,
    knowsAbout: SITE.knowsAbout,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Consulting services',
      itemListElement: [
        ...services.map((page) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            '@id': `${absoluteUrl(`/what-we-do/${page.slug}`)}#service`,
            name: page.title,
            url: absoluteUrl(`/what-we-do/${page.slug}`),
            description: page.heroSummary,
          },
        })),
        ...(engagements?.offers ?? []).map((offer) => ({
          '@type': 'Offer',
          name: offer.name,
          description: [offer.duration, offer.pricing, offer.description].filter(Boolean).join('. '),
          seller: { '@id': ORG_ID },
        })),
      ],
    },
  }
}

function founder(about?: AboutBlock): Json {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: about?.personName || SITE.founder.name,
    jobTitle: about?.personTitle || SITE.founder.jobTitle,
    worksFor: { '@id': ORG_ID },
    knowsAbout: SITE.knowsAbout,
    ...(about?.linkedinUrl ? { sameAs: [about.linkedinUrl] } : {}),
  }
}

function website(): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: SITE.name,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  }
}

export function homepageJsonLd(homepage: Homepage, services: ServicePage[]): Json {
  const about = homepage.sections?.find((s): s is AboutBlock => s.blockType === 'about')
  const engagements = homepage.sections?.find((s): s is EngagementsBlock => s.blockType === 'engagements')
  const faq = homepage.sections?.find((s): s is FaqBlock => s.blockType === 'faq')
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization(services, about, engagements),
      founder(about),
      website(),
      {
        '@type': 'WebPage',
        '@id': `${absoluteUrl('/')}#webpage`,
        url: absoluteUrl('/'),
        name: homepage.meta?.title || SITE.defaultTitle,
        description: homepage.meta?.description || SITE.description,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORG_ID },
      },
      ...faqPage(absoluteUrl('/'), faq?.faqs),
    ],
  }
}

export function servicePageJsonLd(page: ServicePage): Json {
  const url = absoluteUrl(`/what-we-do/${page.slug}`)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: page.title,
        serviceType: page.navigationLabel,
        description: page.meta?.description || page.heroSummary,
        url,
        provider: { '@id': ORG_ID, '@type': 'ProfessionalService', name: SITE.name, url: absoluteUrl('/') },
        areaServed: { '@type': 'Country', name: 'United States' },
        audience: { '@type': 'BusinessAudience', audienceType: 'Marketing leaders: managers, directors and executives' },
        hasOfferCatalog: page.capabilities?.length
          ? {
              '@type': 'OfferCatalog',
              name: `${page.title} capabilities`,
              itemListElement: page.capabilities.map((c) => ({
                '@type': 'Offer',
                itemOffered: { '@type': 'Service', name: c.title, description: c.body },
              })),
            }
          : undefined,
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: page.meta?.title || page.title,
        description: page.meta?.description || page.heroSummary,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': `${url}#service` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'What we do', item: absoluteUrl('/#services') },
          { '@type': 'ListItem', position: 3, name: page.navigationLabel, item: url },
        ],
      },
      ...faqPage(url, page.faqs),
    ],
  }
}

/** Serialise for a <script type="application/ld+json">, safe against "</script>" in CMS text. */
export const jsonLdString = (data: Json) => JSON.stringify(data).replace(/</g, '\\u003c')
