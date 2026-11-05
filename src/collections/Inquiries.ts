import type { CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'

/**
 * Leads from the site's contact form. Created only by /next/inquiry (with overrideAccess),
 * so the public API can neither write nor read them.
 */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'topic', 'status', 'createdAt'],
    description: 'Messages sent through the contact form on the website, newest first.',
  },
  defaultSort: '-createdAt',
  access: {
    create: () => false,
    read: isPayloadAdmin,
    update: isPayloadAdmin,
    delete: isPayloadAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'company', type: 'text' },
        { name: 'role', type: 'text' },
      ],
    },
    { name: 'topic', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
        { label: 'Closed', value: 'closed' },
        { label: 'Spam', value: 'spam' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'page', type: 'text', admin: { position: 'sidebar', readOnly: true, description: 'Page the form was sent from.' } },
    {
      name: 'notified',
      type: 'checkbox',
      admin: { position: 'sidebar', readOnly: true, description: 'An email alert was sent.' },
    },
  ],
}
