import { defineArrayMember, defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'footerLocations',
      title: 'Footer Locations',
      description: 'Locations shown in the footer (in display order)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'location' }],
        }),
      ],
    }),
    defineField({
      name: 'navItems',
      title: 'Navigation Items',
      description: 'Ordered list of links in the top navigation bar',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({
              name: 'path',
              title: 'Path',
              type: 'string',
              description: 'e.g. /attorneys or /practice-areas/government-relations',
            }),
            defineField({
              name: 'hasDropdown',
              title: 'Has Dropdown',
              description: 'When enabled this link shows the Practice Areas sub-menu',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'path', dropdown: 'hasDropdown' },
            prepare({ title, subtitle, dropdown }) {
              return { title, subtitle: dropdown ? `${subtitle} ▾ (dropdown)` : subtitle }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'siteName' },
  },
})
