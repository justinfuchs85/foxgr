import type { GlobalAfterChangeHook } from 'payload'
import { safeRevalidate } from './revalidateHomepage'

export const CONSENT_SETTINGS_TAG = 'consent-settings'

export const revalidateConsentSettings: GlobalAfterChangeHook = ({ doc }) => {
  safeRevalidate(CONSENT_SETTINGS_TAG)
  return doc
}
