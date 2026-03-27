import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import { client, getDraftClient } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { ATTORNEYS_LIST_QUERY } from '@/sanity/queries/attorneys'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries/pages'
import { draftMode } from 'next/headers'

export const metadata = {
  title: 'Our Attorneys | Panza Maurer',
}

type AttorneyListItem = {
  _id: string
  name: string
  role: string
  slug: { current: string }
  image?: { asset: { _ref: string } } | null
  type: string
  order: number
}

type TeamSection = {
  _type: 'teamSection'
  _key: string
  heading?: string
  attorneys?: AttorneyListItem[]
}

type PageConfig = {
  sections?: { _type: string; _key: string; heading?: string; attorneys?: AttorneyListItem[] }[]
}

function AttorneyCard({ attorney }: { attorney: AttorneyListItem }) {
  const imgSrc = attorney.image
    ? urlFor(attorney.image).width(400).height(400).url()
    : null

  return (
    <Link
      href={`/attorneys/${attorney.slug.current}`}
      className='group overflow-hidden rounded-xl border border-slate-200 bg-white'
    >
      <div className='relative aspect-square w-full overflow-hidden bg-slate-100'>
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={attorney.name}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw'
            className='object-contain transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-slate-300'>
            <svg className='h-16 w-16' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z' />
            </svg>
          </div>
        )}
      </div>
      <div className='px-4 py-4'>
        <h3 className='font-[family-name:var(--font-noto)] text-[20px] font-semibold text-black'>
          {attorney.name}
        </h3>
        <p className='font-[family-name:var(--font-noto)] text-[16px] text-slate-500'>
          {attorney.role}
        </p>
      </div>
    </Link>
  )
}

function AttorneyGroup({
  heading,
  attorneys,
  large,
}: {
  heading?: string
  attorneys: AttorneyListItem[]
  large?: boolean
}) {
  if (attorneys.length === 0) return null
  return (
    <section className='bg-white'>
      <div className='mx-auto max-w-[1440px] px-8 py-20 lg:px-28'>
        {heading && (
          <h2 className='mb-12 font-[family-name:var(--font-hanken)] text-3xl font-semibold text-gray-950'>
            {heading}
          </h2>
        )}
        <div
          className={`grid grid-cols-1 gap-10 ${
            large ? 'sm:grid-cols-3 lg:grid-cols-4' : 'sm:grid-cols-3'
          }`}
        >
          {attorneys.map((attorney) => (
            <AttorneyCard key={attorney._id} attorney={attorney} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default async function AttorneysPage() {
  const { isEnabled } = await draftMode()
  const sanityClient = isEnabled ? getDraftClient() : client
  const fetchOptions = isEnabled
    ? { cache: 'no-store' as const }
    : { next: { tags: ['attorneys', 'pages'] } }

  // Fetch page config and full attorney list in parallel
  const [pageConfig, allAttorneys] = await Promise.all([
    sanityClient
      .fetch<PageConfig>(PAGE_BY_SLUG_QUERY, { slug: 'attorneys' }, fetchOptions)
      .catch(() => null),
    sanityClient
      .fetch<AttorneyListItem[]>(ATTORNEYS_LIST_QUERY, {}, fetchOptions)
      .catch(() => [] as AttorneyListItem[]),
  ])

  // Build an id→attorney lookup for resolving weak refs that GROQ may not expand
  const attorneyById = Object.fromEntries(allAttorneys.map((a) => [a._id, a]))

  // Extract teamSection blocks from the page config
  const teamSections: TeamSection[] = (pageConfig?.sections ?? [])
    .filter((s): s is TeamSection => s._type === 'teamSection')
    .map((s) => ({
      ...s,
      // Filter nulls from weak refs; fall back to lookup if GROQ returned partial data
      attorneys: (s.attorneys ?? [])
        .filter((a): a is AttorneyListItem => a != null && a.slug != null)
        .map((a) => attorneyById[a._id] ?? a),
    }))

  // Fallback: if no page config, show type-based groups
  const fallbackSections: TeamSection[] =
    teamSections.length === 0
      ? [
          {
            _type: 'teamSection',
            _key: 'fallback-our-attorneys',
            heading: 'Our Attorneys',
            attorneys: allAttorneys.filter((a) => a.type === 'Our Attorneys'),
          },
          {
            _type: 'teamSection',
            _key: 'fallback-of-counsel',
            heading: 'Of Counsel',
            attorneys: allAttorneys.filter((a) => a.type === 'Of Counsel'),
          },
        ]
      : []

  const sections = teamSections.length > 0 ? teamSections : fallbackSections

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Navbar />
      <main className='w-full pt-[145px] lg:pt-[109px]'>
        <PageHero
          title='Our Attorneys'
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Our Attorneys' },
          ]}
        />

        {sections.map((section, index) => (
          <AttorneyGroup
            key={section._key}
            heading={section.heading}
            attorneys={section.attorneys ?? []}
            large={index === 0}
          />
        ))}
      </main>
      <Footer />
    </div>
  )
}
