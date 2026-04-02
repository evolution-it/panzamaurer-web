'use client'

import { useCallback } from 'react'
import {
  useClient,
  useCurrentUser,
  type DocumentActionComponent,
  type DocumentActionProps,
} from 'sanity'
import { apiVersion } from '../env'
import { PAGE_SCHEMA_VERSION } from '../schemas/page'
import { NEWS_ARTICLE_SCHEMA_VERSION } from '../schemas/newsArticle'
import { batchDelete } from '../utils/batchMutate'

const SCHEMA_VERSIONS: Record<string, string> = {
  page: PAGE_SCHEMA_VERSION,
  newsArticle: NEWS_ARTICLE_SCHEMA_VERSION,
}

const MAX_CONTENT_SNAPSHOTS_TOTAL = 20

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
 * Wraps Sanity's default PublishAction so that every publish automatically
 * creates a contentSnapshot for the specific document being published.
 *
 * Global snapshots are created separately by the weekly cron job, not here.
 * Snapshot creation is fire-and-forget — errors are logged silently so a
 * snapshot failure never blocks or reverts the publish.
 */
export function createAutoPublishSnapshotAction(
  OriginalAction: DocumentActionComponent,
): DocumentActionComponent {
  return function AutoPublishSnapshotAction(
    props: DocumentActionProps,
  ): ReturnType<DocumentActionComponent> {
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
        // Prune oldest snapshots globally before creating the new one so the
        // total never exceeds MAX_CONTENT_SNAPSHOTS_TOTAL. Query oldest-first.
        const existing = await client.fetch<{ _id: string }[]>(
          `*[_type == "contentSnapshot"] | order(createdAt asc) { _id }`,
        )
        if (existing.length >= MAX_CONTENT_SNAPSHOTS_TOTAL) {
          const toDelete = existing.slice(0, existing.length - MAX_CONTENT_SNAPSHOTS_TOTAL + 1)
          await batchDelete(client, toDelete.map(({ _id }) => _id))
        }

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
        })
      } catch (err) {
        // Never block the publish — log silently
        console.error('[AutoPublishSnapshotAction] Snapshot creation failed:', err)
      }
    }, [client, currentUser, props])

    const wrappedOnHandle = useCallback(() => {
      // Fire snapshot creation without awaiting so publish is never delayed
      createSnapshots()
      original?.onHandle?.()
    }, [createSnapshots, original])

    if (!original) return original

    return {
      ...original,
      onHandle: wrappedOnHandle,
    }
  }
}
