import Image from 'next/image';
import Link from 'next/link';

type PracticeAreaItem = {
  _id?: string
  title: string
  slug: { current: string }
}

const FALLBACK_AREAS: PracticeAreaItem[] = [
  { title: 'Administrative | Regulatory Law', slug: { current: 'administrative--regulatory-law' } },
  { title: 'Healthcare', slug: { current: 'healthcare' } },
  { title: 'Compliance', slug: { current: 'compliance' } },
  { title: 'Corporate | Transactional', slug: { current: 'corporate--transactional' } },
  { title: 'Litigation', slug: { current: 'litigation' } },
  { title: 'Land Use | Environmental', slug: { current: 'land-use--environmental' } },
  { title: 'Estate Planning | Probate', slug: { current: 'trusts--estates' } },
  { title: 'Technology | IT', slug: { current: 'technology--it' } },
  { title: 'Education Law', slug: { current: 'education-law' } },
  { title: 'Gaming | Hospitality', slug: { current: 'gaming--hospitality' } },
  { title: 'Strategic Planning', slug: { current: 'strategic-planning' } },
  { title: 'Labor | Employment', slug: { current: 'labor--employment' } },
  { title: 'Procurement', slug: { current: 'procurement' } },
  { title: 'Real Property', slug: { current: 'real-property' } },
  { title: 'Receivership | Conservatorship', slug: { current: 'receivership--conservatorship' } },
  { title: 'Medical Marijuana', slug: { current: 'medical-marijuana' } },
];

export default function PracticeAreas({ areas }: { areas?: PracticeAreaItem[] }) {
  const displayAreas = areas && areas.length > 0 ? areas : FALLBACK_AREAS;

  return (
    <section id='practice-areas' className='relative w-full overflow-hidden'>
      <div className='absolute inset-0'>
        <Image
          src='/images/cases-bg.jpg'
          alt=''
          fill
          className='object-cover opacity-50'
        />
        <div
          className='absolute inset-0'
          style={{
            background:
              'linear-gradient(90deg, rgba(17,24,39,0.95) 0%, rgba(17,24,39,0.85) 50%, rgba(17,24,39,0.95) 100%)',
          }}
        />
        <div
          className='absolute inset-0'
          style={{
            background:
              'linear-gradient(180deg, rgba(185,28,28,0.08) 0%, rgba(185,28,28,0) 30%, rgba(185,28,28,0) 70%, rgba(185,28,28,0.08) 100%)',
          }}
        />
      </div>

      <div className='relative z-10 mx-auto max-w-[1440px] px-8 py-[70px] lg:px-[150px]'>
        <div className='flex flex-col items-center gap-10'>
          <div className='flex flex-col items-center gap-3'>
            <h2 className='font-[family-name:var(--font-hanken)] text-4xl font-semibold tracking-tight text-white lg:text-[52px] lg:leading-[1.6]'>
              Practice Areas
            </h2>
            <Image src='/images/underline-2.svg' alt='' width={122} height={4} />
          </div>

          <div className='grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
            {displayAreas.map((area) => (
              <Link
                key={area._id ?? area.slug.current}
                href={`/practice-areas/${area.slug.current}`}
                className='flex items-center gap-5 rounded-lg py-5 transition-colors hover:bg-white/5'
              >
                <Image
                  src='/images/practice-icon.svg'
                  alt=''
                  width={34}
                  height={34}
                />
                <span className='font-[family-name:var(--font-noto)] text-base font-medium leading-[34px] tracking-tight text-gray-50'>
                  {area.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
