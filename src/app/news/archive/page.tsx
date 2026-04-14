import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import { getDraftModeClient } from '@/sanity/draftMode'
import { ARCHIVE_NEWS_QUERY, ARCHIVE_NEWS_COUNT_QUERY } from '@/sanity/queries/news'
import { urlFor } from '@/sanity/image'
import type { SanityImageSource } from '@sanity/image-url'

export const metadata = {
  title: 'News Archive | Panza Maurer',
}

const PAGE_SIZE = 6

type NewsCard = {
  _id: string
  title: string
  slug: { current: string }
  date: string
  excerpt: string
  categories: string[]
  listingImages?: SanityImageSource | null
}

export default async function NewsArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const { sanityClient, cacheTags } = await getDraftModeClient()

  const currentPage = Math.max(1, parseInt(page ?? '1', 10) || 1)

  const [totalCount, posts] = await Promise.all([
    sanityClient.fetch<number>(ARCHIVE_NEWS_COUNT_QUERY, {}, cacheTags(['news'])),
    sanityClient.fetch<NewsCard[]>(
      ARCHIVE_NEWS_QUERY,
      { from: (currentPage - 1) * PAGE_SIZE, to: currentPage * PAGE_SIZE },
      cacheTags(['news']),
    ),
  ])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)
  const clampedPage = Math.min(currentPage, Math.max(1, totalPages))

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Navbar />
      <main id='main-content' className='w-full pt-[109px]'>
        <PageHero title='News Archive' subtitle='More Firm News & Events' />

        <section className='bg-white'>
          <div className='mx-auto max-w-[1440px] px-8 py-12 lg:px-28'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {posts.map((post) => {
                const listingImg = post.listingImages
                  ? urlFor(post.listingImages).width(600).height(400).url()
                  : null
                return (
                  <Link
                    key={post._id}
                    href={`/news/${post.slug.current}`}
                    prefetch={false}
                    className='group flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md'
                  >
                    {listingImg && (
                      <div className='relative h-[200px] w-full overflow-hidden bg-gray-100'>
                        <Image
                          src={listingImg}
                          alt={post.title}
                          fill
                          sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                          className='object-cover object-top transition-transform duration-300 group-hover:scale-105'
                        />
                      </div>
                    )}
                    <div className='flex flex-1 flex-col gap-3 p-6'>
                      <time
                        dateTime={post.date}
                        className='text-sm font-medium text-gray-400'
                      >
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <h3 className='font-[family-name:var(--font-hanken)] text-lg font-semibold leading-snug text-gray-950'>
                        {post.title}
                      </h3>
                      <p className='flex-1 text-sm leading-6 text-gray-600'>{post.excerpt}</p>
                      <span className='mt-2 text-sm font-semibold text-primary-red transition-colors group-hover:text-red-800'>
                        Read More →
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {totalPages > 1 && (
              <nav aria-label='Pagination' className='mt-12 flex items-center justify-center gap-2'>
                <PaginationLink
                  href={`/news/archive?page=${clampedPage - 1}`}
                  disabled={clampedPage === 1}
                  aria-label='Previous page'
                >
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                    aria-hidden='true'
                    focusable='false'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
                  </svg>
                </PaginationLink>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationLink
                    key={p}
                    href={`/news/archive?page=${p}`}
                    active={p === clampedPage}
                    aria-label={`Page ${p}`}
                  >
                    {p}
                  </PaginationLink>
                ))}

                <PaginationLink
                  href={`/news/archive?page=${clampedPage + 1}`}
                  disabled={clampedPage === totalPages}
                  aria-label='Next page'
                >
                  <svg
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                    aria-hidden='true'
                    focusable='false'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
                  </svg>
                </PaginationLink>
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function PaginationLink({
  href,
  children,
  active,
  disabled,
  'aria-label': ariaLabel,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  'aria-label'?: string
}) {
  const base = 'flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors'
  const styles = disabled
    ? `${base} cursor-not-allowed text-gray-300 border border-gray-200`
    : active
      ? `${base} bg-primary-red text-white`
      : `${base} border border-gray-300 text-gray-600 hover:border-primary-red hover:text-primary-red`

  if (disabled) {
    return (
      <span className={styles} aria-label={ariaLabel} aria-disabled='true'>
        {children}
      </span>
    )
  }

  return (
    <Link
      href={href}
      className={styles}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}
