import Image from 'next/image'
import Navbar from '@/components/Navbar'
import PageHero from '@/components/PageHero'
import LocationAddress from '@/components/LocationAddress'
import Footer from '@/components/Footer'
import { getDraftModeClient } from '@/sanity/draftMode'
import { urlFor } from '@/sanity/image'
import { LOCATIONS_QUERY } from '@/sanity/queries/locations'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries/pages'

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

type PageSection = { _type: string; locations?: Location[] }
type PageConfig = { sections?: PageSection[] }

export default async function LocationsPage() {
  const { sanityClient, cacheTags } = await getDraftModeClient()

  const [pageConfig, fallbackLocations] = await Promise.all([
    sanityClient
      .fetch<PageConfig>(PAGE_BY_SLUG_QUERY, { slug: 'locations' }, cacheTags(['locations', 'pages']))
      .catch(() => null),
    sanityClient
      .fetch<Location[]>(LOCATIONS_QUERY, {}, cacheTags(['locations']))
      .catch(() => [] as Location[]),
  ])

  const locationsSection = pageConfig?.sections?.find((s) => s._type === 'locationsSection')
  const offices: Location[] =
    locationsSection?.locations && locationsSection.locations.length > 0
      ? locationsSection.locations
      : fallbackLocations

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Navbar />
      <main id='main-content' className='w-full pt-[145px] lg:pt-[109px]'>
        <PageHero title='Our Locations' />

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

                    <div className='flex flex-1 flex-col gap-4'>
                      <h2 className='font-[family-name:var(--font-hanken)] text-3xl font-semibold text-slate-600 lg:text-[42px] lg:leading-[50px]'>
                        {office.name}
                      </h2>
                      <Image src='/images/underline-1.svg' alt='' width={168} height={4} />
                      <div className='mt-2'>
                        <LocationAddress
                          building={office.building}
                          address={office.address}
                          city={office.city}
                          phone={office.phone}
                          fax={office.fax}
                        />
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
