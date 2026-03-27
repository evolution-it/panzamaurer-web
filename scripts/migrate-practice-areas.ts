/**
 * Re-runs only the practice area migration (idempotent, safe to re-run).
 * Run with: npx tsx scripts/migrate-practice-areas.ts
 */

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

const practiceAreaData: Record<string, { title: string; heading: string; content: string[] }> = {
  'administrative--regulatory-law': { title: 'Administrative | Regulatory Law', heading: 'A Nice Heading about Regulatory Law', content: ["Panza Maurer & Maynard assists clients within the framework of local, state and federal regulations. A key factor in this area of practice is an in-depth understanding of applicable laws to assist clients in navigating what is often a complex set of rules and regulations. The firm has intimate knowledge of the regulatory process and has developed long-standing professional relationships within many governmental and administrative agencies, a significant factor in achieving results.", "PMM represents clients on matters before the Florida Attorney General's Office, the Florida Departments of Insurance and Revenue, Children and Families, Health, Agriculture and Consumer Services, Environmental Protection, Department of Lottery, Environmental Regulations, the Florida Department of Education, DCA, and Department of Transportation. We also work extensively with the Florida Agency for Health Care Administration (AHCA), as well as federal agencies such as the Centers for Medicare and Medicaid Services, Occupational Safety and Health Administration, the U.S. Department of Education, Department of Justice and the Food and Drug Administration. Other diverse matters handled by this division include: professional licensure and discipline, procurement, bid protests, environment and land use issues, utilities rate-making regulation and grants. We know the Florida landscape at PMM and can produce significant benefits for our clients."] },
  'healthcare': { title: 'Healthcare', heading: 'Comprehensive Healthcare Legal Services', content: ["Today's healthcare providers are subject to an ever-increasing and constantly evolving number of regulatory requirements that require experienced legal counsel who have a clear understanding of the wide range of issues that providers may encounter."] },
  'compliance': { title: 'Compliance', heading: 'Strategic Compliance & Risk Management', content: ["At Panza Maurer, compliance is a core strength of our practice."] },
  'corporate--transactional': { title: 'Corporate | Transactional', heading: 'Corporate & Transactional Law', content: ["Panza Maurer provides comprehensive counsel to businesses at every stage of growth."] },
  'litigation': { title: 'Litigation', heading: 'Civil & Commercial Litigation', content: ["Insurance defense counsel representing numerous individuals, private and public corporations."] },
  'land-use--environmental': { title: 'Land Use | Environmental', heading: 'Land Use & Environmental Law', content: ["Panza Maurer represents property owners, developers, lenders and other affected parties with land use and environmental matters."] },
  'trusts--estates': { title: 'Estate Planning | Probate', heading: 'Estate Planning | Probate', content: ["Panza Maurer offers estate planning, administration, and probate services tailored to protect clients, their families, and their legacies."] },
  'technology--it': { title: 'Technology | IT', heading: 'Technology | IT', content: ["Panza Maurer provides strategic legal counsel on cybersecurity compliance and risk management."] },
  'education-law': { title: 'Education Law', heading: 'Education Law', content: ["Panza Maurer provides comprehensive legal counsel to colleges, universities, and K–12 institutions."] },
  'gaming--hospitality': { title: 'Gaming | Hospitality', heading: 'Gaming | Hospitality Law', content: ["Panza Maurer has represented lottery, gaming and hospitality clients in one of Florida's most highly regulated industries."] },
  'strategic-planning': { title: 'Strategic Planning', heading: 'Government Relations & Strategic Planning', content: ["Strategic planning is essential for organizations that want to grow, manage risk, and remain competitive."] },
  'government-relations': { title: 'Government Relations', heading: 'Government Affairs & Strategic Advocacy', content: ["Panza Maurer's government affairs practice is fully integrated within the firm's broader regulatory and administrative law platform."] },
  'labor--employment': { title: 'Labor | Employment', heading: 'Labor & Employment Law', content: ["Panza Maurer is recognized for its depth of experience in labor and employment law."] },
  'procurement': { title: 'Procurement', heading: 'Government Procurement Law', content: ["Panza Maurer has decades of experience in handling large state and local bid and procurement matters."] },
  'real-property': { title: 'Real Property', heading: 'Real Property Law', content: ["With more than fifty years of combined experience, our attorneys handle real estate sales contracts and leases."] },
  'receivership--conservatorship': { title: 'Receivership | Conservatorship', heading: 'Receivership & Conservatorship Services', content: ["Panza Maurer Law Firm serves as Conservators, Receivers or Custodians for commercial and real estate entities."] },
  'medical-marijuana': { title: 'Medical Marijuana', heading: 'Medical Marijuana Law', content: ["Panza Maurer is an administrative and regulatory law firm focused on guiding clients through the complex legal framework governing medical marijuana in the State of Florida."] },
}

async function run() {
  console.log('⚖️  Migrating practice areas...')

  for (const [slug, data] of Object.entries(practiceAreaData)) {
    const safeId = slug.replace(/[^a-zA-Z0-9-_]/g, '-')

    const featuredAttorneys =
      slug === 'government-relations'
        ? [
            { _type: 'reference' as const, _ref: 'attorney-thomas-f-panza', _key: 'fa-1', _weak: true },
            { _type: 'reference' as const, _ref: 'attorney-jennifer-maurer-bean', _key: 'fa-2', _weak: true },
            { _type: 'reference' as const, _ref: 'attorney-sandra-harris', _key: 'fa-3', _weak: true },
          ]
        : undefined

    const doc = {
      _type: 'practiceArea',
      _id: `practicearea-${safeId}`,
      title: data.title,
      slug: { _type: 'slug', current: slug },
      heading: data.heading,
      content: data.content,
      status: 'published',
      ...(featuredAttorneys ? { featuredAttorneys } : {}),
    }

    await client.createOrReplace(doc)
    console.log(`  ✅ ${data.title}`)
  }

  console.log('\n✅ Practice areas migration complete!')
}

run().catch((e) => { console.error(e); process.exit(1) })
