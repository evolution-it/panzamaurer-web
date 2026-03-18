import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import newsData from '@/data/news.json';
import ReactMarkdown from 'react-markdown';

export function generateStaticParams() {
  return newsData.articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = newsData.articles.find((a) => a.slug === slug);
  return {
    title: article ? `${article.title} | Panza Maurer` : 'News | Panza Maurer',
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = newsData.articles.find((a) => a.slug === slug);

  if (!post) {
    return (
      <div className='flex min-h-screen flex-col items-center'>
        <Navbar />
        <main className='flex w-full flex-1 items-center justify-center pt-[145px] lg:pt-[109px]'>
          <p className='text-xl text-gray-600'>Article not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const images = post.images.map((img) => `/images/news/${img}`);

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
              {post.categories.length > 0 && (
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
                {post.date}
              </p>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className='bg-white'>
          <div className='mx-auto max-w-[1440px] px-8 py-16 lg:px-28'>
            <div className='mx-auto max-w-[700px]'>
              {/* Article Images */}
              {images.length > 0 && (
                <div className='mb-10 flex flex-col gap-6'>
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className='relative h-[300px] overflow-hidden rounded-lg md:h-[400px]'
                    >
                      <Image
                        src={src}
                        alt={`${post.title} image ${i + 1}`}
                        fill
                        className='object-cover'
                      />
                    </div>
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
                      <strong className='font-semibold text-gray-900'>
                        {children}
                      </strong>
                    ),
                    ul: ({ children }) => (
                      <ul className='mb-4 ml-6 list-disc space-y-1'>
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className='mb-4 ml-6 list-decimal space-y-1'>
                        {children}
                      </ol>
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
                    em: ({ children }) => (
                      <em className='italic'>{children}</em>
                    ),
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
