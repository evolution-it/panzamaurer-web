import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/client'
import { HOME_NEWS_QUERY } from '@/sanity/queries/news'

type NewsItem = {
  _id: string
  title: string
  slug: { current: string }
  date: string
  excerpt: string
  listingImages?: { asset: { _id: string; url: string } } | null
}

function NewsCard({ title, date, excerpt, slug }: NewsItem) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className='flex flex-1 flex-col rounded-2xl border border-gray-700 bg-gray-800/60 backdrop-blur-sm'>
      <div className='flex flex-col gap-4 px-6 pb-8 pt-6'>
        <h3 className='font-[family-name:var(--font-noto)] text-xl font-medium leading-7 text-white'>
          {title}
        </h3>
        <p className='font-[family-name:var(--font-noto)] text-base font-normal leading-6 text-gray-400'>
          {formattedDate}
        </p>
        <p className='font-[family-name:var(--font-noto)] text-base font-normal leading-6 text-gray-300'>
          {excerpt}...
        </p>
        <Link
          href={`/news/${slug.current}`}
          prefetch={false}
          aria-label={`Read: ${title}`}
          className='mt-2 inline-flex items-center gap-2 font-[family-name:var(--font-noto)] text-lg font-medium leading-7 text-red-500 transition-colors hover:text-red-400'
        >
          Read
          <Image src='/images/arrow-up-right.svg' alt='' width={16} height={16} aria-hidden='true' />
        </Link>
      </div>
    </div>
  )
}

export default async function News({ count = 3 }: { count?: number }) {
  const newsItems: NewsItem[] = await client
    .fetch(HOME_NEWS_QUERY, { count }, { next: { tags: ['news'] } })
    .catch(() => [])

  if (newsItems.length === 0) return null

  return (
    <section id='news' className='relative w-full overflow-hidden bg-primary-dark'>
      <Image
        src='/images/cases-bg.jpg'
        alt=''
        fill
        className='object-cover opacity-50'
      />
      <div
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(114.9deg, rgba(185,28,28,0) 68.8%, rgba(185,28,28,0.2) 94.2%), linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)',
        }}
      />

      <div className='relative z-10 mx-auto max-w-[1440px] px-8 py-10 lg:px-[110px]'>
        {/* Row 1: Header + first card */}
        <div className='flex flex-col gap-8 lg:flex-row lg:items-start'>
          <div className='flex flex-1 flex-col gap-4 py-8'>
            <span className='font-[family-name:var(--font-noto)] text-lg font-bold uppercase tracking-[0.72px] text-red-700'>
              Latest News
            </span>
            <h2 className='font-[family-name:var(--font-hanken)] text-4xl font-semibold tracking-tight text-white lg:text-[52px] lg:leading-[1.6]'>
              Panza Maurer News
            </h2>
          </div>
          {newsItems[0] && (
            <div className='flex-1'>
              <NewsCard {...newsItems[0]} />
            </div>
          )}
        </div>

        {/* Row 2: Two cards */}
        {newsItems.length > 1 && (
          <div className='mt-8 flex flex-col gap-8 lg:flex-row'>
            {newsItems[1] && <NewsCard {...newsItems[1]} />}
            {newsItems[2] && <NewsCard {...newsItems[2]} />}
          </div>
        )}
      </div>
    </section>
  )
}
