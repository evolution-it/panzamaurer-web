import { client } from '@/sanity/client'
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/siteSettings'
import { NAV_PRACTICE_AREAS_QUERY } from '@/sanity/queries/practiceAreas'
import NavbarClient, { NavLink, PracticeAreaLink } from './NavbarClient'

// Fallback nav in case Sanity is unavailable
const FALLBACK_NAV: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Professionals', href: '/attorneys' },
  { label: 'Practice Areas', href: '/practice-areas', hasDropdown: true },
  { label: 'Government Relations', href: '/practice-areas/government-relations' },
  { label: 'News', href: '/news' },
  { label: 'Locations', href: '/locations' },
]

const FALLBACK_PRACTICE_AREAS: PracticeAreaLink[] = [
  { label: 'Administrative | Regulatory Law', slug: 'administrative--regulatory-law' },
  { label: 'Healthcare', slug: 'healthcare' },
  { label: 'Compliance', slug: 'compliance' },
  { label: 'Corporate | Transactional', slug: 'corporate--transactional' },
  { label: 'Litigation', slug: 'litigation' },
  { label: 'Land Use | Environmental', slug: 'land-use--environmental' },
  { label: 'Estate Planning | Probate', slug: 'trusts--estates' },
  { label: 'Technology | IT', slug: 'technology--it' },
  { label: 'Education Law', slug: 'education-law' },
  { label: 'Gaming | Hospitality', slug: 'gaming--hospitality' },
  { label: 'Strategic Planning', slug: 'strategic-planning' },
  { label: 'Labor | Employment', slug: 'labor--employment' },
  { label: 'Procurement', slug: 'procurement' },
  { label: 'Real Property', slug: 'real-property' },
  { label: 'Receivership | Conservatorship', slug: 'receivership--conservatorship' },
  { label: 'Medical Marijuana', slug: 'medical-marijuana' },
  { label: 'All Practice Areas', slug: '' },
]

type SiteSettings = {
  navItems?: { _key: string; label: string; path: string; hasDropdown?: boolean }[]
  contactPhone?: string
}

type PracticeAreaRef = {
  _id: string
  title: string
  slug: { current: string }
}

export default async function Navbar() {
  const [settings, navPracticeAreas] = await Promise.all([
    client
      .fetch<SiteSettings>(SITE_SETTINGS_QUERY, {}, { next: { tags: ['siteSettings'] } })
      .catch(() => null),
    client
      .fetch<PracticeAreaRef[]>(NAV_PRACTICE_AREAS_QUERY, {}, { next: { tags: ['practiceAreas'] } })
      .catch(() => null),
  ])

  // ── Top-level nav links ──────────────────────────────────────────────────
  const navLinks: NavLink[] =
    settings?.navItems && settings.navItems.length > 0
      ? settings.navItems.map((item) => ({
          label: item.label,
          href: item.path,
          hasDropdown: item.hasDropdown ?? false,
        }))
      : FALLBACK_NAV

  // ── Practice areas dropdown ──────────────────────────────────────────────
  // Driven directly by the showInNavDropdown toggle on each practice area document.
  let practiceAreaLinks: PracticeAreaLink[]

  if (navPracticeAreas && navPracticeAreas.length > 0) {
    practiceAreaLinks = [
      ...navPracticeAreas.map((pa) => ({
        label: pa.title,
        slug: pa.slug.current,
      })),
      { label: 'All Practice Areas', slug: '' },
    ]
  } else {
    practiceAreaLinks = FALLBACK_PRACTICE_AREAS
  }

  return (
    <NavbarClient
      navLinks={navLinks}
      practiceAreaLinks={practiceAreaLinks}
      contactPhone={settings?.contactPhone ?? '+1-(954) 390-0100'}
    />
  )
}
