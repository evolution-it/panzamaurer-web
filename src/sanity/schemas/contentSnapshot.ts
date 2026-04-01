import { defineField, defineType } from 'sanity'
import { ClockIcon } from '@sanity/icons'

export const contentSnapshot = defineType({
  name: 'contentSnapshot',
  title: 'Content Snapshot',
  type: 'document',
  icon: ClockIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'A human-readable name for this snapshot, e.g. "Pre-redesign backup"',
    }),
    defineField({
      name: 'sourceId',
      title: 'Source Document ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'sourceType',
      title: 'Source Document Type',
      type: 'string',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'sourceTitle',
      title: 'Source Document Title',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'schemaVersion',
      title: 'Schema Version',
      type: 'string',
      readOnly: true,
      description:
        'Records the schema version at the time this snapshot was taken. If the schema has since changed, this snapshot may be missing newer fields.',
    }),
    defineField({
      name: 'snapshotData',
      title: 'Snapshot Data (JSON)',
      type: 'text',
      readOnly: true,
      description: 'Full serialized content of the source document at the time of the snapshot.',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'createdBy',
      title: 'Created By',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'globalSnapshot',
      title: 'Global Snapshot',
      description: 'The full-site snapshot taken at the same time as this item snapshot.',
      type: 'reference',
      weak: true,
      to: [{ type: 'globalSnapshot' }],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'label',
      sourceTitle: 'sourceTitle',
      sourceType: 'sourceType',
      createdAt: 'createdAt',
    },
    prepare({ title, sourceTitle, sourceType, createdAt }) {
      const date = createdAt ? new Date(createdAt).toLocaleDateString() : ''
      return {
        title,
        subtitle: `${sourceType ?? ''}: ${sourceTitle ?? ''} — ${date}`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
})
