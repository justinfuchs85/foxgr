import type { CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'
import {
  revalidateHomepageAfterChange,
  revalidateHomepageAfterDelete,
} from '@/hooks/revalidateHomepage'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'category', 'order'],
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
    { name: 'client', type: 'text', required: true },
    { name: 'category', type: 'text', required: true },
    { name: 'result', type: 'textarea', required: true },
    {
      name: 'artifact',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'A real project screenshot, deliverable, or working artifact.',
      },
    },
    {
      name: 'artifactCaption',
      type: 'text',
    },
    {
      name: 'methodology',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'detail', type: 'text', required: true },
      ],
    },
    {
      name: 'metric',
      type: 'group',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
