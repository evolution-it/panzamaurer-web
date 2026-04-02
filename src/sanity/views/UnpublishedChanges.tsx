'use client'

import { useState, useEffect, useCallback } from 'react'
import { useClient } from 'sanity'
import { IntentLink } from 'sanity/router'
import {
  Box,
  Button,
  Card,
  Flex,
  Spinner,
  Stack,
  Text,
  Badge,
} from '@sanity/ui'
import { EditIcon, PublishIcon } from '@sanity/icons'
import { apiVersion } from '../env'

const EXCLUDED_TYPES = ['contentSnapshot', 'globalSnapshot']

interface DraftDoc {
  _id: string        // raw draft id: "drafts.<realId>"
  _type: string
  _updatedAt: string
  title?: string
  name?: string
}

const TYPE_LABELS: Record<string, string> = {
  page: 'Page',
  newsArticle: 'News Article',
  attorney: 'Attorney',
  practiceArea: 'Practice Area',
  location: 'Location',
  siteSettings: 'Site Settings',
}

function getLabel(doc: DraftDoc): string {
  return doc.title ?? doc.name ?? doc._id.replace(/^drafts\./, '')
}

function getRealId(draftId: string): string {
  return draftId.replace(/^drafts\./, '')
}

export function UnpublishedChanges() {
  const client = useClient({ apiVersion })
  const [drafts, setDrafts] = useState<DraftDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDrafts = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setError(null)
    try {
      // Query the raw dataset so draft IDs are returned as-is (drafts.xxx).
      // S.documentList() applies a 'published' perspective which strips the
      // drafts prefix before the filter runs, causing _id path matches to fail.
      const result = await client.fetch<DraftDoc[]>(
        `*[_id in path("drafts.**") && !(_type in $excluded) && !(_type match "sanity.*")] | order(_updatedAt desc) {
          _id, _type, _updatedAt, title, name
        }`,
        { excluded: EXCLUDED_TYPES },
      )
      setDrafts(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load unpublished changes')
    } finally {
      if (!silent) setLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchDrafts()
  }, [fetchDrafts])

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
              <EditIcon />
              <Text size={2} weight="semibold">
                Unpublished Changes
              </Text>
            </Flex>
            <Text size={1} muted>
              {drafts.length === 0
                ? 'No unpublished changes — all documents are up to date.'
                : `${drafts.length} document${drafts.length === 1 ? '' : 's'} with unpublished changes.`}
            </Text>
          </Stack>
          <Button
            text="Refresh"
            mode="ghost"
            fontSize={1}
            padding={2}
            onClick={() => fetchDrafts()}
          />
        </Flex>

        {drafts.length > 0 && (
          <Stack space={2}>
            {drafts.map((doc) => {
              const realId = getRealId(doc._id)
              const label = getLabel(doc)
              const typeLabel = TYPE_LABELS[doc._type] ?? doc._type
              const updatedAt = doc._updatedAt
                ? new Date(doc._updatedAt).toLocaleString()
                : ''

              return (
                <Card key={doc._id} padding={3} border radius={2} tone="caution">
                  <Flex align="center" justify="space-between" gap={3}>
                    <Stack space={2} flex={1}>
                      <Flex align="center" gap={2} wrap="wrap">
                        <Badge tone="caution" fontSize={0} padding={2}>
                          {typeLabel}
                        </Badge>
                        <Text size={1} weight="semibold">
                          {label}
                        </Text>
                      </Flex>
                      {updatedAt && (
                        <Text size={0} muted>
                          Last edited: {updatedAt}
                        </Text>
                      )}
                    </Stack>
                    <IntentLink
                      intent="edit"
                      params={{ id: realId, type: doc._type }}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button
                        text="Open & Publish"
                        icon={PublishIcon}
                        tone="primary"
                        mode="ghost"
                        fontSize={1}
                        padding={2}
                        as="span"
                      />
                    </IntentLink>
                  </Flex>
                </Card>
              )
            })}
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
