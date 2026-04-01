import { NextRequest } from 'next/server'
import { client, getWriteClient } from '@/sanity/client'
import { PAGE_SCHEMA_VERSION } from '@/sanity/schemas/page'
import { NEWS_ARTICLE_SCHEMA_VERSION } from '@/sanity/schemas/newsArticle'

const SCHEMA_VERSIONS: Record<string, string> = {
  page: PAGE_SCHEMA_VERSION,
  newsArticle: NEWS_ARTICLE_SCHEMA_VERSION,
}

const SYSTEM_FIELDS = new Set(['_id', '_type', '_rev', '_createdAt', '_updatedAt'])

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')
  if (!secret || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { documentId?: string; label?: string } = {}
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { documentId, label } = body
  if (!documentId || !label) {
    return Response.json({ error: 'documentId and label are required' }, { status: 400 })
  }

  const sourceDoc = await client.getDocument(documentId)
  if (!sourceDoc) {
    return Response.json({ error: `Document not found: ${documentId}` }, { status: 404 })
  }

  const fields = Object.fromEntries(
    Object.entries(sourceDoc).filter(([key]) => !SYSTEM_FIELDS.has(key)),
  )

  const sourceTitle =
    (sourceDoc.title as string | undefined) ??
    (sourceDoc.name as string | undefined) ??
    documentId

  const snapshot = await getWriteClient().create({
    _type: 'contentSnapshot',
    label,
    sourceId: documentId,
    sourceType: sourceDoc._type,
    sourceTitle,
    schemaVersion: SCHEMA_VERSIONS[sourceDoc._type] ?? 'unknown',
    snapshotData: JSON.stringify(fields),
    createdAt: new Date().toISOString(),
    createdBy: 'API',
  })

  return Response.json({ snapshotId: snapshot._id })
}
