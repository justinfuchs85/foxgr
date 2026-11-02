import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

const HOMEPAGE_TAG = 'homepage-content'

// revalidateTag throws outside a Next request (e.g. `pnpm seed`), so swallow that case.
const safeRevalidate = (tag: string) => {
  try {
    revalidateTag(tag, 'max')
  } catch {
    // not running inside Next.js
  }
}

export const revalidateHomepageAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidate(HOMEPAGE_TAG)
  return doc
}

export const revalidateHomepageAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  safeRevalidate(HOMEPAGE_TAG)
  return doc
}

export const revalidateHomepageGlobal: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidate(HOMEPAGE_TAG)
  return doc
}

export { HOMEPAGE_TAG, safeRevalidate }
