/**
 * One-off script: creates Sandra Harris attorney document in Sanity.
 * Run with: npx tsx scripts/seed-sandra-harris.ts
 */

import { createClient } from '@sanity/client'
import { randomUUID } from 'crypto'
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

function key() {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

function textToBlock(text: string) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }
}

async function run() {
  const existing = await client.fetch(
    '*[_type == "attorney" && slug.current == "sandra-harris"][0]{ _id }',
  )

  if (existing) {
    console.log('Sandra Harris already exists in Sanity (_id:', existing._id, ') — nothing to do.')
    return
  }

  const doc = {
    _type: 'attorney',
    name: 'Sandra Harris',
    firstName: 'Sandra',
    role: 'Executive Vice President of Government Affairs',
    slug: { _type: 'slug', current: 'sandra-harris' },
    type: 'Of Counsel',
    status: 'published',
    intro: [
      textToBlock(
        'Sandra Harris is a government relations professional at Panza Maurer, bringing extensive experience in legislative advocacy and public affairs.',
      ),
    ],
    sections: [],
    education: [],
    barAdmissions: [],
    courtAdmissions: [],
    professionalMemberships: [],
  }

  const result = await client.create(doc)
  console.log('✓ Sandra Harris created (_id:', result._id, ')')
}

run().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
