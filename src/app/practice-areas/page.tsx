import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import { getDraftModeClient } from '@/sanity/draftMode'
import { PRACTICE_AREAS_LIST_QUERY } from '@/sanity/queries/practiceAreas'

export const metadata = {
  title: 'Practice Areas | Panza Maurer',
}

type PracticeArea = {
  _id: string
  title: string
  slug: { current: string }
  heading?: string
  summary?: string
  status: string
}

export default async function PracticeAreasPage() {
  const { sanityClient, cacheTags } = await getDraftModeClient()

  const practiceAreas: PracticeArea[] = await sanityClient
    .fetch(PRACTICE_AREAS_LIST_QUERY, {}, cacheTags(['practiceAreas']))
    .catch(() => [] as PracticeArea[])

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Navbar />
      <main className='w-full pt-[145px] lg:pt-[109px]'>
        <PageHero title='Practice Areas' />

        <section className='bg-white'>
          <div className='mx-auto max-w-[1440px] px-8 py-8 lg:px-28'>
            <h2 className='mb-8 font-[family-name:var(--font-hanken)] text-3xl font-semibold text-slate-700'>
              Industries | Cases We Handle
            </h2>

            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {practiceAreas.map((area) => (
                <div
                  key={area._id}
                  className='flex flex-col gap-4 rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md'
                >
                  <h3 className='font-[family-name:var(--font-hanken)] text-lg font-semibold text-gray-950'>
                    {area.title}
                  </h3>
                  {(area.summary || area.heading) && (
                    <p className='text-sm leading-6 text-gray-600'>{area.summary || area.heading}</p>
                  )}
                  <Link
                    href={`/practice-areas/${area.slug.current}`}
                    className='mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary-red transition-colors hover:text-red-800'
                  >
                    View Service
                    <Image src='/images/arrow-up-right.svg' alt='' width={14} height={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
