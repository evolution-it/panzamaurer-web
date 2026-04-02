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
  Tab,
  TabList,
  TabPanel,
  Text,
  Badge,
  Dialog,
} from '@sanity/ui'
import { RestoreIcon, WarningOutlineIcon, ClockIcon, TrashIcon, TimelineIcon } from '@sanity/icons'
import { apiVersion, dataset } from '../env'
import { PAGE_SCHEMA_VERSION } from '../schemas/page'
import { NEWS_ARTICLE_SCHEMA_VERSION } from '../schemas/newsArticle'
import type { HistoryTransaction } from '@/app/api/cms/history/route'

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

const TX_TYPE_LABELS: Record<HistoryTransaction['type'], string> = {
  Published: 'Published',
  'Draft saved': 'Draft saved',
  Deleted: 'Deleted',
  Changed: 'Changed',
}

const TX_TYPE_TONES: Record<HistoryTransaction['type'], 'positive' | 'caution' | 'critical' | 'default'> = {
  Published: 'positive',
  'Draft saved': 'default',
  Deleted: 'critical',
  Changed: 'default',
}

export function SnapshotHistory({ documentId, schemaType }: SnapshotHistoryProps) {
  const client = useClient({ apiVersion })
  const schemaTypeName = schemaType.name
  const currentSchemaVersion = CURRENT_SCHEMA_VERSIONS[schemaTypeName]

  // ── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'checkpoints' | 'history'>('checkpoints')

  // ── Published Checkpoints state ────────────────────────────────────────────
  const [snapshots, setSnapshots] = useState<Snapshot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [confirmSnapshotId, setConfirmSnapshotId] = useState<string | null>(null)
  const [restoreError, setRestoreError] = useState<string | null>(null)
  const [restoreSuccess, setRestoreSuccess] = useState<string | null>(null)
  const [deleteSnapshotId, setDeleteSnapshotId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // ── Edit History state ─────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState<HistoryTransaction[]>([])
  const [txLoading, setTxLoading] = useState(false)
  const [txError, setTxError] = useState<string | null>(null)
  const [txLoaded, setTxLoaded] = useState(false)
  const [confirmTxId, setConfirmTxId] = useState<string | null>(null)
  const [restoringTx, setRestoringTx] = useState<string | null>(null)
  const [restoreTxError, setRestoreTxError] = useState<string | null>(null)
  const [restoreTxSuccess, setRestoreTxSuccess] = useState<string | null>(null)

  // ── Fetch: Published Checkpoints ───────────────────────────────────────────
  const fetchSnapshots = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
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
      if (!silent) setLoading(false)
    }
  }, [client, documentId])

  useEffect(() => {
    fetchSnapshots()
  }, [fetchSnapshots])

  // ── Fetch: Edit History ────────────────────────────────────────────────────
  const fetchTransactions = useCallback(async () => {
    setTxLoading(true)
    setTxError(null)
    try {
      const res = await fetch(`/api/cms/history?documentId=${encodeURIComponent(documentId)}`)
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? `Request failed (${res.status})`)
      }
      const data = await res.json() as { transactions: HistoryTransaction[] }
      setTransactions(data.transactions)
      setTxLoaded(true)
    } catch (err) {
      setTxError(err instanceof Error ? err.message : 'Failed to load edit history')
    } finally {
      setTxLoading(false)
    }
  }, [documentId])

  // Lazy-load transactions only when Edit History tab is first opened
  const handleTabChange = useCallback((tab: 'checkpoints' | 'history') => {
    setActiveTab(tab)
    if (tab === 'history' && !txLoaded) {
      fetchTransactions()
    }
  }, [txLoaded, fetchTransactions])

  // ── Restore: Published Checkpoint ──────────────────────────────────────────
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
          `Restored to "${snapshot.label}". Review the changes and publish when ready.`,
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

  // ── Delete: Published Checkpoint ───────────────────────────────────────────
  const handleDelete = useCallback(
    async (snapshot: Snapshot) => {
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

  // ── Restore: Native History transaction ────────────────────────────────────
  const handleRestoreTx = useCallback(
    async (tx: HistoryTransaction) => {
      setRestoringTx(tx.id)
      setRestoreTxError(null)
      setRestoreTxSuccess(null)
      try {
        const result = await client.request<{ documents: Record<string, unknown>[] }>({
          uri: `/data/history/${dataset}/documents/${documentId}?time=${encodeURIComponent(tx.timestamp)}`,
        })
        const docAtTime = result?.documents?.[0]
        if (!docAtTime) throw new Error('No document state found at that timestamp')

        const cleanFields = Object.fromEntries(
          Object.entries(docAtTime).filter(([key]) => !SYSTEM_FIELDS.has(key)),
        )
        await client.patch(documentId).set(cleanFields).commit()
        setRestoreTxSuccess(
          `Restored to state from ${new Date(tx.timestamp).toLocaleString()}. Review and publish when ready.`,
        )
      } catch (err) {
        setRestoreTxError(err instanceof Error ? err.message : 'Restore failed')
      } finally {
        setRestoringTx(null)
        setConfirmTxId(null)
      }
    },
    [client, documentId],
  )

  const confirmSnapshot = snapshots.find((s) => s._id === confirmSnapshotId)
  const deleteSnapshot = snapshots.find((s) => s._id === deleteSnapshotId)
  const confirmTx = transactions.find((t) => t.id === confirmTxId)
  const isBusy = restoring !== null || deleting !== null || restoringTx !== null

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box padding={4}>
      <Stack space={4}>
        {/* Tab bar */}
        <TabList space={2}>
          <Tab
            aria-controls="checkpoints-panel"
            id="checkpoints-tab"
            label="Published Checkpoints"
            onClick={() => handleTabChange('checkpoints')}
            selected={activeTab === 'checkpoints'}
            fontSize={1}
          />
          <Tab
            aria-controls="history-panel"
            id="history-tab"
            label="Edit History"
            onClick={() => handleTabChange('history')}
            selected={activeTab === 'history'}
            fontSize={1}
          />
        </TabList>

        {/* ── Tab 1: Published Checkpoints ─────────────────────────────── */}
        <TabPanel
          aria-labelledby="checkpoints-tab"
          hidden={activeTab !== 'checkpoints'}
          id="checkpoints-panel"
        >
          <Stack space={4}>
            <Flex align="center" justify="space-between">
              <Text size={1} muted>
                {loading
                  ? 'Loading…'
                  : snapshots.length === 0
                    ? 'No snapshots yet. Snapshots are created automatically each time this document is published.'
                    : `${snapshots.length} snapshot${snapshots.length === 1 ? '' : 's'} — saved automatically on each publish`}
              </Text>
              <Button text="Refresh" mode="ghost" fontSize={1} padding={2} onClick={() => fetchSnapshots()} />
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

            {loading ? (
              <Flex padding={4} align="center" justify="center">
                <Spinner muted />
              </Flex>
            ) : error ? (
              <Card padding={3} tone="critical" border radius={2}>
                <Text size={1}>{error}</Text>
              </Card>
            ) : (
              snapshots.length > 0 && (
                <Stack space={0}>
                  {snapshots.map((snapshot, index) => {
                    const isStale =
                      currentSchemaVersion &&
                      snapshot.schemaVersion &&
                      snapshot.schemaVersion !== currentSchemaVersion
                    const isFirst = index === 0
                    const isLast = index === snapshots.length - 1
                    const date = snapshot.createdAt
                      ? new Date(snapshot.createdAt).toLocaleString()
                      : 'Unknown date'

                    return (
                      <Flex key={snapshot._id} gap={3} align="stretch">
                        {/* Timeline spine */}
                        <Flex
                          direction="column"
                          align="center"
                          style={{ width: 24, flexShrink: 0, paddingTop: 12 }}
                        >
                          <Box
                            style={{
                              width: 2,
                              flexShrink: 0,
                              minHeight: 12,
                              visibility: isFirst ? 'hidden' : 'visible',
                              backgroundColor: 'var(--card-border-color)',
                            }}
                          />
                          <Box
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              flexShrink: 0,
                              backgroundColor: isFirst
                                ? 'var(--card-focus-ring-color)'
                                : 'var(--card-border-color)',
                              border: '2px solid var(--card-bg-color)',
                              outline: isFirst ? '2px solid var(--card-focus-ring-color)' : 'none',
                              outlineOffset: 1,
                            }}
                          />
                          <Box
                            style={{
                              width: 2,
                              flex: 1,
                              minHeight: 8,
                              visibility: isLast ? 'hidden' : 'visible',
                              backgroundColor: 'var(--card-border-color)',
                            }}
                          />
                        </Flex>

                        {/* Card */}
                        <Box flex={1} paddingBottom={isLast ? 0 : 2}>
                          <Card padding={3} border radius={2} tone={isFirst ? 'primary' : 'default'}>
                            <Flex align="flex-start" justify="space-between" gap={3}>
                              <Stack space={2} flex={1}>
                                <Flex align="center" gap={2} wrap="wrap">
                                  {isFirst && (
                                    <Badge tone="primary" fontSize={0} padding={2}>Latest</Badge>
                                  )}
                                  {isStale && (
                                    <Badge tone="caution" fontSize={0} padding={2}>
                                      <Flex align="center" gap={1}>
                                        <WarningOutlineIcon />
                                        <span>Schema changed</span>
                                      </Flex>
                                    </Badge>
                                  )}
                                </Flex>
                                <Text size={1} weight="semibold">{snapshot.label}</Text>
                                <Flex align="center" gap={2}>
                                  <ClockIcon style={{ opacity: 0.5 }} />
                                  <Text size={0} muted>{date}</Text>
                                  <Text size={0} muted>·</Text>
                                  <Text size={0} muted>{snapshot.createdBy ?? 'Unknown'}</Text>
                                </Flex>
                                {snapshot.schemaVersion && currentSchemaVersion && (
                                  <Text size={0} muted>
                                    Schema:{' '}
                                    {snapshot.schemaVersion === currentSchemaVersion
                                      ? `v${snapshot.schemaVersion} (current)`
                                      : `v${snapshot.schemaVersion} → current v${currentSchemaVersion}`}
                                  </Text>
                                )}
                              </Stack>
                              <Flex gap={2} align="center">
                                <Button
                                  text={restoring === snapshot._id ? 'Restoring…' : 'Restore'}
                                  icon={RestoreIcon}
                                  tone="caution"
                                  mode="ghost"
                                  fontSize={1}
                                  padding={2}
                                  disabled={isBusy}
                                  loading={restoring === snapshot._id}
                                  onClick={() => setConfirmSnapshotId(snapshot._id)}
                                />
                                <Button
                                  icon={TrashIcon}
                                  tone="critical"
                                  mode="ghost"
                                  fontSize={1}
                                  padding={2}
                                  disabled={isBusy}
                                  loading={deleting === snapshot._id}
                                  onClick={() => setDeleteSnapshotId(snapshot._id)}
                                />
                              </Flex>
                            </Flex>
                          </Card>
                        </Box>
                      </Flex>
                    )
                  })}
                </Stack>
              )
            )}
          </Stack>
        </TabPanel>

        {/* ── Tab 2: Edit History ───────────────────────────────────────── */}
        <TabPanel
          aria-labelledby="history-tab"
          hidden={activeTab !== 'history'}
          id="history-panel"
        >
          <Stack space={4}>
            <Flex align="center" justify="space-between">
              <Text size={1} muted>
                {txLoading
                  ? 'Loading…'
                  : txLoaded
                    ? `${transactions.length} event${transactions.length === 1 ? '' : 's'} from Sanity's native history`
                    : 'Every draft save and publish from Sanity\'s native transaction log.'}
              </Text>
              <Button
                text="Refresh"
                mode="ghost"
                fontSize={1}
                padding={2}
                onClick={fetchTransactions}
                disabled={txLoading}
              />
            </Flex>

            <Card padding={3} tone="caution" border radius={2}>
              <Text size={0} muted>
                History retention: 3 days (Free plan) or 90 days (Growth plan). Restoring from
                Edit History writes the document as a draft — you must publish for changes to go
                live.
              </Text>
            </Card>

            {restoreTxSuccess && (
              <Card padding={3} tone="positive" border radius={2}>
                <Text size={1}>{restoreTxSuccess}</Text>
              </Card>
            )}
            {restoreTxError && (
              <Card padding={3} tone="critical" border radius={2}>
                <Text size={1}>{restoreTxError}</Text>
              </Card>
            )}

            {txLoading ? (
              <Flex padding={4} align="center" justify="center">
                <Spinner muted />
              </Flex>
            ) : txError ? (
              <Card padding={3} tone="critical" border radius={2}>
                <Text size={1}>{txError}</Text>
              </Card>
            ) : transactions.length === 0 && txLoaded ? (
              <Card padding={4} border radius={2}>
                <Text size={1} muted>No history events found for this document.</Text>
              </Card>
            ) : (
              transactions.length > 0 && (
                <Stack space={0}>
                  {transactions.map((tx, index) => {
                    const isFirst = index === 0
                    const isLast = index === transactions.length - 1
                    const tone = TX_TYPE_TONES[tx.type]
                    const date = new Date(tx.timestamp).toLocaleString()

                    return (
                      <Flex key={tx.id} gap={3} align="stretch">
                        {/* Timeline spine */}
                        <Flex
                          direction="column"
                          align="center"
                          style={{ width: 24, flexShrink: 0, paddingTop: 12 }}
                        >
                          <Box
                            style={{
                              width: 2,
                              flexShrink: 0,
                              minHeight: 12,
                              visibility: isFirst ? 'hidden' : 'visible',
                              backgroundColor: 'var(--card-border-color)',
                            }}
                          />
                          <Box
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              flexShrink: 0,
                              backgroundColor: isFirst
                                ? 'var(--card-focus-ring-color)'
                                : 'var(--card-border-color)',
                              border: '2px solid var(--card-bg-color)',
                              outline: isFirst ? '2px solid var(--card-focus-ring-color)' : 'none',
                              outlineOffset: 1,
                            }}
                          />
                          <Box
                            style={{
                              width: 2,
                              flex: 1,
                              minHeight: 8,
                              visibility: isLast ? 'hidden' : 'visible',
                              backgroundColor: 'var(--card-border-color)',
                            }}
                          />
                        </Flex>

                        {/* Card */}
                        <Box flex={1} paddingBottom={isLast ? 0 : 2}>
                          <Card padding={3} border radius={2} tone={isFirst ? 'primary' : 'default'}>
                            <Flex align="flex-start" justify="space-between" gap={3}>
                              <Stack space={2} flex={1}>
                                <Flex align="center" gap={2} wrap="wrap">
                                  {isFirst && (
                                    <Badge tone="primary" fontSize={0} padding={2}>Latest</Badge>
                                  )}
                                  <Badge tone={tone} fontSize={0} padding={2}>
                                    {TX_TYPE_LABELS[tx.type]}
                                  </Badge>
                                </Flex>
                                <Flex align="center" gap={2}>
                                  <TimelineIcon style={{ opacity: 0.5 }} />
                                  <Text size={0} muted>{date}</Text>
                                </Flex>
                              </Stack>
                              {tx.type !== 'Deleted' && (
                                <Button
                                  text={restoringTx === tx.id ? 'Restoring…' : 'Restore'}
                                  icon={RestoreIcon}
                                  tone="caution"
                                  mode="ghost"
                                  fontSize={1}
                                  padding={2}
                                  disabled={isBusy}
                                  loading={restoringTx === tx.id}
                                  onClick={() => setConfirmTxId(tx.id)}
                                />
                              )}
                            </Flex>
                          </Card>
                        </Box>
                      </Flex>
                    )
                  })}
                </Stack>
              )
            )}
          </Stack>
        </TabPanel>
      </Stack>

      {/* ── Dialogs ─────────────────────────────────────────────────────── */}

      {deleteSnapshot && (
        <Dialog
          header="Delete this snapshot?"
          id="delete-confirm-dialog"
          onClose={() => setDeleteSnapshotId(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={1}>
                Permanently delete <strong>&ldquo;{deleteSnapshot.label}&rdquo;</strong>? This
                cannot be undone. The live document will not be affected.
              </Text>
              <Flex gap={2} justify="flex-end">
                <Button text="Cancel" mode="ghost" onClick={() => setDeleteSnapshotId(null)} disabled={deleting !== null} />
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
          header="Restore this snapshot?"
          id="restore-confirm-dialog"
          onClose={() => setConfirmSnapshotId(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={1}>
                This will overwrite the current document with{' '}
                <strong>&ldquo;{confirmSnapshot.label}&rdquo;</strong> and save it as a draft —
                you must publish for changes to go live.
              </Text>
              {confirmSnapshot.schemaVersion !== currentSchemaVersion && (
                <Card padding={3} tone="caution" border radius={2}>
                  <Text size={1}>
                    Schema v<strong>{confirmSnapshot.schemaVersion}</strong> → current v
                    <strong>{currentSchemaVersion}</strong>. Fields added after this snapshot was
                    taken will be cleared.
                  </Text>
                </Card>
              )}
              <Flex gap={2} justify="flex-end">
                <Button text="Cancel" mode="ghost" onClick={() => setConfirmSnapshotId(null)} disabled={restoring !== null} />
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

      {confirmTx && (
        <Dialog
          header="Restore to this point in history?"
          id="restore-tx-confirm-dialog"
          onClose={() => setConfirmTxId(null)}
          zOffset={1000}
          width={1}
        >
          <Box padding={4}>
            <Stack space={4}>
              <Text size={1}>
                This will restore the document to its state on{' '}
                <strong>{new Date(confirmTx.timestamp).toLocaleString()}</strong> (
                {confirmTx.type}) and save it as a draft. You must publish for changes to go live.
              </Text>
              <Flex gap={2} justify="flex-end">
                <Button text="Cancel" mode="ghost" onClick={() => setConfirmTxId(null)} disabled={restoringTx !== null} />
                <Button
                  text={restoringTx === confirmTx.id ? 'Restoring…' : 'Yes, Restore'}
                  tone="caution"
                  loading={restoringTx === confirmTx.id}
                  disabled={restoringTx !== null}
                  onClick={() => handleRestoreTx(confirmTx)}
                />
              </Flex>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Box>
  )
}
