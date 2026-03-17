import Image from "next/image";

export default function GetInTouch() {
  return (
    <section id="contact" className="relative flex h-[611px] w-full items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/get-in-touch-bg.jpg"
        alt="Courtroom"
        fill
        className="object-cover"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(17,24,39,0.8) 0%, rgba(17,24,39,0.3) 34.6%, rgba(17,24,39,0.3) 57.2%, rgba(17,24,39,0.74) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex max-w-[620px] flex-col items-center gap-5 px-8 text-center">
        <h2
          className="font-[family-name:var(--font-noto)] text-4xl font-bold uppercase text-white lg:text-[56px] lg:leading-[41px]"
          style={{
            textShadow: "0px 4px 12.2px rgba(0,0,0,0.45)",
          }}
        >
          Get in Touch
        </h2>

        <p className="font-[family-name:var(--font-noto)] text-[30px] font-medium leading-10 tracking-tight text-oyster">
          Panza Maurer is ready to navigate a successful result.
        </p>

        <p className="font-[family-name:var(--font-noto)] text-lg font-medium leading-7 text-oyster">
          Our experienced strategic approach provides the foundation for every
          case we engage in. Please do not hesitate to contact us.
        </p>

        <a
          href="/attorneys"
          className="mt-4 inline-flex items-center rounded-lg bg-white px-8 py-3.5 font-[family-name:var(--font-noto)] text-lg font-semibold tracking-wide text-gray-950 transition-colors hover:bg-gray-100"
        >
          Meet Our Team
        </a>
      </div>
    </section>
  );
}
