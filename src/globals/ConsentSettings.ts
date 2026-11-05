import type { GlobalConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'
import { revalidateConsentSettings } from '@/hooks/revalidateConsent'

/**
 * Everything the cookie banner and Google Consent Mode do, editable without a deploy.
 * Read by the site layout (src/lib/consent-settings.ts); changes go live within seconds.
 */
export const ConsentSettings: GlobalConfig = {
  slug: 'consent-settings',
  label: 'Consent Settings',
  admin: {
    group: 'Privacy',
    description:
      'Controls the cookie banner and how analytics consent works on the site. Every visitor choice is logged in Consent Records.',
  },
  access: {
    read: () => true,
    update: isPayloadAdmin,
  },
  hooks: { afterChange: [revalidateConsentSettings] },
  versions: { max: 25 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Rules',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show the consent banner',
              admin: {
                description:
                  'Turn off only if the site runs no analytics. When off, consent stays at the default below and no banner appears.',
              },
            },
            {
              name: 'mode',
              type: 'radio',
              defaultValue: 'opt-in',
              required: true,
              options: [
                { label: 'Opt-in: analytics off until a visitor allows it (strictest, GDPR-style)', value: 'opt-in' },
                { label: 'Opt-out: analytics on unless a visitor declines (common in the US)', value: 'opt-out' },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'honorGpc',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Honor Global Privacy Control',
                  admin: { description: 'Legally required in California and several other states. Leave on.' },
                },
                {
                  name: 'honorDnt',
                  type: 'checkbox',
                  defaultValue: true,
                  label: 'Honor Do Not Track',
                  admin: { description: 'Older signal. Not legally required, but respectful.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'maxAgeMonths',
                  type: 'number',
                  defaultValue: 12,
                  min: 1,
                  max: 24,
                  required: true,
                  label: 'Ask again after (months)',
                },
                {
                  name: 'policyVersion',
                  type: 'text',
                  defaultValue: '2026-11-05',
                  required: true,
                  label: 'Policy version',
                  admin: {
                    description:
                      'Change this (e.g. to today’s date) when the privacy policy or categories change materially. Every visitor is asked again.',
                  },
                },
              ],
            },
            {
              name: 'marketingEnabled',
              type: 'checkbox',
              defaultValue: false,
              label: 'The site uses marketing or advertising tags',
              admin: {
                description:
                  'Adds a "Marketing" category to the banner (Google ad_storage, ad_user_data, ad_personalization). Leave off unless you add ad pixels such as LinkedIn Insight or Meta. Marketing is always opt-in.',
              },
            },
            {
              name: 'logChoices',
              type: 'checkbox',
              defaultValue: true,
              label: 'Keep a log of consent choices',
              admin: {
                description:
                  'Saves an anonymous record (random ID, choice, time, signal, policy version) in Consent Records. No names, emails or IP addresses.',
              },
            },
          ],
        },
        {
          label: 'Banner text',
          fields: [
            {
              name: 'message',
              type: 'textarea',
              required: true,
              defaultValue:
                'We’d like to use analytics cookies to understand which pages are useful. No advertising, no selling data.',
            },
            {
              name: 'signalMessage',
              type: 'textarea',
              required: true,
              defaultValue:
                'Your browser is sending a {signal} signal, so analytics cookies are off. You can still allow them for this site.',
              admin: { description: 'Shown when a visitor with a privacy signal opens Cookie settings. {signal} is replaced with its name.' },
            },
            {
              type: 'row',
              fields: [
                { name: 'acceptLabel', type: 'text', required: true, defaultValue: 'Allow analytics', admin: { description: 'Becomes “Allow all” when Marketing is on.' } },
                { name: 'declineLabel', type: 'text', required: true, defaultValue: 'No thanks' },
                { name: 'customizeLabel', type: 'text', required: true, defaultValue: 'Choose', admin: { description: 'Only shown with Marketing on.' } },
              ],
            },
            { name: 'policyLinkLabel', type: 'text', required: true, defaultValue: 'Privacy policy' },
          ],
        },
        {
          label: 'Categories',
          fields: [
            {
              name: 'analyticsDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'Google Analytics, to see which pages and content are useful. Reported in aggregate.',
            },
            {
              name: 'marketingDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'Advertising and remarketing tags, to measure and tailor ads on other sites.',
              admin: { condition: (data) => Boolean(data?.marketingEnabled) },
            },
          ],
        },
      ],
    },
  ],
}
