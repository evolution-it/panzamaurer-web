import { NextRequest } from 'next/server'
import { getWriteClient } from '@/sanity/client'

const MAX_GLOBAL_SNAPSHOTS = 8

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const writeClient = getWriteClient()
  const now = new Date().toISOString()
  const label = `Weekly: ${new Date(now).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`

  try {
    const allPublished = await writeClient.fetch<Record<string, unknown>[]>(
      `*[!(_id in path("drafts.**")) && _type != "contentSnapshot" && _type != "globalSnapshot"]`,
    )

    await writeClient.create({
      _type: 'globalSnapshot',
      label,
      createdAt: now,
      createdBy: 'Scheduled (weekly cron)',
      snapshotData: JSON.stringify(allPublished),
    })

    // Fetch all snapshots oldest-first so we can slice from the front to delete
    const allSnapshots = await writeClient.fetch<{ _id: string }[]>(
      `*[_type == "globalSnapshot"] | order(createdAt asc) { _id }`,
    )

    let deleted = 0
    if (allSnapshots.length > MAX_GLOBAL_SNAPSHOTS) {
      const toDelete = allSnapshots.slice(0, allSnapshots.length - MAX_GLOBAL_SNAPSHOTS)
      await Promise.all(toDelete.map(({ _id }) => writeClient.delete(_id)))
      deleted = toDelete.length
    }

    return Response.json({
      success: true,
      label,
      documentCount: allPublished.length,
      totalSnapshots: Math.min(allSnapshots.length, MAX_GLOBAL_SNAPSHOTS),
      deleted,
    })
  } catch (err) {
    console.error('[GlobalSnapshotCron] Failed:', err)
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
