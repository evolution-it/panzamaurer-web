import Image from "next/image";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import LocationsSection from "@/components/LocationsSection";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About the Firm | Panza Maurer",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full">
        <PageHero
          title="About the Firm"
          boldPrefix="For more than five decades,"
          subtitle="Panza Maurer has been committed to providing the highest caliber of legal services with integrity, reliability and dedication."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "About the Firm" },
          ]}
        />

        {/* About Content: Figma h=725px, bg=white */}
        <section className="bg-white">
          {/*
            Figma layout:
            - Left content: left=112px, top=89px, w=520px
            - Right content: left=747px, top=179px, w=582px
            - Gap between columns: 747 - 112 - 520 = 115px
            - Right column top offset vs left: 179 - 89 = 90px
          */}
          <div className="relative mx-auto max-w-[1440px] px-6 pt-[89px] pb-[89px] md:px-12 lg:px-[112px]">
            <div className="flex flex-col gap-12 lg:flex-row lg:gap-[115px]">
              {/* Left column: w=520px */}
              <div className="w-full flex-shrink-0 lg:w-[520px]">
                {/* Title + underline: gap=25px between them */}
                <div className="mb-[25px]">
                  <h2 className="font-[family-name:var(--font-hanken)] text-[36px] font-semibold leading-[40px] tracking-[-1.08px] text-slate-700">
                    Integrity. Reliability. Dedication.
                  </h2>
                  <Image
                    src="/images/underline-1.svg"
                    alt=""
                    width={171}
                    height={4}
                    className="mt-[25px]"
                  />
                </div>

                {/* Body text: 16px, leading 28px, text-justify, black */}
                <div className="text-justify text-[16px] leading-[28px] text-black">
                  <p>
                    At Panza Maurer, we help clients navigate complex commercial,
                    regulatory and administrative challenges with clarity, strategy,
                    and impact. Panza Maurer has partnered with clients across
                    industries &ndash; including healthcare, education, gaming,
                    energy, infrastructure, emergency management, hospitality,
                    resiliency, and medical marijuana &ndash; to deliver results
                    that align with clients&rsquo; goals and drive success.
                  </p>
                  <br />
                  <p>
                    Our team blends legal insight with real-world problem solving.
                    Whether providing strategic counseling to Fortune 500 companies
                    on the ever-changing legislative and regulatory landscape,
                    engaging with clients in the procurement and contracting
                    process, advising academic or healthcare institutions on
                    compliance and regulatory matters, engaging in the rule-making
                    process with state agencies, resolving regulatory
                    investigations, licensure issues, or litigating high-stakes
                    disputes, Panza Maurer brings experience, innovativeness, and
                    sound judgment to every matter.
                  </p>
                </div>
              </div>

              {/* Right column: w=582px, top offset 90px vs left */}
              <div className="w-full lg:w-[582px] lg:pt-[90px]">
                {/* "Highlights..." heading: 16px, medium, justified */}
                <p className="mb-[28px] text-justify text-[16px] font-medium leading-[28px] text-black">
                  Highlights of our work include:
                </p>

                {/* Bullet list: 16px, semibold, justified */}
                <ul className="list-disc space-y-[4px] pl-[24px] text-justify text-[16px] font-semibold leading-[28px] text-black">
                  <li>
                    Serving as general counsel to one of the largest,
                    not-for-profit private universities in country for 40+ years
                  </li>
                  <li>
                    Assisting clients in obtaining and fulfilling multiple
                    high-value government contracts
                  </li>
                  <li>
                    Providing guidance on regulatory requirements and navigating
                    highly-regulated industries effectively
                  </li>
                  <li>
                    Successfully obtaining approval on dozens of CONs
                    (certificates of need)
                  </li>
                  <li>
                    Strategic wins for clients in rulemaking and rule challenges
                    involving healthcare, environmental, and other complex
                    regulations
                  </li>
                </ul>

                {/* Closing paragraph */}
                <p className="mt-[28px] text-justify text-[16px] leading-[28px] text-black">
                  From local issues to statewide policy and federal oversight,
                  Panza Maurer is trusted by clients who value legal expertise
                  that delivers real-world results.
                </p>
              </div>
            </div>
          </div>
        </section>

        <LocationsSection />
      </main>
      <Footer />
    </div>
  );
}
