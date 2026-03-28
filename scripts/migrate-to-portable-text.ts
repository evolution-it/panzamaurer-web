/**
 * Migrates plain-text fields to Portable Text (block content) format.
 *
 * Affected documents / fields:
 *   attorney   → intro (string → block[])
 *   attorney   → sections[].content (string[] → block[])
 *   practiceArea → content (string[] → block[])
 *
 * Safe to re-run: documents whose fields are already in block format are skipped.
 *
 * Run with:
 *   npx tsx scripts/migrate-to-portable-text.ts
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

function key(): string {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

/** Convert a plain string to a single Portable Text block. */
function stringToBlock(text: string) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: key(),
        text,
        marks: [],
      },
    ],
  }
}

/** Convert an array of plain strings to an array of Portable Text blocks. */
function stringsToBlocks(strings: string[]) {
  return strings.filter((s) => typeof s === 'string' && s.trim()).map(stringToBlock)
}

/** Returns true if the value looks like it is already in Portable Text block format. */
function isAlreadyBlocks(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === 'object' &&
    value[0] !== null &&
    '_type' in value[0]
  )
}

// ─── Attorneys ──────────────────────────────────────────────────────────────

async function migrateAttorneys() {
  console.log('\n── Attorneys ────────────────────────────────────────')

  const attorneys = await client.fetch<
    { _id: string; name: string; intro?: unknown; sections?: { title?: string; content?: unknown }[] }[]
  >('*[_type == "attorney"]{ _id, name, intro, sections }')

  console.log(`Found ${attorneys.length} attorney document(s)`)

  let patched = 0

  for (const attorney of attorneys) {
    const patch = client.patch(attorney._id)
    let dirty = false

    // ── intro ──────────────────────────────────────────────────────────────
    if (typeof attorney.intro === 'string' && attorney.intro.trim()) {
      console.log(`  [${attorney.name}] Converting intro from string → block[]`)
      patch.set({ intro: [stringToBlock(attorney.intro)] })
      dirty = true
    } else if (isAlreadyBlocks(attorney.intro)) {
      console.log(`  [${attorney.name}] intro already in block format — skipping`)
    } else if (!attorney.intro) {
      console.log(`  [${attorney.name}] intro is empty — skipping`)
    }

    // ── sections[].content ────────────────────────────────────────────────
    if (attorney.sections && attorney.sections.length > 0) {
      const updatedSections = attorney.sections.map((section) => {
        if (!section.content) return section

        if (
          Array.isArray(section.content) &&
          section.content.length > 0 &&
          typeof section.content[0] === 'string'
        ) {
          console.log(
            `  [${attorney.name}] Section "${section.title ?? '(untitled)'}" — converting content string[] → block[]`,
          )
          dirty = true
          return { ...section, content: stringsToBlocks(section.content as string[]) }
        }

        if (isAlreadyBlocks(section.content)) {
          console.log(
            `  [${attorney.name}] Section "${section.title ?? '(untitled)'}" — already in block format, skipping`,
          )
        }

        return section
      })

      if (dirty) {
        patch.set({ sections: updatedSections })
      }
    }

    if (dirty) {
      await patch.commit()
      patched++
      console.log(`  [${attorney.name}] ✓ Patched`)
    }
  }

  console.log(`Attorneys done: ${patched} document(s) updated.`)
}

// ─── Practice Areas ──────────────────────────────────────────────────────────

async function migratePracticeAreas() {
  console.log('\n── Practice Areas ───────────────────────────────────')

  const areas = await client.fetch<{ _id: string; title: string; content?: unknown }[]>(
    '*[_type == "practiceArea"]{ _id, title, content }',
  )

  console.log(`Found ${areas.length} practice area document(s)`)

  let patched = 0

  for (const area of areas) {
    if (!area.content) {
      console.log(`  [${area.title}] content is empty — skipping`)
      continue
    }

    if (isAlreadyBlocks(area.content)) {
      console.log(`  [${area.title}] already in block format — skipping`)
      continue
    }

    if (
      Array.isArray(area.content) &&
      area.content.length > 0 &&
      typeof area.content[0] === 'string'
    ) {
      console.log(`  [${area.title}] Converting content string[] → block[]`)
      await client.patch(area._id).set({ content: stringsToBlocks(area.content as string[]) }).commit()
      patched++
      console.log(`  [${area.title}] ✓ Patched`)
      continue
    }

    console.log(`  [${area.title}] content has unexpected format — skipping`)
  }

  console.log(`Practice areas done: ${patched} document(s) updated.`)
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function run() {
  const { projectId, dataset } = client.config()
  console.log(`\nMigrating to Portable Text`)
  console.log(`Project: ${projectId}  Dataset: ${dataset}\n`)

  if (!process.env.SANITY_WRITE_TOKEN) {
    console.error('Error: SANITY_WRITE_TOKEN is not set in .env.local')
    process.exit(1)
  }

  try {
    await migrateAttorneys()
    await migratePracticeAreas()
    console.log('\n✓ Migration complete.')
  } catch (err) {
    console.error('\nMigration failed:', err)
    process.exit(1)
  }
}

run()
