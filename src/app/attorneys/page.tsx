import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Our Attorneys | Panza Maurer",
};

interface Attorney {
  name: string;
  role: string;
  image: string;
}

const partners: Attorney[] = [
  { name: "Thomas F. Panza", role: "Founding Partner", image: "thomas-f-panza.png" },
  { name: "Susan Horovitz Maurer", role: "Founding Partner", image: "susan-horovitz-maurer.png" },
  { name: "Dana Panza Macdonald", role: "Managing Partner", image: "dana-panza-macdonald.png" },
  { name: "Benjamin P. Bean", role: "Partner", image: "benjamin-p-bean.png" },
  { name: "Jennifer Maurer Bean", role: "Partner", image: "jennifer-maurer-bean.png" },
  { name: "Richard A. Beauchamp", role: "Partner", image: "richard-a-beauchamp.png" },
  { name: "Robert M. Bulfin", role: "Partner", image: "robert-m-bulfin.png" },
  { name: "Jose Felix Diaz", role: "Partner", image: "jose-felix-diaz.png" },
  { name: "Lorraine Duthe", role: "Partner", image: "lorraine-duthe.png" },
  { name: "James H. Horton, IV", role: "Partner", image: "james-h-horton-iv.png" },
  { name: "Pamela M. Kane", role: "Partner", image: "pamela-kane.png" },
  { name: "Gregory L. McDermott", role: "Partner", image: "gregory-l-mcdermott.png" },
  { name: "Elizabeth L. Pedersen", role: "Founding Partner", image: "elizabeth-l-pedersen.png" },
  { name: "Louise Wilhite St. Laurent", role: "Partner", image: "louise-wilhite-st-laurent.png" },
  { name: "Samantha Evans Saltzburg", role: "Senior Associate", image: "samantha-evans-saltzburg.png" },
  { name: "Jennifer K. Graner", role: "Associate", image: "jennifer-k-graner.png" },
  { name: "Andrew L. Myers", role: "Senior Associate", image: "andrew-l-myers.png" },
  { name: "Trevor D. Scott", role: "Senior Associate", image: "trevor-d-scott.png" },
];

const ofCounsel: Attorney[] = [
  { name: "Brian Ballard", role: "Of Counsel Attorney", image: "brian-ballard.png" },
  { name: "Brad Burleson", role: "Of Counsel Attorney", image: "brad-burleson.png" },
  { name: "David Childs", role: "Of Counsel Attorney", image: "david-childs.png" },
  { name: "Jan Gorrie", role: "Of Counsel Attorney", image: "jan-gorrie.png" },
  { name: "Adrian Lukis", role: "Of Counsel Attorney", image: "adrian-lukis.png" },
  { name: "Syl Luks", role: "Of Counsel Attorney", image: "syl-luks.png" },
  { name: "Monica Rodriguez", role: "Of Counsel Attorney", image: "monica-rodriquez.png" },
  { name: "Eileen Stuart", role: "Of Counsel Attorney", image: "eileen-stuart.png" },
  { name: "Abby Vail", role: "Of Counsel Attorney", image: "abby-vail.png" },
];

function AttorneyCard({ attorney }: { attorney: Attorney }) {
  const slug = attorney.name
    .toLowerCase()
    .replace(/[\s.,]+/g, "-")
    .replace(/-+/g, "-");
  return (
    <Link
      href={`/attorneys/${slug}`}
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={`/images/attorneys/${attorney.image}`}
          alt={attorney.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="px-4 py-4">
        <h3 className="font-[family-name:var(--font-noto)] text-[20px] font-semibold text-black">
          {attorney.name}
        </h3>
        <p className="font-[family-name:var(--font-noto)] text-[16px] text-slate-500">
          {attorney.role}
        </p>
      </div>
    </Link>
  );
}

export default function AttorneysPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full pt-[145px] lg:pt-[109px]">
        <PageHero
          title="Our Attorneys"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Our Attorneys" },
          ]}
        />

        {/* Partners */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-8 py-20 lg:px-28">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((attorney) => (
                <AttorneyCard key={attorney.name} attorney={attorney} />
              ))}
            </div>
          </div>
        </section>

        {/* Of Counsel */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-8 pb-20 lg:px-28">
            <h2 className="mb-12 font-[family-name:var(--font-hanken)] text-3xl font-semibold text-gray-950">
              Of Counsel
            </h2>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              {ofCounsel.map((attorney) => (
                <AttorneyCard key={attorney.image} attorney={attorney} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
