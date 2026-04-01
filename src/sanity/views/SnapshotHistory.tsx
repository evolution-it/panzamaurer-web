'use client'

import { useState, useEffect, useCallback } from 'react'
import { useClient, type SchemaType, type SanityDocument } from 'sanity'
import {
  Box,
  Button,
  Card,
  Flex,
  Spinner,
  Stack,
  Text,
  Badge,
  Dialog,
} from '@sanity/ui'
import { RestoreIcon, WarningOutlineIcon } from '@sanity/icons'
import { apiVersion } from '../env'
import { PAGE_SCHEMA_VERSION } from '../schemas/page'
import { NEWS_ARTICLE_SCHEMA_VERSION } from '../schemas/newsArticle'

const CURRENT_SCHEMA_VERSIONS: Record<string, string> = {
  page: PAGE_SCHEMA_VERSION,
  newsArticle: NEWS_ARTICLE_SCHEMA_VERSION,
}

const SYSTEM_FIELDS = new Set(['_id', '_type', '_rev', '_createdAt', '_updatedAt'])

interface Snapshot {
  _id: string
  label: string
  createdAt: string
  createdBy: string
  schemaVersion: string
  snapshotData: string
}

/** Props shape passed by Sanity's S.view.component() */
interface SnapshotHistoryProps {
  documentId: string
  schemaType: SchemaType
  document: {
    draft: SanityDocument | null
    displayed: Partial<SanityDocument>
    historical: Partial<SanityDocument> | null
    published: SanityDocument | null
  }
  options: Record<string, unknown>
}

