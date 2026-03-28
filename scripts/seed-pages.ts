/**
 * Seed page documents in Sanity (idempotent – safe to re-run).
 *
 * Prerequisites: SANITY_WRITE_TOKEN must be set in .env.local
 *
 * Run with:
 *   npm run seed-pages
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_WRITE_TOKEN!

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

function ref(id: string, key: string) {
  return { _type: 'reference' as const, _ref: id, _key: key, _weak: true }
}

async function uploadVideoAssets() {
  const videoFiles = [
    { filename: 'sea-view.mp4', localPath: 'public/assets/sea-view.mp4' },
    { filename: 'cityview.mp4', localPath: 'public/assets/cityview.mp4' },
    { filename: 'townhouse.mp4', localPath: 'public/assets/townhouse.mp4' },
  ]

  console.log('🎬 Uploading hero video assets...')
  const videoRefs: { _type: string; _key: string; asset: { _type: string; _ref: string } }[] = []

  for (const video of videoFiles) {
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "sanity.fileAsset" && originalFilename == $filename][0]{ _id }`,
      { filename: video.filename },
    )

    if (existing?._id) {
      console.log(`  ⏭️  Already uploaded: ${video.filename}`)
      videoRefs.push({
        _type: 'file',
        _key: `video-${video.filename.replace(/\./g, '-')}`,
        asset: { _type: 'reference', _ref: existing._id },
      })
    } else {
      const filePath = path.resolve(process.cwd(), video.localPath)
      const fileStream = fs.createReadStream(filePath)
      const asset = await client.assets.upload('file', fileStream, {
        filename: video.filename,
        contentType: 'video/mp4',
      })
      console.log(`  ✅ Uploaded: ${video.filename}`)
      videoRefs.push({
        _type: 'file',
        _key: `video-${video.filename.replace(/\./g, '-')}`,
        asset: { _type: 'reference', _ref: asset._id },
      })
    }
  }

  return videoRefs
}

async function seedPages() {
  const heroVideos = await uploadVideoAssets()

  console.log('📄 Seeding page documents...')

  const pages = [
    // ── Home ──────────────────────────────────────────────────────────────────
    {
      _id: 'page-home',
      title: 'Home',
      navigationLabel: 'Home',
      slug: 'home',
      seoDescription:
        'Panza Maurer — experienced Florida attorneys in government relations, healthcare, litigation, and more.',
      showInNavigation: true,
      navigationOrder: 1,
      sections: [
        {
          _type: 'heroSection',
          _key: 'section-hero',
          heading: 'We Know Florida',
          subtitle:
            'Representing businesses, regulated industries and institutions for more than 50 years.',
          videos: heroVideos,
        },
        {
          _type: 'aboutSection',
          _key: 'section-about',
          heading: 'About Our Firm',
          quote:
            '\u201cPanza Maurer\u2019s mission is to provide our clients with a team of highly skilled and motivated professionals dedicated to helping clients resolve their legal and business needs with reliability, honesty and excellence.\u201d',
          body: [
            "At Panza Maurer, we\u2019re more than just legal advisors \u2014 we\u2019re strategic partners who know how to get things done in Florida\u2019s complex regulatory and administrative landscape. Panza Maurer counsels a wide range of public and private clients in resolving their legal issues.",
            'Whether engaging in rulemaking, procurements, facing compliance issues, or influencing policy, we bring deep insight, creative strategies, and real-world experience to the table.',
            'With offices in Fort Lauderdale, Miami, and Tallahassee, our team is here to help you move forward \u2014 clearly, confidently, and with purpose.',
          ].join('\n'),
        },
        {
          _type: 'practiceAreasSection',
          _key: 'section-practices',
          heading: 'Practice Areas',
          practiceAreas: [
            ref('practicearea-administrative--regulatory-law', 'pa-1'),
            ref('practicearea-healthcare', 'pa-2'),
            ref('practicearea-government-relations', 'pa-3'),
            ref('practicearea-labor--employment', 'pa-4'),
            ref('practicearea-litigation', 'pa-5'),
            ref('practicearea-education-law', 'pa-6'),
            ref('practicearea-compliance', 'pa-7'),
            ref('practicearea-corporate--transactional', 'pa-8'),
            ref('practicearea-land-use--environmental', 'pa-9'),
            ref('practicearea-trusts--estates', 'pa-10'),
            ref('practicearea-technology--it', 'pa-11'),
            ref('practicearea-gaming--hospitality', 'pa-12'),
            ref('practicearea-strategic-planning', 'pa-13'),
            ref('practicearea-procurement', 'pa-14'),
            ref('practicearea-real-property', 'pa-15'),
            ref('practicearea-receivership--conservatorship', 'pa-16'),
            ref('practicearea-medical-marijuana', 'pa-17'),
          ],
        },
        {
          _type: 'teamSection',
          _key: 'section-team',
          heading: 'Our Team',
          attorneys: [
            ref('attorney-thomas-f-panza', 'team-1'),
            ref('attorney-susan-horovitz-maurer', 'team-2'),
            ref('attorney-dana-panza-macdonald', 'team-3'),
            ref('attorney-benjamin-p-bean', 'team-4'),
            ref('attorney-jennifer-maurer-bean', 'team-5'),
          ],
        },
        {
          _type: 'newsSection',
          _key: 'section-news',
          heading: 'Latest News',
          articleCount: 3,
        },
        {
          _type: 'locationsSection',
          _key: 'section-locations',
          heading: 'Our Locations',
          locations: [
            ref('location-tallahassee', 'loc-1'),
            ref('location-fort-lauderdale', 'loc-2'),
            ref('location-coral-gables', 'loc-3'),
          ],
        },
        {
          _type: 'ctaSection',
          _key: 'section-cta',
          heading: 'Get in Touch',
          subtitle: 'Panza Maurer is ready to navigate a successful result.',
          body: 'Our experienced strategic approach provides the foundation for every case we engage in. Please do not hesitate to contact us.',
          ctaLabel: 'Meet Our Team',
          ctaHref: '/attorneys',
        },
      ],
    },

    // ── Attorneys ─────────────────────────────────────────────────────────────
    {
      _id: 'page-attorneys',
      title: 'Attorneys',
      navigationLabel: 'Professionals',
      slug: 'attorneys',
      seoDescription: 'Meet the experienced attorneys at Panza Maurer.',
      showInNavigation: true,
      navigationOrder: 2,
      sections: [
        {
          _type: 'teamSection',
          _key: 'section-our-attorneys',
          heading: 'Our Attorneys',
          attorneys: [
            ref('attorney-thomas-f-panza', 'team-1'),
            ref('attorney-susan-horovitz-maurer', 'team-2'),
            ref('attorney-dana-panza-macdonald', 'team-3'),
            ref('attorney-benjamin-p-bean', 'team-4'),
            ref('attorney-jennifer-maurer-bean', 'team-5'),
            ref('attorney-richard-a-beauchamp', 'team-6'),
            ref('attorney-robert-m-bulfin', 'team-7'),
            ref('attorney-jose-felix-diaz', 'team-8'),
            ref('attorney-lorraine-duthe', 'team-9'),
            ref('attorney-james-h-horton-iv', 'team-10'),
            ref('attorney-gregory-l-mcdermott', 'team-11'),
            ref('attorney-elizabeth-l-pedersen', 'team-12'),
            ref('attorney-louise-wilhite-st-laurent', 'team-13'),
            ref('attorney-samantha-evans-saltzburg', 'team-14'),
            ref('attorney-jennifer-k-graner', 'team-15'),
            ref('attorney-andrew-l-myers', 'team-16'),
            ref('attorney-trevor-d-scott', 'team-17'),
            ref('attorney-julia-c-marano', 'team-18'),
          ],
        },
        {
          _type: 'teamSection',
          _key: 'section-of-counsel',
          heading: 'Of Counsel',
          attorneys: [
            ref('attorney-brian-ballard', 'oc-1'),
            ref('attorney-brad-burleson', 'oc-2'),
            ref('attorney-david-childs', 'oc-3'),
            ref('attorney-jan-gorrie', 'oc-4'),
            ref('attorney-adrian-lukis', 'oc-5'),
            ref('attorney-syl-luks', 'oc-6'),
            ref('attorney-monica-rodriguez', 'oc-7'),
            ref('attorney-eileen-stuart', 'oc-8'),
            ref('attorney-abby-vail', 'oc-9'),
            ref('attorney-sandra-harris', 'oc-10'),
          ],
        },
      ],
    },

    // ── Practice Areas ────────────────────────────────────────────────────────
    {
      _id: 'page-practice-areas',
      title: 'Practice Areas',
      navigationLabel: 'Practice Areas',
      slug: 'practice-areas',
      seoDescription: 'Explore the legal practice areas at Panza Maurer.',
      showInNavigation: true,
      navigationOrder: 3,
      sections: [
        {
          _type: 'practiceAreasSection',
          _key: 'section-practices',
          heading: 'Our Practice Areas',
          practiceAreas: [
            ref('practicearea-administrative--regulatory-law', 'pa-1'),
            ref('practicearea-healthcare', 'pa-2'),
            ref('practicearea-government-relations', 'pa-3'),
            ref('practicearea-labor--employment', 'pa-4'),
            ref('practicearea-litigation', 'pa-5'),
            ref('practicearea-education-law', 'pa-6'),
            ref('practicearea-compliance', 'pa-7'),
            ref('practicearea-corporate--transactional', 'pa-8'),
            ref('practicearea-land-use--environmental', 'pa-9'),
            ref('practicearea-trusts--estates', 'pa-10'),
            ref('practicearea-technology--it', 'pa-11'),
            ref('practicearea-gaming--hospitality', 'pa-12'),
            ref('practicearea-strategic-planning', 'pa-13'),
            ref('practicearea-procurement', 'pa-14'),
            ref('practicearea-real-property', 'pa-15'),
            ref('practicearea-receivership--conservatorship', 'pa-16'),
            ref('practicearea-medical-marijuana', 'pa-17'),
          ],
        },
      ],
    },

    // ── News ──────────────────────────────────────────────────────────────────
    {
      _id: 'page-news',
      title: 'News',
      navigationLabel: 'News',
      slug: 'news',
      seoDescription: 'Latest news and updates from Panza Maurer.',
      showInNavigation: true,
      navigationOrder: 5,
      sections: [
        { _type: 'newsSection', _key: 'section-news', heading: 'Latest News', articleCount: 6 },
      ],
    },

    // ── News Archive ──────────────────────────────────────────────────────────
    {
      _id: 'page-news-archive',
      title: 'News Archive',
      navigationLabel: 'News Archive',
      slug: 'news-archive',
      seoDescription: 'Browse archived news and articles from Panza Maurer.',
      showInNavigation: false,
      navigationOrder: 6,
      sections: [
        {
          _type: 'newsSection',
          _key: 'section-news',
          heading: 'News Archive',
          articleCount: 12,
        },
      ],
    },

    // ── Locations ─────────────────────────────────────────────────────────────
    {
      _id: 'page-locations',
      title: 'Locations',
      navigationLabel: 'Locations',
      slug: 'locations',
      seoDescription:
        'Panza Maurer offices in Tallahassee, Fort Lauderdale, and Coral Gables, Florida.',
      showInNavigation: true,
      navigationOrder: 7,
      sections: [
        {
          _type: 'locationsSection',
          _key: 'section-locations',
          heading: 'Our Locations',
          locations: [
            ref('location-tallahassee', 'loc-1'),
            ref('location-fort-lauderdale', 'loc-2'),
            ref('location-coral-gables', 'loc-3'),
          ],
        },
      ],
    },

    // ── Contact ───────────────────────────────────────────────────────────────
    {
      _id: 'page-contact',
      title: 'Contact',
      navigationLabel: 'Contact',
      slug: 'contact',
      seoDescription:
        'Contact Panza Maurer at our offices in Tallahassee, Fort Lauderdale, and Coral Gables.',
      showInNavigation: false,
      navigationOrder: 8,
      sections: [
        {
          _type: 'locationsSection',
          _key: 'section-locations',
          heading: 'Contact Our Offices',
          locations: [
            ref('location-tallahassee', 'loc-1'),
            ref('location-fort-lauderdale', 'loc-2'),
            ref('location-coral-gables', 'loc-3'),
          ],
        },
      ],
    },

    // ── About ─────────────────────────────────────────────────────────────────
    {
      _id: 'page-about',
      title: 'About',
      navigationLabel: 'About',
      slug: 'about',
      seoDescription:
        'Learn about Panza Maurer, a Florida law firm with more than 50 years of legal excellence.',
      showInNavigation: false,
      navigationOrder: 9,
      sections: [
        {
          _type: 'heroSection',
          _key: 'section-hero',
          heading: 'About the Firm',
          boldPrefix: 'For more than five decades,',
          subtitle:
            'Panza Maurer has been committed to providing the highest caliber of legal services with integrity, reliability and dedication.',
        },
      ],
    },
  ]

  for (const page of pages) {
    const doc = {
      _type: 'page',
      _id: page._id,
      title: page.title,
      navigationLabel: page.navigationLabel,
      slug: { _type: 'slug', current: page.slug },
      seoDescription: page.seoDescription,
      showInNavigation: page.showInNavigation,
      navigationOrder: page.navigationOrder,
      status: 'published',
      sections: page.sections,
    }
    await client.createOrReplace(doc)
    console.log(`  ✅ Page: ${page.title}`)
  }

  console.log('\n✅ Page seeding complete!')
}

seedPages().catch((err) => {
  console.error('\n❌ Seeding failed:', err)
  process.exit(1)
})
