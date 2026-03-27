import Image from 'next/image'
import { client } from '@/sanity/client'
import { urlFor } from '@/sanity/image'
import { LOCATIONS_QUERY } from '@/sanity/queries/locations'

type Location = {
  _id: string
  name: string
  image?: { asset: { _ref: string } } | null
  order: number
}

export default async function Locations({
  preloadedLocations,
}: {
  preloadedLocations?: Location[]
}) {
  const locations: Location[] =
    preloadedLocations ??
    (await client
      .fetch(LOCATIONS_QUERY, {}, { next: { tags: ['locations'] } })
      .catch(() => []))

  return (
    <section id='locations' className='w-full bg-[#f3f4f6]'>
      <div className='mx-auto max-w-[1216px] px-8 py-20 lg:py-40'>
        <div className='flex flex-col items-center gap-20'>
          {/* Heading */}
          <div className='flex flex-col items-center gap-3'>
            <h2 className='font-[family-name:var(--font-hanken)] text-4xl font-semibold tracking-tight text-gray-950 lg:text-[52px] lg:leading-[1.6]'>
              Our Locations
            </h2>
            <Image src='/images/underline-2.svg' alt='' width={122} height={4} />
          </div>

          {/* Location Cards */}
          <div className='flex w-full flex-col gap-0.5 lg:flex-row'>
            {locations.map((location, index) => {
              const imgSrc = location.image
                ? urlFor(location.image).width(800).height(500).url()
                : null

              return (
                <div
                  key={location._id}
                  className={`group relative h-[250px] w-full overflow-hidden sm:h-[400px] lg:h-[500px] ${
                    index === 0 ? 'lg:flex-1' : 'lg:w-[404px]'
                  }`}
                >
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={location.name}
                      fill
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                  ) : (
                    <div className='h-full bg-slate-200' />
                  )}
                  {/* Dark overlay */}
                  <div
                    className='absolute inset-0 transition-opacity duration-500 group-hover:opacity-0'
                    style={{ background: 'rgba(17, 24, 39, 0.52)' }}
                  />
                  {/* Bottom gradient */}
                  <div
                    className='absolute inset-0'
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)',
                    }}
                  />
                  <div className='absolute inset-x-0 bottom-0 p-6'>
                    <p className='font-[family-name:var(--font-noto)] text-2xl font-medium leading-10 text-white'>
                      {location.name}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
