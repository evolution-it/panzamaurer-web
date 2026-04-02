import { defineArrayMember, defineField, defineType } from 'sanity'

export const NEWS_ARTICLE_SCHEMA_VERSION = 'newsArticle-v1'

export const newsArticle = defineType({
  name: 'newsArticle',
  title: 'News Article',
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
      options: { source: 'title', maxLength: 120 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Publication Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: 'Short summary shown on listing cards',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Article Body',
      description: 'Rich markdown editor — supports headings, bold, italic, lists, and links',
      type: 'markdown',
    }),
    defineField({
      name: 'images',
      title: 'Article Images',
      description: 'Images displayed within the article body',
      type: 'array',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true } })],
    }),
    defineField({
      name: 'listingImages',
      title: 'Listing / Thumbnail Image',
      description: 'Image shown on the news listing card',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
          { title: 'Deleted', value: 'deleted' },
        ],
        layout: 'radio',
      },
      initialValue: 'published',
      description:
        'Archived articles appear on /news/archive only. Deleted articles are hidden from all public pages.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'date', media: 'listingImages' },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
})
