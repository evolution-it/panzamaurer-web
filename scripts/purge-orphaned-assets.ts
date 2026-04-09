import { createClient } from '@sanity/client'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

// Finds every image asset that no other document references
const ORPHAN_QUERY = `*[_type == "sanity.imageAsset" && count(*[references(^._id)]) == 0]{ _id, originalFilename, size }`

async function main() {
  const dryRun = process.argv.includes('--dry-run')

  console.log('Fetching orphaned image assets...')
  const orphans = await client.fetch<{ _id: string; originalFilename?: string; size?: number }[]>(ORPHAN_QUERY)

  if (orphans.length === 0) {
    console.log('No orphaned assets found. Nothing to do.')
    return
  }

  const totalMb = (orphans.reduce((sum, a) => sum + (a.size ?? 0), 0) / 1024 / 1024).toFixed(2)
  console.log(`\nFound ${orphans.length} orphaned asset(s) — ~${totalMb} MB`)
  orphans.forEach((a) =>
    console.log(`  ${a._id}  ${a.originalFilename ?? '(no filename)'}  ${a.size ? (a.size / 1024).toFixed(0) + ' KB' : ''}`)
  )

  if (dryRun) {
    console.log('\n[dry-run] No assets deleted. Remove --dry-run to delete.')
    return
  }

  console.log('\nDeleting...')
  const tx = client.transaction()
  orphans.forEach((a) => tx.delete(a._id))
  const result = await tx.commit()
  console.log(`Deleted ${result.results.length} asset(s).`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
