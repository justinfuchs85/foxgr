import type { CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'
import {
  revalidateHomepageAfterChange,
  revalidateHomepageAfterDelete,
} from '@/hooks/revalidateHomepage'

export const Insights: CollectionConfig = {
  slug: 'insights',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'readingTime', 'order'],
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
    { name: 'excerpt', type: 'textarea', required: true },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'readingTime',
      type: 'text',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
