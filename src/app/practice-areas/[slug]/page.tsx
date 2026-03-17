import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const practiceAreaData: Record<
  string,
  {
    title: string;
    heading: string;
    content: string[];
  }
> = {
  "administrative--regulatory-law": {
    title: "Administrative | Regulatory Law",
    heading: "A Nice Heading about Regulatory Law",
    content: [
      "Panza Maurer & Maynard assists clients within the framework of local, state and federal regulations. A key factor in this area of practice is an in-depth understanding of applicable laws to assist clients in navigating what is often a complex set of rules and regulations. The firm has intimate knowledge of the regulatory process and has developed long-standing professional relationships within many governmental and administrative agencies, a significant factor in achieving results.",
      "PMM represents clients on matters before the Florida Attorney General's Office, the Florida Departments of Insurance and Revenue, Children and Families, Health, Agriculture and Consumer Services, Environmental Protection, Department of Lottery, Environmental Regulations, the Florida Department of Education, DCA, and Department of Transportation. We also work extensively with the Florida Agency for Health Care Administration (AHCA), as well as federal agencies such as the Centers for Medicare and Medicaid Services, Occupational Safety and Health Administration, the U.S. Department of Education, Department of Justice and the Food and Drug Administration. Other diverse matters handled by this division include: professional licensure and discipline, procurement, bid protests, environment and land use issues, utilities rate-making regulation and grants. We know the Florida landscape at PMM and can produce significant benefits for our clients.",
    ],
  },
  healthcare: {
    title: "Healthcare",
    heading: "Comprehensive Healthcare Legal Services",
    content: [
      "Today's healthcare providers are subject to an ever-increasing and constantly evolving number of regulatory requirements that require experienced legal counsel who have a clear understanding of the wide range of issues that providers may encounter. Our experienced health care lawyers deliver strategic, innovative, solution-driven legal counsel to healthcare providers, suppliers, and organizations navigating today's complex regulatory landscape. We emphasize prevention, compliance, and strategic regulatory planning to help our healthcare clients operate confidently, minimize risk, and adapt to the evolving demands of the healthcare regulatory landscape.",
      "Our practice is built on deep experience in compliance, licensure, regulatory affairs, and healthcare business development and operations, including fraud and abuse, physician self-referral, HIPAA, false claims, professional disciplinary matters, medical staff matters, professional service agreements, as well as labor and employment issues. Our healthcare practice includes attorneys who have extensive experience in health care regulation and in state and federal government and administrative law. We collaborate with clients' corporate transactional, development, employment and government relations teams on litigation, regulatory, transactional and compliance matters to deliver integrated solutions tailored to each client's unique needs.",
      "Our team has represented healthcare providers across the healthcare continuum, including hospitals and multi-hospital systems, physician practices and networks, long-term care, skilled nursing, and assisted living facilities, hospices, home health agencies, pharmacies and durable medical equipment providers, imaging centers and diagnostic facilities, trade associations and healthcare service providers, pharmacy benefit managers, and third party payors.",
      "Panza Maurer assists clients with complex licensure and certification matters before state and federal regulatory bodies, including the Agency for Health Care Administration, the Department of Health, and the Centers for Medicare & Medicaid Services. Our licensure services include initial licensure and certification applications, Certificate of Need applications and litigation, change of ownership (CHOW) approvals, facility expansions and service line additions, regulatory compliance reviews, plan of correction development, and defense in administrative proceedings and enforcement actions.",
      "Through our Tallahassee presence, Panza Maurer represents healthcare clients before the Florida Legislature and state agencies on legislative and regulatory matters. We monitor policy developments, advise on regulatory reform, and advocate for client interests in healthcare, insurance, and related sectors.",
    ],
  },
  compliance: {
    title: "Compliance",
    heading: "Strategic Compliance & Risk Management",
    content: [
      "At Panza Maurer, compliance is a core strength of our practice. Our attorneys advise clients on complex compliance matters involving corporate governance, regulatory oversight, and risk management. We understand that proactive compliance is one of the most valuable investments an organization can make.",
      "We work closely with clients to minimize risks while supporting operational goals. From developing corporate-wide ethics and compliance programs to conducting internal audits and targeted investigations in high-risk areas, we provide practical, strategic guidance designed to protect both reputation and revenue. Sensitive matters are handled with precision, confidentiality, and sound legal judgment.",
      "Our team helps organizations navigate a rapidly evolving regulatory environment. We provide timely alerts, training programs, and strategic advice to ensure clients remain compliant, manage risks effectively, and maintain strong corporate governance.",
    ],
  },
  "corporate--transactional": {
    title: "Corporate | Transactional",
    heading: "Corporate & Transactional Law",
    content: [
      "Legal skills and expertise in organizational structure and financial transactions to achieve client business goals. Panza Maurer provides comprehensive corporate counsel on entity formation, governance, mergers and acquisitions, joint ventures, and complex commercial transactions.",
      "Our transactional attorneys draft, review, and negotiate a wide range of business agreements including purchase/sale agreements, operating agreements, shareholder agreements, commercial leases, and licensing arrangements. We focus on structuring deals that protect our clients' interests while achieving their strategic objectives.",
    ],
  },
  litigation: {
    title: "Litigation",
    heading: "Civil & Commercial Litigation",
    content: [
      "Insurance defense counsel representing numerous individuals, private and public corporations. Panza Maurer's litigation practice spans state and federal courts across Florida, handling complex commercial disputes, employment litigation, healthcare litigation, and administrative proceedings.",
      "Our trial attorneys bring decades of experience in navigating high-stakes disputes. From pre-suit investigation through trial and appeal, we develop strategic litigation plans designed to achieve favorable outcomes for our clients through negotiation, mediation, or trial.",
    ],
  },
  "land-use--environmental": {
    title: "Land Use | Environmental",
    heading: "Land Use & Environmental Law",
    content: [
      "Panza Maurer represents property owners, developers, lenders and other affected parties with land use and environmental matters. Our attorneys have extensive experience navigating local, state, and federal regulatory frameworks governing land development, environmental compliance, and natural resource management.",
      "The firm handles zoning matters, comprehensive plan amendments, development orders, environmental permitting, contamination remediation, and regulatory enforcement actions. We work closely with government agencies to secure approvals and resolve disputes efficiently.",
    ],
  },
  "trusts--estates": {
    title: "Trusts & Estates",
    heading: "Trusts & Estate Planning",
    content: [
      "Panza Maurer Law Firm Trusts & Estates practice attorneys know and have extensive experience in a wide variety of estate planning matters. We provide personalized counsel on wills, trusts, powers of attorney, healthcare directives, and comprehensive estate plans.",
      "Our attorneys assist clients with wealth preservation strategies, business succession planning, probate administration, and trust management. We work to ensure that our clients' assets are protected and their wishes are carried out effectively.",
    ],
  },
  "technology--it": {
    title: "Technology | IT",
    heading: "Technology | IT",
    content: [
      "Panza Maurer provides strategic legal counsel on cybersecurity compliance and risk management. Our services include identifying applicable statutory and regulatory frameworks, conducting regulatory mapping (including under the Gramm-Leach-Bliley Act and the HIPAA Security Rule), developing and refining policies and procedures, and advising on coordinated implementation with internal IT personnel and external cybersecurity professionals.",
      "We assist clients in benchmarking policies, controls, and documentation against NIST-aligned standards and other recognized frameworks to support defensible, risk-based compliance programs. Through this integrated approach, we help organizations strengthen their security posture while aligning operational practices with evolving legal and regulatory expectations.",
    ],
  },
  "intellectual-property": {
    title: "Intellectual Property",
    heading: "Intellectual Property Protection",
    content: [
      "Our intellectual property attorneys have extensive experience in client filing and procuring trademarks and copyrights. Panza Maurer assists businesses in identifying, protecting, and enforcing their intellectual property rights.",
      "Our practice encompasses trademark registration and enforcement, copyright protection, trade secret litigation, licensing agreements, and IP due diligence in corporate transactions.",
    ],
  },
  "education-law": {
    title: "Education Law",
    heading: "Education Law",
    content: [
      "Panza Maurer provides comprehensive legal counsel to colleges, universities, and K\u201312 institutions across a broad spectrum of issues unique to the education sector. We advise on matters involving student and employee misconduct, accreditation, tenure and promotion, institutional governance, compliance with federal funding requirements, student-athlete issues, and employment concerns specific to educational environments.",
      "Our attorneys offer particular strength in proactive compliance and risk management, including student handbook review, employee policy development, and alignment with applicable state and federal laws. We routinely counsel institutions on compliance with the Americans with Disabilities Act and Section 504 of the Rehabilitation Act, Title IX, FERPA, the Clery Act, Title VI of the Civil Rights Act, and other federal and state anti-discrimination statutes, helping clients navigate complex regulatory frameworks with clarity and confidence.",
      "The firm has also served as general counsel to major universities, providing strategic guidance at the highest levels of institutional leadership. From governance and long-term planning to regulatory investigations and dispute resolution, we partner with educational institutions to protect their missions and reputations. Our experience includes representing universities in matters before the U.S. Department of Education\u2019s Office for Civil Rights, conducting internal investigations, preparing institutional representatives for agency interviews, and defending related claims in administrative proceedings and litigation.",
    ],
  },
  "gaming--hospitality": {
    title: "Gaming & Hospitality",
    heading: "Gaming & Hospitality Law",
    content: [
      "Panza Maurer has represented lottery, gaming and hospitality clients in one of Florida's most highly regulated industries, with a concentrated focus on regulatory compliance, administrative advocacy, and legislative strategy. Our attorneys advise lottery operators worldwide, pari-mutuel operators, tribal entities, and hospitality businesses on licensing and permitting, statutory interpretation, rulemaking, and enforcement matters, helping clients navigate complex regulatory frameworks with clarity and confidence.",
      "We regularly advocate on behalf of clients before the Florida Department of Administrative Hearings, the First District Court of Appeal, and the Florida Supreme Court, and work closely with regulators, executive agencies, and legislative bodies to protect and advance our clients' interests. Our practice combines administrative depth and government relations insight to deliver strategic, effective regulatory representation.",
    ],
  },
  "strategic-planning": {
    title: "Strategic Planning",
    heading: "Government Relations & Strategic Planning",
    content: [
      "Panza Maurer Law Firm provides government relations consulting and strategic planning to firm clients. We help businesses and organizations develop comprehensive strategies for engaging with local, state, and federal government entities.",
      "Our strategic planning services include legislative monitoring, policy analysis, coalition building, and advocacy campaign development. We leverage our extensive government relationships and deep understanding of the regulatory landscape to help clients achieve their strategic objectives.",
    ],
  },
  "government-relations": {
    title: "Government Relations",
    heading: "Government Affairs & Strategic Advocacy",
    content: [
      "Panza Maurer's government affairs practice is fully integrated within the firm's broader regulatory and administrative law platform. We provide strategic governmental relations counsel and advocacy services to clients navigating complex legislative, regulatory, and policy matters at the federal, state, regional, and local levels.",
      "With offices in Tallahassee, Miami, and Fort Lauderdale, the firm is uniquely positioned to serve clients throughout Florida and beyond. Our Tallahassee presence in the state capital for more than 40 years provides direct access to the Legislature, executive agencies, and statewide regulatory bodies, while our South Florida offices allow us to effectively represent clients before regional and local governments and key economic centers.",
      "Our attorneys and registered lobbyists have a unique understanding of government relations and maintain a longstanding reputation with key policymakers that span partisan lines. Firm attorneys and staff monitor and analyze legislative and regulatory developments, represent clients in agency rulemaking and administrative proceedings, and develop comprehensive advocacy strategies aligned with our clients' legal and business objectives.",
      "Panza Maurer has experience drafting legislation and defending legislative enactments against state constitutional challenges, ensuring that policy objectives are supported by sound legal foundations. The firm is a member of the Florida Association of Professional Lobbyists.",
    ],
  },
  "labor--employment": {
    title: "Labor | Employment",
    heading: "Labor & Employment Law",
    content: [
      "Panza Maurer is recognized for its depth of experience in labor and employment law, representing employers, businesses, and institutions in all aspects of workplace-related matters. We provide strategic counsel designed to minimize risk, ensure regulatory compliance, and protect our clients' operational and reputational interests.",
      "Our practice includes wage and hour compliance, employee classification, discrimination and harassment claims, disciplinary actions, wrongful termination, workplace investigations, employee policies, contractual disputes, separation agreements, compensation arrangements, as well as leave and accommodation matters. The firm can provide training in employment law matters ranging from hiring practices, sexual harassment, religious and ADA accommodations, discipline, emerging employment law issues and other customized topics to meet the client's needs.",
      "Panza Maurer routinely investigates as well as litigates cases involving discrimination in employment, Title VII of the 1964 Civil Rights Act, the Florida Civil Rights Act (FCRA), the Americans with Disabilities Act (ADA) and the Fair Labor Standards Act (FLSA). We routinely advise clients on sexual harassment and retaliation claims as well as involuntary terminations. The firm provides assistance in every step of the litigation process from an initial Equal Employment Opportunity Commission (EEOC)/local agency inquiry through trial and the appellate process and case resolution.",
      "Panza Maurer enjoys an excellent reputation with EEOC offices, as well as the Labor and Employment Litigation Department of the Attorney General's Office. Our approach combines proactive counseling with effective advocacy, helping clients navigate complex employment challenges with confidence.",
    ],
  },
  procurement: {
    title: "Procurement",
    heading: "Government Procurement Law",
    content: [
      "Panza Maurer has decades of experience in handling large state and local bid and procurement matters. The firm consults with clients from the earliest stages of the procurement process including preparing for anticipated procurements, reviewing potential provisions to ensure a fair and balanced solicitation, solicitation specifications that are clear and concise, and navigating the potential contracting process.",
      "We are also well versed in evaluating and assessing procurement submission requirements and collaborating with subject matter experts in developing the client's proposal. Early involvement is critical to understand the client's opportunity to provide requested services and how its proposal best meets the needs of the procuring entity. By directing attention to the evaluation criteria and contract terms, and participating in pre-bid and informational meetings, we are able to help craft client responses that are responsive and responsible, avoid disputes over submission and contract terms, and position clients for success.",
      "Panza Maurer also has extensive experience in challenging and defending specifications, awards and rankings that are frequently part of the procurement process. We have experience in Chapter 120 bid challenge hearings held before the Division of Administrative Hearings as well as those in front of county and municipal government agencies and boards.",
      "Through our comprehensive knowledge of Florida procurement law, our attorneys are particularly well-positioned to manage complex public procurements and bid protest proceedings, delivering strategic and favorable outcomes for clients across the State of Florida.",
    ],
  },
  "real-property": {
    title: "Real Property",
    heading: "Real Property Law",
    content: [
      "With more than fifty years of combined experience, our attorneys handle real estate sales contracts and leases, real estate litigation, land use issues, property management matters, foreclosures and related disputes. Our services include judicial and non-judicial foreclosures, loan modifications, mediations, post-judgment matters, evictions and writs of possession, drafting and negotiation of real estate contracts and leases, closings, and comprehensive land use and permitting representation. The firm also advises on zoning, code violations, association governance, and ongoing regulatory compliance to help clients minimize risk and protect their property interests.",
    ],
  },
  "receivership--conservatorship": {
    title: "Receivership | Conservatorship",
    heading: "Receivership & Conservatorship Services",
    content: [
      "Panza Maurer Law Firm serves as Conservators, Receivers or Custodians for commercial and real estate entities. Our attorneys have been appointed by courts to manage distressed assets, oversee business operations, and protect the interests of stakeholders.",
      "We bring a practical, business-minded approach to receivership and conservatorship matters, working to preserve asset values and achieve orderly resolutions for all parties involved.",
    ],
  },
  "medical-marijuana": {
    title: "Medical Marijuana",
    heading: "Medical Marijuana Law",
    content: [
      "Panza Maurer is an administrative and regulatory law firm focused on guiding clients through the complex legal framework governing medical marijuana in the State of Florida. We assist clients with every stage of the Medical Marijuana Treatment Center (MMTC) licensure process, providing strategic counsel on the administrative and operational requirements imposed by the Florida Department of Health (DOH). Our attorneys possess in-depth knowledge of Florida's evolving medical marijuana laws and regulations, as well as the practical industry insight necessary to navigate this highly regulated environment. With extensive experience across prior iterations of Florida's medical marijuana framework, we remain at the forefront of regulatory developments to position our clients for success.",
      "Beyond licensure, Panza Maurer advises on the formation and structuring of compliant business entities to meet MMTC regulatory requirements. Our team provides ongoing corporate governance and compliance support, including contract development and negotiation, corporate reporting, and internal policy implementation. Panza Maurer counsels medical marijuana operators on a wide range of regulatory matters, including advertising and marketing restrictions, banking and financing considerations, employment and environmental compliance, federal and Florida marijuana policy, licensing and registration, real estate and zoning requirements, product labeling standards, privacy regulations, and corporate and commercial transactions. Through proactive regulatory guidance and comprehensive administrative representation, we help clients operate confidently and compliantly in Florida's medical marijuana industry.",
    ],
  },
};

