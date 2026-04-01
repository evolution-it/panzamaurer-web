import { defineField, defineType } from 'sanity'
import { DatabaseIcon } from '@sanity/icons'

export const globalSnapshot = defineType({
  name: 'globalSnapshot',
  title: 'Global Snapshot',
  type: 'document',
  icon: DatabaseIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      readOnly: true,
      description: 'Auto-generated label describing what triggered this snapshot',
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
      name: 'triggerDocumentId',
      title: 'Trigger Document ID',
      type: 'string',
      readOnly: true,
      description: 'ID of the document whose publish triggered this snapshot',
    }),
    defineField({
      name: 'triggerDocumentType',
      title: 'Trigger Document Type',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'triggerDocumentTitle',
      title: 'Trigger Document Title',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'snapshotData',
      title: 'Snapshot Data (JSON)',
      type: 'text',
      readOnly: true,
      description:
        'Full JSON array of all published CMS documents at the time of this snapshot.',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      triggerType: 'triggerDocumentType',
      triggerTitle: 'triggerDocumentTitle',
      createdAt: 'createdAt',
    },
    prepare({ title, triggerType, triggerTitle, createdAt }) {
      const date = createdAt ? new Date(createdAt).toLocaleString() : ''
      return {
        title: title ?? 'Global Snapshot',
        subtitle: `${triggerType ?? ''}: ${triggerTitle ?? ''} — ${date}`,
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
