import Image from "next/image";
import Link from "next/link";

const practiceAreas = [
  { label: "Administrative | Regulatory Law", slug: "administrative--regulatory-law" },
  { label: "Healthcare", slug: "healthcare" },
  { label: "Compliance", slug: "compliance" },
  { label: "Corporate | Transactional", slug: "corporate--transactional" },
  { label: "Litigation", slug: "litigation" },
  { label: "Land Use | Environmental", slug: "land-use--environmental" },
  { label: "Estate Planning | Probate", slug: "trusts--estates" },
  { label: "Technology | IT", slug: "technology--it" },
  { label: "Education Law", slug: "education-law" },
  { label: "Gaming | Hospitality", slug: "gaming--hospitality" },
  { label: "Strategic Planning", slug: "strategic-planning" },
  { label: "Labor | Employment", slug: "labor--employment" },
  { label: "Procurement", slug: "procurement" },
  { label: "Real Property", slug: "real-property" },
  { label: "Receivership | Conservatorship", slug: "receivership--conservatorship" },
  { label: "Medical Marijuana", slug: "medical-marijuana" },
];

export default function PracticeAreas() {
  return (
    <section id="practice-areas" className="relative w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/cases-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-50"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(17,24,39,0.95) 0%, rgba(17,24,39,0.85) 50%, rgba(17,24,39,0.95) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(185,28,28,0.08) 0%, rgba(185,28,28,0) 30%, rgba(185,28,28,0) 70%, rgba(185,28,28,0.08) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1440px] px-8 py-[70px] lg:px-[150px]">
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-[family-name:var(--font-hanken)] text-4xl font-semibold tracking-tight text-white lg:text-[52px] lg:leading-[1.6]">
              Practice Areas
            </h2>
            <Image
              src="/images/underline-2.svg"
              alt=""
              width={122}
              height={4}
            />
          </div>

          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {practiceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/practice-areas/${area.slug}`}
                className="flex items-center gap-5 rounded-lg py-5 transition-colors hover:bg-white/5"
              >
                <Image
                  src="/images/practice-icon.svg"
                  alt=""
                  width={34}
                  height={34}
                />
                <span className="font-[family-name:var(--font-noto)] text-base font-medium leading-[34px] tracking-tight text-gray-50">
                  {area.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
