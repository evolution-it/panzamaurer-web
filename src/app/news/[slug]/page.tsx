import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReactMarkdown from 'react-markdown'
import { client } from '@/sanity/client'
import { getDraftModeClient } from '@/sanity/draftMode'
import { NEWS_ARTICLE_BY_SLUG_QUERY, NEWS_SLUGS_QUERY } from '@/sanity/queries/news'
import { notFound } from 'next/navigation'

type NewsArticle = {
  _id: string
  title: string
  slug: { current: string }
  date: string
  author?: string
  excerpt: string
  content: string
  categories: string[]
  images?: { asset: { _id: string; url: string } }[]
  listingImages?: { asset: { _id: string; url: string } } | null
  status: string
}

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(NEWS_SLUGS_QUERY).catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article: NewsArticle | null = await client.fetch(NEWS_ARTICLE_BY_SLUG_QUERY, { slug })
  return {
    title: article ? `${article.title} | Panza Maurer` : 'News | Panza Maurer',
  }
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { sanityClient, cacheTags } = await getDraftModeClient()

  const post: NewsArticle | null = await sanityClient.fetch(
    NEWS_ARTICLE_BY_SLUG_QUERY,
    { slug },
    cacheTags(['news']),
  )

  if (!post) {
    notFound()
  }

  const articleImages = post.images?.map((img) => img.asset.url).filter(Boolean) ?? []

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
          <div className='mx-auto max-w-[1440px]'>
            <div className='flex flex-col items-center px-8 pb-8 pt-16 text-center'>
              {post.categories && post.categories.length > 0 && (
                <span className='mb-4 text-xs font-bold uppercase tracking-[3px] text-primary-red'>
                  {post.categories[0]}
                </span>
              )}
              <Image
                src='/images/underline-2.svg'
                alt=''
                width={293}
                height={4}
                className='w-[200px] sm:w-[293px]'
              />
              <h1 className='mb-3 mt-2 max-w-[700px] font-[family-name:var(--font-hanken)] text-[36px] font-semibold leading-[1.3] tracking-[-0.36px] text-slate-600 md:text-[44px]'>
                {post.title}
              </h1>
              <p className='mb-6 text-sm font-medium text-gray-400'>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className='bg-white'>
          <div className='mx-auto max-w-[1440px] px-8 py-16 lg:px-28'>
            <div className='mx-auto max-w-[700px]'>
              {/* Article Images */}
              {articleImages.length > 0 && (
                <div className='mb-10 flex flex-col gap-6'>
                  {articleImages.map((src, i) => (
                    <Image
                      key={i}
                      src={src}
                      alt={`${post.title} image ${i + 1}`}
                      width={0}
                      height={0}
                      sizes='100vw'
                      className='h-auto w-full rounded-lg'
                    />
                  ))}
                </div>
              )}

              {/* Article Body */}
              <div className='prose prose-gray max-w-none text-[15px] leading-[1.8] text-gray-700'>
                <ReactMarkdown
                  components={{
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary-red underline hover:text-red-800'
                      >
                        {children}
                      </a>
                    ),
                    p: ({ children }) => <p className='mb-4'>{children}</p>,
                    strong: ({ children }) => (
                      <strong className='font-semibold text-gray-900'>{children}</strong>
                    ),
                    ul: ({ children }) => (
                      <ul className='mb-4 ml-6 list-disc space-y-1'>{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className='mb-4 ml-6 list-decimal space-y-1'>{children}</ol>
                    ),
                    li: ({ children }) => <li>{children}</li>,
                    h2: ({ children }) => (
                      <h2 className='mb-3 mt-8 font-[family-name:var(--font-hanken)] text-2xl font-semibold text-gray-900'>
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className='mb-2 mt-6 font-[family-name:var(--font-hanken)] text-xl font-semibold text-gray-900'>
                        {children}
                      </h3>
                    ),
                    em: ({ children }) => <em className='italic'>{children}</em>,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Navigation */}
              <div className='mt-12 flex items-center justify-between border-t border-gray-200 pt-8'>
                <Link
                  href='/news'
                  className='group inline-flex items-center gap-3 text-sm font-semibold text-gray-500 transition-colors hover:text-primary-red'
                >
                  <span className='flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition-colors group-hover:border-primary-red group-hover:text-primary-red'>
                    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M19 12H5M12 5l-7 7 7 7' />
                    </svg>
                  </span>
                  Back to News
                </Link>
                <Link
                  href='/news/archive'
                  className='group inline-flex items-center gap-3 text-sm font-semibold text-gray-500 transition-colors hover:text-primary-red'
                >
                  News Archive
                  <span className='flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 transition-colors group-hover:border-primary-red group-hover:text-primary-red'>
                    <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14M12 5l7 7-7 7' />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
