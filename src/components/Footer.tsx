import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/client';
import { LOCATIONS_QUERY } from '@/sanity/queries/locations';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries/siteSettings';

type Location = {
  _id: string;
  name: string;
  building?: string;
  address?: string[];
  city?: string;
  phone?: string;
};

type SiteSettings = {
  footerTagline?: string;
};

export default async function Footer() {
  const [locations, settings] = await Promise.all([
    client
      .fetch<Location[]>(LOCATIONS_QUERY, {}, { next: { tags: ['locations'] } })
      .catch(() => [] as Location[]),
    client
      .fetch<SiteSettings>(
        SITE_SETTINGS_QUERY,
        {},
        { next: { tags: ['siteSettings'] } },
      )
      .catch(() => null),
  ]);

  const tagline =
    settings?.footerTagline ??
    'Copyright © Panza, Maurer & Maynard 2026 All Rights Reserved.';

  return (
    <footer className='w-full bg-dark-navy'>
      <div className='mx-auto max-w-[1440px] px-8 py-12 lg:px-28 lg:py-16'>
        <div className='flex flex-col gap-8'>
          <Link href='/' className='flex-shrink-0'>
            <Image
              src='/images/footer-logo.svg'
              alt='Panza Maurer'
              width={333}
              height={64}
            />
          </Link>

          <p className='font-[family-name:var(--font-noto)] text-base font-normal text-gray-400'>
            {tagline}
          </p>

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
                    <a
                      href={`tel:${loc.phone.replace(/[^\d+]/g, '')}`}
                      className='mt-1 font-[family-name:var(--font-noto)] text-base font-normal leading-[26px] text-gray-300 hover:text-white transition-colors'
                    >
                      {loc.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className='font-[family-name:var(--font-noto)] pt-8 text-xs font-normal text-gray-400'>
            Copyright © Panza, Maurer &amp; Maynard 2026 All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
