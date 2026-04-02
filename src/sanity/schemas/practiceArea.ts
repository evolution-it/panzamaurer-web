import { defineArrayMember, defineField, defineType } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export const practiceArea = defineType({
  name: 'practiceArea',
  title: 'Practice Area',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Content Heading',
      description: 'Sub-headline shown above the body text on the practice area page',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'Brief summary displayed below the title on the All Practice Areas page',
      type: 'string',
      initialValue: (doc: { heading?: string }) => doc?.heading ?? '',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'featuredAttorneys',
      title: 'Featured Attorneys',
      description: 'Attorneys highlighted on this practice area page (e.g. Government Relations team)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          weak: true,
          to: [{ type: 'attorney' }],
        }),
      ],
    }),
    orderRankField({ type: 'practiceArea' }),
    defineField({
      name: 'showOnPracticeAreasPage',
      title: 'Show on Practice Areas Page',
      description: 'When enabled, this practice area appears on the /practice-areas listing page.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showInNavDropdown',
      title: 'Show in Navigation Dropdown',
      description: 'When enabled, this practice area appears in the Practice Areas dropdown in the navigation.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status' },
  },
  orderings: [
    orderRankOrdering,
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
