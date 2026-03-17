import Image from "next/image";
import Link from "next/link";

const locationLinks = [
  {
    name: "Tallahassee",
    address: [
      "201 East Park Avenue | Suite 200-A",
      "Tallahassee, FL 32301",
    ],
    phone: "(850) 681-0980",
  },
  {
    name: "Fort Lauderdale",
    address: [
      "Coastal Tower",
      "2400 East Commercial Blvd | Suite 905",
      "Fort Lauderdale, FL 33308",
    ],
    phone: "(954) 390-0100",
  },
  {
    name: "Coral Gables",
    address: [
      "The Alhambra Building",
      "2 Alhambra Plaza | Suite 102",
      "Coral Gables, FL 33134",
    ],
    phone: "(786) 534-6162",
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-dark-navy">
      <div className="mx-auto max-w-[1440px] px-8 py-20 lg:px-28 lg:py-32">
        <div className="flex flex-col gap-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/footer-logo.svg"
              alt="Panza Maurer"
              width={333}
              height={64}
            />
          </Link>

          {/* Location columns */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {locationLinks.map((loc) => (
              <div key={loc.name} className="flex flex-col gap-4">
                <h3 className="font-[family-name:var(--font-noto)] text-2xl font-medium leading-[34px] text-white">
                  {loc.name}
                </h3>
                <div className="flex flex-col gap-1">
                  {loc.address.map((line, i) => (
                    <p
                      key={i}
                      className="font-[family-name:var(--font-noto)] text-base font-normal leading-[26px] text-gray-300"
                    >
                      {line}
                    </p>
                  ))}
                  <p className="mt-1 font-[family-name:var(--font-noto)] text-base font-normal leading-[26px] text-gray-300">
                    {loc.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-[family-name:var(--font-noto)] text-base font-normal leading-6 text-gray-400">
            Copyright &copy; Panza, Maurer &amp; Maynard 2026 All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
