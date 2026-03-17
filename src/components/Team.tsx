"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const teamMembers = [
  { name: "Thomas F. Panza", role: "Founding Partner", image: "/images/attorneys/thomas-f-panza.png", slug: "thomas-f-panza" },
  { name: "Susan Horovitz Maurer", role: "Founding Partner", image: "/images/attorneys/susan-horovitz-maurer.png", slug: "susan-horovitz-maurer" },
  { name: "Dana Panza Macdonald", role: "Managing Partner", image: "/images/attorneys/dana-panza-macdonald.png", slug: "dana-panza-macdonald" },
  { name: "Benjamin P. Bean", role: "Partner", image: "/images/attorneys/benjamin-p-bean.png", slug: "benjamin-p-bean" },
  { name: "Jennifer Maurer Bean", role: "Partner", image: "/images/attorneys/jennifer-maurer-bean.png", slug: "jennifer-maurer-bean" },
];

export default function Team() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 3;
  const maxIndex = teamMembers.length - visibleCount;

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  const visibleMembers = teamMembers.slice(
    currentIndex,
    currentIndex + visibleCount
  );

  return (
    <section id="team" className="w-full bg-[#f3f4f6]">
      <div className="mx-auto max-w-[1216px] px-8 py-20 lg:py-40">
        <div className="flex flex-col items-center gap-20">
          {/* Heading */}
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-[family-name:var(--font-hanken)] text-4xl font-semibold tracking-tight text-gray-950 lg:text-[52px] lg:leading-[1.6]">
              Our Team
            </h2>
            <Image
              src="/images/underline-2.svg"
              alt=""
              width={122}
              height={4}
            />
          </div>

          {/* Cards with navigation */}
          <div className="relative w-full">
            {/* Left Arrow */}
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="absolute -left-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-4 shadow-lg transition-opacity hover:bg-gray-50 disabled:opacity-30 lg:flex"
            >
              <Image
                src="/images/arrow-left.svg"
                alt="Previous"
                width={32}
                height={32}
              />
            </button>

            {/* Right Arrow */}
            <button
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white p-4 shadow-lg transition-opacity hover:bg-gray-50 disabled:opacity-30 lg:flex"
            >
              <Image
                src="/images/arrow-left.svg"
                alt="Next"
                width={32}
                height={32}
                className="rotate-180"
              />
            </button>

            {/* Team Cards */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visibleMembers.map((member) => (
                <Link
                  key={member.name}
                  href={`/attorneys/${member.slug}`}
                  className="group relative block h-[500px] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0) 3.5%, rgba(0,0,0,0.3) 100%)",
                    }}
                  />
                  {/* Name card */}
                  <div className="absolute inset-x-0 bottom-0 px-6 pb-8 pt-6">
                    <div className="rounded-2xl bg-white/10 px-6 py-5 backdrop-blur-[12px]">
                      <h5 className="font-[family-name:var(--font-hanken)] text-2xl font-bold leading-10 text-white">
                        {member.name}
                      </h5>
                      <p className="font-[family-name:var(--font-noto)] text-base font-medium text-white/80">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination dots */}
            <div className="mt-10 flex items-center justify-center gap-3">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex
                      ? "w-12 bg-blue-600"
                      : "w-12 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
