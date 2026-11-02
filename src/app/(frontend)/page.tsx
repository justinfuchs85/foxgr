import { HomepageView } from './HomepageView'
import { getHomepageContent } from '@/lib/homepage-content'

export const revalidate = 3600

export default async function HomePage() {
  const content = await getHomepageContent()
  const serverURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  return <HomepageView initialContent={content} serverURL={serverURL} />
}
