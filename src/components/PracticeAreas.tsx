import Image from "next/image";

const practiceAreas = [
  "Administrative | Regulatory Law",
  "Healthcare",
  "Compliance",
  "Corporate | Transactional",
  "Litigation",
  "Land Use | Environmental",
  "Trusts & Estates",
  "Technology | IT",
  "Intellectual Property",
  "Education Law",
  "Gaming & Hospitality",
  "Strategic Planning",
  "Labor | Employment",
  "Procurement",
  "Real Property",
  "Receivership | Conservatorship",
  "Medical Marijuana",
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
              <div
                key={area}
                className="flex items-center gap-5 rounded-lg py-5 transition-colors hover:bg-white/5"
              >
                <Image
                  src="/images/practice-icon.svg"
                  alt=""
                  width={34}
                  height={34}
                />
                <span className="font-[family-name:var(--font-noto)] text-base font-medium leading-[34px] tracking-tight text-gray-50">
                  {area}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
