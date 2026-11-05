import type { Field } from 'payload'

/** Question-and-answer pairs. Shown as an accordion and marked up as FAQPage for search and AI answers. */
export const faqItemsField = (description?: string): Field => ({
  name: 'faqs',
  label: 'FAQs',
  type: 'array',
  maxRows: 10,
  labels: { singular: 'Question', plural: 'Questions' },
  admin: {
    description:
      description ??
      'Real questions prospects ask, answered in two to four plain sentences. These are what AI assistants and search results quote most.',
    initCollapsed: true,
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
  ],
})
