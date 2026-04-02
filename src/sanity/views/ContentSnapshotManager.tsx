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
import { DocumentIcon, WarningOutlineIcon, TrashIcon, ResetIcon, RestoreIcon } from '@sanity/icons'
import { apiVersion } from '../env'
import { batchDelete } from '../utils/batchMutate'

const MAX_CONTENT_SNAPSHOTS_TOTAL = 20

const SYSTEM_FIELDS = new Set(['_id', '_type', '_rev', '_createdAt', '_updatedAt'])

interface ContentSnapshot {
  _id: string
  label: string
  sourceId: string
  sourceType: string
  sourceTitle: string
  schemaVersion: string
  createdAt: string
  createdBy: string
  snapshotData: string
}

interface SnapshotGroup {
  sourceId: string
  sourceType: string
  sourceTitle: string
  snapshots: ContentSnapshot[]
}

export function ContentSnapshotManager() {
  const client = useClient({ apiVersion })
  const [groups, setGroups] = useState<SnapshotGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Restore state
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [restoreError, setRestoreError] = useState<string | null>(null)
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null)

  // Delete state
  const [deleteSnapshotId, setDeleteSnapshotId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Cleanup state
  const [cleanupConfirmOpen, setCleanupConfirmOpen] = useState(false)
  const [cleaningUp, setCleaningUp] = useState(false)
  const [cleanupProgress, setCleanupProgress] = useState<string | null>(null)
  const [cleanupError, setCleanupError] = useState<string | null>(null)
  const [cleanupSuccess, setCleanupSuccess] = useState<string | null>(null)

  const isBusy = restoring !== null || deleting !== null || cleaningUp

  const fetchSnapshots = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      const result = await client.fetch<ContentSnapshot[]>(
        `*[_type == "contentSnapshot"] | order(createdAt desc) {
          _id, label, sourceId, sourceType, sourceTitle, schemaVersion, createdAt, createdBy, snapshotData
        }`,
      )

      const map = new Map<string, SnapshotGroup>()
      for (const snap of result) {
        if (!map.has(snap.sourceId)) {
          map.set(snap.sourceId, {
            sourceId: snap.sourceId,
            sourceType: snap.sourceType,
            sourceTitle: snap.sourceTitle,
            snapshots: [],
          })
        }
        map.get(snap.sourceId)!.snapshots.push(snap)
      }

      setGroups(Array.from(map.values()))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content snapshots')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchSnapshots()
  }, [fetchSnapshots])

  const handleRestore = useCallback(
    async (snapshot: ContentSnapshot) => {
      setRestoring(snapshot._id)
      setRestoreError(null)
      setRestoreSuccess(null)
      try {
        const fields = JSON.parse(snapshot.snapshotData) as Record<string, unknown>
        const cleanFields = Object.fromEntries(
          Object.entries(fields).filter(([key]) => !SYSTEM_FIELDS.has(key)),
        )
        await client.patch(snapshot.sourceId).set(cleanFields).commit()
        setRestoreSuccess(
          `Restored "${snapshot.sourceTitle}" to "${snapshot.label}". Review changes and publish when ready.`,
        )
      } catch (err) {
        setRestoreError(err instanceof Error ? err.message : 'Restore failed')
      } finally {
        setRestoring(null)
        setConfirmRestoreId(null)
      }
    },
    [client],
  )

  const handleDelete = useCallback(
    async (snapshot: ContentSnapshot) => {
      setDeleting(snapshot._id)
      setDeleteError(null)
      try {
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
    let contentDeleted = 0

    try {
      setCleanupProgress('Fetching content snapshots…')
      const all = await client.fetch<{ _id: string }[]>(
        `*[_type == "contentSnapshot"] | order(createdAt asc) { _id }`,
      )

      const toDelete =
        all.length > MAX_CONTENT_SNAPSHOTS_TOTAL
          ? all.slice(0, all.length - MAX_CONTENT_SNAPSHOTS_TOTAL)
          : []

      if (toDelete.length > 0) {
        setCleanupProgress(`Removing ${toDelete.length} old content snapshot${toDelete.length === 1 ? '' : 's'}…`)
        await batchDelete(client, toDelete.map(({ _id }) => _id))
        contentDeleted = toDelete.length
      }

      setCleanupProgress(null)
      setCleanupSuccess(
        contentDeleted === 0
          ? 'Already within retention limits — nothing to remove.'
          : `Removed ${contentDeleted} content snapshot${contentDeleted === 1 ? '' : 's'}.`,
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

  const totalCount = groups.reduce((n, g) => n + g.snapshots.length, 0)

  const allSnapshots = groups.flatMap((g) => g.snapshots)
  const pendingRestore = confirmRestoreId ? allSnapshots.find((s) => s._id === confirmRestoreId) ?? null : null
  const pendingDelete = deleteSnapshotId ? allSnapshots.find((s) => s._id === deleteSnapshotId) ?? null : null

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
        {/* Header */}
        <Flex align="flex-start" justify="space-between" gap={3}>
          <Stack space={3}>
            <Flex align="center" gap={2}>
              <DocumentIcon />
              <Text size={2} weight="semibold">
                Content Snapshots
              </Text>
            </Flex>
            <Text size={1} muted>
              Per-document snapshots saved automatically each time an item is published. The{' '}
              {MAX_CONTENT_SNAPSHOTS_TOTAL} most recent snapshots across all documents are kept.{' '}
              {totalCount > 0 && `${totalCount} total across ${groups.length} document${groups.length === 1 ? '' : 's'}.`}
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
              disabled={isBusy}
              onClick={() => setCleanupConfirmOpen(true)}
            />
            <Button
              text="Refresh"
              mode="ghost"
              fontSize={1}
              padding={2}
              disabled={isBusy}
              onClick={() => fetchSnapshots()}
            />
          </Flex>
        </Flex>

        {/* Status banners */}
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

        {/* Snapshot groups */}
        {groups.length === 0 ? (
          <Card padding={4} border radius={2} tone="default">
            <Stack space={2}>
              <Text size={1} weight="semibold">
                No content snapshots yet
              </Text>
              <Text size={1} muted>
                Snapshots are created automatically whenever a document is published.
              </Text>
            </Stack>
          </Card>
        ) : (
          <Stack space={4}>
            {groups.map((group) => (
              <Stack key={group.sourceId} space={2}>
                {/* Group header */}
                <Flex align="center" gap={2}>
                  <Badge tone="default" fontSize={0} padding={2}>
                    {group.sourceType}
                  </Badge>
                  <Text size={1} weight="semibold">
                    {group.sourceTitle || group.sourceId}
                  </Text>
                  <Text size={0} muted>
                    ({group.snapshots.length} snapshot{group.snapshots.length === 1 ? '' : 's'})
                  </Text>
                </Flex>

                {/* Snapshot rows */}
                {group.snapshots.map((snap, index) => {
                  const isLatest = index === 0
                  const date = snap.createdAt
                    ? new Date(snap.createdAt).toLocaleString()
                    : 'Unknown date'

                  return (
                    <Card
                      key={snap._id}
                      padding={3}
                      border
                      radius={2}
                      tone={isLatest ? 'primary' : 'default'}
                    >
                      <Flex align="center" justify="space-between" gap={3}>
                        <Stack space={2} flex={1}>
                          <Flex align="center" gap={2} wrap="wrap">
                            {isLatest && (
                              <Badge tone="primary" fontSize={0} padding={1}>
                                Latest
                              </Badge>
                            )}
                            <Text size={1}>{snap.label}</Text>
                          </Flex>
                          <Flex align="center" gap={3} wrap="wrap">
                            <Text size={0} muted>{date}</Text>
                            {snap.createdBy && (
                              <>
                                <Text size={0} muted>·</Text>
                                <Text size={0} muted>{snap.createdBy}</Text>
                              </>
                            )}
                            {snap.schemaVersion && (
                              <>
                                <Text size={0} muted>·</Text>
                                <Text size={0} muted>schema v{snap.schemaVersion}</Text>
                              </>
                            )}
                          </Flex>
                        </Stack>
                        <Flex gap={2} align="center">
                          <Button
                            text={restoring === snap._id ? 'Restoring…' : 'Restore'}
                            icon={RestoreIcon}
                            tone="caution"
                            mode="ghost"
                            fontSize={1}
                            padding={2}
                            disabled={isBusy}
                            loading={restoring === snap._id}
                            onClick={() => setConfirmRestoreId(snap._id)}
                          />
                          <Button
                            icon={TrashIcon}
                            tone="critical"
                            mode="ghost"
                            fontSize={1}
                            padding={2}
                            disabled={isBusy}
                            loading={deleting === snap._id}
                            onClick={() => setDeleteSnapshotId(snap._id)}
                          />
                        </Flex>
                      </Flex>
                    </Card>
                  )
                })}
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>

      {/* Restore confirmation dialog */}
      {pendingRestore && (
        <Dialog
          header="Restore this snapshot?"
          id="content-restore-confirm-dialog"
          onClose={() => setConfirmRestoreId(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Card padding={3} tone="caution" border radius={2}>
                <Flex gap={2} align="flex-start">
                  <WarningOutlineIcon style={{ marginTop: 2, flexShrink: 0 }} />
                  <Text size={1}>
                    This will overwrite the current <strong>{pendingRestore.sourceTitle}</strong>{' '}
                    document with the state from{' '}
                    <strong>&ldquo;{pendingRestore.label}&rdquo;</strong> and save it as a draft.
                    You must publish for changes to go live.
                  </Text>
                </Flex>
              </Card>
              <Flex gap={2} justify="flex-end">
                <Button
                  text="Cancel"
                  mode="ghost"
                  onClick={() => setConfirmRestoreId(null)}
                  disabled={restoring !== null}
                />
                <Button
                  text={restoring === pendingRestore._id ? 'Restoring…' : 'Yes, Restore'}
                  tone="caution"
                  loading={restoring === pendingRestore._id}
                  disabled={restoring !== null}
                  onClick={() => handleRestore(pendingRestore)}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}

      {/* Cleanup confirmation dialog */}
      {cleanupConfirmOpen && (
        <Dialog
          header="Run cleanup now?"
          id="content-cleanup-confirm-dialog"
          onClose={() => setCleanupConfirmOpen(false)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={1}>
                This will permanently delete all content snapshots beyond the retention limit:
              </Text>
              <Card padding={3} border radius={2}>
                <Text size={1}>
                  · Content snapshots: keep the {MAX_CONTENT_SNAPSHOTS_TOTAL} most recent across all documents
                </Text>
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

      {/* Delete confirmation dialog */}
      {pendingDelete && (
        <Dialog
          header="Delete this snapshot?"
          id="content-delete-confirm-dialog"
          onClose={() => setDeleteSnapshotId(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Flex gap={2} align="flex-start">
                <WarningOutlineIcon style={{ marginTop: 2, flexShrink: 0 }} />
                <Text size={1}>
                  Permanently delete <strong>&ldquo;{pendingDelete.label}&rdquo;</strong>? This
                  cannot be undone. No live site content will be affected.
                </Text>
              </Flex>
              <Flex gap={2} justify="flex-end">
                <Button
                  text="Cancel"
                  mode="ghost"
                  onClick={() => setDeleteSnapshotId(null)}
                  disabled={deleting !== null}
                />
                <Button
                  text={deleting === pendingDelete._id ? 'Deleting…' : 'Yes, Delete'}
                  tone="critical"
                  loading={deleting === pendingDelete._id}
                  disabled={deleting !== null}
                  onClick={() => handleDelete(pendingDelete)}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Box>
  )
}
