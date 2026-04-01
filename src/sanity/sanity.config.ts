import { defineConfig, type DocumentActionComponent } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { markdownSchema } from 'sanity-plugin-markdown'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { schemaTypes } from './schemas'
import { projectId, dataset, apiVersion } from './env'
import { resolve } from './presentation/resolve'
import { createAutoPublishSnapshotAction } from './actions/autoPublishSnapshotAction'
import { SnapshotHistory } from './views/SnapshotHistory'

const SNAPSHOT_EXCLUDED_TYPES = ['contentSnapshot', 'globalSnapshot']

export default defineConfig({
  name: 'panza-maurer',
  title: 'Panza Maurer',
  basePath: '/studio',

  projectId,
  dataset,
  apiVersion,

  plugins: [
    markdownSchema(),
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document().schemaType('siteSettings').documentId('siteSettings'),
              ),
            S.divider(),
            S.listItem()
              .title('Pages')
              .schemaType('page')
              .child(
                S.documentTypeList('page').child((documentId) =>
                  S.document()
                    .documentId(documentId)
                    .schemaType('page')
                    .views([
                      S.view.form(),
                      S.view.component(SnapshotHistory).title('Version History').id('version-history'),
                    ]),
                ),
              ),
            S.divider(),
            S.listItem()
              .title('News Articles')
              .schemaType('newsArticle')
              .child(
                S.documentTypeList('newsArticle').child((documentId) =>
                  S.document()
                    .documentId(documentId)
                    .schemaType('newsArticle')
                    .views([
                      S.view.form(),
                      S.view.component(SnapshotHistory).title('Version History').id('version-history'),
                    ]),
                ),
              ),
            S.listItem()
              .title('Attorneys')
              .schemaType('attorney')
              .child(S.documentTypeList('attorney').title('Attorneys')),
            orderableDocumentListDeskItem({ type: 'practiceArea', title: 'Practice Areas', S, context }),
            S.listItem()
              .title('Locations')
              .schemaType('location')
              .child(S.documentTypeList('location').title('Locations')),
            S.divider(),
            S.listItem()
              .title('Unpublished Changes')
              .id('unpublishedChanges')
              .child(
                S.documentList()
                  .title('Unpublished Changes')
                  .filter('_id in path("drafts.**") && _type != "contentSnapshot" && _type != "globalSnapshot"')
                  .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
              ),
            S.divider(),
            S.listItem()
              .title('Global Snapshots')
              .schemaType('globalSnapshot')
              .child(
                S.documentTypeList('globalSnapshot')
                  .title('Global Snapshots')
                  .defaultOrdering([{ field: 'createdAt', direction: 'desc' }]),
              ),
            S.listItem()
              .title('Content Snapshots')
              .schemaType('contentSnapshot')
              .child(
                S.documentTypeList('contentSnapshot')
                  .title('Content Snapshots')
                  .defaultOrdering([{ field: 'createdAt', direction: 'desc' }]),
              ),
          ]),
    }),
    presentationTool({
      resolve,
      previewUrl: {
        draftMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (
      prev: DocumentActionComponent[],
      context: { schemaType: string },
    ): DocumentActionComponent[] => {
      if (SNAPSHOT_EXCLUDED_TYPES.includes(context.schemaType)) return prev
      return prev.map((action) =>
        (action as DocumentActionComponent & { action?: string }).action === 'publish'
          ? createAutoPublishSnapshotAction(action)
          : action,
      )
    },
  },
})
