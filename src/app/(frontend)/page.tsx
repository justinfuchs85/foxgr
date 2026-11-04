import type { Metadata } from 'next'
import { HomepageView } from './HomepageView'
import { JsonLd } from './JsonLd'
import { getHomepageContent } from '@/lib/homepage-content'
import { getPublishedServicePages } from '@/lib/service-pages'
import { SITE, pageMetadata } from '@/lib/site'
import { homepageJsonLd } from '@/lib/structured-data'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { homepage } = await getHomepageContent()
  const title = homepage.meta?.title || SITE.defaultTitle
  const description = homepage.meta?.description || SITE.description
  return { title: { absolute: title }, ...pageMetadata({ title, description, path: '/' }) }
}

export default async function HomePage() {
  const [content, servicePages] = await Promise.all([getHomepageContent(), getPublishedServicePages()])
  const serverURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return (
    <>
      <JsonLd data={homepageJsonLd(content.homepage, servicePages)} />
      <HomepageView initialContent={content} serverURL={serverURL} />
    </>
  )
}
