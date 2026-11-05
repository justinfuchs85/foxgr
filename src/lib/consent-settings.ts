import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { CONSENT_SETTINGS_TAG } from '@/hooks/revalidateConsent'
import type { ConsentConfig, ConsentCopy } from '@/lib/consent'

export const DEFAULT_CONFIG: ConsentConfig = {
  enabled: true,
  mode: 'opt-in',
  honorGpc: true,
  honorDnt: true,
  maxAgeDays: 365,
  version: '2026-11-05',
  marketing: false,
  log: true,
}

export const DEFAULT_COPY: ConsentCopy = {
  message: 'We’d like to use analytics cookies to understand which pages are useful. No advertising, no selling data.',
  signalMessage: 'Your browser is sending a {signal} signal, so analytics cookies are off. You can still allow them for this site.',
  acceptLabel: 'Allow analytics',
  declineLabel: 'No thanks',
  customizeLabel: 'Choose',
  policyLinkLabel: 'Privacy policy',
  analyticsDescription: 'Google Analytics, to see which pages and content are useful. Reported in aggregate.',
  marketingDescription: 'Advertising and remarketing tags, to measure and tailor ads on other sites.',
}

/** Consent Settings from the CMS, with safe defaults if the database is unavailable. */
export const getConsentSettings = unstable_cache(
  async (): Promise<{ config: ConsentConfig; copy: ConsentCopy }> => {
    try {
      const payload = await getPayloadClient()
      const s = await payload.findGlobal({ slug: 'consent-settings', depth: 0, overrideAccess: false })
      return {
        config: {
          enabled: s.enabled ?? DEFAULT_CONFIG.enabled,
          mode: s.mode === 'opt-out' ? 'opt-out' : 'opt-in',
          honorGpc: s.honorGpc ?? true,
          honorDnt: s.honorDnt ?? true,
          maxAgeDays: Math.round((s.maxAgeMonths ?? 12) * 30.4),
          version: s.policyVersion || DEFAULT_CONFIG.version,
          marketing: Boolean(s.marketingEnabled),
          log: s.logChoices ?? true,
        },
        copy: {
          message: s.message || DEFAULT_COPY.message,
          signalMessage: s.signalMessage || DEFAULT_COPY.signalMessage,
          acceptLabel: s.acceptLabel || DEFAULT_COPY.acceptLabel,
          declineLabel: s.declineLabel || DEFAULT_COPY.declineLabel,
          customizeLabel: s.customizeLabel || DEFAULT_COPY.customizeLabel,
          policyLinkLabel: s.policyLinkLabel || DEFAULT_COPY.policyLinkLabel,
          analyticsDescription: s.analyticsDescription || DEFAULT_COPY.analyticsDescription,
          marketingDescription: s.marketingDescription || DEFAULT_COPY.marketingDescription,
        },
      }
    } catch {
      return { config: DEFAULT_CONFIG, copy: DEFAULT_COPY }
    }
  },
  ['consent-settings-v1'],
  { tags: [CONSENT_SETTINGS_TAG] },
)
