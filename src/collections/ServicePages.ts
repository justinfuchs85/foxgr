import type { CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'
import {
  revalidateServicePageAfterChange,
  revalidateServicePageAfterDelete,
} from '@/hooks/revalidateServicePages'

const previewURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const ServicePages: CollectionConfig = {
  slug: 'service-pages',
  labels: {
    singular: 'What We Do Page',
    plural: 'What We Do Pages',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', '_status'],
    group: 'Website',
    description: 'The detail pages linked from the “What We Do” navigation.',
    // Both go through /next/preview, which checks the CMS sign-in before showing drafts.
    livePreview: {
      url: ({ data }) =>
        `${previewURL}/next/preview?path=${encodeURIComponent(`/what-we-do/${data?.slug ?? ''}`)}`,
    },
    preview: (doc) =>
      doc?.slug
        ? `${previewURL}/next/preview?path=${encodeURIComponent(`/what-we-do/${doc.slug}`)}`
        : null,
  },
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: ({ req }) =>
      req.user?.collection === 'admins' ? true : { _status: { equals: 'published' } },
    update: isPayloadAdmin,
  },
  hooks: {
    afterChange: [revalidateServicePageAfterChange],
    afterDelete: [revalidateServicePageAfterDelete],
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 25,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'slug', useAsSlug: 'title' },
    {
      name: 'navigationLabel',
      type: 'text',
      required: true,
      admin: { description: 'Short label used in the main navigation dropdown.' },
    },
    {
      name: 'eyebrow',
      type: 'text',
      required: true,
    },
    {
      name: 'heroSummary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'problem',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'capabilities',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
      ],
    },
    {
      name: 'approach',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
        {
          name: 'steps',
          type: 'array',
          minRows: 2,
          maxRows: 5,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'outcomes',
      type: 'array',
      minRows: 2,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
        { name: 'buttonLabel', type: 'text', required: true },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show on the homepage',
      admin: { position: 'sidebar', description: 'Unchecked pages stay in the nav but get no homepage card.' },
    },
  ],
}
