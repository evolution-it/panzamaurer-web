import { defineArrayMember, defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      description: 'Used as the HTML <title> tag',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'navigationLabel',
      title: 'Navigation Label',
      description: 'Label shown in the nav bar (leave blank to use the title)',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      description: 'e.g. "about" or "contact" (no leading slash); use "home" for the homepage',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      description: 'Used as the meta description tag',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'navigationOrder',
      title: 'Navigation Order',
      description: 'Position in the nav bar (lower = earlier)',
      type: 'number',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      description: 'Add, remove, and reorder the content sections that appear on this page',
      type: 'array',
      of: [
        // ── Hero Banner ──────────────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'heroSection',
          title: 'Hero Banner',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({
              name: 'boldPrefix',
              title: 'Bold Prefix',
              description: 'Optional bold text shown before the subtitle (e.g. "For more than five decades,")',
              type: 'string',
            }),
            defineField({ name: 'subtitle', title: 'Subtitle / Body', type: 'text', rows: 2 }),
            defineField({ name: 'ctaLabel', title: 'Button Label', type: 'string' }),
            defineField({ name: 'ctaHref', title: 'Button URL', type: 'string' }),
            defineField({
              name: 'videos',
              title: 'Background Videos',
              description: 'Upload .mp4 files to cycle as the hero background. Falls back to built-in videos if empty.',
              type: 'array',
              of: [defineArrayMember({ type: 'file', options: { accept: 'video/mp4,video/quicktime' } })],
            }),
          ],
          preview: {
            select: { heading: 'heading', subtitle: 'subtitle' },
            prepare({ heading, subtitle }) {
              return { title: heading || 'Hero Banner', subtitle }
            },
          },
        }),

        // ── About / Intro ────────────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'aboutSection',
          title: 'About / Intro',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'About Our Firm' }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'quote', title: 'Mission Statement / Quote', type: 'text', rows: 3 }),
            defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 6 }),
          ],
          preview: {
            select: { heading: 'heading' },
            prepare({ heading }) {
              return { title: heading || 'About Section' }
            },
          },
        }),

        // ── CTA / Get in Touch ───────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'ctaSection',
          title: 'Call to Action',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string', initialValue: 'Get in Touch' }),
            defineField({ name: 'subtitle', title: 'Subtitle (large)', type: 'text', rows: 2 }),
            defineField({ name: 'body', title: 'Body Text', type: 'text', rows: 3 }),
            defineField({ name: 'ctaLabel', title: 'Button Label', type: 'string', initialValue: 'Meet Our Team' }),
            defineField({ name: 'ctaHref', title: 'Button URL', type: 'string', initialValue: '/attorneys' }),
          ],
          preview: {
            select: { heading: 'heading', subtitle: 'subtitle' },
            prepare({ heading, subtitle }) {
              return { title: heading || 'CTA Section', subtitle }
            },
          },
        }),

        // ── Text Block ───────────────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'textSection',
          title: 'Text Block',
          fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'body', title: 'Body', type: 'text', rows: 5 }),
          ],
          preview: {
            select: { heading: 'heading', body: 'body' },
            prepare({ heading, body }) {
              return { title: heading || 'Text Block', subtitle: body }
            },
          },
        }),

        // ── Team / Attorneys ─────────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'teamSection',
          title: 'Team / Attorneys',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              initialValue: 'Our Team',
            }),
            defineField({
              name: 'attorneys',
              title: 'Attorneys',
              description: 'Pick and order the attorneys to display in this section',
              type: 'array',
              of: [defineArrayMember({ type: 'reference', weak: true, to: [{ type: 'attorney' }] })],
            }),
          ],
          preview: {
            select: { heading: 'heading', attorneys: 'attorneys' },
            prepare({ heading, attorneys }) {
              return {
                title: heading || 'Team Section',
                subtitle: `${(attorneys ?? []).length} attorney(s)`,
              }
            },
          },
        }),

        // ── Locations ────────────────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'locationsSection',
          title: 'Locations',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              initialValue: 'Our Locations',
            }),
            defineField({
              name: 'locations',
              title: 'Office Locations',
              description: 'Pick and order the offices to display in this section',
              type: 'array',
              of: [defineArrayMember({ type: 'reference', weak: true, to: [{ type: 'location' }] })],
            }),
          ],
          preview: {
            select: { heading: 'heading', locations: 'locations' },
            prepare({ heading, locations }) {
              return {
                title: heading || 'Locations Section',
                subtitle: `${(locations ?? []).length} location(s)`,
              }
            },
          },
        }),

        // ── Practice Areas ───────────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'practiceAreasSection',
          title: 'Practice Areas',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              initialValue: 'Practice Areas',
            }),
            defineField({
              name: 'practiceAreas',
              title: 'Practice Areas',
              description: 'Pick and order the practice areas to display in this section',
              type: 'array',
              of: [defineArrayMember({ type: 'reference', weak: true, to: [{ type: 'practiceArea' }] })],
            }),
          ],
          preview: {
            select: { heading: 'heading', practiceAreas: 'practiceAreas' },
            prepare({ heading, practiceAreas }) {
              return {
                title: heading || 'Practice Areas Section',
                subtitle: `${(practiceAreas ?? []).length} area(s)`,
              }
            },
          },
        }),

        // ── News / Articles ──────────────────────────────────────────────────
        defineArrayMember({
          type: 'object',
          name: 'newsSection',
          title: 'News / Articles',
          fields: [
            defineField({
              name: 'heading',
              title: 'Section Heading',
              type: 'string',
              initialValue: 'Latest News',
            }),
            defineField({
              name: 'articleCount',
              title: 'Number of Articles to Show',
              type: 'number',
              initialValue: 3,
              validation: (Rule) => Rule.min(1).max(20).integer(),
            }),
          ],
          preview: {
            select: { heading: 'heading', articleCount: 'articleCount' },
            prepare({ heading, articleCount }) {
              return {
                title: heading || 'News Section',
                subtitle: `Show ${articleCount ?? 3} article(s)`,
              }
            },
          },
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
      description: 'Archived pages return 404 and are removed from navigation',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
})
