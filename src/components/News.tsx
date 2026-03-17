import Image from "next/image";

const newsItems = [
  {
    title: "Client Alert: The One Big Beautiful Bill Act & Student Loans",
    date: "December 12, 2025",
    excerpt:
      "The One Big Beautiful Bill Act (OBBBA) has created a significant financial hurdle for many undergraduate and graduate students across the country, due to its new regulations on student loan caps, reduction of repayment options, and increased compliance requirements for institutions of higher education.",
    href: "https://www.panzamaurer.com/client-alert-the-one-big-beautiful-bill-act-student-loans/",
  },
  {
    title: "Eileen Stuart and David Childs Join Panza Maurer as Of Counsel",
    date: "November 19, 2025",
    excerpt:
      "Panza Maurer proudly announces the addition of Eileen Stuart and David Childs as Of Counsel to the firm, bringing extensive expertise in government relations, policy development, and strategic communications.",
    href: "https://www.panzamaurer.com/eileen-stuart-and-david-childs-join-panza-maurer-as-of-counsel/",
  },
  {
    title: "Founding Partners Present at University of Rome Medical School",
    date: "November 12, 2025",
    excerpt:
      "Panza Maurer's founding partners recently visited the Università Campus Bio-Medico di Roma, an institution established with a vision to place the human person at the heart of biomedical sciences, to explore its mission and connect with staff and students.",
    href: "https://www.panzamaurer.com/panza-maurer-founding-partners-present-at-university-of-rome-medical-school/",
  },
  {
    title:
      "Panza Maurer Partners Recognized in Florida Trend's 2025 Legal Elite Notable – Women Leaders in Law",
    date: "November 12, 2025",
    excerpt:
      "Congratulations to Panza Maurer Managing Partner, Dana Panza Macdonald, and Partner, Elizabeth Pedersen, on their recognition in Florida Trend Media Company's Legal Elite Notable — Women Leaders in Law. Their leadership, mentorship, and commitment to community impact exemplify the excellence that defines our firm and Florida's legal community.",
    href: "https://www.panzamaurer.com/panza-mauerer-partners-recognized-in-florida-trends-2025-legal-elite-notable-women-leaders-in-law/",
  },
  {
    title: "Panza Maurer – A Sponsor of the 2025 Guy Harvey Foundation Love the Blue Gala",
    date: "November 7, 2025",
    excerpt:
      "Panza Maurer was honored to sponsor and attend the 2025 Guy Harvey Foundation Love the Blue Gala, an inspiring evening dedicated to ocean conservation and education. The firm's team participated alongside Guy Harvey and Jessica Harvey, joining supporters committed to marine ecosystem protection.",
    href: "https://www.panzamaurer.com/35288-2/",
  },
  {
    title:
      "Panza Maurer Participates in the 9th Annual Marine Research Hub of South Florida Summit at FLIBS",
    date: "November 6, 2025",
    excerpt:
      "Panza Maurer was proud to participate in the 9th Annual Marine Research Hub of South Florida Summit, held in conjunction with the Fort Lauderdale International Boat Show (FLIBS). This event brought together leaders from academia, industry, and government to explore groundbreaking innovations shaping the future of our oceans and coastal communities.",
    href: "https://www.panzamaurer.com/panza-maurer-participates-in-the-9th-annual-marine-research-hub-of-south-florida-summit-at-flibs/",
  },
];

function NewsCard({
  title,
  date,
  excerpt,
  href,
}: {
  title: string;
  date: string;
  excerpt: string;
  href: string;
}) {
  return (
    <div className="flex flex-1 flex-col rounded-2xl border border-gray-700 bg-gray-800/60 backdrop-blur-sm">
      <div className="flex flex-col gap-4 px-6 pb-8 pt-6">
        <h3 className="font-[family-name:var(--font-noto)] text-xl font-medium leading-7 text-white">
          {title}
        </h3>
        <p className="font-[family-name:var(--font-noto)] text-base font-normal leading-6 text-gray-400">
          {date}
        </p>
        <p className="font-[family-name:var(--font-noto)] text-base font-normal leading-6 text-gray-300">
          {excerpt}
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 font-[family-name:var(--font-noto)] text-lg font-medium leading-7 text-red-500 transition-colors hover:text-red-400"
        >
          Read
          <Image
            src="/images/arrow-up-right.svg"
            alt=""
            width={16}
            height={16}
          />
        </a>
      </div>
    </div>
  );
}

export default function News() {
  return (
    <section id="news" className="relative w-full overflow-hidden bg-primary-dark">
      {/* Background texture */}
      <Image
        src="/images/cases-bg.jpg"
        alt=""
        fill
        className="object-cover opacity-50"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(114.9deg, rgba(185,28,28,0) 68.8%, rgba(185,28,28,0.2) 94.2%), linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-8 py-10 lg:px-[110px]">
        {/* Row 1: Header + first card */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Left: Section header */}
          <div className="flex flex-1 flex-col gap-4 py-8">
            <span className="font-[family-name:var(--font-noto)] text-lg font-bold uppercase tracking-[0.72px] text-red-700">
              Latest News
            </span>
            <h2 className="font-[family-name:var(--font-hanken)] text-4xl font-semibold tracking-tight text-white lg:text-[52px] lg:leading-[1.6]">
              Panza Maurer News
            </h2>
          </div>
          {/* Right: First news card */}
          <div className="flex-1">
            <NewsCard {...newsItems[0]} />
          </div>
        </div>

        {/* Row 2: Two cards */}
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <NewsCard {...newsItems[1]} />
          <NewsCard {...newsItems[2]} />
        </div>

        {/* Row 3: Three cards */}
        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <NewsCard {...newsItems[3]} />
          <NewsCard {...newsItems[4]} />
          <NewsCard {...newsItems[5]} />
        </div>
      </div>
    </section>
  );
}