export function SnapshotHistory({ documentId, schemaType }: SnapshotHistoryProps) {
  const client = useClient({ apiVersion })
  const schemaTypeName = schemaType.name
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [confirmSnapshotId, setConfirmSnapshotId] = useState<string | null>(null)
  const [restoreError, setRestoreError] = useState<string | null>(null)
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null)

  const currentSchemaVersion = CURRENT_SCHEMA_VERSIONS[schemaTypeName]

  const fetchSnapshots = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await client.fetch<Snapshot[]>(
        `*[_type == "contentSnapshot" && sourceId == $id] | order(createdAt desc) {
          _id, label, createdAt, createdBy, schemaVersion, snapshotData
        }`,
        { id: documentId },
      )
      setSnapshots(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load snapshots')
    } finally {
      setLoading(false)
    }
  }, [client, documentId])

  useEffect(() => {
    fetchSnapshots()
  }, [fetchSnapshots])

  const handleRestore = useCallback(
    async (snapshot: Snapshot) => {
      setRestoring(snapshot._id)
      setRestoreError(null)
      setRestoreSuccess(null)

      try {
        const fields = JSON.parse(snapshot.snapshotData) as Record<string, unknown>
        const cleanFields = Object.fromEntries(
          Object.entries(fields).filter(([key]) => !SYSTEM_FIELDS.has(key)),
        )

        await client.patch(documentId).set(cleanFields).commit()

        setRestoreSuccess(
          `Restored to "${snapshot.label}". The document has been updated — review the changes and publish when ready.`,
        )
      } catch (err) {
        setRestoreError(err instanceof Error ? err.message : 'Restore failed')
      } finally {
        setRestoring(null)
        setConfirmSnapshotId(null)
      }
    },
    [client, documentId],
  )

  const confirmSnapshot = snapshots.find((s) => s._id === confirmSnapshotId)

  if (loading) {
    return (
      <Flex padding={6} align="center" justify="center">
        <Spinner muted />
      </Flex>
    )
  }

  if (error) {
    return (
      <Box padding={4}>
        <Card padding={3} tone="critical" border radius={2}>
          <Text size={1}>{error}</Text>
        </Card>
      </Box>
    )
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Stack space={2}>
            <Text size={2} weight="semibold">
              Version History
            </Text>
            <Text size={1} muted>
              {snapshots.length === 0
                ? 'No snapshots yet. Use "Save Snapshot" from the action menu (... button).'
                : `${snapshots.length} snapshot${snapshots.length === 1 ? '' : 's'}`}
            </Text>
          </Stack>
          <Button text="Refresh" mode="ghost" fontSize={1} padding={2} onClick={fetchSnapshots} />
        </Flex>

        {restoreSuccess && (
          <Card padding={3} tone="positive" border radius={2}>
            <Text size={1}>{restoreSuccess}</Text>
          </Card>
        )}

        {restoreError && (
          <Card padding={3} tone="critical" border radius={2}>
            <Text size={1}>{restoreError}</Text>
          </Card>
        )}

        {snapshots.map((snapshot) => {
          const isStale =
            currentSchemaVersion &&
            snapshot.schemaVersion &&
            snapshot.schemaVersion !== currentSchemaVersion
          const date = snapshot.createdAt
            ? new Date(snapshot.createdAt).toLocaleString()
            : 'Unknown date'

          return (
            <Card key={snapshot._id} padding={3} border radius={2} tone="default">
              <Flex align="flex-start" justify="space-between" gap={3}>
                <Stack space={2} flex={1}>
                  <Flex align="center" gap={2} wrap="wrap">
                    <Text size={1} weight="semibold">
                      {snapshot.label}
                    </Text>
                    {isStale && (
                      <Badge tone="caution" fontSize={0} padding={2}>
                        <Flex align="center" gap={1}>
                          <WarningOutlineIcon />
                          <span>Schema changed</span>
                        </Flex>
                      </Badge>
                    )}
                  </Flex>
                  <Text size={0} muted>
                    {date} · {snapshot.createdBy ?? 'Unknown'}
                  </Text>
                  {snapshot.schemaVersion && (
                    <Text size={0} muted>
                      Schema: {snapshot.schemaVersion}
                      {currentSchemaVersion && snapshot.schemaVersion === currentSchemaVersion
                        ? ' (current)'
                        : ''}
                    </Text>
                  )}
                </Stack>
                <Button
                  text={restoring === snapshot._id ? 'Restoring…' : 'Restore'}
                  icon={RestoreIcon}
                  tone="caution"
                  mode="ghost"
                  fontSize={1}
                  padding={2}
                  disabled={restoring !== null}
                  loading={restoring === snapshot._id}
                  onClick={() => setConfirmSnapshotId(snapshot._id)}
                />
              </Flex>
            </Card>
          )
        })}
      </Stack>

      {confirmSnapshot && (
        <Dialog
          header="Restore this snapshot?"
          id="restore-confirm-dialog"
          onClose={() => setConfirmSnapshotId(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={1}>
                This will overwrite the current document content with the snapshot{' '}
                <strong>&ldquo;{confirmSnapshot.label}&rdquo;</strong>. The change will be saved as
                a draft — you must publish it for it to go live.
              </Text>
              {confirmSnapshot.schemaVersion !== currentSchemaVersion && (
                <Card padding={3} tone="caution" border radius={2}>
                  <Text size={1}>
                    This snapshot was saved under schema version{' '}
                    <strong>{confirmSnapshot.schemaVersion}</strong>, but the current schema is{' '}
                    <strong>{currentSchemaVersion}</strong>. Fields added after the snapshot was
                    taken will be cleared.
                  </Text>
                </Card>
              )}
              <Flex gap={2} justify="flex-end">
                <Button
                  text="Cancel"
                  mode="ghost"
                  onClick={() => setConfirmSnapshotId(null)}
                  disabled={restoring !== null}
                />
                <Button
                  text={restoring === confirmSnapshot._id ? 'Restoring…' : 'Yes, Restore'}
                  tone="caution"
                  loading={restoring === confirmSnapshot._id}
                  disabled={restoring !== null}
                  onClick={() => handleRestore(confirmSnapshot)}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Box>
  )
}
