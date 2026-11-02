import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { HOMEPAGE_TAG, safeRevalidate } from '@/hooks/revalidateHomepage'

export const SERVICE_PAGES_TAG = 'service-pages'

const detailTag = (slug?: string | null) => (slug ? `service-page:${slug}` : null)

export const revalidateServicePageAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
}) => {
  safeRevalidate(SERVICE_PAGES_TAG)
  safeRevalidate(HOMEPAGE_TAG)

  const currentTag = detailTag(doc.slug)
  const previousTag = detailTag(previousDoc?.slug)

  if (currentTag) safeRevalidate(currentTag)
  if (previousTag && previousTag !== currentTag) safeRevalidate(previousTag)

  return doc
}

export const revalidateServicePageAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  safeRevalidate(SERVICE_PAGES_TAG)
  safeRevalidate(HOMEPAGE_TAG)

  const deletedTag = detailTag(doc.slug)
  if (deletedTag) safeRevalidate(deletedTag)

  return doc
}
