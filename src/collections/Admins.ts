import type { CollectionConfig } from 'payload'
import { isPayloadAdmin } from '@/access/isPayloadAdmin'

// In Figma Make, admins signed in through Figma SSO. Here it's standard
// email/password auth: the first visit to /admin prompts you to create the
// first admin, after which only signed-in admins can add more.
export const Admins: CollectionConfig = {
  slug: 'admins',
  access: {
    create: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: isPayloadAdmin,
    update: isPayloadAdmin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [],
}
