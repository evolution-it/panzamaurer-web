import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

async function run() {
  await client.createOrReplace({
    _type: 'siteSettings',
    _id: 'siteSettings',
    siteName: 'Panza Maurer',
    contactPhone: '(954) 390-0100',
    footerTagline: 'Experienced. Strategic. Effective.',
    footerLocations: [
      { _type: 'reference', _ref: 'location-tallahassee', _key: 'fl-1' },
      { _type: 'reference', _ref: 'location-fort-lauderdale', _key: 'fl-2' },
      { _type: 'reference', _ref: 'location-coral-gables', _key: 'fl-3' },
    ],
    navItems: [
      { _key: 'nav-1', label: 'Home', path: '/', hasDropdown: false },
      { _key: 'nav-2', label: 'Professionals', path: '/attorneys', hasDropdown: false },
      { _key: 'nav-3', label: 'Practice Areas', path: '/practice-areas', hasDropdown: true },
      { _key: 'nav-4', label: 'Government Relations', path: '/practice-areas/government-relations', hasDropdown: false },
      { _key: 'nav-5', label: 'News', path: '/news', hasDropdown: false },
      { _key: 'nav-6', label: 'Locations', path: '/locations', hasDropdown: false },
    ],
  })
  console.log('✅ siteSettings created/updated')
}

run().catch((e) => { console.error(e); process.exit(1) })
