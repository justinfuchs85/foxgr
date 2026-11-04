import type { Field } from 'payload'

/** Search and AI-answer metadata. Blank fields fall back to the page title and summary. */
export const seoField: Field = {
  name: 'meta',
  label: 'Search & sharing',
  type: 'group',
  admin: {
    description:
      'How this page appears in Google, AI answers and link previews. Leave blank to use the page title and summary.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      maxLength: 70,
      admin: { description: 'Aim for 50–60 characters, with the main search phrase first.' },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
      admin: { description: 'Aim for 120–160 characters: who it is for and what they get.' },
    },
  ],
}
