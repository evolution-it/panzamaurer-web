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
  title: 'Contact Us | Panza Maurer',
}

type Location = {
  _id: string
  name: string
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

export default async function ContactPage() {
  const { sanityClient, cacheTags } = await getDraftModeClient()

  const [pageConfig, fallbackLocations] = await Promise.all([
    sanityClient
      .fetch<PageConfig>(PAGE_BY_SLUG_QUERY, { slug: 'contact' }, cacheTags(['locations', 'pages']))
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
        <PageHero
          title='Contact Us'
          subtitle='Every Second Counts! When you need serious counsel every second counts. Panza Maurer is ready to navigate a successful result. Our experienced strategic approach provides the foundation for every case we engage in. Please do not hesitate to contact us.'
        />

        <section className='bg-white'>
          <div className='mx-auto max-w-[1440px] px-8 py-16 lg:px-28'>
            <div className='grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3'>
              {offices.map((office) => {
                const imgSrc = office.image
                  ? urlFor(office.image).width(600).height(440).url()
                  : null

                return (
                  <div key={office._id} className='flex flex-col gap-8'>
                    <div className='relative h-[220px] overflow-hidden rounded-[10px]'>
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

                    <div className='flex flex-col gap-3'>
                      <h2 className='font-[family-name:var(--font-hanken)] text-3xl font-semibold text-slate-600 lg:text-[42px] lg:leading-[50px]'>
                        {office.name}
                      </h2>
                      <div className='h-[2px] w-[168px] bg-primary-red' />

                      <div className='mt-2'>
                        <LocationAddress
                          building={office.building}
                          address={office.address}
                          city={office.city}
                          phone={office.phone}
                          fax={office.fax}
                        />
                      </div>

                      {office.phone && (
                        <a
                          href={`tel:${office.phone.replace(/[^\d]/g, '')}`}
                          aria-label={`Call ${office.name}`}
                          className='mt-2 inline-flex w-fit items-center justify-center rounded-lg bg-primary-red px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-red-800'
                        >
                          Call Now
                        </a>
                      )}
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
