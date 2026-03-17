import Image from "next/image";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Locations | Panza Maurer",
};

const offices = [
  {
    name: "Tallahassee",
    image: "/images/contact-tallahassee.jpg",
    address: "201 East Park Avenue | Suite 200-A",
    city: "Tallahassee, FL 32301",
    phone: "(850) 681-0980 (T)",
    fax: "(850) 681-0983 (F)",
  },
  {
    name: "Fort Lauderdale",
    image: "/images/contact-fort-lauderdale.jpg",
    building: "Coastal Tower",
    address: "2400 East Commercial Blvd | Suite 905",
    city: "Fort Lauderdale, FL 33308",
    phone: "(954) 390-0100 (T)",
    fax: "(954) 390-7991 (F)",
  },
  {
    name: "Coral Gables",
    image: "/images/contact-coral-gables.jpg",
    building: "The Alhambra Building",
    address: "2 Alhambra Plaza | Suite 102",
    city: "Coral Gables, FL 33134",
    phone: "(786) 534-6162 (T)",
  },
];

export default function LocationsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full pt-[145px] lg:pt-[109px]">
        <PageHero
          title="Our Locations"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Locations" },
          ]}
        />

        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-8 py-16 lg:px-28">
            <div className="flex flex-col gap-20">
              {offices.map((office, index) => (
                <div
                  key={office.name}
                  className="flex flex-col gap-10 lg:flex-row lg:items-start"
                >
                  {/* Image */}
                  <div className="relative h-[280px] w-full overflow-hidden rounded-[10px] lg:w-[400px]">
                    <Image
                      src={office.image}
                      alt={office.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-4">
                    <h2 className="font-[family-name:var(--font-hanken)] text-3xl font-semibold text-slate-600 lg:text-[42px] lg:leading-[50px]">
                      {office.name}
                    </h2>
                    <Image
                      src="/images/underline-1.svg"
                      alt=""
                      width={168}
                      height={4}
                    />

                    <div className="mt-2 flex flex-col gap-1">
                      <div className="flex items-start gap-3">
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
                          <p className="font-semibold text-gray-950">
                            {office.address}
                          </p>
                          <p className="font-semibold text-gray-950">
                            {office.city}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col gap-1 pl-[30px]">
                        <p className="text-gray-950">{office.phone}</p>
                        {office.fax && (
                          <p className="text-gray-950">{office.fax}</p>
                        )}
                      </div>
                    </div>

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
