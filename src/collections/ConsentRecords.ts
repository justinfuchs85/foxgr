import type { CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'

/**
 * Anonymous log of consent choices, written by /next/consent. Proof of what a browser
 * agreed to and when. No personal data: the ID is random and lives only in that browser.
 */
export const ConsentRecords: CollectionConfig = {
  slug: 'consent-records',
  labels: { singular: 'Consent Record', plural: 'Consent Records' },
  admin: {
    group: 'Privacy',
    useAsTitle: 'consentId',
    defaultColumns: ['createdAt', 'analytics', 'marketing', 'source', 'signal', 'policyVersion'],
    description:
      'Every choice made in the cookie banner, plus changes caused by browser privacy signals. Records are anonymous and read-only.',
  },
  defaultSort: '-createdAt',
  access: {
    create: () => false,
    read: isPayloadAdmin,
    update: () => false,
    delete: isPayloadAdmin,
  },
  fields: [
    { name: 'consentId', type: 'text', required: true, index: true, admin: { readOnly: true } },
    {
      type: 'row',
      fields: [
        {
          name: 'analytics',
          type: 'select',
          required: true,
          options: ['granted', 'denied'],
          admin: { readOnly: true },
        },
        {
          name: 'marketing',
          type: 'select',
          options: ['granted', 'denied', 'n/a'],
          defaultValue: 'n/a',
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          type: 'select',
          required: true,
          options: [
            { label: 'Banner choice', value: 'banner' },
            { label: 'Browser signal', value: 'browser_signal' },
          ],
          admin: { readOnly: true },
        },
        {
          name: 'signal',
          type: 'select',
          defaultValue: 'none',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Global Privacy Control', value: 'gpc' },
            { label: 'Do Not Track', value: 'dnt' },
          ],
          admin: { readOnly: true },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'mode', type: 'text', admin: { readOnly: true } },
        { name: 'policyVersion', type: 'text', admin: { readOnly: true } },
      ],
    },
    { name: 'page', type: 'text', admin: { readOnly: true } },
    { name: 'browser', type: 'text', admin: { readOnly: true, description: 'Browser family only, e.g. "Chrome on macOS".' } },
  ],
}