const allPracticeAreas = Object.entries(practiceAreaData).map(
  ([slug, data]) => ({
    slug,
    title: data.title,
  })
);

export function generateStaticParams() {
  return Object.keys(practiceAreaData).map((slug) => ({ slug }));
}

export default async function PracticeAreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = practiceAreaData[slug];

  if (!area) {
    return (
      <div className="flex min-h-screen flex-col items-center">
        <Navbar />
        <main className="flex w-full flex-1 items-center justify-center pt-[145px] lg:pt-[109px]">
          <p className="text-xl text-gray-600">Practice area not found.</p>
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
          <div className="mx-auto h-auto min-h-[160px] max-w-[1440px] pt-[100px] lg:h-[216px] lg:min-h-0 lg:pt-0">
            <div className="flex h-full flex-col items-center justify-center px-6 py-6 lg:pt-[36px] lg:pb-0">
              <div className="flex w-[800px] max-w-full flex-col items-center gap-[15px] text-center">
                <span className="text-xs font-bold uppercase tracking-[3px] text-primary-red">
                  Practice Area
                </span>
                <h1 className="font-[family-name:var(--font-hanken)] text-[28px] font-semibold leading-[1.3] tracking-[-0.52px] text-slate-600 sm:text-[36px] lg:text-[44px]">
                  {area.title}
                </h1>
                <Image
                  src="/images/underline-2.svg"
                  alt=""
                  width={293}
                  height={4}
                  className="w-[200px] sm:w-[293px]"
                />
              </div>
            </div>
          </div>

        </section>

        {/* Government Relations Team */}
        {slug === "government-relations" && (
          <section className="bg-white">
            <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 lg:px-28">
              <h2 className="mb-10 text-center font-[family-name:var(--font-hanken)] text-[28px] font-semibold text-gray-900 lg:text-[32px]">
                Our Government Relations Team
              </h2>
              <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "Thomas F. Panza",
                    role: "Founding Partner",
                    image: "thomas-f-panza.png",
                    slug: "thomas-f-panza",
                  },
                  {
                    name: "Sandra Harris",
                    role: "Government Relations",
                    image: "sandra-harris.jpeg",
                    slug: "sandra-harris",
                  },
                  {
                    name: "Jennifer Maurer Bean",
                    role: "Partner",
                    image: "jennifer-maurer-bean.png",
                    slug: "jennifer-maurer-bean",
                  },
                ].map((member) => (
                  <Link
                    key={member.slug}
                    href={`/attorneys/${member.slug}`}
                    className="group flex w-full max-w-[300px] flex-col items-center"
                  >
                    <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-lg">
                      <Image
                        src={`/images/attorneys/${member.image}`}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-[family-name:var(--font-hanken)] text-lg font-semibold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="bg-white">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-6 py-16 sm:px-8 lg:flex-row lg:gap-20 lg:px-28">
            {/* Left: Article content */}
            <div className="flex-1">
              <h2 className="mb-8 font-[family-name:var(--font-hanken)] text-2xl font-semibold text-gray-900 lg:text-[30px]">
                {area.heading}
              </h2>
              <div className="font-[family-name:var(--font-noto)] text-base leading-7 text-gray-700">
                {area.content.map((paragraph, i) => (
                  <p key={i} className="mb-6 text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="w-full flex-shrink-0 lg:sticky lg:top-[130px] lg:w-[340px] lg:self-start">
              <h3 className="mb-6 font-[family-name:var(--font-hanken)] text-xl font-semibold text-gray-900">
                Practice Areas
              </h3>
              <div className="flex flex-col">
                {allPracticeAreas.map((pa) => (
                  <Link
                    key={pa.slug}
                    href={`/practice-areas/${pa.slug}`}
                    className={`flex items-center justify-between border-b border-gray-100 py-3.5 text-sm transition-colors ${
                      pa.slug === slug
                        ? "font-semibold text-primary-red"
                        : "text-gray-700 hover:text-primary-red"
                    }`}
                  >
                    {pa.title}
                    <svg
                      className="h-4 w-4 flex-shrink-0 text-primary-red"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
