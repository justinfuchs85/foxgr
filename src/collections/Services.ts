import type { CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'
import {
  revalidateHomepageAfterChange,
  revalidateHomepageAfterDelete,
} from '@/hooks/revalidateHomepage'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eyebrow', 'order'],
    group: 'Website',
  },
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: () => true,
    update: isPayloadAdmin,
  },
  hooks: {
    afterChange: [revalidateHomepageAfterChange],
    afterDelete: [revalidateHomepageAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true },
    {
      name: 'capabilities',
      type: 'array',
      minRows: 1,
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
