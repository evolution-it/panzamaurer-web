'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const FALLBACK_VIDEOS = [
  '/assets/sea-view.mp4',
  '/assets/cityview.mp4',
  '/assets/townhouse.mp4',
];

export default function Hero({
  heading,
  subtitle,
  videos,
}: {
  heading?: string
  subtitle?: string
  videos?: string[]
}) {
  const displayVideos = videos && videos.length > 0 ? videos : FALLBACK_VIDEOS;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const displayHeading = heading ?? 'We Know Florida';
  const displaySubtitle =
    subtitle ??
    'Representing businesses, regulated industries and institutions for more than 50 years.';

  useEffect(() => {
    // Respect user's reduced-motion preference — skip auto-rotation
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || paused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % displayVideos.length;
        const nextVideo = videoRefs.current[next];
        if (nextVideo) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch(() => {});
        }
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [displayVideos.length, paused]);

  return (
    <section className='relative flex h-[803px] w-full items-end justify-center overflow-hidden bg-white'>
      {displayVideos.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[i] = el;
          }}
          autoPlay={i === 0}
          muted
          loop
          playsInline
          aria-hidden="true"
          tabIndex={-1}
          className='absolute inset-0 h-full w-full object-cover transition-opacity duration-1000'
          style={{ opacity: activeIndex === i ? 1 : 0 }}
        >
          <source
            src={src}
            type={src.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'}
          />
        </video>
      ))}

      <div
        aria-hidden="true"
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(0deg, rgba(17,24,39,0.96) 13.3%, rgba(17,24,39,0.61) 43.3%, rgba(17,24,39,0.288) 61.3%)',
        }}
      />
      <div
        aria-hidden="true"
        className='absolute inset-0'
        style={{
          background:
            'linear-gradient(-19.3deg, rgba(255,255,255,0) 71.6%, rgba(255,255,255,0.7) 99.6%)',
        }}
      />

      <div className='relative z-10 mx-auto w-full max-w-[1280px] px-8 pb-28 pt-36'>
        <div className='max-w-[600px]'>
          <h1 className='pb-3 font-[family-name:var(--font-hanken)] text-[40px] font-extrabold uppercase leading-[1.1] text-gray-50 md:whitespace-nowrap md:text-[70px]'>
            {displayHeading}
          </h1>
          <Image src='/images/underline-1.svg' alt='' width={122} height={4} />
          <div className='mt-4 flex items-baseline gap-[15px]'>
            <p className='font-[family-name:var(--font-noto)] text-[27px] font-medium leading-[40px] text-gray-50'>
              {displaySubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Pause/play control for background slideshow (WCAG 2.2.2) */}
      <button
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? 'Play background slideshow' : 'Pause background slideshow'}
        className='absolute bottom-6 right-6 z-20 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-white'
      >
        {paused ? (
          /* Play icon */
          <svg
            className='h-5 w-5'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M8 5v14l11-7z' />
          </svg>
        ) : (
          /* Pause icon */
          <svg
            className='h-5 w-5'
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' />
          </svg>
        )}
      </button>
    </section>
  );
}
