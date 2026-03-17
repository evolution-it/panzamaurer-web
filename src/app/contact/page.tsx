import Image from "next/image";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact Us | Panza Maurer",
};

const offices = [
  {
    name: "Tallahassee",
    image: "/images/contact-tallahassee.jpg",
    address: ["201 East Park Avenue | Suite 200-A", "Tallahassee, FL 32301"],
    phone: "(850) 681-0980",
    fax: "(850) 681-0983",
  },
  {
    name: "Fort Lauderdale",
    image: "/images/contact-fort-lauderdale.jpg",
    building: "Coastal Tower",
    address: [
      "2400 East Commercial Blvd | Suite 905",
      "Fort Lauderdale, FL 33308",
    ],
    phone: "(954) 390-0100",
    fax: "(954) 390-7991",
  },
  {
    name: "Coral Gables",
    image: "/images/contact-coral-gables.jpg",
    building: "The Alhambra Building",
    address: [
      "2 Alhambra Plaza | Suite 102",
      "Coral Gables, FL 33134",
    ],
    phone: "(786) 534-6162",
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full pt-[145px] lg:pt-[109px]">
        <PageHero
          title="Contact Us"
          subtitle="Every Second Counts! When you need serious counsel every second counts. Panza Maurer is ready to navigate a successful result. Our experienced strategic approach provides the foundation for every case we engage in. Please do not hesitate to contact us."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Contact" },
          ]}
        />

        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-8 py-16 lg:px-28">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {offices.map((office) => (
                <div key={office.name} className="flex flex-col gap-8">
                  {/* Image */}
                  <div className="relative h-[220px] overflow-hidden rounded-[10px]">
                    <Image
                      src={office.image}
                      alt={office.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-3">
                    <h2 className="font-[family-name:var(--font-hanken)] text-3xl font-semibold text-slate-600 lg:text-[42px] lg:leading-[50px]">
                      {office.name}
                    </h2>
                    <div className="h-[2px] w-[168px] bg-primary-red" />

                    <div className="mt-2 flex items-start gap-3">
                      <Image
                        src="/images/location-pin.svg"
                        alt=""
                        width={18}
                        height={18}
                        className="mt-1"
                      />
                      <div>
                        {office.building && (
                          <p className="font-semibold text-gray-950">
                            {office.building}
                          </p>
                        )}
                        {office.address.map((line, i) => (
                          <p key={i} className="font-semibold text-gray-950">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="pl-[30px]">
                      <p className="text-gray-950">{office.phone} (T)</p>
                      {office.fax && (
                        <p className="text-gray-950">{office.fax} (F)</p>
                      )}
                    </div>

                    <a
                      href={`tel:${office.phone.replace(/[^\d]/g, "")}`}
                      className="mt-2 inline-flex w-fit items-center justify-center rounded-lg bg-primary-red px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-red-800"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
