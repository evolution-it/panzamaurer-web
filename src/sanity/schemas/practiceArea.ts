import { defineArrayMember, defineField, defineType } from 'sanity'

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
      name: 'content',
      title: 'Content Paragraphs',
      type: 'array',
      of: [defineArrayMember({ type: 'text' })],
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
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
