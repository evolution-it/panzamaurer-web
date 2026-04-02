import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'
import { client, getWriteClient } from '@/sanity/client'

const SYSTEM_FIELDS = new Set(['_id', '_type', '_rev', '_createdAt', '_updatedAt'])

function revalidateForType(type: string) {
  switch (type) {
    case 'page':
      revalidateTag('pages')
      revalidatePath('/', 'layout')
      break
    case 'newsArticle':
      revalidateTag('news')
      revalidatePath('/news', 'layout')
      revalidatePath('/', 'layout')
      break
    case 'attorney':
      revalidateTag('attorneys')
      revalidatePath('/attorneys', 'layout')
      break
    case 'practiceArea':
      revalidateTag('practiceAreas')
      revalidatePath('/practice-areas', 'layout')
      break
    case 'location':
      revalidateTag('locations')
      revalidatePath('/locations', 'page')
      break
  }
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-webhook-secret')
  if (!secret || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { snapshotId?: string } = {}
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { snapshotId } = body
  if (!snapshotId) {
    return Response.json({ error: 'snapshotId is required' }, { status: 400 })
  }

  const snapshot = await client.getDocument(snapshotId)
  if (!snapshot || snapshot._type !== 'contentSnapshot') {
    return Response.json({ error: `Snapshot not found: ${snapshotId}` }, { status: 404 })
  }

  const { sourceId, sourceType, snapshotData } = snapshot as unknown as {
    sourceId: string
    sourceType: string
    snapshotData: string
  }

  let fields: Record<string, unknown>
  try {
    fields = JSON.parse(snapshotData) as Record<string, unknown>
  } catch {
    return Response.json({ error: 'Snapshot data is not valid JSON' }, { status: 422 })
  }

  const cleanFields = Object.fromEntries(
    Object.entries(fields).filter(([key]) => !SYSTEM_FIELDS.has(key)),
  )

  await getWriteClient().patch(sourceId).set(cleanFields).commit()

  revalidateForType(sourceType)

  return Response.json({ restoredTo: sourceId, sourceType })
}
