import type { GlobalConfig } from 'payload'
import { seoField } from '@/fields/seo'
import { homepageBlocks } from '@/blocks/HomepageBlocks'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'
import { revalidateHomepageGlobal } from '@/hooks/revalidateHomepage'

const previewURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Builder',
  admin: {
    group: 'Website',
    description:
      'Add, remove, reorder, and configure homepage sections. Open Live Preview to see edits as you work.',
    livePreview: {
      url: () => previewURL,
    },
    preview: () => previewURL,
  },
  access: {
    read: () => true,
    update: isPayloadAdmin,
  },
  hooks: {
    afterChange: [revalidateHomepageGlobal],
  },
  versions: {
    max: 25,
  },
  fields: [
    {
      name: 'sections',
      type: 'blocks',
      blocks: homepageBlocks,
      minRows: 1,
      required: true,
      admin: {
        description:
          'Drag sections to reorder them. Each section exposes only design-safe layout options.',
      },
    },
    seoField,
  ],
}
