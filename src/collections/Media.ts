import type { CollectionConfig } from 'payload'
import { createFolderField, createTagField } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'
import {
  revalidateHomepageAfterChange,
  revalidateHomepageAfterDelete,
} from '@/hooks/revalidateHomepage'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isPayloadAdmin,
    update: isPayloadAdmin,
    delete: isPayloadAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  hooks: {
    afterChange: [revalidateHomepageAfterChange],
    afterDelete: [revalidateHomepageAfterDelete],
  },
  upload: {
    mimeTypes: ['image/*'],
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=3600')
      return headers
    },
  },
}
