'use client'

import { useState, useCallback } from 'react'
import { useClient, useCurrentUser, DocumentActionProps, DocumentActionDescription } from 'sanity'
import { Box, Button, Card, Stack, Text, TextInput } from '@sanity/ui'
import { ClockIcon } from '@sanity/icons'
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

export function SaveSnapshotAction(props: DocumentActionProps): DocumentActionDescription {
  const { id, type, published } = props
  const client = useClient({ apiVersion })
  const currentUser = useCurrentUser()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpen = useCallback(() => {
    setLabel('')
    setError(null)
    setDialogOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setDialogOpen(false)
    setError(null)
  }, [])

  const handleSave = useCallback(async () => {
    if (!label.trim()) return
    if (!published) {
      setError('This document has no published version to snapshot. Publish it first.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const fields = stripSystemFields(published as Record<string, unknown>)
      const sourceTitle =
        (published as Record<string, unknown>).title as string | undefined ??
        (published as Record<string, unknown>).name as string | undefined ??
        id

      await client.create({
        _type: 'contentSnapshot',
        label: label.trim(),
        sourceId: id,
        sourceType: type,
        sourceTitle: sourceTitle ?? id,
        schemaVersion: SCHEMA_VERSIONS[type] ?? 'unknown',
        snapshotData: JSON.stringify(fields),
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.name ?? currentUser?.email ?? 'Unknown',
      })

      setDialogOpen(false)
      setLabel('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save snapshot')
    } finally {
      setSaving(false)
    }
  }, [client, currentUser, id, label, published, type])

  return {
    label: 'Save Snapshot',
    icon: ClockIcon,
    onHandle: handleOpen,
    dialog: dialogOpen
      ? {
          type: 'dialog',
          header: 'Save Content Snapshot',
          onClose: handleClose,
          content: (
            <Box padding={4}>
              <Stack space={4}>
                <Text size={1} muted>
                  A snapshot stores a copy of the currently published content so you can restore it
                  later. You must publish the document before saving a snapshot.
                </Text>
                <Stack space={2}>
                  <Text size={1} weight="semibold">
                    Snapshot label
                  </Text>
                  <TextInput
                    value={label}
                    onChange={(e) => setLabel(e.currentTarget.value)}
                    placeholder="e.g. Pre-redesign backup, June 2025 launch"
                    disabled={saving}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave()
                    }}
                  />
                </Stack>
                {error && (
                  <Card padding={3} tone="critical" border radius={2}>
                    <Text size={1}>{error}</Text>
                  </Card>
                )}
                <Button
                  text={saving ? 'Saving…' : 'Save Snapshot'}
                  tone="primary"
                  disabled={!label.trim() || saving}
                  onClick={handleSave}
                  loading={saving}
                />
              </Stack>
            </Box>
          ),
        }
      : undefined,
  }
}
