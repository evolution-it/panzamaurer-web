export type ConsultingService = {
  slug: string
  title: string
  heading: string
  paragraphs: string[]
}

export const CONSULTING_ONLY_SLUGS = ['robin-supler'] as const

export function isConsultingOnlyAttorney(slug: string) {
  return (CONSULTING_ONLY_SLUGS as readonly string[]).includes(slug)
}

export const CONSULTING_TEAM: {
  slug: string
  name: string
  role: string
  imageSrc?: string
}[] = [
  { slug: 'thomas-f-panza', name: 'Thomas F. Panza', role: 'Founding Partner' },
  { slug: 'jennifer-maurer-bean', name: 'Jennifer Maurer Bean', role: 'Partner' },
  {
    slug: 'robin-supler',
    name: 'Robin Supler',
    role: 'Consultant',
    imageSrc: '/images/attorneys/robin-supler.jpeg',
  },
  { slug: 'gregory-l-mcdermott', name: 'Gregory L. McDermott', role: 'Partner' },
]

export const CONSULTING_ONLY_ATTORNEYS = {
  'robin-supler': {
    name: 'Robin Supler, JD, CHC, CHPC',
    firstName: 'Robin',
    role: 'Consultant',
    imageSrc: '/images/attorneys/robin-supler.jpeg',
    intro: [
      'Robin is a healthcare compliance and privacy professional with over 25 years of experience guiding healthcare organizations through regulatory complexity and operational transformation. Throughout her career, she has supported physicians and healthcare organizations in navigating complex regulatory environments, implementing effective compliance frameworks, and strengthening internal controls to ensure adherence to federal and state requirements.',
      'Her extensive knowledge of federal and state healthcare laws, program requirements and best practices have led her to work with large public health systems, academic medical centers, physician practices, and seven university health colleges (Colleges of Allopathic Medicine, Dental Medicine, Nursing, Optometry, Osteopathic Medicine, Pharmacy and Psychology).',
      'Her legal background and hands-on healthcare compliance experience enable her to translate complex regulatory requirements into practical policies and workflows that are clear, effective, and well suited for physician and staff education and implementation. The combination of compliance expertise and legal knowledge is a valuable addition to the Panza Maurer Solutions Consulting, enhancing our ability to address healthcare compliance from both a regulatory and business-risk perspective. Robin earned her Juris Doctor from the University of Miami School of Law and is certified in Healthcare Privacy Compliance (CHPC), and Healthcare Compliance (CHC).',
    ],
    sections: [],
    education: [
      'B.A. in Psychology from the University of Miami (1983)',
      'J.D. from the University of Miami (1986)',
    ],
    barAdmissions: ['Florida (1988)'],
  },
}

export const CONSULTING_OVERVIEW = {
  eyebrow: 'Consulting & Strategic Advisory Services',
  title: 'Panza Maurer Solutions',
  teamHeading: 'Panza Maurer Solutions Consulting Team',
  heading: 'Strategic Insight. Trusted Relationships. Real-World Solutions.',
  paragraphs: [
    'Panza Maurer Solution’s consulting practice helps businesses, institutions, and organizations navigate complex challenges at the intersection of law, government, business, and public policy. Drawing on decades of legal, political, regulatory, and community experience, our team brings more than technical expertise to an engagement – we understand how decisions are made, who the relevant stakeholders are, and how to build the relationships and strategies necessary to move an initiative forward.',
    'Our consultants work alongside clients to identify opportunities, solve problems, manage regulatory and institutional complexity, and turn ambitious ideas into actionable strategies. With deep roots throughout Florida and extensive relationships across the public and private sectors, Panza Maurer Solutions is uniquely positioned to connect legal and regulatory insight with political awareness, industry knowledge, and local relationships. Whether advising a healthcare organization navigating a changing regulatory environment, helping an organization strengthen its compliance framework, or advancing opportunities within Florida’s growing blue economy, our approach is practical, strategic, and focused on results.',
  ],
}

