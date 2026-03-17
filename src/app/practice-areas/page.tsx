import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Practice Areas | Panza Maurer",
};

const practiceAreas = [
  {
    title: "Administrative | Regulatory Law",
    description:
      "Panza Maurer assists clients within the framework of local, state and federal regulations.",
  },
  {
    title: "Healthcare",
    description:
      "Panza Maurer healthcare law practice focuses on the trends, initiatives and objectives set by health-related industries.",
  },
  {
    title: "Compliance",
    description:
      "Representing clients in compliance matters involving corporate governance, allegations of business and accounting fraud.",
  },
  {
    title: "Corporate | Transactional",
    description:
      "Legal skills and expertise in organizational structure and financial transactions to achieve client business goal.",
  },
  {
    title: "Litigation",
    description:
      "Insurance defense counsel representing numerous individuals, private and public corporations.",
  },
  {
    title: "Land Use | Environmental",
    description:
      "Panza Maurer represents property owners, developers, lenders and other affected parties with land use.",
  },
  {
    title: "Trusts & Estates",
    description:
      "Panza Maurer Law Firm Trusts & Estates practice attorneys know and have extensive experience in a wide variety of estate planning matters.",
  },
  {
    title: "Technology | IT",
    description:
      "At Panza Maurer our practice is structured to provide diversified businesses regulatory service.",
  },
  {
    title: "Intellectual Property",
    description:
      "Our intellectual property attorneys have extensive experience in client filing and procuring trademarks and copyrights.",
  },
  {
    title: "Education Law",
    description:
      "Panza Maurer provides comprehensive legal counsel to colleges, universities, and K\u201312 institutions across a broad spectrum of issues unique to the education sector.",
  },
  {
    title: "Gaming & Hospitality",
    description:
      "Panza Maurer Law Firm attorneys have a strong practice area in gaming law, drawing upon our expertise in administrative law.",
  },
  {
    title: "Strategic Planning",
    description:
      "Panza Maurer Law Firm provides government relations consulting and strategic planning to firm clients.",
  },
  {
    title: "Labor | Employment",
    description:
      "Panza Maurer Law Firm is recognized for our expertise in the areas of Labor and Employment law.",
  },
  {
    title: "Procurement",
    description:
      "Panza Maurer Law Firm has extensive experience in handling large state and local bid and procurement matters for decades.",
  },
  {
    title: "Real Property",
    description:
      "Panza Maurer Law Firm Real Property Division is comprised of experienced transactional and litigation attorneys.",
  },
  {
    title: "Receivership | Conservatorship",
    description:
      "Panza Maurer Law Firm serves as Conservators, Receivers or Custodians for commercial and real estate entities.",
  },
  {
    title: "Medical Marijuana",
    description:
      "Our firm assists with navigating the governmental channels to obtain licenses.",
  },
];

export default function PracticeAreasPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full pt-[145px] lg:pt-[109px]">
        <PageHero
          title="Practice Areas"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Practice Areas" },
          ]}
        />

        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-8 py-8 lg:px-28">
            <h2 className="mb-8 font-[family-name:var(--font-hanken)] text-3xl font-semibold text-slate-700">
              Industries | Cases We Handle
            </h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {practiceAreas.map((area) => {
                const slug = area.title
                  .toLowerCase()
                  .replace(/[|&]/g, "")
                  .replace(/\s+/g, "-")
                  .replace(/-+/g, "-");
                return (
                  <div
                    key={area.title}
                    className="flex flex-col gap-4 rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
                  >
                    <h3 className="font-[family-name:var(--font-hanken)] text-lg font-semibold text-gray-950">
                      {area.title}
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">
                      {area.description}
                    </p>
                    <Link
                      href={`/practice-areas/${slug}`}
                      className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary-red transition-colors hover:text-red-800"
                    >
                      View Service
                      <Image
                        src="/images/arrow-up-right.svg"
                        alt=""
                        width={14}
                        height={14}
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
