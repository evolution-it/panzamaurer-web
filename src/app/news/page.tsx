import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import { getDraftModeClient } from '@/sanity/draftMode'
import { urlFor } from '@/sanity/image'
import { LATEST_NEWS_QUERY } from '@/sanity/queries/news'

export const metadata = {
  title: 'News | Panza Maurer',
}

type NewsCard = {
  _id: string
  title: string
  slug: { current: string }
  date: string
  excerpt: string
  categories: string[]
  listingImages?: { asset: { _id: string; url: string } } | null
}

export default async function NewsPage() {
  const { sanityClient, cacheTags } = await getDraftModeClient()

  const posts: NewsCard[] = await sanityClient.fetch(LATEST_NEWS_QUERY, {}, cacheTags(['news']))

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Navbar />
      <main className='w-full pt-[109px]'>
        <PageHero title='News' subtitle='Recent Firm News & Events' />

        <section className='bg-white'>
          <div className='mx-auto max-w-[1440px] px-8 py-12 lg:px-28'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {posts.map((post) => {
                const listingImg = post.listingImages?.asset?.url ?? null
                return (
                  <Link
                    key={post._id}
                    href={`/news/${post.slug.current}`}
                    className='group flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md'
                  >
                    {listingImg && (
                      <div className='relative h-[200px] w-full overflow-hidden bg-gray-100'>
                        <Image
                          src={listingImg}
                          alt={post.title}
                          fill
                          className='object-cover object-top transition-transform duration-300 group-hover:scale-105'
                        />
                      </div>
                    )}
                    <div className='flex flex-1 flex-col gap-3 p-6'>
                      <p className='text-sm font-medium text-gray-400'>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
