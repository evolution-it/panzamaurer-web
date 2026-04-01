'use client'

import { useCallback } from 'react'
import {
  useClient,
  useCurrentUser,
  type DocumentActionComponent,
  type DocumentActionProps,
  type DocumentActionDescription,
} from 'sanity'
import { apiVersion } from '../env'
import { PAGE_SCHEMA_VERSION } from '../schemas/page'
import { NEWS_ARTICLE_SCHEMA_VERSION } from '../schemas/newsArticle'

const SCHEMA_VERSIONS: Record<string, string> = {
  page: PAGE_SCHEMA_VERSION,
  newsArticle: NEWS_ARTICLE_SCHEMA_VERSION,
}

const SYSTEM_FIELDS = new Set(['_id', '_type', '_rev', '_createdAt', '_updatedAt'])

function stripSystemFields(doc: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(doc).filter(([key]) => !SYSTEM_FIELDS.has(key)))
}

function getSourceTitle(doc: Record<string, unknown>, fallbackId: string): string {
  return (
    (doc.title as string | undefined) ??
    (doc.name as string | undefined) ??
    fallbackId
  )
}

/**
 * Wraps Sanity's default PublishAction so that every publish automatically:
 *  1. Creates a globalSnapshot (full JSON of all published docs + the item being published)
 *  2. Creates a contentSnapshot for the specific document, linked to the globalSnapshot
 *
 * Snapshot creation is fire-and-forget — errors are logged silently so a
 * snapshot failure never blocks or reverts the publish.
 */
export function createAutoPublishSnapshotAction(
  OriginalAction: DocumentActionComponent,
): DocumentActionComponent {
  return function AutoPublishSnapshotAction(
    props: DocumentActionProps,
  ): DocumentActionDescription {
    const original = OriginalAction(props)
    const client = useClient({ apiVersion })
    const currentUser = useCurrentUser()

    const createSnapshots = useCallback(async () => {
      const { id, type, draft, published } = props

      // Use draft if available (what's about to be published), otherwise fall back to published
      const docToSnapshot = (draft ?? published) as Record<string, unknown> | null
      if (!docToSnapshot) return

      const sourceTitle = getSourceTitle(docToSnapshot, id)
      const now = new Date().toISOString()
      const author = currentUser?.name ?? currentUser?.email ?? 'Unknown'
      const label = `Auto: ${sourceTitle} published on ${new Date(now).toLocaleDateString()}`

      try {
        // Fetch all currently published docs (excluding snapshots themselves)
        const allPublished = await client.fetch<Record<string, unknown>[]>(
          `*[!(_id in path("drafts.**")) && _type != "contentSnapshot" && _type != "globalSnapshot"]`,
        )

        // Build the global snapshot data: all published docs, with the item being
        // published replacing its current published version (or added if new)
        const otherDocs = allPublished.filter((d) => d._id !== id)
        const combinedDocs = [...otherDocs, { ...docToSnapshot, _id: id, _type: type }]

        // 1. Create the global snapshot
        const globalSnap = await client.create({
          _type: 'globalSnapshot',
          label,
          createdAt: now,
          createdBy: author,
          triggerDocumentId: id,
          triggerDocumentType: type,
          triggerDocumentTitle: sourceTitle,
          snapshotData: JSON.stringify(combinedDocs),
        })

        // 2. Create the per-document content snapshot linked to the global snapshot
        await client.create({
          _type: 'contentSnapshot',
          label,
          sourceId: id,
          sourceType: type,
          sourceTitle,
          schemaVersion: SCHEMA_VERSIONS[type] ?? 'unknown',
          snapshotData: JSON.stringify(stripSystemFields(docToSnapshot)),
          createdAt: now,
          createdBy: author,
          globalSnapshot: { _type: 'reference', _ref: globalSnap._id },
        })
      } catch (err) {
        // Never block the publish — log silently
        console.error('[AutoPublishSnapshotAction] Snapshot creation failed:', err)
      }
    }, [client, currentUser, props])

    const wrappedOnHandle = useCallback(() => {
      // Fire snapshot creation without awaiting so publish is never delayed
      createSnapshots()
      original.onHandle?.()
    }, [createSnapshots, original])

    if (!original) return original

    return {
      ...original,
      onHandle: wrappedOnHandle,
    }
  }
}
