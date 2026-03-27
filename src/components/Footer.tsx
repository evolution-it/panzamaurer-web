import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/client'
import { LOCATIONS_QUERY } from '@/sanity/queries/locations'

type Location = {
  _id: string
  name: string
  building?: string
  address?: string[]
  city?: string
  phone?: string
}

export default async function Footer() {
  const locations: Location[] = await client
    .fetch(LOCATIONS_QUERY, {}, { next: { tags: ['locations'] } })
    .catch(() => [])

  return (
    <footer className='w-full bg-dark-navy'>
      <div className='mx-auto max-w-[1440px] px-8 py-12 lg:px-28 lg:py-16'>
        <div className='flex flex-col gap-20'>
          {/* Logo */}
          <Link href='/' className='flex-shrink-0'>
            <Image
              src='/images/footer-logo.svg'
              alt='Panza Maurer'
              width={333}
              height={64}
            />
          </Link>

          {/* Location columns */}
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {locations.map((loc) => (
              <div key={loc._id} className='flex flex-col gap-4'>
                <h3 className='font-[family-name:var(--font-noto)] text-2xl font-medium leading-[34px] text-white'>
                  {loc.name}
                </h3>
                <div className='flex flex-col gap-1'>
                  {loc.building && (
                    <p className='font-[family-name:var(--font-noto)] text-base font-normal leading-[26px] text-gray-300'>
                      {loc.building}
                    </p>
                  )}
                  {loc.address?.map((line, i) => (
                    <p
                      key={i}
                      className='font-[family-name:var(--font-noto)] text-base font-normal leading-[26px] text-gray-300'
                    >
                      {line}
                    </p>
                  ))}
                  {loc.city && (
                    <p className='font-[family-name:var(--font-noto)] text-base font-normal leading-[26px] text-gray-300'>
                      {loc.city}
                    </p>
                  )}
                  {loc.phone && (
                    <p className='mt-1 font-[family-name:var(--font-noto)] text-base font-normal leading-[26px] text-gray-300'>
                      {loc.phone}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <p className='font-[family-name:var(--font-noto)] text-base font-normal leading-6 text-gray-400'>
            Copyright &copy; Panza, Maurer &amp; Maynard 2026 All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
