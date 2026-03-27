import { defineArrayMember, defineField, defineType } from 'sanity'

export const attorney = defineType({
  name: 'attorney',
  title: 'Attorney',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      description: 'Used for "About [firstName]" heading on profile page',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Attorney Type',
      type: 'string',
      options: {
        list: [
          { title: 'Our Attorneys', value: 'Our Attorneys' },
          { title: 'Of Counsel', value: 'Of Counsel' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Headshot',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Lower numbers appear first within the same type group',
      type: 'number',
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
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
    }),
    defineField({
      name: 'education',
      title: 'Education',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'barAdmissions',
      title: 'Bar Admissions',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'courtAdmissions',
      title: 'Court Admissions',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'professionalMemberships',
      title: 'Professional Memberships',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'sections',
      title: 'Bio Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'bioSection',
          title: 'Section',
          fields: [
            defineField({ name: 'title', title: 'Section Title', type: 'string' }),
            defineField({
              name: 'content',
              title: 'Paragraphs',
              type: 'array',
              of: [defineArrayMember({ type: 'text' })],
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'image' },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
