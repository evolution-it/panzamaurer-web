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
import { GlobalSnapshotRestore } from './views/GlobalSnapshotRestore'
import { ContentSnapshotManager } from './views/ContentSnapshotManager'
import { UnpublishedChanges } from './views/UnpublishedChanges'

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
              .child(
                S.documentTypeList('attorney').child((documentId) =>
                  S.document()
                    .documentId(documentId)
                    .schemaType('attorney')
                    .views([
                      S.view.form(),
                      S.view.component(SnapshotHistory).title('Version History').id('version-history'),
                    ]),
                ),
              ),
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
                S.component(UnpublishedChanges)
                  .id('unpublished-changes')
                  .title('Unpublished Changes'),
              ),
            S.divider(),
            S.listItem()
              .title('Developers')
              .id('developers')
              .child(
                S.list()
                  .title('Developers')
                  .items([
                    S.listItem()
                      .title('Global Snapshots')
                      .id('globalSnapshots')
                      .child(
                        S.component(GlobalSnapshotRestore)
                          .id('global-snapshot-restore')
                          .title('Global Snapshots'),
                      ),
                    S.listItem()
                      .title('Content Snapshots')
                      .id('contentSnapshots')
                      .child(
                        S.component(ContentSnapshotManager)
                          .id('content-snapshot-manager')
                          .title('Content Snapshots'),
                      ),
                  ]),
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
