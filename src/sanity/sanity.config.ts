import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schemas'
import { projectId, dataset, apiVersion } from './env'
import { resolve } from './presentation/resolve'

export default defineConfig({
  name: 'panza-maurer',
  title: 'Panza Maurer',
  basePath: '/studio',

  projectId,
  dataset,
  apiVersion,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Attorneys')
              .schemaType('attorney')
              .child(S.documentTypeList('attorney').title('Attorneys')),
            S.listItem()
              .title('Locations')
              .schemaType('location')
              .child(S.documentTypeList('location').title('Locations')),
            S.listItem()
              .title('News Articles')
              .schemaType('newsArticle')
              .child(S.documentTypeList('newsArticle').title('News Articles')),
            S.listItem()
              .title('Practice Areas')
              .schemaType('practiceArea')
              .child(S.documentTypeList('practiceArea').title('Practice Areas')),
            S.listItem()
              .title('Pages')
              .schemaType('page')
              .child(S.documentTypeList('page').title('Pages')),
            S.divider(),
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
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
})
