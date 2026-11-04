import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'

/**
 * Entry point for the CMS's Preview / Live Preview buttons.
 * Turns on Next draft mode only for a signed-in CMS admin, then sends them to the page.
 *   /next/preview?path=/what-we-do/some-page
 */
export async function GET(request: Request) {
  const url = new URL(request.url)
  const path = url.searchParams.get('path') ?? '/'

  // Same-site paths only: no open redirect.
  if (!path.startsWith('/') || path.startsWith('//')) {
    return new Response('Invalid preview path.', { status: 400 })
  }

  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('Sign in to the CMS (/admin) to preview drafts.', { status: 401 })
  }

  ;(await draftMode()).enable()
  redirect(path)
}
