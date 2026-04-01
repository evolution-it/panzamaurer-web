import { createClient } from '@sanity/client'
import fs from 'fs'
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

async function run() {
  const imagePath = path.resolve(process.cwd(), 'public', 'images', 'contact-tallahassee.jpg')

  console.log('⬆️  Uploading contact-tallahassee.jpg...')
  const buffer = fs.readFileSync(imagePath)
  const asset = await client.assets.upload('image', buffer, {
    filename: 'contact-tallahassee.jpg',
    contentType: 'image/jpeg',
  })
  console.log(`   Asset ID: ${asset._id}`)

  console.log('🔗 Patching location-tallahassee document...')
  await client.patch('location-tallahassee').set({
    image: {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    },
  }).commit()

  console.log('✅ Tallahassee location image fixed!')
}

run().catch((e) => { console.error(e); process.exit(1) })
