import Image from 'next/image';
import { PortableText, type PortableTextBlock } from '@portabletext/react';

const FALLBACK_QUOTE =
  '\u201cPanza Maurer\u2019s mission is to provide our clients with a team of highly skilled and motivated professionals dedicated to helping clients resolve their legal and business needs with reliability, honesty and excellence.\u201d';

const FALLBACK_BODY = [
  'At Panza Maurer, we\u2019re more than just legal advisors \u2014 we\u2019re strategic partners who know how to get things done in Florida\u2019s complex regulatory and administrative landscape. Panza Maurer counsels a wide range of public and private clients in resolving their legal issues.',
  'Whether engaging in rulemaking, procurements, facing compliance issues, or influencing policy, we bring deep insight, creative strategies, and real-world experience to the table.',
  'With offices in Fort Lauderdale, Miami, and Tallahassee, our team is here to help you move forward \u2014 clearly, confidently, and with purpose.',
];

export default function About({
  heading,
  quote,
  body,
  imageUrl,
}: {
  heading?: string
  quote?: string
  body?: PortableTextBlock[]
  imageUrl?: string
}) {
  const displayHeading = heading ?? 'About Our Firm';
  const displayQuote = quote ?? FALLBACK_QUOTE;
  const displayImageUrl = imageUrl ?? '/images/about-image.jpg';

  return (
    <section id='about' className='w-full bg-dark-navy'>
      <div className='mx-auto flex max-w-[1280px] flex-col items-stretch lg:flex-row'>
        <div className='relative h-[400px] w-full flex-shrink-0 lg:h-auto lg:w-[500px] lg:self-stretch'>
          <Image
            src={displayImageUrl}
            alt='Downtown Fort Lauderdale'
            fill
            className='rounded-tr-[50px] object-cover'
          />
          <div
            className='absolute inset-0 rounded-tr-[50px]'
            style={{
              background:
                'linear-gradient(14deg, rgba(0,0,0,0.48) 9.9%, rgba(0,0,0,0.264) 33.6%, rgba(0,0,0,0) 59.3%)',
            }}
          />
        </div>

        <div className='flex flex-1 flex-col justify-center px-10 py-20 lg:px-[100px] lg:py-[128px]'>
          <div className='flex flex-col gap-7'>
            <div className='flex flex-col items-start gap-3'>
              <h2 className='font-[family-name:var(--font-hanken)] text-4xl font-semibold tracking-tight text-white lg:text-[52px] lg:leading-[1.6]'>
                {displayHeading}
              </h2>
              <Image src='/images/underline-1.svg' alt='' width={122} height={4} />
            </div>

            <div className='flex max-w-[640px] flex-col gap-6 text-justify'>
              <p className='font-[family-name:var(--font-noto)] text-[17px] font-semibold italic leading-6 text-gray-300'>
                {displayQuote}
              </p>

              {body && body.length > 0 ? (
                <div className='font-[family-name:var(--font-noto)] text-base font-normal leading-6 text-gray-300 [&_p]:mb-2 [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal'>
                  <PortableText value={body} />
                </div>
              ) : (
                FALLBACK_BODY.map((paragraph, i) => (
                  <p
                    key={i}
                    className='font-[family-name:var(--font-noto)] text-base font-normal leading-6 text-gray-300'
                  >
                    {paragraph}
                  </p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
