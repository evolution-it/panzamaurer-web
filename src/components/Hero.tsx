"use client";

import { useEffect, useRef, useState } from "react";

const videos = [
  "/assets/sea-view.mp4",
  "/assets/cityview.mp4",
  "/assets/townhouse.mp4",
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % videos.length;
        const nextVideo = videoRefs.current[next];
        if (nextVideo) {
          nextVideo.currentTime = 0;
          nextVideo.play().catch(() => {});
        }
        return next;
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex h-[803px] w-full items-end justify-center overflow-hidden bg-white">
      {/* Background Videos with crossfade */}
      {videos.map((src, i) => (
        <video
          key={src}
          ref={(el) => { videoRefs.current[i] = el; }}
          autoPlay={i === 0}
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{ opacity: activeIndex === i ? 1 : 0 }}
        >
          <source src={src} type={src.endsWith(".mov") ? "video/quicktime" : "video/mp4"} />
        </video>
      ))}

      {/* Dark overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(17,24,39,0.96) 13.3%, rgba(17,24,39,0.61) 43.3%, rgba(17,24,39,0.288) 61.3%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(-19.3deg, rgba(255,255,255,0) 71.6%, rgba(255,255,255,0.7) 99.6%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-8 pb-28 pt-36">
        <div className="max-w-[600px]">
          <h1 className="font-[family-name:var(--font-hanken)] text-[40px] font-extrabold uppercase leading-[1.1] text-gray-50 md:whitespace-nowrap md:text-[70px]">
            We Know Florida
          </h1>
          <div className="mt-4 flex items-baseline gap-[15px]">
            <p className="font-[family-name:var(--font-noto)] text-[27px] font-medium leading-[40px] text-gray-50">
              Representing businesses, regulated industries and institutions for more than{" "}
              <span className="font-black">50</span>
              <span className="font-bold"> years.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
