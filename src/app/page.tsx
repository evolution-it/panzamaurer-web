import { type PortableTextBlock } from '@portabletext/react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import PracticeAreas from '@/components/PracticeAreas'
import Team, { TeamMember } from '@/components/Team'
import News from '@/components/News'
import Locations from '@/components/Locations'
import GetInTouch from '@/components/GetInTouch'
import Footer from '@/components/Footer'
import { getDraftModeClient } from '@/sanity/draftMode'
import { urlFor } from '@/sanity/image'
import { TEAM_ATTORNEYS_QUERY } from '@/sanity/queries/attorneys'
import { HOME_PAGE_QUERY } from '@/sanity/queries/pages'

type RawTeamMember = TeamMember & {
  image?: { asset: { _ref: string } } | null
}

type SanityLocation = {
  _id: string
  name: string
  image?: { asset: { _ref: string } } | null
  order: number
}

type SanityImage = {
  asset: { _ref?: string; url?: string }
}

type PracticeAreaItem = {
  _id: string
  title: string
  slug: { current: string }
}

type PageSection = {
  _type: string
  _key: string
  heading?: string
  boldPrefix?: string
  subtitle?: string
  body?: PortableTextBlock[]
  quote?: string
  image?: SanityImage | null
  ctaLabel?: string
  ctaHref?: string
  videos?: { url: string }[]
  attorneys?: RawTeamMember[]
  locations?: SanityLocation[]
  practiceAreas?: PracticeAreaItem[]
  articleCount?: number
}

type HomePageConfig = {
  _id: string
  sections?: PageSection[]
}

function toTeamMembers(raw: RawTeamMember[]): TeamMember[] {
  return raw.map((m) => ({
    ...m,
    imageUrl: m.image ? urlFor(m.image).width(600).height(800).url() : null,
  }))
}

export default async function Home() {
  const { sanityClient, cacheTags } = await getDraftModeClient()

  const pageConfig: HomePageConfig | null = await sanityClient
    .fetch(HOME_PAGE_QUERY, {}, cacheTags(['pages']))
    .catch(() => null)

  const sections = pageConfig?.sections ?? []

  // ── Hero section ─────────────────────────────────────────────────────────────
  const heroSection = sections.find((s) => s._type === 'heroSection')
  const heroVideos = heroSection?.videos?.map((v) => v.url).filter(Boolean) as string[] | undefined

  // ── About section ─────────────────────────────────────────────────────────────
  const aboutSection = sections.find((s) => s._type === 'aboutSection')
  const aboutImageUrl = aboutSection?.image
    ? urlFor(aboutSection.image).width(500).height(600).url()
    : undefined

  // ── Practice Areas section ────────────────────────────────────────────────────
  const practiceAreasSection = sections.find((s) => s._type === 'practiceAreasSection')

  // ── Team section ─────────────────────────────────────────────────────────────
  const teamSection = sections.find((s) => s._type === 'teamSection')
  let teamMembers: TeamMember[]

  if (teamSection?.attorneys && teamSection.attorneys.length > 0) {
    teamMembers = toTeamMembers(teamSection.attorneys)
  } else {
    const rawTeam: RawTeamMember[] = await sanityClient
      .fetch(TEAM_ATTORNEYS_QUERY, {}, cacheTags(['attorneys']))
      .catch(() => [])
    teamMembers = toTeamMembers(rawTeam)
  }

  // ── News section ──────────────────────────────────────────────────────────────
  const newsSection = sections.find((s) => s._type === 'newsSection')
  const newsCount = newsSection?.articleCount ?? 3

  // ── Locations section ─────────────────────────────────────────────────────────
  const locationsSection = sections.find((s) => s._type === 'locationsSection')
  const preloadedLocations =
    locationsSection?.locations && locationsSection.locations.length > 0
      ? locationsSection.locations
      : undefined

  // ── CTA section ───────────────────────────────────────────────────────────────
  const ctaSection = sections.find((s) => s._type === 'ctaSection')

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Navbar />
      <main id='main-content' className='w-full'>
        <Hero
          heading={heroSection?.heading ?? undefined}
          subtitle={heroSection?.subtitle ?? undefined}
          videos={heroVideos}
        />
        <About
          heading={aboutSection?.heading ?? undefined}
          quote={aboutSection?.quote ?? undefined}
          body={aboutSection?.body ?? undefined}
          imageUrl={aboutImageUrl}
        />
        <PracticeAreas areas={practiceAreasSection?.practiceAreas ?? undefined} />
        <News count={newsCount} />
        <Locations preloadedLocations={preloadedLocations} linkToLocationsPage />
      </main>
      <Footer />
    </div>
  )
}
