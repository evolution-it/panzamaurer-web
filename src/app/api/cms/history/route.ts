import { NextRequest } from 'next/server'
import { dataset, projectId, apiVersion } from '@/sanity/env'

interface RawMutation {
  create?: { _id: string }
  createOrReplace?: { _id: string }
  patch?: { id: string }
  delete?: { id: string; purge?: boolean }
}

interface RawTransaction {
  id: string
  timestamp: string
  author: string
  mutations: RawMutation[]
  documentIDs: string[]
}

export interface HistoryTransaction {
  id: string
  timestamp: string
  author: string
  type: 'Published' | 'Draft saved' | 'Deleted' | 'Changed'
}

function classifyTransaction(tx: RawTransaction): HistoryTransaction['type'] {
  const { mutations } = tx
  const publishedToNonDraft = mutations.some(
    (m) => m.createOrReplace && !m.createOrReplace._id.startsWith('drafts.'),
  )
  const draftDeleted = mutations.some((m) => m.delete && m.delete.id.startsWith('drafts.'))
  const draftPatched = mutations.some((m) => m.patch && m.patch.id.startsWith('drafts.'))
  const draftCreated = mutations.some((m) => m.create && m.create._id?.startsWith('drafts.'))
  const publishedDeleted = mutations.some(
    (m) => m.delete && !m.delete.id.startsWith('drafts.'),
  )

  if (publishedToNonDraft && draftDeleted) return 'Published'
  if (publishedDeleted) return 'Deleted'
  if (draftPatched || draftCreated) return 'Draft saved'
  return 'Changed'
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const documentId = searchParams.get('documentId')
  const limit = searchParams.get('limit') ?? '60'

  if (!documentId) {
    return Response.json({ error: 'documentId is required' }, { status: 400 })
  }

  const token = process.env.SANITY_API_READ_TOKEN
  if (!token) {
    return Response.json({ error: 'SANITY_API_READ_TOKEN is not configured' }, { status: 500 })
  }

  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/history/${dataset}/transactions/${documentId}?excludeContent=true&limit=${limit}`

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      return Response.json(
        { error: `Sanity History API returned ${res.status}` },
        { status: res.status },
      )
    }

    const text = await res.text()
    const transactions: HistoryTransaction[] = text
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const tx = JSON.parse(line) as RawTransaction
        return {
          id: tx.id,
          timestamp: tx.timestamp,
          author: tx.author,
          type: classifyTransaction(tx),
        }
      })
      .reverse()

    return Response.json({ transactions })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