export const CONSULTING_SERVICES: ConsultingService[] = [
  {
    slug: 'healthcare-strategy-consulting',
    title: 'Healthcare Strategy & Consulting',
    heading: 'Navigating Healthcare Complexity. Advancing Strategic Opportunities.',
    paragraphs: [
      'Healthcare organizations operate in an increasingly complex environment shaped by evolving regulations, shifting public policy, financial pressures, and changing models of care. Panza Maurer Solutions provides strategic advisory services to hospitals, health systems, physician organizations, healthcare businesses, and other industry stakeholders seeking to navigate these challenges while identifying opportunities for growth and innovation. Drawing on decades of experience advising healthcare institutions and working with state and federal regulatory agencies, our consultants bring a practical understanding of the legal, political, operational, and institutional considerations that influence healthcare decisions.',
      'Our team works alongside healthcare leadership to develop and implement strategies involving organizational growth, regulatory positioning, business development, government relations, institutional partnerships, and operational challenges. Whether evaluating a new service line, navigating a changing regulatory environment, pursuing a strategic affiliation, or responding to emerging industry trends, we help clients anticipate obstacles, engage the appropriate stakeholders, and develop actionable plans aligned with their organizational objectives.',
      'What distinguishes Panza Maurer Solutions is our ability to connect healthcare industry knowledge with regulatory insight, government relationships, and a sophisticated understanding of Florida’s healthcare landscape. We recognize that successful healthcare initiatives require more than technical compliance; they require an understanding of how public policy, regulatory agencies, institutional interests, and business realities intersect. Our approach is collaborative, forward-looking, and focused on helping clients make informed decisions and achieve sustainable results.',
    ],
  },
  {
    slug: 'compliance-risk-management',
    title: 'Compliance & Risk Management',
    heading: 'Proactive Solutions for Complex Regulatory Environments.',
    paragraphs: [
      'In today’s highly regulated business environment, effective compliance and risk management are essential to organizational stability, operational efficiency, and long-term success. Panza Maurer Solutions helps businesses, institutions, and organizations develop practical compliance strategies that address regulatory obligations while supporting broader business objectives. With extensive experience across healthcare, higher education, government contracting, and other regulated industries, our consultants understand the challenges organizations face in translating complex legal and regulatory requirements into effective operational practices.',
      'Our advisory services include evaluating existing compliance frameworks, identifying areas of regulatory and institutional risk, developing policies and internal procedures, and assisting leadership with strategies to strengthen accountability and organizational oversight. We work with clients to anticipate regulatory developments, assess operational vulnerabilities, and establish practical systems that promote compliance without unnecessarily burdening business operations. Our approach emphasizes prevention, early identification of potential problems, and solutions tailored to each organization’s structure, industry, and risk profile.',
      'Panza Maurer Solutions brings a perspective shaped by decades of experience working with regulatory agencies, institutional leadership, and businesses navigating government oversight. We understand not only what the regulations require, but how they are interpreted, administered, and enforced. By combining regulatory knowledge with practical business judgment, we help organizations move beyond reactive compliance toward a more strategic approach to managing risk, protecting institutional interests, and supporting responsible growth.',
    ],
  },
  {
    slug: 'blue-economy-marine-innovation',
    title: 'Blue Economy & Marine Innovation',
    heading: 'Connecting Marine Innovation, Policy, and Economic Opportunity.',
    paragraphs: [
      'Florida’s marine and maritime industries represent extraordinary opportunities for innovation, economic development, environmental resilience, and scientific advancement. Panza Maurer Solutions provides strategic advisory services to businesses, research institutions, technology developers, investors, and public-sector organizations seeking to advance initiatives within the growing blue economy. Our work focuses on connecting the region’s extensive marine and maritime assets with the partnerships, regulatory strategies, institutional relationships, and commercial opportunities necessary to transform innovation into meaningful economic impact.',
      'Drawing on our experience working with academic research institutions, government agencies, and marine-sector stakeholders, we help clients navigate the complex intersection of ocean science, technology commercialization, environmental regulation, coastal resilience, maritime infrastructure, and economic development. Our consulting approach recognizes that successful marine innovation requires coordination across traditionally separate sectors, including universities, research laboratories, industry, government, investors, and workforce development organizations. We assist clients in identifying strategic partnerships, evaluating regulatory and permitting pathways, developing public-private initiatives, advancing research commercialization, and creating opportunities for emerging marine technologies to be tested, demonstrated, and brought to market.',
      'Panza Maurer Solutions is particularly focused on helping Florida capitalize on its unique geographic, scientific, and institutional advantages to strengthen its position as a leader in the global blue economy. From marine technology and ecosystem restoration to resilient infrastructure, aquaculture, maritime innovation, and workforce development, we help bring together the people, resources, and strategies necessary to move ambitious initiatives forward. Our strength lies in understanding both the opportunities and the institutional barriers that can prevent promising ideas from advancing – and in developing practical strategies to bridge the gap between research, policy, investment, and implementation.',
    ],
  },
  {
    slug: 'government-procurement-public-sector-strategy',
    title: 'Government Procurement & Public Sector Strategy',
    heading: 'Understanding Government. Positioning Clients for Success.',
    paragraphs: [
      'Successfully pursuing opportunities in the public sector requires more than a competitive product or service. It demands an understanding of government priorities, procurement processes, institutional decision-making, and the regulatory frameworks that shape public contracting. Panza Maurer Solutions advises businesses, contractors, service providers, and organizations seeking to enter, expand, or strengthen their presence in government markets. With decades of experience navigating Florida’s state and local procurement systems, our team helps clients understand the public-sector landscape, identify opportunities, and develop strategies that align their capabilities with government needs.',
      'Our consulting services extend throughout the business development and procurement lifecycle, from early market assessment and opportunity identification to procurement planning, competitive positioning, stakeholder engagement, and contract implementation strategy. We help clients evaluate government priorities, understand procurement requirements, anticipate potential challenges, and develop approaches that improve their ability to compete effectively. For organizations already working with government, we provide strategic guidance on navigating institutional relationships, addressing operational challenges, and identifying opportunities for expanded public-sector engagement.',
      'What sets Panza Maurer Solutions apart is our understanding of how government operates beyond the written procurement rules. Our team brings extensive experience working with state agencies, counties, municipalities, school districts, special districts, and other public institutions throughout Florida. By combining procurement expertise with regulatory knowledge, political awareness, and longstanding relationships across the public and private sectors, we help clients approach government opportunities strategically, build credibility, and position themselves for long-term success.',
    ],
  },
  {
    slug: 'higher-education-institutional-strategy',
    title: 'Higher Education & Institutional Strategy',
    heading: 'Advancing Institutional Missions Through Strategic Partnerships and Practical Solutions.',
    paragraphs: [
      'Colleges, universities, research institutions, and other mission-driven organizations face increasingly complex challenges involving governance, regulatory oversight, financial sustainability, institutional growth, and evolving public expectations. Panza Maurer Solutions provides strategic advisory services to institutional leaders seeking to navigate these challenges while advancing long-term organizational priorities. Building on decades of experience advising major educational and research institutions, our consultants understand the intersection of academic governance, public policy, institutional operations, and the external relationships that influence an institution’s ability to grow and succeed.',
      'We work with institutional leadership to evaluate strategic opportunities, strengthen governance and operational frameworks, develop partnerships, and advance initiatives involving research, innovation, infrastructure, and economic development. Our services include advising on institutional expansion, public-private collaborations, government engagement, research commercialization strategies, and the development of new academic or industry partnerships. We also help institutions navigate the regulatory and political considerations associated with complex initiatives, particularly those requiring coordination among universities, government agencies, healthcare organizations, private industry, and community stakeholders.',
      'Panza Maurer Solutions recognizes that successful institutional initiatives depend on more than sound internal planning. They require alignment among leadership, governing bodies, funding partners, regulators, and the broader community. Our consultants bring the institutional perspective, government relationships, and practical experience necessary to help organizations build consensus, overcome barriers, and translate long-term visions into achievable strategies. Whether supporting a major research initiative, developing a new institutional partnership, or evaluating opportunities for organizational growth, our focus remains on advancing each client’s mission through thoughtful planning and effective execution.',
    ],
  },
  {
    slug: 'strategic-planning-economic-development',
    title: 'Strategic Planning & Economic Development',
    heading: 'Turning Vision into Action. Connecting Opportunity with Results.',
    paragraphs: [
      'Meaningful economic development requires more than identifying opportunities—it requires a coordinated strategy that connects business interests, government priorities, institutional resources, and community needs. Panza Maurer Solutions works with businesses, public entities, economic development organizations, academic institutions, and industry groups to develop and advance initiatives that promote investment, innovation, job creation, and long-term economic growth. Our approach combines strategic planning with an understanding of Florida’s regulatory environment, governmental processes, business landscape, and the relationships necessary to move complex initiatives forward.',
      'We assist clients in identifying competitive advantages, evaluating development opportunities, building public-private partnerships, and creating strategies to attract investment and support emerging industries. Our consulting work may involve coordinating stakeholders around major economic initiatives, identifying opportunities to leverage institutional and infrastructure assets, developing industry-focused innovation ecosystems, or advancing projects that require cooperation among government, academia, and the private sector. We place particular emphasis on connecting strategic objectives with practical implementation plans, including leadership structures, funding opportunities, regulatory considerations, and measurable milestones.',
      'Panza Maurer Solutions understands that even the most promising economic development concepts can fail without the right leadership, partnerships, and execution strategy. Our consultants help clients move beyond planning documents by identifying the organizations and decision-makers essential to success, clarifying responsibilities, and developing the relationships needed to sustain progress. Drawing on extensive experience across Florida’s public and private sectors, we help transform ambitious ideas into coordinated initiatives capable of delivering lasting economic and community value.',
    ],
  },
  {
    slug: 'regulatory-market-entry-strategy',
    title: 'Regulatory & Market Entry Strategy',
    heading: 'Navigating Regulatory Barriers. Opening New Markets.',
    paragraphs: [
      'Entering a new market, launching an innovative product, or expanding into a regulated industry presents challenges that extend well beyond traditional business planning. Regulatory requirements, licensing structures, government policies, and institutional decision-making can significantly influence the feasibility, timing, and success of a new venture. Panza Maurer Solutions provides strategic advisory services to businesses, investors, entrepreneurs, and established organizations seeking to enter or expand within complex regulatory environments, particularly in Florida’s highly regulated industries.',
      'Our consultants work with clients to evaluate regulatory landscapes, identify potential barriers to entry, assess licensing and permitting pathways, and develop strategies that align business objectives with applicable government requirements. We assist organizations in understanding the agencies, policymakers, and other stakeholders whose decisions may affect their initiatives, while identifying opportunities to engage constructively in regulatory and policy processes. Whether entering a new geographic market, introducing an emerging technology, pursuing a new business model, or expanding operations within an existing industry, we help clients anticipate challenges and develop informed, practical strategies for moving forward.',
      'With decades of experience in administrative law, regulatory affairs, government relations, and business strategy, Panza Maurer Solutions offers clients an understanding of how regulatory systems function in practice. We recognize that market entry often depends not only on satisfying established requirements, but also on understanding evolving policies, institutional priorities, and the broader governmental environment. By connecting regulatory insight with business strategy and longstanding relationships throughout Florida, we help clients evaluate opportunities, navigate uncertainty, and establish a foundation for successful market entry and sustainable growth.',
    ],
  },
]

export function getConsultingService(slug: string) {
  return CONSULTING_SERVICES.find((service) => service.slug === slug)
}
