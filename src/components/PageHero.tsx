import Image from "next/image";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  boldPrefix?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHero({
  title,
  subtitle,
  boldPrefix,
}: PageHeroProps) {
  return (
    <section
      className="relative w-full rounded-br-[30px]"
      style={{
        background:
          "linear-gradient(-57.8deg, rgba(100,116,139,0) 57.5%, rgba(0,105,255,0.1) 103.2%), linear-gradient(90deg, rgba(255,255,255,0) 20.3%, rgba(255,255,255,0.7) 85.8%), linear-gradient(90deg, rgba(229,233,241,0.8) 0%, rgba(229,233,241,0.8) 100%), linear-gradient(90deg, #f3f4f6 0%, #f3f4f6 100%)",
      }}
    >
      <div className="mx-auto h-auto min-h-[160px] max-w-[1440px] pt-[100px] lg:h-[216px] lg:min-h-0 lg:pt-0">
        <div className="flex h-full flex-col items-center justify-center px-6 py-6 lg:pt-[36px] lg:pb-0">
          <div className="flex w-[800px] max-w-full flex-col items-center gap-[15px] text-center">
            <h1 className="font-[family-name:var(--font-hanken)] text-[32px] font-semibold leading-[1.4] tracking-[-0.52px] text-slate-600 sm:text-[40px] lg:text-[52px] lg:leading-[1.6]">
              {title}
            </h1>
            <Image
              src="/images/underline-2.svg"
              alt=""
              width={293}
              height={4}
              className="w-[200px] sm:w-[293px]"
            />
            {subtitle && (
              <p className="text-[16px] leading-[1.6] text-primary-dark sm:text-[20px]">
                {boldPrefix && (
                  <span className="font-semibold">{boldPrefix}</span>
                )}{" "}
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
