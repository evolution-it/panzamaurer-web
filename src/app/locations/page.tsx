import Image from 'next/image'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import Footer from '@/components/Footer'
import { client, getDraftClient } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { LOCATIONS_QUERY } from '@/sanity/queries/locations'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries/pages'
import { draftMode } from 'next/headers'

export const metadata = {
  title: 'Locations | Panza Maurer',
}

type Location = {
  _id: string
  name: string
  slug: { current: string }
  image?: { asset: { _ref: string } } | null
  building?: string
  address?: string[]
  city?: string
  phone?: string
  fax?: string
  order: number
}

type PageSection = {
  _type: string
  locations?: Location[]
}

type PageConfig = { sections?: PageSection[] }

export default async function LocationsPage() {
  const { isEnabled } = await draftMode()
  const sanityClient = isEnabled ? getDraftClient() : client
  const fetchOptions = isEnabled
    ? { cache: 'no-store' as const }
    : { next: { tags: ['locations', 'pages'] } }

  // Use page config ordering/selection if available, otherwise all locations
  const pageConfig: PageConfig | null = await sanityClient
    .fetch(PAGE_BY_SLUG_QUERY, { slug: 'locations' }, fetchOptions)
    .catch(() => null)

  const locationsSection = pageConfig?.sections?.find((s) => s._type === 'locationsSection')
  const offices: Location[] =
    locationsSection?.locations && locationsSection.locations.length > 0
      ? locationsSection.locations
      : await sanityClient.fetch(LOCATIONS_QUERY, {}, fetchOptions).catch(() => [])

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Navbar />
      <main className='w-full pt-[145px] lg:pt-[109px]'>
        <PageHero
          title='Our Locations'
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Locations' },
          ]}
        />

        <section className='bg-white'>
          <div className='mx-auto max-w-[1440px] px-8 py-16 lg:px-28'>
            <div className='flex flex-col gap-20'>
              {offices.map((office) => {
                const imgSrc = office.image
                  ? urlFor(office.image).width(800).height(560).url()
                  : null

                return (
                  <div
                    key={office._id}
                    className='flex flex-col gap-10 lg:flex-row lg:items-start'
                  >
                    {/* Image */}
                    <div className='relative h-[280px] w-full overflow-hidden rounded-[10px] lg:w-[400px]'>
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={office.name}
                          fill
                          className='object-cover'
                        />
                      ) : (
                        <div className='h-full bg-slate-100' />
                      )}
                    </div>

                    {/* Info */}
                    <div className='flex flex-1 flex-col gap-4'>
                      <h2 className='font-[family-name:var(--font-hanken)] text-3xl font-semibold text-slate-600 lg:text-[42px] lg:leading-[50px]'>
                        {office.name}
                      </h2>
                      <Image
                        src='/images/underline-1.svg'
                        alt=''
                        width={168}
                        height={4}
                      />

                      <div className='mt-2 flex flex-col gap-1'>
                        <div className='flex items-start gap-3'>
                          <Image
                            src='/images/location-pin.svg'
                            alt=''
                            width={18}
                            height={18}
                            className='mt-1'
                          />
                          <div>
                            {office.building && (
                              <p className='font-semibold text-gray-950'>{office.building}</p>
                            )}
                            {office.address?.map((line, i) => (
                              <p key={i} className='font-semibold text-gray-950'>{line}</p>
                            ))}
                            {office.city && (
                              <p className='font-semibold text-gray-950'>{office.city}</p>
                            )}
                          </div>
                        </div>

                        <div className='mt-3 flex flex-col gap-1 pl-[30px]'>
                          {office.phone && (
                            <p className='text-gray-950'>{office.phone} (T)</p>
                          )}
                          {office.fax && (
                            <p className='text-gray-950'>{office.fax} (F)</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
