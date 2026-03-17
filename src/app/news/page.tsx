import Image from "next/image";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Footer from "@/components/Footer";

export const metadata = {
  title: "News | Panza Maurer",
};

const posts = [
  {
    title: "Client Alert: The One Big Beautiful Bill Act & Student Loans",
    date: "December 12, 2025",
    excerpt:
      "The One Big Beautiful Bill Act (OBBBA) has created a significant financial hurdle for many undergraduate and graduate students across the country, due to its new regulations on student loan caps, reduction of repayment options, and increased compliance requirements for institutions of higher education.",
    href: "https://www.panzamaurer.com/client-alert-the-one-big-beautiful-bill-act-student-loans/",
    image: null,
  },
  {
    title: "Eileen Stuart and David Childs Join Panza Maurer as Of Counsel",
    date: "November 19, 2025",
    excerpt:
      "Panza Maurer proudly announces the addition of Eileen Stuart and David Childs as Of Counsel to the firm, bringing extensive expertise in government relations, policy development, and strategic communications.",
    href: "https://www.panzamaurer.com/eileen-stuart-and-david-childs-join-panza-maurer-as-of-counsel/",
    image: null,
  },
  {
    title: "Founding Partners Present at University of Rome Medical School",
    date: "November 12, 2025",
    excerpt:
      "Panza Maurer's founding partners recently visited the Università Campus Bio-Medico di Roma, an institution established with a vision to place the human person at the heart of biomedical sciences, to explore its mission and connect with staff and students.",
    href: "https://www.panzamaurer.com/panza-maurer-founding-partners-present-at-university-of-rome-medical-school/",
    image: null,
  },
  {
    title:
      "Panza Maurer Partners Recognized in Florida Trend's 2025 Legal Elite Notable – Women Leaders in Law",
    date: "November 12, 2025",
    excerpt:
      "Congratulations to Panza Maurer Managing Partner, Dana Panza Macdonald, and Partner, Elizabeth Pedersen, on their recognition in Florida Trend Media Company's Legal Elite Notable — Women Leaders in Law.",
    href: "https://www.panzamaurer.com/panza-mauerer-partners-recognized-in-florida-trends-2025-legal-elite-notable-women-leaders-in-law/",
    image: null,
  },
  {
    title: "Panza Maurer – A Sponsor of the 2025 Guy Harvey Foundation Love the Blue Gala",
    date: "November 7, 2025",
    excerpt:
      "Panza Maurer was honored to sponsor and attend the 2025 Guy Harvey Foundation Love the Blue Gala, an inspiring evening dedicated to ocean conservation and education.",
    href: "https://www.panzamaurer.com/35288-2/",
    image: "/GHF-Gala-280x350.jpg",
  },
  {
    title:
      "Panza Maurer Participates in the 9th Annual Marine Research Hub of South Florida Summit at FLIBS",
    date: "November 6, 2025",
    excerpt:
      "Panza Maurer was proud to participate in the 9th Annual Marine Research Hub of South Florida Summit, held in conjunction with the Fort Lauderdale International Boat Show (FLIBS).",
    href: "https://www.panzamaurer.com/panza-maurer-participates-in-the-9th-annual-marine-research-hub-of-south-florida-summit-at-flibs/",
    image: "/FLIBSCoral-Vita-350x233.jpg",
  },
];

export default function NewsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full pt-[109px]">
        <PageHero
          title="News"
          subtitle="Recent Firm News & Events"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "News" },
          ]}
        />

        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-8 py-12 lg:px-28">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <a
                  key={post.href}
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-4 overflow-hidden rounded-xl border border-gray-200 transition-shadow hover:shadow-md"
                >
                  {post.image && (
                    <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <p className="text-sm font-medium text-gray-400">{post.date}</p>
                    <h3 className="font-[family-name:var(--font-hanken)] text-lg font-semibold leading-snug text-gray-950">
                      {post.title}
                    </h3>
                    <p className="flex-1 text-sm leading-6 text-gray-600">{post.excerpt}</p>
                    <span className="mt-2 text-sm font-semibold text-primary-red transition-colors group-hover:text-red-800">
                      Read More →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
