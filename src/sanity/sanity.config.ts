import { defineConfig, type DocumentActionComponent } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { markdownSchema } from 'sanity-plugin-markdown'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { schemaTypes } from './schemas'
import { projectId, dataset, apiVersion } from './env'
import { resolve } from './presentation/resolve'
import { SaveSnapshotAction } from './actions/saveSnapshot'
import { SnapshotHistory } from './views/SnapshotHistory'

const SNAPSHOT_TYPES = ['page', 'newsArticle']

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
                  .filter('_id in path("drafts.**") && _type != "contentSnapshot"')
                  .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
              ),
            S.divider(),
            S.listItem()
              .title('Content Snapshots')
              .schemaType('contentSnapshot')
              .child(S.documentTypeList('contentSnapshot').title('Content Snapshots')),
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
    ): DocumentActionComponent[] =>
      SNAPSHOT_TYPES.includes(context.schemaType)
        ? [...prev, SaveSnapshotAction as DocumentActionComponent]
        : prev,
  },
})
