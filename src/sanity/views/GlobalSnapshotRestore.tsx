'use client'

import { useState, useEffect, useCallback } from 'react'
import { useClient } from 'sanity'
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
import { RestoreIcon, DatabaseIcon, WarningOutlineIcon, TrashIcon, ResetIcon } from '@sanity/icons'
import { apiVersion } from '../env'
import { batchDelete, batchUnsetField } from '../utils/batchMutate'

const MAX_GLOBAL_SNAPSHOTS = 8
const MAX_CONTENT_SNAPSHOTS_PER_DOC = 20

const SYSTEM_FIELDS = new Set(['_id', '_type', '_rev', '_createdAt', '_updatedAt'])

interface GlobalSnapshot {
  _id: string
  label: string
  createdAt: string
  createdBy: string
  snapshotData: string
}

function getDocumentCount(snapshotData: string): number {
  try {
    const parsed = JSON.parse(snapshotData)
    return Array.isArray(parsed) ? parsed.length : 0
  } catch {
    return 0
  }
}

export function GlobalSnapshotRestore() {
  const client = useClient({ apiVersion })
  const [snapshots, setSnapshots] = useState<GlobalSnapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [confirmSnapshotId, setConfirmSnapshotId] = useState<string | null>(null)
  const [restoreProgress, setRestoreProgress] = useState<string | null>(null)
  const [restoreError, setRestoreError] = useState<string | null>(null)
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null)
  const [deleteSnapshotId, setDeleteSnapshotId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [cleanupConfirmOpen, setCleanupConfirmOpen] = useState(false)
  const [cleaningUp, setCleaningUp] = useState(false)
  const [cleanupProgress, setCleanupProgress] = useState<string | null>(null)
  const [cleanupError, setCleanupError] = useState<string | null>(null)
  const [cleanupSuccess, setCleanupSuccess] = useState<string | null>(null)

  const fetchSnapshots = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const result = await client.fetch<GlobalSnapshot[]>(
        `*[_type == "globalSnapshot"] | order(createdAt desc) {
          _id, label, createdAt, createdBy, snapshotData
        }`,
      )
      setSnapshots(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load global snapshots')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchSnapshots()
  }, [fetchSnapshots])

  const handleRestore = useCallback(
    async (snapshot: GlobalSnapshot) => {
      setRestoring(snapshot._id)
      setRestoreError(null)
      setRestoreSuccess(null)

      try {
        const docs = JSON.parse(snapshot.snapshotData) as Record<string, unknown>[]
        const total = docs.length
        let completed = 0

        setRestoreProgress(`Restoring 0 of ${total} documents…`)

        await Promise.allSettled(
          docs.map(async (doc) => {
            const id = doc._id as string
            if (!id) return

            const cleanFields = Object.fromEntries(
              Object.entries(doc).filter(([key]) => !SYSTEM_FIELDS.has(key)),
            )

            await client.patch(id).set(cleanFields).commit()
            completed += 1
            setRestoreProgress(`Restoring ${completed} of ${total} documents…`)
          }),
        )

        setRestoreProgress(null)
        setRestoreSuccess(
          `Site restored from "${snapshot.label}". All ${total} documents have been updated as drafts — review changes and publish each when ready.`,
        )
      } catch (err) {
        setRestoreProgress(null)
        setRestoreError(err instanceof Error ? err.message : 'Restore failed')
      } finally {
        setRestoring(null)
        setConfirmSnapshotId(null)
      }
    },
    [client],
  )

  const handleDelete = useCallback(
    async (snapshot: GlobalSnapshot) => {
      setDeleting(snapshot._id)
      setDeleteError(null)
      try {
        // Old content snapshots stored strong references (no _weak flag in the data).
        // Unset those references first so Sanity doesn't reject the delete with 409.
        const refs = await client.fetch<{ _id: string }[]>(
          `*[_type == "contentSnapshot" && globalSnapshot._ref == $id]{ _id }`,
          { id: snapshot._id },
        )
        if (refs.length > 0) {
          await batchUnsetField(client, refs.map(({ _id }) => _id), 'globalSnapshot')
        }
        await client.delete(snapshot._id)
        await fetchSnapshots({ silent: true })
      } catch (err) {
        setDeleteError(err instanceof Error ? err.message : 'Delete failed')
      } finally {
        setDeleting(null)
        setDeleteSnapshotId(null)
      }
    },
    [client, fetchSnapshots],
  )

  const handleCleanup = useCallback(async () => {
    setCleaningUp(true)
    setCleanupError(null)
    setCleanupSuccess(null)
    let globalDeleted = 0
    let contentDeleted = 0

    try {
      // 1. Prune global snapshots to MAX_GLOBAL_SNAPSHOTS
      setCleanupProgress('Fetching global snapshots…')
      const allGlobal = await client.fetch<{ _id: string }[]>(
        `*[_type == "globalSnapshot"] | order(createdAt asc) { _id }`,
      )
      if (allGlobal.length > MAX_GLOBAL_SNAPSHOTS) {
        const toDelete = allGlobal.slice(0, allGlobal.length - MAX_GLOBAL_SNAPSHOTS)
        setCleanupProgress(`Removing ${toDelete.length} old global snapshot${toDelete.length === 1 ? '' : 's'}…`)
        for (const { _id } of toDelete) {
          // Unset any strong content snapshot references first to avoid 409
          const refs = await client.fetch<{ _id: string }[]>(
            `*[_type == "contentSnapshot" && globalSnapshot._ref == $id]{ _id }`,
            { id: _id },
          )
          if (refs.length > 0) {
            await batchUnsetField(client, refs.map(({ _id: refId }) => refId), 'globalSnapshot')
          }
          await client.delete(_id)
          globalDeleted += 1
        }
      }

      // 2. Prune content snapshots to MAX_CONTENT_SNAPSHOTS_PER_DOC total (newest kept)
      setCleanupProgress('Fetching content snapshots…')
      const allContent = await client.fetch<{ _id: string }[]>(
        `*[_type == "contentSnapshot"] | order(createdAt asc) { _id }`,
      )

      const contentToDelete =
        allContent.length > MAX_CONTENT_SNAPSHOTS_PER_DOC
          ? allContent.slice(0, allContent.length - MAX_CONTENT_SNAPSHOTS_PER_DOC)
          : []

      if (contentToDelete.length > 0) {
        setCleanupProgress(`Removing ${contentToDelete.length} old content snapshot${contentToDelete.length === 1 ? '' : 's'}…`)
        await batchDelete(client, contentToDelete.map(({ _id }) => _id))
        contentDeleted = contentToDelete.length
      }

      setCleanupProgress(null)
      setCleanupSuccess(
        globalDeleted === 0 && contentDeleted === 0
          ? 'Already within retention limits — nothing to remove.'
          : `Removed ${globalDeleted} global snapshot${globalDeleted === 1 ? '' : 's'} and ${contentDeleted} content snapshot${contentDeleted === 1 ? '' : 's'}.`,
      )
      await fetchSnapshots({ silent: true })
    } catch (err) {
      setCleanupProgress(null)
      setCleanupError(err instanceof Error ? err.message : 'Cleanup failed')
    } finally {
      setCleaningUp(false)
      setCleanupConfirmOpen(false)
    }
  }, [client, fetchSnapshots])

  const confirmSnapshot = snapshots.find((s) => s._id === confirmSnapshotId)
  const deleteSnapshot = snapshots.find((s) => s._id === deleteSnapshotId)

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
      <Stack space={5}>
        <Flex align="flex-start" justify="space-between" gap={3}>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <DatabaseIcon />
              <Text size={2} weight="semibold">
                Global Snapshots
              </Text>
            </Flex>
            <Text size={1} muted>
              Weekly full-site snapshots of all published content, saved every Sunday at 12:01 AM
              UTC. Use these to roll back the entire site to a prior state. Up to 8 weeks are
              retained.
            </Text>
          </Stack>
          <Flex gap={2}>
            <Button
              text="Run Cleanup Now"
              icon={ResetIcon}
              mode="ghost"
              tone="caution"
              fontSize={1}
              padding={2}
              disabled={cleaningUp || restoring !== null || deleting !== null}
              onClick={() => setCleanupConfirmOpen(true)}
            />
            <Button text="Refresh" mode="ghost" fontSize={1} padding={2} onClick={() => fetchSnapshots()} />
          </Flex>
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

        {deleteError && (
          <Card padding={3} tone="critical" border radius={2}>
            <Text size={1}>{deleteError}</Text>
          </Card>
        )}

        {restoreProgress && (
          <Card padding={3} tone="primary" border radius={2}>
            <Flex align="center" gap={3}>
              <Spinner muted />
              <Text size={1}>{restoreProgress}</Text>
            </Flex>
          </Card>
        )}

        {cleanupSuccess && (
          <Card padding={3} tone="positive" border radius={2}>
            <Text size={1}>{cleanupSuccess}</Text>
          </Card>
        )}
        {cleanupError && (
          <Card padding={3} tone="critical" border radius={2}>
            <Text size={1}>{cleanupError}</Text>
          </Card>
        )}
        {cleanupProgress && (
          <Card padding={3} tone="caution" border radius={2}>
            <Flex align="center" gap={3}>
              <Spinner muted />
              <Text size={1}>{cleanupProgress}</Text>
            </Flex>
          </Card>
        )}

        {snapshots.length === 0 ? (
          <Card padding={4} border radius={2} tone="default">
            <Stack space={2}>
              <Text size={1} weight="semibold">
                No global snapshots yet
              </Text>
              <Text size={1} muted>
                The weekly cron job will create the first snapshot next Sunday at 12:01 AM UTC.
              </Text>
            </Stack>
          </Card>
        ) : (
          <Stack space={3}>
            {snapshots.map((snapshot, index) => {
              const isLatest = index === 0
              const docCount = getDocumentCount(snapshot.snapshotData)
              const date = snapshot.createdAt
                ? new Date(snapshot.createdAt).toLocaleString()
                : 'Unknown date'

              return (
                <Card
                  key={snapshot._id}
                  padding={4}
                  border
                  radius={2}
                  tone={isLatest ? 'primary' : 'default'}
                >
                  <Flex align="flex-start" justify="space-between" gap={3}>
                    <Stack space={3} flex={1}>
                      <Flex align="center" gap={2} wrap="wrap">
                        {isLatest && (
                          <Badge tone="primary" fontSize={0} padding={2}>
                            Latest
                          </Badge>
                        )}
                        <Text size={1} weight="semibold">
                          {snapshot.label}
                        </Text>
                      </Flex>
                      <Flex align="center" gap={3} wrap="wrap">
                        <Text size={0} muted>
                          {date}
                        </Text>
                        <Text size={0} muted>·</Text>
                        <Text size={0} muted>
                          {snapshot.createdBy}
                        </Text>
                        <Text size={0} muted>·</Text>
                        <Text size={0} muted>
                          {docCount} document{docCount === 1 ? '' : 's'}
                        </Text>
                      </Flex>
                    </Stack>
                    <Flex gap={2} align="center">
                      <Button
                        text={restoring === snapshot._id ? 'Restoring…' : 'Restore Site'}
                        icon={RestoreIcon}
                        tone="caution"
                        mode="ghost"
                        fontSize={1}
                        padding={2}
                        disabled={restoring !== null || deleting !== null}
                        loading={restoring === snapshot._id}
                        onClick={() => setConfirmSnapshotId(snapshot._id)}
                      />
                      <Button
                        icon={TrashIcon}
                        tone="critical"
                        mode="ghost"
                        fontSize={1}
                        padding={2}
                        disabled={restoring !== null || deleting !== null}
                        loading={deleting === snapshot._id}
                        onClick={() => setDeleteSnapshotId(snapshot._id)}
                      />
                    </Flex>
                  </Flex>
                </Card>
              )
            })}
          </Stack>
        )}
      </Stack>

      {cleanupConfirmOpen && (
        <Dialog
          header="Run cleanup now?"
          id="cleanup-confirm-dialog"
          onClose={() => setCleanupConfirmOpen(false)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={1}>
                This will permanently delete all snapshots beyond the current retention limits:
              </Text>
              <Card padding={3} border radius={2}>
                <Stack space={2}>
                  <Text size={1}>· Global snapshots: keep the {MAX_GLOBAL_SNAPSHOTS} most recent</Text>
                  <Text size={1}>· Content snapshots: keep the {MAX_CONTENT_SNAPSHOTS_PER_DOC} most recent across all documents</Text>
                </Stack>
              </Card>
              <Text size={1} muted>
                This cannot be undone. No live site content will be affected.
              </Text>
              <Flex gap={2} justify="flex-end">
                <Button
                  text="Cancel"
                  mode="ghost"
                  onClick={() => setCleanupConfirmOpen(false)}
                  disabled={cleaningUp}
                />
                <Button
                  text={cleaningUp ? 'Cleaning up…' : 'Yes, Clean Up'}
                  tone="caution"
                  loading={cleaningUp}
                  disabled={cleaningUp}
                  onClick={handleCleanup}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}

      {deleteSnapshot && (
        <Dialog
          header="Delete this snapshot?"
          id="global-delete-confirm-dialog"
          onClose={() => setDeleteSnapshotId(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={1}>
                Permanently delete{' '}
                <strong>&ldquo;{deleteSnapshot.label}&rdquo;</strong>? This cannot be undone. The
                snapshot data will be removed from Sanity — no live site content will be affected.
              </Text>
              <Flex gap={2} justify="flex-end">
                <Button
                  text="Cancel"
                  mode="ghost"
                  onClick={() => setDeleteSnapshotId(null)}
                  disabled={deleting !== null}
                />
                <Button
                  text={deleting === deleteSnapshot._id ? 'Deleting…' : 'Yes, Delete'}
                  tone="critical"
                  loading={deleting === deleteSnapshot._id}
                  disabled={deleting !== null}
                  onClick={() => handleDelete(deleteSnapshot)}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}

      {confirmSnapshot && (
        <Dialog
          header="Restore entire site from this snapshot?"
          id="global-restore-confirm-dialog"
          onClose={() => setConfirmSnapshotId(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Card padding={3} tone="caution" border radius={2}>
                <Flex gap={2} align="flex-start">
                  <WarningOutlineIcon style={{ marginTop: 2, flexShrink: 0 }} />
                  <Stack space={2}>
                    <Text size={1} weight="semibold">
                      This will overwrite all published documents
                    </Text>
                    <Text size={1}>
                      Every document in the snapshot will be written back as a draft. Documents
                      created after this snapshot was taken will not be affected. You must publish
                      each document for changes to go live.
                    </Text>
                  </Stack>
                </Flex>
              </Card>
              <Text size={1}>
                Restoring from:{' '}
                <strong>&ldquo;{confirmSnapshot.label}&rdquo;</strong>
                {' '}({getDocumentCount(confirmSnapshot.snapshotData)} documents)
              </Text>
              <Flex gap={2} justify="flex-end">
                <Button
                  text="Cancel"
                  mode="ghost"
                  onClick={() => setConfirmSnapshotId(null)}
                  disabled={restoring !== null}
                />
                <Button
                  text={restoring === confirmSnapshot._id ? 'Restoring…' : 'Yes, Restore Site'}
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
