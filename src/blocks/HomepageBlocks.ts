import type { Block, Field } from 'payload'

const sectionOptions = (): Field[] => [
  {
    name: 'spacing',
    type: 'select',
    defaultValue: 'standard',
    admin: {
      description: 'Controls the vertical breathing room around this section.',
    },
    options: [
      { label: 'Compact', value: 'compact' },
      { label: 'Standard', value: 'standard' },
      { label: 'Generous', value: 'generous' },
    ],
  },
]

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'accent',
      type: 'text',
      required: true,
      admin: { description: 'The italic coral line beneath the main heading.' },
    },
    { name: 'body', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'buttonLabel', type: 'text', required: true },
        { name: 'buttonHref', type: 'text', required: true },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      maxRows: 4,
      minRows: 2,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const IntroBlock: Block = {
  slug: 'intro',
  labels: { singular: 'Introduction', plural: 'Introductions' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'heading', type: 'textarea', required: true },
    {
      name: 'columns',
      type: 'array',
      maxRows: 3,
      minRows: 1,
      fields: [{ name: 'body', type: 'textarea', required: true }],
    },
    {
      name: 'characterImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional transparent character illustration.' },
    },
    { name: 'characterTitle', type: 'text' },
    { name: 'characterCaption', type: 'text' },
    ...sectionOptions(),
  ],
}

export const ImageBreakBlock: Block = {
  slug: 'imageBreak',
  labels: { singular: 'Image Break', plural: 'Image Breaks' },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    { name: 'label', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'overlay',
      type: 'select',
      defaultValue: 'navy',
      options: [
        { label: 'Navy gradient', value: 'navy' },
        { label: 'No overlay', value: 'none' },
      ],
    },
  ],
}

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: 'Services List', plural: 'Services Lists' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'navy',
      options: [
        { label: 'Navy', value: 'navy' },
        { label: 'Warm paper', value: 'paper' },
      ],
    },
    ...sectionOptions(),
  ],
}

export const CaseStudiesBlock: Block = {
  slug: 'caseStudies',
  labels: { singular: 'Case Studies', plural: 'Case Studies' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 2,
      min: 1,
      max: 6,
      admin: { position: 'sidebar' },
    },
    ...sectionOptions(),
  ],
}

export const TestimonialBlock: Block = {
  slug: 'testimonial',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  fields: [
    {
      name: 'testimonial',
      type: 'relationship',
      relationTo: 'testimonials',
      required: true,
    },
    { name: 'label', type: 'text', required: true },
    {
      name: 'theme',
      type: 'select',
      defaultValue: 'coral',
      options: [
        { label: 'Coral', value: 'coral' },
        { label: 'Pale blue', value: 'blue' },
      ],
    },
    ...sectionOptions(),
  ],
}

export const InsightsBlock: Block = {
  slug: 'insights',
  labels: { singular: 'Insights List', plural: 'Insights Lists' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'heading', type: 'text', required: true },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 3,
      min: 1,
      max: 6,
      admin: { position: 'sidebar' },
    },
    ...sectionOptions(),
  ],
}

export const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'heading', type: 'textarea', required: true },
    { name: 'body', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'buttonLabel', type: 'text', required: true },
        { name: 'buttonHref', type: 'text', required: true },
      ],
    },
    ...sectionOptions(),
  ],
}

export const homepageBlocks = [
  HeroBlock,
  IntroBlock,
  ImageBreakBlock,
  ServicesBlock,
  CaseStudiesBlock,
  TestimonialBlock,
  InsightsBlock,
  CtaBlock,
]
