import type { CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'
import {
  revalidateHomepageAfterChange,
  revalidateHomepageAfterDelete,
} from '@/hooks/revalidateHomepage'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'attribution',
    defaultColumns: ['attribution', 'role', 'order'],
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
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text', required: true },
    { name: 'role', type: 'text', required: true },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
