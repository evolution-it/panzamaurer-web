import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { client } from '@/sanity/client'
import { getDraftModeClient } from '@/sanity/draftMode'
import { urlFor } from '@/sanity/image'
import {
  PRACTICE_AREA_BY_SLUG_QUERY,
  PRACTICE_AREAS_LIST_QUERY,
  PRACTICE_AREA_SLUGS_QUERY,
} from '@/sanity/queries/practiceAreas'
import { notFound } from 'next/navigation'

type PracticeAreaDetail = {
  _id: string
  title: string
  slug: { current: string }
  heading: string
  content: string[]
  status: string
  featuredAttorneys?: {
    _id: string
    name: string
    role: string
    slug: { current: string }
    image?: { asset: { _ref: string } } | null
  }[]
}

type PracticeAreaListItem = {
  _id: string
  title: string
  slug: { current: string }
}

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(PRACTICE_AREA_SLUGS_QUERY).catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const area: PracticeAreaDetail | null = await client.fetch(PRACTICE_AREA_BY_SLUG_QUERY, { slug })
  return {
    title: area ? `${area.title} | Panza Maurer` : 'Practice Area | Panza Maurer',
  }
}

export default async function PracticeAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { sanityClient, cacheTags } = await getDraftModeClient()

  const [area, allAreas] = await Promise.all([
    sanityClient.fetch<PracticeAreaDetail | null>(PRACTICE_AREA_BY_SLUG_QUERY, { slug }, cacheTags(['practiceAreas'])),
    sanityClient.fetch<PracticeAreaListItem[]>(PRACTICE_AREAS_LIST_QUERY, {}, cacheTags(['practiceAreas'])),
  ])

  if (!area) {
    notFound()
  }

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Navbar />
      <main className='w-full pt-[145px] lg:pt-[109px]'>
        {/* Hero */}
        <section
          className='relative w-full rounded-br-[30px]'
          style={{
            background:
              'linear-gradient(-57.8deg, rgba(100,116,139,0) 57.5%, rgba(0,105,255,0.1) 103.2%), linear-gradient(90deg, rgba(255,255,255,0) 20.3%, rgba(255,255,255,0.7) 85.8%), linear-gradient(90deg, rgba(229,233,241,0.8) 0%, rgba(229,233,241,0.8) 100%), linear-gradient(90deg, #f3f4f6 0%, #f3f4f6 100%)',
          }}
        >
          <div className='mx-auto h-auto min-h-[160px] max-w-[1440px] pt-[100px] lg:h-[216px] lg:min-h-0 lg:pt-0'>
            <div className='flex h-full flex-col items-center justify-center px-6 py-6 lg:pt-[36px] lg:pb-0'>
              <div className='flex w-[800px] max-w-full flex-col items-center gap-[15px] text-center'>
                <span className='text-xs font-bold uppercase tracking-[3px] text-primary-red'>
                  Practice Area
                </span>
                <h1 className='font-[family-name:var(--font-hanken)] text-[28px] font-semibold leading-[1.3] tracking-[-0.52px] text-slate-600 sm:text-[36px] lg:text-[44px]'>
                  {area.title}
                </h1>
                <Image
                  src='/images/underline-2.svg'
                  alt=''
                  width={293}
                  height={4}
                  className='w-[200px] sm:w-[293px]'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Attorneys (e.g. Government Relations team) */}
        {area.featuredAttorneys && area.featuredAttorneys.length > 0 && (
          <section className='bg-white'>
            <div className='mx-auto max-w-[1440px] px-6 py-16 sm:px-8 lg:px-28'>
              <h2 className='mb-10 text-center font-[family-name:var(--font-hanken)] text-[28px] font-semibold text-gray-900 lg:text-[32px]'>
                Our {area.title} Team
              </h2>
              <div className='grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                {area.featuredAttorneys.filter((m) => m != null && m.slug?.current).map((member) => {
                  const imgSrc = member.image
                    ? urlFor(member.image).width(600).height(600).url()
                    : null
                  return (
                    <Link
                      key={member._id}
                      href={`/attorneys/${member.slug.current}`}
                      className='group flex w-full max-w-[300px] flex-col items-center'
                    >
                      <div className='relative mb-4 aspect-square w-full overflow-hidden rounded-lg bg-slate-100'>
                        {imgSrc && (
                          <Image
                            src={imgSrc}
                            alt={member.name}
                            fill
                            sizes='300px'
                            className='object-cover object-top transition-transform duration-300 group-hover:scale-105'
                          />
                        )}
                      </div>
                      <h3 className='font-[family-name:var(--font-hanken)] text-lg font-semibold text-gray-900'>
                        {member.name}
                      </h3>
                      <p className='text-sm text-gray-600'>{member.role}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className='bg-white'>
          <div className='mx-auto flex max-w-[1440px] flex-col gap-12 px-6 py-16 sm:px-8 lg:flex-row lg:gap-20 lg:px-28'>
            {/* Left: Article content */}
            <div className='flex-1'>
              <h2 className='mb-8 font-[family-name:var(--font-hanken)] text-2xl font-semibold text-gray-900 lg:text-[30px]'>
                {area.heading}
              </h2>
              <div className='font-[family-name:var(--font-noto)] text-base leading-7 text-gray-700'>
                {area.content?.map((paragraph, i) => (
                  <p key={i} className='mb-6 text-justify'>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className='w-full flex-shrink-0 lg:sticky lg:top-[130px] lg:w-[340px] lg:self-start'>
              <h3 className='mb-6 font-[family-name:var(--font-hanken)] text-xl font-semibold text-gray-900'>
                Practice Areas
              </h3>
              <div className='flex flex-col'>
                {allAreas.map((pa) => (
                  <Link
                    key={pa._id}
                    href={`/practice-areas/${pa.slug.current}`}
                    className={`flex items-center justify-between border-b border-gray-100 py-3.5 text-sm transition-colors ${
                      pa.slug.current === slug
                        ? 'font-semibold text-primary-red'
                        : 'text-gray-700 hover:text-primary-red'
                    }`}
                  >
                    {pa.title}
                    <svg
                      className='h-4 w-4 flex-shrink-0 text-primary-red'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
