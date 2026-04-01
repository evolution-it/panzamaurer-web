import Image from 'next/image'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { client } from '@/sanity/client'
import { getDraftModeClient } from '@/sanity/draftMode'
import { urlFor } from '@/sanity/image'
import { ATTORNEY_BY_SLUG_QUERY, ATTORNEY_SLUGS_QUERY } from '@/sanity/queries/attorneys'

type AttorneyDetail = {
  _id: string
  name: string
  firstName: string
  role: string
  slug: { current: string }
  image?: { asset: { _ref: string } } | null
  type: string
  status: string
  intro: string
  education: string[]
  barAdmissions: string[]
  courtAdmissions: string[]
  professionalMemberships: string[]
  sections: { title: string; content: string[] }[]
}

export async function generateStaticParams() {
  const slugs: string[] = await client.fetch(ATTORNEY_SLUGS_QUERY).catch(() => [])
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const attorney: AttorneyDetail | null = await client.fetch(ATTORNEY_BY_SLUG_QUERY, { slug })
  return {
    title: attorney ? `${attorney.name} | Panza Maurer` : 'Attorney | Panza Maurer',
  }
}

export default async function AttorneyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { sanityClient, cacheTags } = await getDraftModeClient()

  const attorney: AttorneyDetail | null = await sanityClient.fetch(
    ATTORNEY_BY_SLUG_QUERY,
    { slug },
    cacheTags(['attorneys']),
  )

  if (!attorney) {
    notFound()
  }

  const imgSrc = attorney.image
    ? urlFor(attorney.image).width(480).height(560).url()
    : null

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Navbar />
      <main className='w-full pt-[145px] lg:pt-[109px]'>
        {/* Profile Hero */}
        <section
          className='relative w-full overflow-hidden'
          style={{
            background:
              'linear-gradient(-57.8deg, rgba(100,116,139,0) 57.5%, rgba(0,105,255,0.1) 103.2%), linear-gradient(90deg, rgba(255,255,255,0) 20.3%, rgba(255,255,255,0.7) 85.8%), linear-gradient(90deg, rgba(229,233,241,0.8) 0%, rgba(229,233,241,0.8) 100%), linear-gradient(90deg, #f3f4f6 0%, #f3f4f6 100%)',
          }}
        >
          <div className='mx-auto flex max-w-[1440px] flex-col items-center px-6 pb-0 pt-16 sm:px-8 lg:flex-row lg:items-end lg:px-28'>
            <div className='flex flex-1 flex-col gap-2 pb-6 text-center lg:pb-12 lg:text-left'>
              <Image
                src='/images/underline-1.svg'
                alt=''
                width={80}
                height={4}
                className='lg:mx-0'
              />
              <span className='font-[family-name:var(--font-inter)] text-sm font-semibold uppercase tracking-[3px] text-slate-500'>
                Profile
              </span>
              <h1 className='font-[family-name:var(--font-hanken)] text-3xl font-semibold text-slate-800 sm:text-4xl lg:text-[52px] lg:leading-[1.3]'>
                {attorney.name}
              </h1>
              <p className='font-[family-name:var(--font-noto)] text-lg text-slate-500'>
                {attorney.role}
              </p>
            </div>

            {/* Mobile profile image */}
            {imgSrc && (
              <div className='relative mb-0 h-[250px] w-[220px] flex-shrink-0 lg:hidden'>
                <Image
                  src={imgSrc}
                  alt={attorney.name}
                  fill
                  className='rounded-t-xl object-cover object-top'
                />
              </div>
            )}
            {/* Desktop profile image */}
            {imgSrc && (
              <div className='relative hidden h-[280px] w-[240px] flex-shrink-0 lg:block'>
                <Image
                  src={imgSrc}
                  alt={attorney.name}
                  fill
                  className='rounded-t-xl object-cover object-top'
                />
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <section className='w-full bg-white py-16'>
          <div className='mx-auto flex max-w-[1440px] flex-col gap-12 px-8 lg:flex-row lg:gap-20 lg:px-28'>
            {/* Left: Bio */}
            <div className='flex-1'>
              <h2 className='mb-8 font-[family-name:var(--font-hanken)] text-3xl font-semibold text-gray-900 lg:text-[36px]'>
                About {attorney.firstName}
              </h2>

              <div className='font-[family-name:var(--font-noto)] text-base leading-7 text-gray-700'>
                {attorney.intro && (
                  <p className='mb-6 text-justify'>{attorney.intro}</p>
                )}

                {attorney.sections?.map((section) => (
                  <div key={section.title} className='mb-8'>
                    {section.title && (
                      <h3 className='mb-4 font-[family-name:var(--font-noto)] text-xl font-bold text-gray-900'>
                        {section.title}
                      </h3>
                    )}
                    {section.content?.map((paragraph, i) => (
                      <p key={i} className='mb-4 text-justify'>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className='w-full flex-shrink-0 lg:sticky lg:top-[130px] lg:w-[340px] lg:self-start'>
              <div className='flex flex-col gap-6'>
                {(attorney.education.length > 0 || attorney.barAdmissions.length > 0 || attorney.courtAdmissions.length > 0 || attorney.professionalMemberships.length > 0) && (
                  <div>
                    <h3 className='font-[family-name:var(--font-noto)] text-lg font-bold text-gray-900'>
                      Credentials
                    </h3>
                    <div className='mt-2 h-[3px] w-10 bg-primary-red' />
                  </div>
                )}

                {attorney.education?.length > 0 && (
                  <div>
                    <h4 className='mb-2 font-[family-name:var(--font-noto)] text-sm font-bold text-gray-900'>
                      Education
                    </h4>
                    <ul className='flex flex-col gap-1'>
                      {attorney.education.map((item) => (
                        <li
                          key={item}
                          className='flex items-start gap-2 font-[family-name:var(--font-noto)] text-sm text-gray-600'
                        >
                          <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {attorney.barAdmissions?.length > 0 && (
                  <div>
                    <h4 className='mb-2 font-[family-name:var(--font-noto)] text-sm font-bold text-gray-900'>
                      Bar Admissions
                    </h4>
                    <ul className='flex flex-col gap-1'>
                      {attorney.barAdmissions.map((item) => (
                        <li
                          key={item}
                          className='flex items-start gap-2 font-[family-name:var(--font-noto)] text-sm text-gray-600'
                        >
                          <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {attorney.courtAdmissions?.length > 0 && (
                  <div>
                    <h4 className='mb-2 font-[family-name:var(--font-noto)] text-sm font-bold text-gray-900'>
                      Court Admissions
                    </h4>
                    <ul className='flex flex-col gap-1'>
                      {attorney.courtAdmissions.map((item) => (
                        <li
                          key={item}
                          className='flex items-start gap-2 font-[family-name:var(--font-noto)] text-sm text-gray-600'
                        >
                          <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {attorney.professionalMemberships?.length > 0 && (
                  <div>
                    <h4 className='mb-2 font-[family-name:var(--font-noto)] text-sm font-bold text-gray-900'>
                      Professional Memberships and Associations
                    </h4>
                    <ul className='flex flex-col gap-1'>
                      {attorney.professionalMemberships.map((item) => (
                        <li
                          key={item}
                          className='flex items-start gap-2 font-[family-name:var(--font-noto)] text-sm text-gray-600'
                        >
                          <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
