import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allPosts = [
  {
    title: "Leadership Broward Foundations's Fun Lunch",
    slug: "leadership-broward-fun-lunch",
    image: "/images/news/leadership-broward-fun-lunch.png",
    category: "Firm News",
    content: `Panza Maurer congratulates our esteemed colleague, Gail Bulfin, on being honored at the Leadership Broward Foundation's "What is the 4-11?" Fun Lunch held at the Seminole Hard Rock Hotel & Casino. This annual event celebrates outstanding community leaders who have significantly contributed to Broward County. Please join us in celebrating Gail's dedication to excellence and unwavering commitment to our community as well as the collective efforts of all the honorees who continue to make a positive impact in Broward County.

Above: Robert Bulfin, Jennifer Bean, Dana Macdonald, Elizabeth Pedersen, Trevor Scott and Andrew Myers`,
  },
  {
    title: "NSU Investiture",
    slug: "nsu-investiture",
    image: "/images/news/nsu-investiture.png",
    category: "Firm News",
    content:
      "Panza Maurer was proud to attend the NSU Investiture ceremony, celebrating a milestone for the university and its community.",
  },
  {
    title: "Congratulations – United States Attorney General Pam Bondi!",
    slug: "congratulations-pam-bondi",
    image: "/images/news/congratulations-pam-bondi.png",
    category: "Firm News",
    content:
      "Panza Maurer extends its warmest congratulations to Pam Bondi on her appointment as United States Attorney General.",
  },
  {
    title: "2024 Fort Lauderdale International Boat Show Opening",
    slug: "fort-lauderdale-boat-show",
    image: "/images/news/fort-lauderdale-boat-show.png",
    category: "Firm News",
    content:
      "Panza Maurer was honored to attend the opening of the 2024 Fort Lauderdale International Boat Show, one of the largest in-water boat shows in the world.",
  },
  {
    title: "BSO Research Development and Training Center Tour",
    slug: "bsd-research-tour",
    image: "/images/news/bsd-research-tour.png",
    category: "Firm News",
    content:
      "Panza Maurer team members toured the BSO Research Development and Training Center, gaining insight into the latest advancements in law enforcement training and technology.",
  },
  {
    title:
      "Panza Maurer's Elizabeth Pedersen Appointed to The Board of Directors for Arc Broward and Barc Housing",
    slug: "elizabeth-pedersen-board",
    image: "/images/news/elizabeth-pedersen-board.png",
    category: "Firm News",
    content:
      "Panza Maurer is proud to announce that Elizabeth Pedersen has been appointed to the Board of Directors for Arc Broward and Barc Housing.",
  },
  {
    title: "Leadership Florida Cornerstone Class 42 Program",
    slug: "leadership-florida-class-42",
    image: "/images/news/leadership-florida-class-42.png",
    category: "Firm News",
    content:
      "Panza Maurer participated in the Leadership Florida Cornerstone Class 42 Program, strengthening connections with leaders across the state.",
  },
];


export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center">
        <Navbar />
        <main className="flex w-full flex-1 items-center justify-center pt-[145px] lg:pt-[109px]">
          <p className="text-xl text-gray-600">Article not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full pt-[145px] lg:pt-[109px]">
        {/* Hero */}
        <section
          className="relative w-full rounded-br-[30px]"
          style={{
            background:
              "linear-gradient(-57.8deg, rgba(100,116,139,0) 57.5%, rgba(0,105,255,0.1) 103.2%), linear-gradient(90deg, rgba(255,255,255,0) 20.3%, rgba(255,255,255,0.7) 85.8%), linear-gradient(90deg, rgba(229,233,241,0.8) 0%, rgba(229,233,241,0.8) 100%), linear-gradient(90deg, #f3f4f6 0%, #f3f4f6 100%)",
          }}
        >
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col items-center px-8 pb-8 pt-16 text-center">
              <span className="mb-4 text-xs font-bold uppercase tracking-[3px] text-primary-red">
                Firm News
              </span>
              <h1 className="mb-6 max-w-[700px] font-[family-name:var(--font-hanken)] text-[36px] font-semibold leading-[1.3] tracking-[-0.36px] text-slate-600 md:text-[44px]">
                {post.title}
              </h1>
              {/* Share Article */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Share Article</span>
                <div className="flex gap-2">
                  {[
                    {
                      icon: (
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      ),
                      label: "Facebook",
                    },
                    {
                      icon: (
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
                      ),
                      label: "LinkedIn",
                    },
                    {
                      icon: (
                        <>
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="5"
                            ry="5"
                          />
                          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </>
                      ),
                      label: "Instagram",
                    },
                    {
                      icon: (
                        <path d="M4 4l5 5m0 0l7 7M9 9l7-7M9 9l-7 7" />
                      ),
                      label: "Share",
                    },
                  ].map((social) => (
                    <button
                      key={social.label}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-dark text-white transition-colors hover:bg-gray-700"
                      aria-label={social.label}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        {social.icon}
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Article Content */}
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-8 py-16 lg:px-28">
            <div className="mx-auto max-w-[700px]">
              {/* Article Image */}
              <div className="relative mb-10 h-[300px] overflow-hidden rounded-lg md:h-[400px]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Article Body */}
              <div className="text-[15px] leading-[1.8] text-gray-700 whitespace-pre-line">
                {post.content}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
