/**
 * One-off script: creates Robin Supler as an Our Attorneys document in Sanity
 * and appends her to the Our Attorneys section on the attorneys page.
 * Run with: npx tsx scripts/seed-robin-supler.ts
 */

import { createClient } from '@sanity/client'
import { LexoRank } from 'lexorank'
import { randomUUID } from 'crypto'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !dataset || !token) {
  console.error(
    'Missing required environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN',
  )
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const ATTORNEY_ID = 'attorney-robin-supler'
const SLUG = 'robin-supler'

const INTRO = [
  'Robin is a healthcare compliance and privacy professional with over 25 years of experience guiding healthcare organizations through regulatory complexity and operational transformation. Throughout her career, she has supported physicians and healthcare organizations in navigating complex regulatory environments, implementing effective compliance frameworks, and strengthening internal controls to ensure adherence to federal and state requirements.',
  'Her extensive knowledge of federal and state healthcare laws, program requirements and best practices have led her to work with large public health systems, academic medical centers, physician practices, and seven university health colleges (Colleges of Allopathic Medicine, Dental Medicine, Nursing, Optometry, Osteopathic Medicine, Pharmacy and Psychology).',
  'Her legal background and hands-on healthcare compliance experience enable her to translate complex regulatory requirements into practical policies and workflows that are clear, effective, and well suited for physician and staff education and implementation. The combination of compliance expertise and legal knowledge is a valuable addition to Panza Maurer Solutions, enhancing our ability to address healthcare compliance from both a regulatory and business-risk perspective. Robin earned her Juris Doctor from the University of Miami School of Law and is certified in Healthcare Privacy Compliance (CHPC), and Healthcare Compliance (CHC).',
]

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

function rankAfter(value: string | null) {
  if (!value) return LexoRank.middle().toString()
  return LexoRank.parse(value).genNext().genNext().toString()
}

async function uploadHeadshot() {
  const imagePath = path.resolve(process.cwd(), 'public/images/attorneys/robin-supler.jpeg')
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Headshot not found: ${imagePath}`)
  }
  const asset = await client.assets.upload('image', fs.readFileSync(imagePath), {
    filename: 'robin-supler.jpeg',
    contentType: 'image/jpeg',
  })
  console.log('Uploaded headshot:', asset._id)
  return {
    _type: 'image' as const,
    asset: { _type: 'reference' as const, _ref: asset._id },
  }
}

type AttorneyRef = { _key?: string; _ref?: string; _type?: string; _weak?: boolean }
type TeamSection = {
  _key?: string
  _type?: string
  heading?: string
  attorneys?: AttorneyRef[]
}
type PageDoc = { _id: string; sections?: TeamSection[] }

async function appendToOurAttorneys(page: PageDoc) {
  const sections = page.sections ?? []
  const sectionIndex = sections.findIndex(
    (section) =>
      section._type === 'teamSection' &&
      (section.heading ?? '').trim().toLowerCase() === 'our attorneys',
  )
  const index = sectionIndex >= 0 ? sectionIndex : sections.findIndex((section) => section._type === 'teamSection')
  if (index < 0) {
    throw new Error(`No team section found on ${page._id}`)
  }

  const attorneys = sections[index].attorneys ?? []
  if (attorneys.some((attorney) => attorney._ref === ATTORNEY_ID)) {
    console.log(`Already listed on ${page._id}`)
    return
  }

  const nextSections = sections.map((section, sectionIndex) => {
    if (sectionIndex !== index) return section
    return {
      ...section,
      attorneys: [
        ...attorneys,
        {
          _type: 'reference',
          _ref: ATTORNEY_ID,
          _key: 'team-robin-supler',
          _weak: true,
        },
      ],
    }
  })

  await client.patch(page._id).set({ sections: nextSections }).commit()
  console.log(`Appended Robin to Our Attorneys on ${page._id}`)
}

async function run() {
  const existing = await client.fetch<{ _id: string; orderRank?: string; image?: unknown } | null>(
    `*[_id == $id][0]{ _id, orderRank, image }`,
    { id: ATTORNEY_ID },
  )

  let orderRank = existing?.orderRank
  if (!orderRank) {
    const lastRank = await client.fetch<string | null>(
      `*[_type == "attorney" && type == "Our Attorneys" && _id != $id && defined(orderRank)] | order(orderRank desc)[0].orderRank`,
      { id: ATTORNEY_ID },
    )
    orderRank = rankAfter(lastRank)
  }

  const image = await uploadHeadshot()
  await client.createOrReplace({
    _id: ATTORNEY_ID,
    _type: 'attorney',
    name: 'Robin Supler',
    profileName: 'Robin Supler, JD, CHC, CHPC',
    firstName: 'Robin',
    slug: { _type: 'slug', current: SLUG },
    type: 'Our Attorneys',
    role: 'Partner',
    status: 'published',
    orderRank,
    image,
    intro: INTRO.map(textToBlock),
    education: [
      'B.A. in Psychology from the University of Miami (1983)',
      'J.D. from the University of Miami (1986)',
    ],
    barAdmissions: ['Florida (1988)'],
    courtAdmissions: [],
    professionalMemberships: [],
    sections: [],
  })
  console.log(`Wrote ${ATTORNEY_ID}`)

  const pages = await client.fetch<PageDoc[]>(
    `*[_type == "page" && slug.current == "attorneys"]{ _id, sections }`,
  )
  if (pages.length === 0) {
    throw new Error('Attorneys page document was not found')
  }
  for (const page of pages) {
    await appendToOurAttorneys(page)
    const draftId = page._id.startsWith('drafts.') ? null : `drafts.${page._id}`
    if (!draftId) continue
    const draft = await client.fetch<PageDoc | null>(`*[_id == $id][0]{ _id, sections }`, { id: draftId })
    if (draft) await appendToOurAttorneys(draft)
  }
}

run().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
