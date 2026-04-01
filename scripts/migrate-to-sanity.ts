/**
 * One-time data migration: hardcoded site content → Sanity
 *
 * Prerequisites:
 *   1. Create an Editor API token in Sanity (manage.sanity.io → API → Tokens)
 *   2. Add to .env.local:  SANITY_WRITE_TOKEN=<your-editor-token>
 *
 * Run with:
 *   npx tsx scripts/migrate-to-sanity.ts
 *
 * Install tsx if needed:
 *   npm install --save-dev tsx
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const token = process.env.SANITY_WRITE_TOKEN!

if (!projectId || !dataset || !token) {
  console.error('Missing required environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')

// ─── Image upload helper ────────────────────────────────────────────────────

const uploadedAssets: Record<string, string> = {} // filename → asset _id

async function uploadImage(imagePath: string, label?: string): Promise<string | null> {
  if (!fs.existsSync(imagePath)) {
    console.warn(`  ⚠️  Image not found: ${imagePath}`)
    return null
  }

  const filename = path.basename(imagePath)
  if (uploadedAssets[filename]) {
    return uploadedAssets[filename]
  }

  try {
    const buffer = fs.readFileSync(imagePath)
    const ext = path.extname(filename).slice(1).toLowerCase()
    const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`

    const asset = await client.assets.upload('image', buffer, {
      filename,
      contentType,
    })

    uploadedAssets[filename] = asset._id
    console.log(`  ✅ Uploaded ${label ?? filename}`)
    return asset._id
  } catch (err) {
    console.warn(`  ⚠️  Failed to upload ${filename}:`, (err as Error).message)
    return null
  }
}

function imageRef(assetId: string) {
  return { _type: 'image' as const, asset: { _type: 'reference' as const, _ref: assetId } }
}

// ─── Data definitions ────────────────────────────────────────────────────────

const partners = [
  { name: 'Thomas F. Panza', role: 'Founding Partner', image: 'thomas-f-panza.png', order: 1 },
  { name: 'Susan Horovitz Maurer', role: 'Founding Partner', image: 'susan-horovitz-maurer.png', order: 2 },
  { name: 'Dana Panza Macdonald', role: 'Managing Partner', image: 'dana-panza-macdonald.png', order: 3 },
  { name: 'Benjamin P. Bean', role: 'Partner', image: 'benjamin-p-bean.png', order: 4 },
  { name: 'Jennifer Maurer Bean', role: 'Partner', image: 'jennifer-maurer-bean.png', order: 5 },
  { name: 'Richard A. Beauchamp', role: 'Partner', image: 'richard-a-beauchamp.png', order: 6 },
  { name: 'Robert M. Bulfin', role: 'Partner', image: 'robert-m-bulfin.png', order: 7 },
  { name: 'Jose Felix Diaz', role: 'Partner', image: 'jose-felix-diaz.png', order: 8 },
  { name: 'Lorraine Duthe', role: 'Partner', image: 'lorraine-duthe.png', order: 9 },
  { name: 'James H. Horton, IV', role: 'Partner', image: 'james-h-horton-iv.png', order: 10 },
  { name: 'Gregory L. McDermott', role: 'Partner', image: 'gregory-l-mcdermott.png', order: 11 },
  { name: 'Elizabeth L. Pedersen', role: 'Partner', image: 'elizabeth-l-pedersen.png', order: 12 },
  { name: 'Louise Wilhite St. Laurent', role: 'Partner', image: 'louise-wilhite-st-laurent.png', order: 13 },
  { name: 'Samantha Evans Saltzburg', role: 'Senior Associate', image: 'samantha-evans-saltzburg.png', order: 14 },
  { name: 'Jennifer K. Graner', role: 'Senior Associate', image: 'jennifer-k-graner.png', order: 15 },
  { name: 'Andrew L. Myers', role: 'Senior Associate', image: 'andrew-l-myers.png', order: 16 },
  { name: 'Trevor D. Scott', role: 'Senior Associate', image: 'trevor-d-scott.png', order: 17 },
  { name: 'Julia C. Marano', role: 'Associate', image: 'julia-marano.png', order: 18 },
]

const ofCounsel = [
  { name: 'Brian Ballard', role: 'Of Counsel Attorney', image: 'brian-ballard.png', order: 1 },
  { name: 'Brad Burleson', role: 'Of Counsel Attorney', image: 'brad-burleson.png', order: 2 },
  { name: 'David Childs', role: 'Of Counsel Attorney', image: 'david-childs.png', order: 3 },
  { name: 'Jan Gorrie', role: 'Of Counsel Attorney', image: 'jan-gorrie.png', order: 4 },
  { name: 'Adrian Lukis', role: 'Of Counsel Attorney', image: 'adrian-lukis.png', order: 5 },
  { name: 'Syl Luks', role: 'Of Counsel Attorney', image: 'syl-luks.png', order: 6 },
  { name: 'Monica Rodriguez', role: 'Of Counsel Attorney', image: 'monica-rodriquez.png', order: 7 },
  { name: 'Eileen Stuart', role: 'Of Counsel Attorney', image: 'eileen-stuart.png', order: 8 },
  { name: 'Abby Vail', role: 'Of Counsel Attorney', image: 'abby-vail.png', order: 9 },
  { name: 'Sandra Harris', role: 'Government Relations', image: 'sandra-harris.jpeg', order: 10 },
]

// Full attorney bio data (matches attorneyData in attorneys/[slug]/page.tsx)
type AttorneyBio = {
  firstName: string
  education: string[]
  barAdmissions: string[]
  courtAdmissions: string[]
  professionalMemberships: string[]
  intro: string
  sections: { title: string; content: string[] }[]
}

const attorneyBios: Record<string, AttorneyBio> = {
  'thomas-f-panza': {
    firstName: 'Thomas',
    education: [
      'B.A. from Florida State University',
      'J.D. from Stetson University',
      'M.S. in Criminal Justice from Nova Southeastern University',
      'Ed.D. from Florida Atlantic University',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: ['U.S. District Court for the Southern District of Florida'],
    professionalMemberships: [
      'The Florida Bar — Administrative Law, Business Law, Health Care Law, and Trial Lawyer Sections',
      'National Association of College and University Attorneys (NACUA)',
      'American Health Lawyers Association (AHLA)',
      'American Bar Association (ABA)',
      'American Arbitration Association — Certified Arbitrator',
      'Florida Bar Foundation Fellow',
      'Italian American Lawyers Association — Past President',
    ],
    intro: 'Tom is an AV-rated attorney with over 50 years of experience in litigation, regulatory affairs, and governmental relations. His broad legal expertise spans multiple sectors, including healthcare, insurance, procurement, education, employment, environmental law, and government affairs. Throughout his distinguished career, Tom has represented numerous Fortune 500 companies, with a focus on corporate, academic, administrative, regulatory matters, and healthcare law.',
    sections: [
      {
        title: 'Healthcare Law',
        content: [
          "Tom provides strategic counsel to multimillion-dollar healthcare institutions and major corporations on complex regulatory and insurance matters, such as reimbursement issues, fraud and abuse allegations, state audit investigations, compliance and privacy concerns. He has successfully navigated high-stakes cases involving state and federal agencies, including the Agency for Health Care Administration (AHCA), Florida Department of Health, Florida Department of Children and Families, and the Florida Department of Financial Services. He has litigated complex cases before the Division of Administrative Hearings, the Florida Circuit Courts, the State Attorney's Office, the U.S. Attorney's Office, and the Office of Inspector General (OIG).",
          'Tom has successfully negotiated favorable settlements in high-stakes false claims and healthcare fraud matters. He has also represented healthcare providers in disciplinary proceedings before various health professions boards. With extensive knowledge of healthcare compliance, Tom has assisted both private and public institutions in developing comprehensive HITECH and HIPAA privacy plans. His expertise spans a wide range of healthcare law, with a particular focus on rulemaking and compliance across virtually every aspect of the field.',
          "Over the years, Tom has represented clients including Jackson Health System, Nemours, Shands Hospital, North and South Broward Hospital Districts, and various hospice and nursing home providers. Tom's advocacy is distinguished not only by his legal acumen but also by his strategic vision, helping clients achieve their objectives effectively.",
        ],
      },
      {
        title: 'Education Law',
        content: [
          'In addition to his healthcare law expertise, Tom has an extensive background in graduate medical education, enabling him to collaborate effectively with academic medical centers and hospitals on various healthcare programs, including those for medical, dental, optometry, and pharmacy education.',
          'Tom has served as University Counsel to Nova Southeastern University for over 40 years, advising on higher education and academic law as well as corporate governance for one of the largest independent private universities in the U.S. His involvement in education law extends beyond Nova Southeastern University, as he has worked with academic institutions to navigate complex regulatory and compliance matters.',
        ],
      },
      {
        title: 'Government Affairs',
        content: [
          'Tom has a robust background in government affairs and has built a distinguished reputation advocating for clients before state and federal government agencies. He has represented numerous public and private sector clients in matters involving regulatory compliance, legislative initiatives, and policy development. His extensive understanding of governmental processes allows him to effectively navigate complex administrative and regulatory landscapes.',
          "Throughout his career, Tom has been actively involved in legislative and gubernatorial committees. He has served as a member of the Florida Study Committee on Skilled Nursing Facilities, General Counsel to the Florida Patient's Compensation Fund, and served on various commissions and task forces related to healthcare regulation, licensure, and certificate of need programs. Tom's in-depth knowledge of governmental affairs has made him an invaluable asset to clients seeking to influence or comply with government policies.",
          'Tom represented one of the largest lottery companies in the world to implement the Florida lottery in the State of Florida and has also worked on lottery issues in other states and countries. His advocacy in government affairs has included working with local, state, and federal agencies to shape regulatory frameworks and legislation in sectors such as healthcare, education, gaming and insurance, giving him a unique ability to bridge the gap between private sector interests and public policy.',
        ],
      },
      {
        title: 'Additional Areas of Expertise',
        content: [
          "Tom's legal experience extends across various sectors, including healthcare, insurance, procurement, employment, and environmental law. He has represented public, private, not-for-profit, and for-profit entities, including sports franchises, technology companies, and major corporations in high-stakes regulatory and litigation matters.",
          'Tom is a member in good standing with both federal and state bar systems and holds memberships in the Administrative Law, Business Law, Health Care Law, and Trial Lawyer Sections of The Florida Bar. He is also a member of the National Association of College and University Attorneys (NACUA), the American Health Lawyers Association (AHLA), and the American Bar Association (ABA). He is a certified arbitrator with the American Arbitration Association and has been recognized as an expert in healthcare administration in federal court. Additionally, Tom previously served as a member of the Florida Federal Judicial Nominating Commission.',
        ],
      },
      {
        title: 'Community Leadership',
        content: [
          "Tom's commitment to community service is exemplified by his leadership roles, including serving as President of the New World Aquarium for eight years, Vice Chairman of the Museum of Discovery and Science, and Board Member for the Ounce of Prevention children's charity. He also served as President of the Catholic Education Foundation and is an active member of various advisory and governing boards, including the President's Advisory Council at Nova Southeastern University and the Board of Directors of the Florida State University Boosters. He is a Florida Bar Foundation Fellow and Past President of the Italian American Lawyers Association.",
        ],
      },
    ],
  },
  'susan-horovitz-maurer': {
    firstName: 'Susan',
    education: [
      'B.A. from Emory University',
      'J.D. from Nova Southeastern University Shepard Broad Law School (1980)',
    ],
    barAdmissions: ['Florida (State and Federal Court)'],
    courtAdmissions: ['U.S. District Court for the Southern District of Florida'],
    professionalMemberships: [
      'Broward County Bar Association',
      'The Florida Bar — Administrative Law and General Practice Sections',
      'American Health Lawyers Association (AHLA)',
      'National Association of College and University Attorneys (NACUA)',
      'Florida Bar Fellows',
      'American Arbitration Association — Commercial Arbitrator',
    ],
    intro: 'Susan Horovitz Maurer is an A.V. rated member of the Florida Bar admitted to practice in both state and federal court. She became a partner in Panza, Maurer & Maynard, P.A. in 1984, and assumed responsibilities as Managing Partner in 1994.',
    sections: [
      { title: 'Litigation & Regulatory Practice', content: ['Her extensive legal background is in litigation with an emphasis in regulatory and administrative work. Her primary practice areas have been in healthcare and academic law. For 40 years, she has provided advice and counsel to regulated industries and academic institutions, both public and private.', 'As a Commercial Arbitrator with the American Arbitration Association, Mrs. Maurer has arbitrated multiple healthcare, insurance and commercial matters. Mrs. Maurer has represented acute care chains and specialty care hospital providers on issues of licensure, reimbursement and fraud and abuse.', 'She has developed compliance plans and navigated multi-million dollar investigations for healthcare providers. Her work spans a broad range of regulatory and administrative matters affecting both public and private institutions.'] },
      { title: 'Healthcare & Academic Law', content: ['Mrs. Maurer has extensive experience advising healthcare institutions and academic medical centers. She has represented hospitals, specialty care providers, and academic institutions on complex regulatory matters including licensure, reimbursement, fraud and abuse, and compliance.', 'Her healthcare practice includes developing comprehensive compliance plans, navigating state and federal investigations, and representing providers before regulatory agencies and administrative tribunals.'] },
      { title: 'Prior Positions & Experience', content: ["Susan's distinguished career includes service with the United States Senate Committee on Governmental Affairs and the City of Miami Legal Department. She served as Adjunct Faculty and General Counsel for Nova Southeastern University, General Counsel for Community Mental Health Center, Inc., General Counsel for the Florida Workers' Compensation Insurance Guarantee Association, and Assistant General Counsel for the Broward Principals and Assistants Association."] },
      { title: 'Community Involvement', content: ["Susan has served on the boards of numerous community organizations, including the American Lung Association, Fort Lauderdale Historical Society, Temple Bat Yam, Nova Southeastern University President's Advisory Council, and the Fort Lauderdale Museum of Art.", 'Susan Horovitz Maurer is a native Floridian. Raised in Miami and currently lives in Broward County. She is fortunately married to Laurence Maurer, Esquire and has two awesome children.'] },
    ],
  },
  'dana-panza-macdonald': {
    firstName: 'Dana',
    education: ['J.D. from Stetson University College of Law, cum laude (2001)', 'B.S. from Florida State University (1998)'],
    barAdmissions: ['Florida', 'New York'],
    courtAdmissions: ['U.S. District Court for the Northern District of Florida', 'U.S. District Court for the Middle District of Florida', 'U.S. District Court for the Southern District of Florida'],
    professionalMemberships: ['Administrative Law Section of The Florida Bar', 'Labor and Employment Law Section of The Florida Bar', 'Broward County Bar Association', 'American Bar Association', "Broward County Women Lawyers' Association", 'Italian American Bar Association', 'National Association of College and University Attorneys (NACUA)'],
    intro: 'Dana Panza Macdonald practices primarily in the areas of labor and employment, litigation, and education matters in state and federal courts. Dana is Board Certified in Education Law by the Florida Bar.',
    sections: [
      { title: 'Education Law', content: ['Dana specializes in advising universities, colleges, and academic institutions on regulatory compliance, student rights, faculty/staff issues, and institutional governance. She has represented clients in Title IX, accreditation, student conduct, and employment law matters. She has moderated and spoken at seminars hosted by the National Association of College and University Attorneys (NACUA) regarding workplace discrimination and social media issues.'] },
      { title: 'Labor & Employment Law', content: ['Dana advises employers on wage and hour compliance, employee classification, and overtime regulations. She resolves disputes involving wrongful termination, discrimination, and harassment. She represents employers before the Equal Employment Opportunity Commission (EEOC), Florida Commission on Human Relations (FCHR), and in unemployment compensation hearings, Office for Civil Rights complaints, and workplace investigations.'] },
      { title: 'Community Leadership', content: ["Dana has been recognized as \"Florida Trend's Legal Elite NOTABLE – Women Leaders in Law\" (2025) and \"Florida Trend's Legal Elite NOTABLE – Managing Partners\" (2024). She is a member of Leadership Florida Cornerstone Class 42 and previously served on the Broward County Parks and Recreation Advisory Board from 2014 to 2019. Dana has also served with Gilda's Club South Florida, the Broward County Library Foundation, and the Christ Church School Board."] },
      { title: 'Education and Background', content: ['Dana earned her J.D. from Stetson University College of Law, cum laude, in 2001, where she was a Senior Associate Member of the Stetson Law Review and a member of Phi Delta Phi legal honorary fraternity. She interned for Hon. Thomas G. Wilson, U.S. Magistrate Judge. She received her B.S. from Florida State University in 1998.'] },
    ],
  },
  'benjamin-p-bean': {
    firstName: 'Benjamin',
    education: ['J.D., cum laude, University of Miami School of Law (2009)', 'B.A. in Political Science from University of Michigan (2004)'],
    barAdmissions: ['Florida'],
    courtAdmissions: ['U.S. District Court for the Southern District of Florida', 'U.S. District Court for the Middle District of Florida'],
    professionalMemberships: ['University of Michigan Alumni Club of Miami-Fort Lauderdale'],
    intro: 'Ben is a litigator and legal advisor who provides general counsel services to Florida businesses, with a primary focus on litigation in both state and federal courts.',
    sections: [
      { title: 'Litigation & General Counsel', content: ['Ben represents clients in complex disputes across multiple jurisdictions, including commercial litigation, employment law, intellectual property, and corporate matters. His approach combines sharp legal analysis with a practical, business-minded approach to achieve favorable outcomes through trial, mediation, or negotiated settlement.', 'Beyond litigation, Ben serves as general counsel to various Florida entities, offering strategic guidance on corporate governance, compliance, risk management, and contract negotiations.'] },
      { title: 'Community Leadership', content: ["Ben is a current member of the University of Michigan Alumni Club of Miami-Fort Lauderdale. He served on the City of Fort Lauderdale's Community Services Board, evaluating funding allocations for social service programs. Previously, he participated on the Young Leadership Council Steering Committee for Gilda's Club South Florida, an organization supporting individuals affected by cancer."] },
      { title: 'Education and Background', content: ["Ben earned his Juris Doctor, cum laude, from the University of Miami School of Law in 2009, where he served as executive editor of the International and Comparative Law Review. He received his Bachelor's degree in Political Science from the University of Michigan in 2004.", 'Ben has been named a "Rising Star" by Attorney at Law Magazine, recognized among "40 Under 40 Outstanding Lawyers of South Florida" by the Cystic Fibrosis Foundation, and named an "Up and Comer" by Florida Trend magazine. He was also selected for the 2026 Best Lawyers in America for Commercial Litigation.'] },
    ],
  },
  'jennifer-maurer-bean': {
    firstName: 'Jennifer',
    education: ['B.A. in Finance from University of Miami', 'J.D., cum laude, from University of Miami'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: ['The Florida Bar — Administrative Law, Health Law, and Environmental & Land Use Sections'],
    intro: 'Jennifer Maurer Bean brings over fifteen years of experience in government relations, with a strong track record of advocating before state legislative and executive agencies on matters related to healthcare, higher education, insurance, and environmental issues.',
    sections: [
      { title: 'Strategic Focus & Industry Expertise', content: ['As a skilled strategist and attorney, Jen offers clients forward-looking operational guidance and actionable policy insight, grounded in a deep understanding of state and local government operations. She is particularly focused on initiatives related to public procurements, higher education institutions, healthcare, and resiliency – areas where legislative and local policy making have a lasting impact on economic development, institutional strength, and long-term sustainability.', 'Jen partners closely with clients to develop strategies that not only address immediate policy challenges but also support long-term business positioning. Her ability to navigate the intersection of public policy and corporate strategy makes her a valued advisor to companies seeking to advance their strategic goals.'] },
      { title: 'Community Leadership', content: ["A committed community leader, Jen currently serves on the Board of Directors for the Broward County Chapter of the South Florida Red Cross as well as the Pace Center for Girls of Broward County. She is an active member of both the Greater Fort Lauderdale Alliance, the Port Everglades Action Team and the Florida Ocean Alliance. Her civic involvement reflects her dedication to supporting Florida's future through economic opportunity and inclusive growth."] },
      { title: 'Education and Background', content: ['Prior to joining the firm, Jen served as Vice President of Government Affairs for a national healthcare technology company. There, she led federal and state-level advocacy initiatives, playing a central role in shaping policies related to healthcare delivery systems and insurance reimbursement.', 'A native of Florida, Jen earned both her Bachelor of Arts in Finance and her Juris Doctor, cum laude, from the University of Miami. She is a member of the Florida Bar, including its Administrative Law, Health Law, and Environmental & Land Use sections.'] },
    ],
  },
  'richard-a-beauchamp': {
    firstName: 'Richard',
    education: ['B.A. from Stetson University (1982)', 'J.D. from Stetson College of Law (1984)'],
    barAdmissions: ['Florida', 'District of Columbia', 'Pennsylvania'],
    courtAdmissions: ['U.S. District Court for the Northern District of Florida', 'U.S. District Court for the Middle District of Florida', 'U.S. District Court for the Southern District of Florida', 'U.S. Eleventh Circuit Court of Appeals'],
    professionalMemberships: ['Labor and Employment Law Section of The Florida Bar', 'Trial Law Section of The Florida Bar', 'Business Law Section of The Florida Bar'],
    intro: "Richard A. Beauchamp's practice areas include the representation of one of the largest private universities and some of the largest school systems in the nation, as well as representing one of the largest accredited law enforcement agencies in the country.",
    sections: [
      { title: 'Litigation Practice', content: ['Mr. Beauchamp is originally from Detroit, Michigan, and has lived in Florida since 1975. He began his legal career focusing on commercial litigation, construction disputes, personal injury matters, real estate, and insurance. After operating a successful solo practice concentrating on insurance, real estate, personal injury, governmental entity liability and products liability, he joined the firm as partner in 2002.', "His practice encompasses educators' liability, civil rights litigation, commercial disputes, nursing home/medical malpractice litigation, and employment matters. He has represented both employees and employers regarding harassment, discrimination, and retaliation claims, as well as E.E.O.C. proceedings and whistleblower matters.", "He has managed the firm's statewide nursing home and rehabilitation hospital litigation division since joining. His experience includes multi-million dollar class actions and appellate work."] },
    ],
  },
  'robert-m-bulfin': {
    firstName: 'Robert',
    education: ['B.A. in Government from University of Notre Dame (1973)', 'J.D. from Loyola University of Chicago Law School (1976)'],
    barAdmissions: ['Florida'],
    courtAdmissions: ['U.S. District Court for the Southern District of Florida'],
    professionalMemberships: ['Business Law Section of The Florida Bar', 'General Practice Section of The Florida Bar', 'Real Property, Probate, and Trust Law Section of The Florida Bar', 'Broward County Bar Association', 'St. Thomas More Society of South Florida — Past President', 'Notre Dame Club of Fort Lauderdale — Past President'],
    intro: 'Bob Bulfin brings nearly 50 years of experience representing individuals, investors, and business owners in complex matters involving corporate structuring, real estate acquisitions and sales, commercial leasing, licensing, and permitting.',
    sections: [
      { title: 'Transactional Practice', content: ['His practice encompasses contract law, corporate structuring, and employment matters. Bob provides comprehensive counsel on drafting, negotiating, and enforcing various business agreements including purchase/sale agreements, leases, and licensing deals. He is known for his ability to anticipate risk, structure favorable terms, provide counsel on corporate practices, and settle disputes.', 'Bob has extensive experience structuring corporate agreements, supporting sound governance, and business growth, assisting with formations and advising on shareholder agreements, operating agreements, buy-sell arrangements, and corporate resolutions.', 'He has defended his corporate clients against EEOC and employment discrimination claims, ADA matters, unfair wages, and other governmental and private claims. Additionally, Bob provides trusted counsel on estate planning matters, assisting clients with wills, trusts, powers of attorney, and healthcare directives.', 'Since 2016 at Panza Maurer, he has represented clients in healthcare, real estate development, medical marijuana licensing, corporate acquisitions, and advised not-for-profits.'] },
    ],
  },
  'jose-felix-diaz': {
    firstName: 'Jose',
    education: ['B.A. with honors from University of Miami', 'J.D. from Columbia University School of Law', 'Certificate in Energy Policy and Planning from University of Idaho'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Jose Felix Diaz is a government law attorney. His practice areas include the representation of individuals, non-profits, major corporations, and various other entities before county and municipal boards throughout the State of Florida and beyond in complex matters involving public contract procurement, public-private partnership deals and solicitations, litigation, zoning, land use, code compliance and enforcement, energy project development and comprehensive planning.',
    sections: [
      { title: 'Legislative Experience', content: ["In 2010, Mr. Diaz was elected to the Florida House of Representatives, where he served as Chairman of the Energy & Utilities, Regulatory Affairs, and Commerce Committees. He served four terms in the Florida Legislature and was elected as the Chairman of the Miami-Dade Legislative Delegation. Mr. Diaz co-sponsored the State's first public-private partnership legislation which paved the way for local governments to codify uniform unsolicited proposal procedures.", "Mr. Diaz has served on various committees of statewide and regional significance, including the Public Service Commission's Nominating Council, the Southern States Energy Board, the National Conference of State Legislators, and the Florida Constitution Revision Commission, where he chaired the Legislative Committee. In 2017, Mr. Diaz was nominated as a top candidate for U.S. Attorney for the Southern District of Florida."] },
      { title: 'Community Leadership', content: ['He has been honored by both Miami-Dade County and the City of Miami for his national and local accomplishments, as well as being recognized by numerous state and national publications as a rising star in law and politics. Miami Today News listed Mr. Diaz in their listing of Best Legal Leaders of Miami-Dade County in 2014, and in 2016 recognized him as one of Miami-Dade\'s "Best in Government."', "A tireless advocate for children's causes, Mr. Diaz has served on the board of CHARLEE Homes for Children, the Miami-Dade County Children's Trust, and Our Kids of Miami-Dade & Monroe. He is a recipient of the United Way of Miami-Dade's Public Service Leadership Award, the Children's Trust Champion for Children Award, and Volunteer Florida's Champion of Service."] },
    ],
  },
  'lorraine-duthe': {
    firstName: 'Lorraine',
    education: ['Bachelor of Science in Nursing, magna cum laude', 'Master of Science in Community Health', 'J.D. from State University of New York at Buffalo School of Law (2006)'],
    barAdmissions: ['New York (2007)'],
    courtAdmissions: [],
    professionalMemberships: ['New York State Bar Association — Health Law Section', 'New York State Academy of Trial Lawyers', 'American Health Law Association', 'Health Care Compliance Association', 'Certified in HealthCare Research Compliance, Compliance Certification Board'],
    intro: "Lorraine Duthe is an accomplished healthcare attorney with over two decades of experience guiding hospitals, health systems, and healthcare technology companies through today's complex and ever-changing regulatory environment. With a unique blend of clinical insight and legal expertise, she helps clients navigate issues involving HIPAA, Stark Law, the Anti-Kickback Statute, clinical research compliance, and patient safety.",
    sections: [
      { title: 'Healthcare Law', content: ['A former nurse and health care executive, Lorraine brings a unique blend of clinical experience and legal expertise to her work with healthcare organizations. Whether collaborating with hospital leadership, compliance teams, or healthcare innovators, she offers guidance on navigating complex legal and regulatory landscapes, including federal and state healthcare laws, the Stark Law, Anti-Kickback Statute, HIPAA/privacy compliance, clinical research, and billing practices.'] },
      { title: 'Community Leadership', content: ['From 2018 to 2024, she served as a governor-appointed board member of the Florida Prescription Drug Monitoring Program Foundation.'] },
      { title: 'Education and Background', content: ['Lorraine holds a Bachelor of Science in Nursing, graduating magna cum laude, and a Master of Science in Community Health. She earned her J.D. from the State University of New York at Buffalo School of Law in 2006 and was admitted to the New York State Bar in 2007.', "For over a decade, Lorraine served as Associate General Counsel for a major hospital system in Western New York, where she provided comprehensive legal guidance on a range of healthcare-related issues, including regulatory compliance, fraud and abuse, HIPAA/privacy, and immigration. She was instrumental in developing the system's Clinical Research Center in collaboration with the State University of New York at Buffalo School of Medicine.", 'Lorraine later served as General Counsel for a healthcare technology company in Florida, where she advised on a wide range of legal and regulatory matters, including privacy, contracting, employment-related issues, and complex billing compliance.'] },
    ],
  },
  'james-h-horton-iv': {
    firstName: 'James',
    education: ['J.D. from Florida State University College of Law (2008)', 'B.S. in Legal Studies from University of Central Florida (2005)'],
    barAdmissions: ['Florida'],
    courtAdmissions: ['U.S. District Court for the Northern District of Florida', 'U.S. District Court for the Middle District of Florida', 'U.S. District Court for the Southern District of Florida'],
    professionalMemberships: ['National Association of College and University Attorneys (NACUA)', 'Phi Alpha Delta Law Fraternity', 'Labor & Employment Law Section of the Florida Bar'],
    intro: 'James Horton has been with the firm since 2008 and serves as a partner. As a member of the National Association of College and University Attorneys (NACUA), James focuses his practice in the areas of higher-education law, employment law, civil rights, disability rights, and information security.',
    sections: [
      { title: 'Education Law', content: ['James regularly advises colleges and universities on compliance with the Americans with Disabilities Act (ADA), Section 504 of the Rehabilitation Act of 1973, Title IV of the Higher Education Act of 1965, Title IX of the Education Amendments of 1972, the Family Educational Rights and Privacy Act (FERPA), and other required regulations of the U.S. Department of Education. His higher-education practice includes policy and student handbook development, governance, student and employee grievances, internal investigations, and responses to complaints and agency inquiries.'] },
      { title: 'Employment Law', content: ['James advises employers on compliance with Title VII of the Civil Rights Act of 1964, the Age Discrimination in Employment Act (ADEA), the Americans with Disabilities Act (ADA), the Pregnancy Discrimination Act (PDA), the Pregnant Workers Fairness Act (PWFA), the Family and Medical Leave Act (FMLA), and the Florida Civil Rights Act. His employment law practice includes counseling on discrimination and retaliation claims, disciplinary actions, accommodations, internal investigations, and employee grievances.'] },
      { title: 'Information Security Law', content: ['James advises educational institutions and private organizations on information security compliance. His work includes guidance under the Florida Information Protection Act (FIPA), the Family Educational Rights and Privacy Act (FERPA), the Gramm-Leach-Bliley Act (GLBA), the Health Insurance Portability and Accountability Act (HIPAA) Security Rule, and federal rules governing sensitive or bulk data. He assists clients with policy development, data governance, risk assessments, and responses to data breaches.'] },
      { title: 'Community Involvement', content: ['James currently serves on the School Board for Christ Church School in Fort Lauderdale.'] },
    ],
  },
  'gregory-l-mcdermott': {
    firstName: 'Gregory',
    education: ['J.D., magna cum laude, from University of Miami School of Law (2009)', 'B.A. in Mass Communication from Illinois State University (2005)'],
    barAdmissions: ['Colorado'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Gregory L. McDermott engages in civil litigation in state and federal court in a wide range of matters, with focus on commercial litigation and labor and employment.',
    sections: [
      { title: 'Administrative & Regulatory Practice', content: ['His administrative practice involves particular focus on issues related to state and local government. He demonstrates expertise in interpreting and understanding complex legislative issues, development of state agency administrative rules, and navigating through the often complex process of administrative and state agency proceedings.', 'He works with clients on a complex range of business issues with a focus on increasing bottom lines, while maintaining compliance with an often-times complex myriad of intermingling local, state and federal regulations.'] },
      { title: 'Education and Background', content: ['Gregory graduated magna cum laude from the University of Miami School of Law in 2009, where he was a member of the Order of the Coif Honor Society and the Miami Business Law Review. He received First Place in the 2007 Charles C. Papy Jr. Moot Court Competition and earned Highest Honors in the Litigation Skills Pre-trial & Trial Program.', 'He received his Bachelor of Arts in Mass Communication with a Minor in Political Science from Illinois State University in 2005.'] },
    ],
  },
  'elizabeth-l-pedersen': {
    firstName: 'Elizabeth',
    education: ['J.D. from University of Miami School of Law', 'B.A. in History from Tulane University'],
    barAdmissions: ['Florida'],
    courtAdmissions: ['U.S. District Court for the Northern District of Florida', 'U.S. District Court for the Middle District of Florida', 'U.S. District Court for the Southern District of Florida'],
    professionalMemberships: ['American Health Law Association (AHLA)', 'The Florida Bar — Administrative Law, Health Law, and General Practice Sections'],
    intro: 'Elizabeth L. "Libby" Pedersen is a skilled attorney specializing in administrative law and healthcare law, with extensive experience in navigating the complex regulatory frameworks that govern the procurement and healthcare industries.',
    sections: [
      { title: 'Healthcare Law', content: ['Libby represents clients in health care facility and licensed entity applications, handling licensure and litigation matters before regulatory bodies including the Agency for Health Care Administration (AHCA), Department of Health (DOH), and Department of Children and Families (DCF).', 'Her healthcare expertise encompasses facility development, certificate of need (CON) applications, trauma center designations, change of ownership (CHOW) transactions, policy development, telehealth compliance, and regulated entity licensure.', "Notable clients include Jackson Health System, Tampa General, UF Shands, Broward Health, Nemours Children's Hospital, and numerous hospice and healthcare organizations."] },
      { title: 'Procurement Law', content: ['In procurement law, she advises on government procurement matters and litigation, including bid protests at local and state levels, with focus on challenging and defending bid decisions.'] },
      { title: 'Community Leadership', content: ['She serves on the Board of Directors for Arc Broward and the FLITE Center. Since 2015, she has been an advisor to the Upsilon Delta Chapter of Chi Omega at the University of Miami. She is a member of Leadership Broward Class XXXVI.'] },
    ],
  },
  'louise-wilhite-st-laurent': {
    firstName: 'Louise',
    education: ['J.D., Florida State University, Cum Laude', 'B.A., Florida State University, Cum Laude'],
    barAdmissions: ['Florida', 'U.S. District Court for the Northern District of Florida'],
    courtAdmissions: [],
    professionalMemberships: ['Administrative Law Section of The Florida Bar — Immediate Past Chair', 'Tallahassee Bar Association — Director', 'Health Law Section of The Florida Bar', 'Government Lawyer Section of The Florida Bar', 'Florida Government Bar Association', 'Governmental and Public Policy Advocacy Committee'],
    intro: 'Louise Wilhite-St. Laurent brings over 15 years of experience in procurements, administrative, healthcare, and marijuana law. Leveraging her experience as General Counsel for the Florida Department of Health, Louise is intimately familiar with navigating governmental processes on behalf of her clients in a variety of complex healthcare and administrative matters.',
    sections: [
      { title: 'Administrative Law and Competitive Procurements', content: ["Louise's career in administrative law began in 2013 when she joined the Florida Department of Health (DOH). There, Louise navigated complex state and federal regulations while overseeing the legal operations related to regulatory compliance, litigation, and rulemaking. As General Counsel for DOH, Louise led a team of more than 80 attorneys, managing high-stakes litigation and providing legal guidance on administrative law matters across Florida's circuit, district, and federal courts, as well as before the Division of Administrative Hearings (DOAH).", 'Since joining the firm, Louise has provided significant state and federal regulatory support for her clients in complex legal matters involving procurements, protests, and a variety of healthcare matters.'] },
      { title: 'Healthcare Law', content: ["Louise offers deep expertise in healthcare law, focusing on regulatory compliance, healthcare policy, and public health law. During her tenure at DOH, she provided strategic legal counsel on complex healthcare regulations, public health initiatives, and delivery systems. Her notable experience includes work with the Office of Medical Marijuana Use (OMMU), where Louise played a key role in developing Florida's medical marijuana program, now the third-largest in the U.S., helping to shape the program's legal frameworks."] },
      { title: 'Marijuana Law', content: ["A recognized expert in marijuana law, Louise specializes in the legal and regulatory aspects of medical marijuana. Louise has provided significant litigation and rulemaking support to the Florida Department of Health's Office of Medical Marijuana Use, where her work involved advising on compliance issues, defending the program's legal standing in various courts, and navigating the complex regulatory environment surrounding licensing, distribution, and policy development in the marijuana industry."] },
      { title: 'Community Leadership', content: ['Louise is the immediate past Chair of the Administrative Law Section of the Florida Bar, a Director of the Tallahassee Bar Association, and a member of the Health Law Section, Government Lawyer Section, and the Florida Government Bar Association. She has delivered numerous continuing legal education presentations on topics such as administrative litigation, constitutional rulemaking, evidence in administrative hearings, and the use of executive power during states of emergency.'] },
    ],
  },
  'jennifer-k-graner': {
    firstName: 'Jennifer',
    education: ['B.A. in Finance from Florida Atlantic University (1987)', 'J.D. from Nova Southeastern University Shepard Broad Law Center (1991)'],
    barAdmissions: ['Florida'],
    courtAdmissions: ['Florida Division of Administrative Hearings', 'First District Court of Appeals'],
    professionalMemberships: ['The Florida Bar'],
    intro: 'Jennifer K. Graner handles compliance and regulatory matters in the State of Florida including all phases of litigation before the Florida Division of Administrative Hearings and the First District Court of Appeals for health care, pari mutuel and environmental Fortune 500 companies. Her experience also includes real estate, land use and complex litigation.',
    sections: [
      { title: 'Government Affairs & Regulatory Practice', content: ['Mrs. Graner has been involved in lobbying members of the Florida Senate and House of Representatives, interfacing with numerous Florida agencies in Tallahassee and throughout the state to accomplish client objectives. She has represented clients in protracted Administrative Rule challenges and Rule workshops, resulting in changes to the Florida Administrative Code. Mrs. Graner has lectured throughout the State of Florida to various health care groups on licensure and compliance issues. She has advised and litigated on behalf of clients in RFP, RFQ, and RFI matters for various contracts within the state of Florida.'] },
    ],
  },
  'samantha-evans-saltzburg': {
    firstName: 'Samantha',
    education: ['J.D., magna cum laude, from Nova Southeastern University, Shepard Broad College of Law', 'B.S. from Nova Southeastern University, School of Business and Entrepreneurship'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: ['The Florida Bar', 'National Association of College and University Attorneys (NACUA) — Legal Resources Committee'],
    intro: 'Samantha Evans Saltzburg is an experienced attorney with a practice focused on higher education and employment law. She advises institutions and individuals on a wide array of legal and compliance issues, offering strategic guidance with a thoughtful, solutions-oriented approach.',
    sections: [
      { title: 'Higher Education', content: ['Sam provides comprehensive advice on higher education matters related to student affairs, academic policy, and regulatory compliance. Her work includes guiding institutional leadership on issues involving school discipline, student conduct proceedings, academic dismissals, and compliance with federal laws including the ADA and Section 504.', 'With experience representing both institutions and students, Sam offers a unique, well-rounded perspective. She has counseled students through complex university disciplinary processes, including dismissal proceedings, which deepens her insight into due process and procedural fairness in higher education settings.'] },
      { title: 'Employment Law', content: ['Sam provides counsel on a variety of workplace issues affecting corporate institutions, institutions of higher education, as well as employees. She advises institutional clients on employment policies, hiring practices, workplace investigations, and compliance with employment-related laws including Title VII, the FMLA, and wage and hour regulations.'] },
      { title: 'Education and Background', content: ['Sam earned her Juris Doctor, magna cum laude, at Nova Southeastern University, Shepard Broad College of Law and a Bachelor of Science at Nova Southeastern University, School of Business and Entrepreneurship. Sam has published articles in The Florida Bar Journal, Vol. 91, No. 8 and The Public Interest Journal, Vol. 5, Issue #2.'] },
    ],
  },
  'andrew-l-myers': {
    firstName: 'Andrew',
    education: ['J.D. from Tulane University School of Law (Sports Law specialization)', 'B.A. in Business Administration, cum laude, from University of Florida'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Andrew ("Andy") Myers is a Senior Associate Attorney whose practice focuses on corporate, estate planning, and administrative and regulatory law, with extensive experience advising clients on matters involving business formation, estate formation and protection, and strategic legal planning across various industries.',
    sections: [
      { title: 'Corporate Law', content: ['Andy supports clients throughout the business lifecycle – from entity formation and structuring to contract negotiation and day-to-day governance matters. He has worked with startups, small businesses, and mid-sized enterprises across industries. Andy frequently assists clients with reviewing and drafting key corporate documents such as operating agreements, shareholder agreements, and service contracts. In his corporate practice, Andy draws on experience gained from clerking with boutique law firms focused on corporate transactions and intellectual property protection, as well as his education, background, and prior roles in the business and corporate sectors. His work often centers on mitigating risk while advancing clients\u2019 strategic goals, particularly in dynamic and fast-paced business environments.'] },
      { title: 'Estate Planning', content: ['Andy also provides legal assistance and counseling on estate planning matters. He assists individuals, families, and organizations with both will and trust-based planning documents, including wills, irrevocable and revocable trusts, durable powers of attorney, and healthcare directives and authorizations.'] },
      { title: 'Administrative and Regulatory Law', content: ['Andy\u2019s regulatory experience includes advising clients on compliance with federal, state, and local administrative frameworks. He has supported organizations through various administrative law proceedings, including bid protests and rulemaking challenges. He has also supported large non-profit organizations across various sectors with regulatory compliance.'] },
      { title: 'Sports Law and Industry Engagement', content: ['With a background in Sports Law, Andy brings specialized insight into the legal challenges facing sports organizations, athletes, and related businesses. At Tulane Law School, Andy was actively involved in the university\u2019s nationally recognized sports law program. He served as a board member and sponsorship chair for the Tulane Professional Basketball Negotiation Competition, worked as a labor and employment research assistant, and participated as a Tulane legal extern for a well-regarded law firm.'] },
      { title: 'Education & Background', content: ['Andy earned his Juris Doctor from Tulane University School of Law, where he specialized in Sports Law. He also graduated cum laude from the University of Florida with a Bachelor of Arts in Business Administration, a specialization in Sports Management, and a minor in Communication Studies. During law school, Andy clerked for several boutique law firms with practice areas including corporate law, intellectual property, and sports law. He also served as an in-house legal intern with a prominent sports and entertainment company, where he supported the legal team on matters involving contracts, compliance, and brand protection.', 'Andy has a 2-15 Life, Health, and Annuity License. He enjoys playing pickleball and traveling with his wife.'] },
    ],
  },
  'trevor-d-scott': {
    firstName: 'Trevor',
    education: ['J.D., cum laude, from Florida State University College of Law', 'B.A., summa cum laude, in Psychology from University of Alabama'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Trevor represents clients in administrative and regulatory matters at the federal, state, and local levels, including preparing petitions to challenge agency sanctions, advising on compliance with state healthcare and medical marijuana licensing requirements, and drafting public comments and variance applications in response to local ordinance changes.',
    sections: [
      { title: 'Administrative & Regulatory Law', content: ['Trevor represents clients in administrative and regulatory matters at the federal, state, and local levels, including preparing petitions to challenge agency sanctions, advising on compliance with state healthcare and medical marijuana licensing requirements, and drafting public comments and variance applications in response to local ordinance changes. He also represents clients in rulemaking disputes, including challenges to both emergency and standard rules promulgated by state agencies, and advises on strategic responses to agency rulemaking initiatives.', 'Trevor\u2019s experience extends to delivering formal legal opinions and compliance strategies on emerging regulatory issues for clients in the healthcare, education, emergency management, and public construction sectors. Whether developing policies to align with evolving regulations, engaging with agencies to resolve compliance issues, challenging unlawful agency action, or outlining regulatory pathways for innovative business models, Trevor works closely with clients to ensure they not only meet legal requirements but also advance their operational and strategic goals.'] },
    ],
  },
  'julia-c-marano': {
    firstName: 'Julia',
    education: ['J.D., cum laude, from Nova Southeastern University Shepard Broad College of Law', 'B.A., cum laude, from University of Alabama (Political Science, Minor in Business Administration)'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Julia Marano is an Associate Attorney who practices in the area of administrative and regulatory law.',
    sections: [
      { title: '', content: ['Julia\u2019s practice focuses on administrative and regulatory law as well as local procurement matters. She advises clients on navigating complex government regulations and assists public and private entities in ensuring compliance with local, state, and federal procurement requirements.', 'Julia also brings experience working with legal and policy issues affecting academic medical institutions, including matters involving regulatory compliance, institutional governance, and contracting. Her exposure to the intersection of healthcare and education adds valuable perspective to her work with clients operating in highly regulated environments.', 'Julia earned her Juris Doctor, cum laude, from Nova Southeastern University Shepard Broad College of Law, where she served as a law clerk for Panza Maurer throughout law school. During law school, she was a board member of the Nova Trial Association where she competed in trial competitions and strengthened her advocacy skills.', 'Julia earned her undergraduate degree, cum laude, from the University of Alabama, where she majored in Political Science and minored in Business Administration. Her academic background and professional experience reflect her ongoing commitment to public service, regulatory compliance, and effective advocacy.', 'She is committed to helping clients understand and operate effectively within regulatory frameworks while managing risk and furthering client objectives.'] },
    ],
  },
  'david-childs': {
    firstName: 'David',
    education: ['J.D. from Florida State University College of Law (2005)', 'B.S. in Biological Engineering from Mississippi State University (2001)'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: ['Leadership Florida Class 35 — Graduate and General Counsel'],
    intro: 'David Childs helps clients solve government-related problems and achieve business objectives. Over 20 years, he has built expertise in water resource and energy policy, legislative appropriations, and administrative procedures.',
    sections: [
      { title: 'Legislative & Policy Work', content: ['David has drafted significant legislation including springs restoration (SB 1228, 2025), phosphogypsum reuse (HB 1191, 2023), essential state infrastructure (SB 7018, 2020), transmission line siting (HB 405, 2018), administrative procedures (HB 183, 2016), and water quality credit trading (HB 713, 2013). He has secured millions in appropriated funds for clients.', 'David maintains relationships with the Florida Department of Environmental Protection and has shaped regulatory programs affecting developers, landowners, and water utilities \u2014 including potable reuse, collection system asset management, numeric nutrient criteria, and biosolids application.'] },
      { title: 'Recognition', content: ["David has been appointed to the Florida Boating Advisory Council by Governors Crist and Scott. He is a Leadership Florida Class 35 graduate, a selectee for Best Lawyers in America for Environmental Law, and was named Florida Politics' Environmental Lobbyist of the Year in 2019."] },
    ],
  },
  'monica-rodriguez': {
    firstName: 'Monica',
    education: ['B.A. in Psychology from University of Miami', 'M.S. in Education from University of Miami', 'J.D., cum laude, from University of Miami'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Monica L. Rodriguez has almost two decades of legislative experience at the state and federal levels representing clients in industries such as health care and insurance, as well as non-profit entities, and local governments.',
    sections: [
      { title: 'Legislative Experience', content: ["Monica received recognition as one of Florida Trend Magazine's Legal Elites in 2008. She held Shareholder status at a large national law firm and served as a legislative aide to former House Speaker and current U.S. Senator Marco Rubio."] },
      { title: 'Community Leadership', content: ["Monica's civic contributions include Board service with Children's Home Society's North Central division and prior involvement with United Way's Power of the Purse and Kristi House Miami boards."] },
    ],
  },
  'eileen-stuart': {
    firstName: 'Eileen',
    education: ['J.D. from Florida State University College of Law (2006)', 'B.A. in History and Political Science from University of Florida (2003)'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Eileen Stuart practices primarily in the areas of Agriculture, Education, Environment and Natural Resources, Healthcare, Industry and Manufacturing, State and Local Appropriations, and Technology and Cybersecurity.',
    sections: [
      { title: 'Government & Public Affairs', content: ['Eileen maintains a broad government and public affairs practice, emphasizing representation in the executive and legislative branches at the local, state, and federal levels. She helps businesses and highly regulated industries devise comprehensive government and public affairs strategies to navigate complex regulatory environments, obtain and maintain a license to operate, identify and secure state and federal funding or incentives, and develop or expand market share.', 'Eileen is particularly adept at forming coalitions and garnering allies in support of policy or political objectives while formulating strategies to assist businesses in elevating or rehabilitating corporate brand and reputation.'] },
      { title: 'Prior Experience', content: ["Prior to entering private practice, Eileen served as Vice President, Government and Regulatory Affairs for Mosaic, one of the world's largest manufacturers of mineral fertilizers. She developed and executed strategic government advocacy plans, particularly regarding local, state, and federal permitting, environmental, energy and tax issues.", 'Eileen also served as Deputy Policy Director in the Executive Office of the Governor, where she developed and managed multiple policy and appropriations initiatives. Her previous professional experience also includes roles as Deputy Political Director on a statewide gubernatorial campaign, as well as serving as a Legislative Fellow in the Florida Senate and at the Florida Public Service Commission.'] },
    ],
  },
  'brian-ballard': {
    firstName: 'Brian',
    education: ['B.S. in Business Administration, University of Florida', 'J.D., University of Florida'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: ['University of Florida Hall of Fame'],
    intro: 'Brian D. Ballard is the President and founder of Ballard Partners. A trusted counselor to presidential and gubernatorial candidates, as well as Fortune 100 leaders, Brian has spent his career navigating the intersection of government and business.',
    sections: [
      { title: 'Government & Political Leadership', content: ["Brian served as Chief of Staff in the Florida Governor's Office, where he developed environmental policy expertise and was the chief architect of Preservation 2000, then the largest public land acquisition program for environmentally sensitive areas in the U.S.", 'He chaired Florida Finance Committees for presidential nominees McCain, Romney, and Trump, and served as Vice Chairman of the Presidential Inaugural Committee. He currently sits on the Board of Trustees for the Trump Kennedy Center.'] },
      { title: 'Recognition', content: ["Brian has been featured in Vanity Fair's 'New Establishment' and Politico Playbook's '18 to Watch,' recognizing him as a top political insider and one of the most influential figures at the intersection of government and business."] },
    ],
  },
  'brad-burleson': {
    firstName: 'Brad',
    education: ['J.D., Washington and Lee University School of Law', 'B.S. in Political Science, Vanderbilt University'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Brad Burleson represents clients across Florida before the legislative and executive branches of government, with a focus on transportation and infrastructure funding and policy, information technology, and tax policy and economic development.',
    sections: [
      { title: 'Legislative & Government Affairs', content: ["Brad helps IT companies and emerging technologies navigate Florida's regulatory framework and assists businesses on tax policy and economic development matters. He also helps clients secure federal and state appropriations.", 'Prior to joining Ballard Partners, Brad practiced law with an emphasis on transportation and construction litigation, representing highway contractors in disputes with the Florida Department of Transportation and airport authorities.'] },
      { title: 'Prior Experience', content: ['Brad previously worked as a legislative correspondent for U.S. Senator Richard Shelby and has experience drafting transportation-related legislation and agency specifications.'] },
    ],
  },
  'jan-gorrie': {
    firstName: 'Jan',
    education: ['B.S. in Biology, Duke University', 'M.P.H., University of South Florida', 'J.D., Stetson College of Law'],
    barAdmissions: ['Florida', 'Hillsborough County Bar Association'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: "Jan Gorrie brings over 20 years of government affairs experience, specializing in healthcare law and policy. She has extensively lobbied Florida's Legislature and Executive Branch on behalf of hospital systems, medical colleges, insurance companies, and economic development organizations.",
    sections: [
      { title: 'Healthcare Law & Policy', content: ["Jan's work has focused on Medicaid reimbursement, healthcare access, and physician and hospital compensation. As a recognized transactional and administrative healthcare attorney, she regularly testifies before Florida's Agency for Health Care Administration and Department of Health on licensure, reimbursement, and provider matters."] },
    ],
  },
  'adrian-lukis': {
    firstName: 'Adrian',
    education: ['B.A. from Florida State University', 'J.D. from Florida State University College of Law'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Adrian Lukis brings extensive experience in Florida government and political advisory work. Most notably, he served as Chief of Staff to Governor Ron DeSantis, where he managed the Executive Office and oversaw executive branch agencies during significant challenges including the Surfside building collapse and the COVID-19 Delta surge.',
    sections: [
      { title: 'Government Leadership', content: ['Prior to serving as Chief of Staff, Adrian held the role of Deputy Chief of Staff, supervising multiple state entities across health care, emergency management, environmental protection, economic development, and professional regulation.', "His earlier career included work as a business law attorney specializing in mergers and acquisitions, plus roles with the Florida House of Representatives, the Republican Party of Florida, and Speaker Jose Oliva's office."] },
    ],
  },
  'syl-luks': {
    firstName: 'Syl',
    education: [],
    barAdmissions: ['District of Columbia'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Sylvester Lukis brings over 40 years of experience in Florida, national, and international policy and politics. As Senior Partner at Ballard Partners, he collaborates closely with firm founder Brian Ballard on strategic expansion across major U.S. markets and international locations.',
    sections: [
      { title: 'Federal Government Relations', content: ["Syl's practice focuses on U.S. government relations for foreign governments and private entities, emphasizing health care, immigration, trade, tariffs, and tax matters before the legislative and executive branches. He has represented clients before major federal departments including HHS, Justice, State, Transportation, Commerce, Treasury, Interior, and Homeland Security, as well as the Office of the U.S. Trade Representative."] },
      { title: 'Prior Government Service', content: ["Syl's prior government service includes roles as Special Assistant to the General Counsel at HHS, Special Assistant U.S. Attorney in Washington D.C., and Assistant Director of a federal interagency task force at the State Department during the Mariel Boatlift. He served in the United States Air Force."] },
    ],
  },
  'abby-vail': {
    firstName: 'Abby',
    education: ['B.S. in Communications, Florida State University', 'M.B.A., Florida State University', 'J.D., Florida State University'],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Abby Vail has over 15 years of government affairs experience, providing political, strategic, and policy direction to clients before the legislative and executive branches of government. Her practice focuses on representing financial services clients in insurance, banking, consumer finance, securities, and fintech sectors.',
    sections: [
      { title: 'Government Affairs', content: ['Most recently, Abby served as Chief of Staff of the Florida Office of Financial Regulation, contributing to the Financial Technology Regulatory Sandbox passage and development. Previously, she held positions as Vice President of External Affairs for an international healthcare company and Senior Cabinet Aide to former Florida Chief Financial Officer Jeff Atwater.', 'She began her career at the Office of Insurance Regulation during significant property and casualty insurance reform following the 2004–2005 hurricane seasons.'] },
    ],
  },
  'sandra-harris': {
    firstName: 'Sandra',
    education: [],
    barAdmissions: [],
    courtAdmissions: [],
    professionalMemberships: [],
    intro: 'Sandra Harris is a government relations professional at Panza Maurer, bringing extensive experience in legislative advocacy and public affairs.',
    sections: [],
  },
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[\s.,]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// ─── Migration functions ──────────────────────────────────────────────────────

async function migrateAttorneys() {
  console.log('\n📋 Migrating attorneys...')

  const allAttorneys = [
    ...partners.map((a) => ({ ...a, type: 'Our Attorneys' })),
    ...ofCounsel.map((a) => ({ ...a, type: 'Of Counsel' })),
  ]

  for (const attorney of allAttorneys) {
    const slug = nameToSlug(attorney.name)
    const bio = attorneyBios[slug]

    const imagePath = path.join(PUBLIC_DIR, 'images', 'attorneys', attorney.image)
    const assetId = await uploadImage(imagePath, attorney.name)

    const doc = {
      _type: 'attorney',
      _id: `attorney-${slug}`,
      name: attorney.name,
      firstName: bio?.firstName ?? attorney.name.split(' ')[0],
      slug: { _type: 'slug', current: slug },
      type: attorney.type,
      role: attorney.role,
      order: attorney.order,
      status: 'published',
      intro: bio?.intro ?? '',
      education: bio?.education ?? [],
      barAdmissions: bio?.barAdmissions ?? [],
      courtAdmissions: bio?.courtAdmissions ?? [],
      professionalMemberships: bio?.professionalMemberships ?? [],
      sections: (bio?.sections ?? []).map((s) => ({
        _type: 'bioSection',
        _key: `section-${s.title.toLowerCase().replace(/\s+/g, '-').slice(0, 20)}`,
        title: s.title,
        content: s.content,
      })),
      ...(assetId ? { image: imageRef(assetId) } : {}),
    }

    await client.createOrReplace(doc)
    console.log(`  ✅ Attorney: ${attorney.name}`)
  }
}

async function migrateLocations() {
  console.log('\n📍 Migrating locations...')

  const locations = [
    {
      _id: 'location-tallahassee',
      name: 'Tallahassee',
      slug: 'tallahassee',
      image: 'contact-tallahassee.jpg',
      building: undefined,
      address: ['201 East Park Avenue | Suite 200-A'],
      city: 'Tallahassee, FL 32301',
      phone: '(850) 681-0980',
      fax: '(850) 681-0983',
      order: 1,
    },
    {
      _id: 'location-fort-lauderdale',
      name: 'Fort Lauderdale',
      slug: 'fort-lauderdale',
      image: 'contact-fort-lauderdale.jpg',
      building: 'Coastal Tower',
      address: ['2400 East Commercial Blvd | Suite 905'],
      city: 'Fort Lauderdale, FL 33308',
      phone: '(954) 390-0100',
      fax: '(954) 390-7991',
      order: 2,
    },
    {
      _id: 'location-coral-gables',
      name: 'Coral Gables',
      slug: 'coral-gables',
      image: 'contact-coral-gables.jpg',
      building: 'The Alhambra Building',
      address: ['2 Alhambra Plaza | Suite 102'],
      city: 'Coral Gables, FL 33134',
      phone: '(786) 534-6162',
      fax: undefined,
      order: 3,
    },
  ]

  for (const loc of locations) {
    const imagePath = path.join(PUBLIC_DIR, 'images', loc.image)
    const assetId = await uploadImage(imagePath, loc.name)

    const doc = {
      _type: 'location',
      _id: loc._id,
      name: loc.name,
      slug: { _type: 'slug', current: loc.slug },
      building: loc.building ?? undefined,
      address: loc.address,
      city: loc.city,
      phone: loc.phone,
      fax: loc.fax ?? undefined,
      order: loc.order,
      ...(assetId ? { image: imageRef(assetId) } : {}),
    }

    await client.createOrReplace(doc)
    console.log(`  ✅ Location: ${loc.name}`)
  }
}

async function migrateNews() {
  console.log('\n📰 Migrating news articles...')

  const newsData = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'news.json'), 'utf-8'),
  ) as {
    articles: {
      slug: string
      title: string
      date: string
      author?: string | null
      content: string
      excerpt: string
      categories: string[]
      images: string[]
      listing_images: string[]
    }[]
  }

  for (const article of newsData.articles) {
    // Parse date to ISO format (YYYY-MM-DD)
    let isoDate = ''
    try {
      const d = new Date(article.date)
      if (!isNaN(d.getTime())) {
        isoDate = d.toISOString().split('T')[0]
      }
    } catch {
      isoDate = '2024-01-01'
    }

    // Upload article images
    const imageAssets: string[] = []
    for (const img of article.images) {
      const imgPath = path.join(PUBLIC_DIR, 'images', 'news', img)
      const assetId = await uploadImage(imgPath, img)
      if (assetId) imageAssets.push(assetId)
    }

    // Upload listing images
    const listingAssets: string[] = []
    for (const img of article.listing_images) {
      const imgPath = path.join(PUBLIC_DIR, 'images', 'news', img)
      const assetId = await uploadImage(imgPath, img)
      if (assetId) listingAssets.push(assetId)
    }

    const safeId = article.slug.replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 80)

    const doc = {
      _type: 'newsArticle',
      _id: `news-${safeId}`,
      title: article.title,
      slug: { _type: 'slug', current: article.slug },
      date: isoDate,
      author: article.author ?? undefined,
      excerpt: article.excerpt,
      content: article.content,
      categories: article.categories,
      status: 'published',
      images: imageAssets.map((id, i) => ({
        _key: `img-${i}`,
        ...imageRef(id),
      })),
      listingImages: listingAssets.map((id, i) => ({
        _key: `limg-${i}`,
        ...imageRef(id),
      })),
    }

    await client.createOrReplace(doc)
    console.log(`  ✅ Article: ${article.title.slice(0, 60)}`)
  }
}

async function migratePracticeAreas() {
  console.log('\n⚖️  Migrating practice areas...')

  const practiceAreaData: Record<string, { title: string; heading: string; content: string[] }> = {
    'administrative--regulatory-law': { title: 'Administrative | Regulatory Law', heading: 'A Nice Heading about Regulatory Law', content: ["Panza Maurer & Maynard assists clients within the framework of local, state and federal regulations. A key factor in this area of practice is an in-depth understanding of applicable laws to assist clients in navigating what is often a complex set of rules and regulations. The firm has intimate knowledge of the regulatory process and has developed long-standing professional relationships within many governmental and administrative agencies, a significant factor in achieving results.", "PMM represents clients on matters before the Florida Attorney General's Office, the Florida Departments of Insurance and Revenue, Children and Families, Health, Agriculture and Consumer Services, Environmental Protection, Department of Lottery, Environmental Regulations, the Florida Department of Education, DCA, and Department of Transportation. We also work extensively with the Florida Agency for Health Care Administration (AHCA), as well as federal agencies such as the Centers for Medicare and Medicaid Services, Occupational Safety and Health Administration, the U.S. Department of Education, Department of Justice and the Food and Drug Administration. Other diverse matters handled by this division include: professional licensure and discipline, procurement, bid protests, environment and land use issues, utilities rate-making regulation and grants. We know the Florida landscape at PMM and can produce significant benefits for our clients."] },
    healthcare: { title: 'Healthcare', heading: 'Comprehensive Healthcare Legal Services', content: ["Today's healthcare providers are subject to an ever-increasing and constantly evolving number of regulatory requirements that require experienced legal counsel who have a clear understanding of the wide range of issues that providers may encounter. Our experienced health care lawyers deliver strategic, innovative, solution-driven legal counsel to healthcare providers, suppliers, and organizations navigating today's complex regulatory landscape. We emphasize prevention, compliance, and strategic regulatory planning to help our healthcare clients operate confidently, minimize risk, and adapt to the evolving demands of the healthcare regulatory landscape.", "Our practice is built on deep experience in compliance, licensure, regulatory affairs, and healthcare business development and operations, including fraud and abuse, physician self-referral, HIPAA, false claims, professional disciplinary matters, medical staff matters, professional service agreements, as well as labor and employment issues. Our healthcare practice includes attorneys who have extensive experience in health care regulation and in state and federal government and administrative law. We collaborate with clients' corporate transactional, development, employment and government relations teams on litigation, regulatory, transactional and compliance matters to deliver integrated solutions tailored to each client's unique needs.", "Our team has represented healthcare providers across the healthcare continuum, including hospitals and multi-hospital systems, physician practices and networks, long-term care, skilled nursing, and assisted living facilities, hospices, home health agencies, pharmacies and durable medical equipment providers, imaging centers and diagnostic facilities, trade associations and healthcare service providers, pharmacy benefit managers, and third party payors.", "Panza Maurer assists clients with complex licensure and certification matters before state and federal regulatory bodies, including the Agency for Health Care Administration, the Department of Health, and the Centers for Medicare & Medicaid Services. Our licensure services include initial licensure and certification applications, Certificate of Need applications and litigation, change of ownership (CHOW) approvals, facility expansions and service line additions, regulatory compliance reviews, plan of correction development, and defense in administrative proceedings and enforcement actions.", "Through our Tallahassee presence, Panza Maurer represents healthcare clients before the Florida Legislature and state agencies on legislative and regulatory matters. We monitor policy developments, advise on regulatory reform, and advocate for client interests in healthcare, insurance, and related sectors."] },
    compliance: { title: 'Compliance', heading: 'Strategic Compliance & Risk Management', content: ["At Panza Maurer, compliance is a core strength of our practice. Our attorneys advise clients on complex compliance matters involving corporate governance, regulatory oversight, and risk management. We understand that proactive compliance is one of the most valuable investments an organization can make.", "We work closely with clients to minimize risks while supporting operational goals. From developing corporate-wide ethics and compliance programs to conducting internal audits and targeted investigations in high-risk areas, we provide practical, strategic guidance designed to protect both reputation and revenue. Sensitive matters are handled with precision, confidentiality, and sound legal judgment.", "Our team helps organizations navigate a rapidly evolving regulatory environment. We provide timely alerts, training programs, and strategic advice to ensure clients remain compliant, manage risks effectively, and maintain strong corporate governance."] },
    'corporate--transactional': { title: 'Corporate | Transactional', heading: 'Corporate & Transactional Law', content: ["Panza Maurer provides comprehensive counsel to businesses at every stage of growth. We advise clients on entity selection and formation in Florida, ongoing corporate administration, shareholder agreements, contract drafting and negotiation, corporate reporting, and policy development.", "The firm's transactional practice focuses on serving as general counsel for both for-profit and nonprofit entities and structuring and executing sophisticated business transactions, including mergers and acquisitions, and commercial and residential real estate transactions. With strategic planning and meticulous attention to detail, we help clients manage risk, protect their interests, and successfully complete transactions that advance their long-term business objectives."] },
    litigation: { title: 'Litigation', heading: 'Civil & Commercial Litigation', content: ["Insurance defense counsel representing numerous individuals, private and public corporations. Panza Maurer's litigation practice spans state and federal courts across Florida, handling complex commercial disputes, employment litigation, healthcare litigation, and administrative proceedings.", "Our trial attorneys bring decades of experience in navigating high-stakes disputes. From pre-suit investigation through trial and appeal, we develop strategic litigation plans designed to achieve favorable outcomes for our clients through negotiation, mediation, or trial."] },
    'land-use--environmental': { title: 'Land Use | Environmental', heading: 'Land Use & Environmental Law', content: ["Panza Maurer represents property owners, developers, lenders and other affected parties with land use and environmental matters. Our attorneys have extensive experience navigating local, state, and federal regulatory frameworks governing land development, environmental compliance, and natural resource management.", "The firm handles zoning matters, comprehensive plan amendments, development orders, environmental permitting, contamination remediation, and regulatory enforcement actions. We work closely with government agencies to secure approvals and resolve disputes efficiently."] },
    'trusts--estates': { title: 'Estate Planning | Probate', heading: 'Estate Planning | Probate', content: ["Panza Maurer offers estate planning, administration, and probate services tailored to protect clients, their families, and their legacies. Our team has extensive experience drafting wills, trusts, pre- and post-marital agreements, health care directives, and Powers of Attorney. Our team has also represented numerous clients during probate proceedings, advocating for our client's best interests when disputes arise.", "Our attorneys assist clients with wealth preservation strategies, business succession planning, probate administration, and trust management. We work to ensure that our clients' assets are protected and their wishes are carried out effectively."] },
    'technology--it': { title: 'Technology | IT', heading: 'Technology | IT', content: ["Panza Maurer provides strategic legal counsel on cybersecurity compliance and risk management. Our services include identifying applicable statutory and regulatory frameworks, conducting regulatory mapping (including under the Gramm-Leach-Bliley Act and the HIPAA Security Rule), developing and refining policies and procedures, and advising on coordinated implementation with internal IT personnel and external cybersecurity professionals.", "We assist clients in benchmarking policies, controls, and documentation against NIST-aligned standards and other recognized frameworks to support defensible, risk-based compliance programs. Through this integrated approach, we help organizations strengthen their security posture while aligning operational practices with evolving legal and regulatory expectations."] },
    'education-law': { title: 'Education Law', heading: 'Education Law', content: ["Panza Maurer provides comprehensive legal counsel to colleges, universities, and K\u201312 institutions across a broad spectrum of issues unique to the education sector. We advise on matters involving student and employee misconduct, accreditation, tenure and promotion, institutional governance, compliance with federal funding requirements, student-athlete issues, and employment concerns specific to educational environments.", "Our attorneys offer particular strength in proactive compliance and risk management, including student handbook review, employee policy development, and alignment with applicable state and federal laws. We routinely counsel institutions on compliance with the Americans with Disabilities Act and Section 504 of the Rehabilitation Act, Title IX, FERPA, the Clery Act, Title VI of the Civil Rights Act, and other federal and state anti-discrimination statutes, helping clients navigate complex regulatory frameworks with clarity and confidence.", "The firm has also served as general counsel to major universities, providing strategic guidance at the highest levels of institutional leadership. From governance and long-term planning to regulatory investigations and dispute resolution, we partner with educational institutions to protect their missions and reputations. Our experience includes representing universities in matters before the U.S. Department of Education's Office for Civil Rights, conducting internal investigations, preparing institutional representatives for agency interviews, and defending related claims in administrative proceedings and litigation."] },
    'gaming--hospitality': { title: 'Gaming | Hospitality', heading: 'Gaming | Hospitality Law', content: ["Panza Maurer has represented lottery, gaming and hospitality clients in one of Florida's most highly regulated industries, with a concentrated focus on regulatory compliance, administrative advocacy, and legislative strategy. Our attorneys advise lottery operators worldwide, pari-mutuel operators, tribal entities, and hospitality businesses on licensing and permitting, statutory interpretation, rulemaking, and enforcement matters, helping clients navigate complex regulatory frameworks with clarity and confidence.", "We regularly advocate on behalf of clients before the Florida Department of Administrative Hearings, the First District Court of Appeal, and the Florida Supreme Court, and work closely with regulators, executive agencies, and legislative bodies to protect and advance our clients' interests. Our practice combines administrative depth and government relations insight to deliver strategic, effective regulatory representation."] },
    'strategic-planning': { title: 'Strategic Planning', heading: 'Government Relations & Strategic Planning', content: ["Strategic planning is essential for organizations that want to grow, manage risk, and remain competitive in an increasingly complex regulatory environment. Panza Maurer works closely with business leaders, executives, and stakeholders to develop forward-looking strategies that align legal considerations with long-term organizational goals. By combining legal insight with practical business understanding, we help clients anticipate challenges, identify opportunities, and implement plans that support sustainable success.", "A key part of our strategic planning approach is staying ahead of regulatory and policy developments at every level of government. Our attorneys continuously monitor changes in local ordinances, state legislation, and federal laws that may affect our clients' industries and operations. By integrating these evolving requirements into our planning process, we help clients adapt proactively, minimize legal exposure, and make informed decisions in a shifting regulatory landscape.", "Panza Maurer views strategic planning as an ongoing partnership rather than a one-time exercise. Our team collaborates with clients to review existing structures, assess potential risks, and refine strategies as business conditions and regulatory frameworks evolve. Whether guiding expansion initiatives, restructuring efforts, compliance planning, or governance improvements, we provide practical, legally sound guidance designed to position our clients for long-term stability and growth."] },
    'government-relations': { title: 'Government Relations', heading: 'Government Affairs & Strategic Advocacy', content: ["Panza Maurer's government affairs practice is fully integrated within the firm's broader regulatory and administrative law platform. We provide strategic governmental relations counsel and advocacy services to clients navigating complex legislative, regulatory, and policy matters at the federal, state, regional, and local levels.", "With offices in Tallahassee, Miami, and Fort Lauderdale, the firm is uniquely positioned to serve clients throughout Florida and beyond. Our Tallahassee presence in the state capital for more than 40 years provides direct access to the Legislature, executive agencies, and statewide regulatory bodies, while our South Florida offices allow us to effectively represent clients before regional and local governments and key economic centers.", "Our attorneys and registered lobbyists have a unique understanding of government relations and maintain a longstanding reputation with key policymakers that span partisan lines. Firm attorneys and staff monitor and analyze legislative and regulatory developments, represent clients in agency rulemaking and administrative proceedings, and develop comprehensive advocacy strategies aligned with our clients' legal and business objectives.", "Panza Maurer has experience drafting legislation and defending legislative enactments against state constitutional challenges, ensuring that policy objectives are supported by sound legal foundations. The firm is a member of the Florida Association of Professional Lobbyists."] },
    'labor--employment': { title: 'Labor | Employment', heading: 'Labor & Employment Law', content: ["Panza Maurer is recognized for its depth of experience in labor and employment law, representing employers, businesses, and institutions in all aspects of workplace-related matters. We provide strategic counsel designed to minimize risk, ensure regulatory compliance, and protect our clients' operational and reputational interests.", "Our practice includes wage and hour compliance, employee classification, discrimination and harassment claims, disciplinary actions, wrongful termination, workplace investigations, employee policies, contractual disputes, separation agreements, compensation arrangements, as well as leave and accommodation matters. The firm can provide training in employment law matters ranging from hiring practices, sexual harassment, religious and ADA accommodations, discipline, emerging employment law issues and other customized topics to meet the client's needs.", "Panza Maurer routinely investigates as well as litigates cases involving discrimination in employment, Title VII of the 1964 Civil Rights Act, the Florida Civil Rights Act (FCRA), the Americans with Disabilities Act (ADA) and the Fair Labor Standards Act (FLSA). We routinely advise clients on sexual harassment and retaliation claims as well as involuntary terminations. The firm provides assistance in every step of the litigation process from an initial Equal Employment Opportunity Commission (EEOC)/local agency inquiry through trial and the appellate process and case resolution.", "Panza Maurer enjoys an excellent reputation with EEOC offices, as well as the Labor and Employment Litigation Department of the Attorney General's Office. Our approach combines proactive counseling with effective advocacy, helping clients navigate complex employment challenges with confidence."] },
    procurement: { title: 'Procurement', heading: 'Government Procurement Law', content: ["Panza Maurer has decades of experience in handling large state and local bid and procurement matters. The firm consults with clients from the earliest stages of the procurement process including preparing for anticipated procurements, reviewing potential provisions to ensure a fair and balanced solicitation, solicitation specifications that are clear and concise, and navigating the potential contracting process.", "We are also well versed in evaluating and assessing procurement submission requirements and collaborating with subject matter experts in developing the client's proposal. Early involvement is critical to understand the client's opportunity to provide requested services and how its proposal best meets the needs of the procuring entity. By directing attention to the evaluation criteria and contract terms, and participating in pre-bid and informational meetings, we are able to help craft client responses that are responsive and responsible, avoid disputes over submission and contract terms, and position clients for success.", "Panza Maurer also has extensive experience in challenging and defending specifications, awards and rankings that are frequently part of the procurement process. We have experience in Chapter 120 bid challenge hearings held before the Division of Administrative Hearings as well as those in front of county and municipal government agencies and boards.", "Through our comprehensive knowledge of Florida procurement law, our attorneys are particularly well-positioned to manage complex public procurements and bid protest proceedings, delivering strategic and favorable outcomes for clients across the State of Florida."] },
    'real-property': { title: 'Real Property', heading: 'Real Property Law', content: ["With more than fifty years of combined experience, our attorneys handle real estate sales contracts and leases, real estate litigation, land use issues, property management matters, foreclosures and related disputes. Our services include judicial and non-judicial foreclosures, loan modifications, mediations, post-judgment matters, evictions and writs of possession, drafting and negotiation of real estate contracts and leases, closings, and comprehensive land use and permitting representation. The firm also advises on zoning, code violations, association governance, and ongoing regulatory compliance to help clients minimize risk and protect their property interests."] },
    'receivership--conservatorship': { title: 'Receivership | Conservatorship', heading: 'Receivership & Conservatorship Services', content: ["Panza Maurer Law Firm serves as Conservators, Receivers or Custodians for commercial and real estate entities. Our attorneys have been appointed by courts to manage distressed assets, oversee business operations, and protect the interests of stakeholders.", "We bring a practical, business-minded approach to receivership and conservatorship matters, working to preserve asset values and achieve orderly resolutions for all parties involved."] },
    'medical-marijuana': { title: 'Medical Marijuana', heading: 'Medical Marijuana Law', content: ["Panza Maurer is an administrative and regulatory law firm focused on guiding clients through the complex legal framework governing medical marijuana in the State of Florida. We assist clients with every stage of the Medical Marijuana Treatment Center (MMTC) licensure process, providing strategic counsel on the administrative and operational requirements imposed by the Florida Department of Health (DOH). Our attorneys possess in-depth knowledge of Florida's evolving medical marijuana laws and regulations, as well as the practical industry insight necessary to navigate this highly regulated environment. With extensive experience across prior iterations of Florida's medical marijuana framework, we remain at the forefront of regulatory developments to position our clients for success.", "Beyond licensure, Panza Maurer advises on the formation and structuring of compliant business entities to meet MMTC regulatory requirements. Our team provides ongoing corporate governance and compliance support, including contract development and negotiation, corporate reporting, and internal policy implementation. Panza Maurer counsels medical marijuana operators on a wide range of regulatory matters, including advertising and marketing restrictions, banking and financing considerations, employment and environmental compliance, federal and Florida marijuana policy, licensing and registration, real estate and zoning requirements, product labeling standards, privacy regulations, and corporate and commercial transactions. Through proactive regulatory guidance and comprehensive administrative representation, we help clients operate confidently and compliantly in Florida's medical marijuana industry."] },
  }

  for (const [slug, data] of Object.entries(practiceAreaData)) {
    const safeId = slug.replace(/[^a-zA-Z0-9-_]/g, '-')

    // Set featured attorneys for government-relations
    const featuredAttorneys =
      slug === 'government-relations'
        ? [
            { _type: 'reference' as const, _ref: 'attorney-thomas-f-panza', _key: 'fa-1', _weak: true },
            { _type: 'reference' as const, _ref: 'attorney-jennifer-maurer-bean', _key: 'fa-2', _weak: true },
            { _type: 'reference' as const, _ref: 'attorney-sandra-harris', _key: 'fa-3', _weak: true },
          ]
        : undefined

    const doc = {
      _type: 'practiceArea',
      _id: `practicearea-${safeId}`,
      title: data.title,
      slug: { _type: 'slug', current: slug },
      heading: data.heading,
      content: data.content,
      status: 'published',
      ...(featuredAttorneys ? { featuredAttorneys } : {}),
    }

    await client.createOrReplace(doc)
    console.log(`  ✅ Practice Area: ${data.title}`)
  }
}

async function migrateSiteSettings() {
  console.log('\n⚙️  Creating site settings...')

  const doc = {
    _type: 'siteSettings',
    _id: 'siteSettings',
    siteName: 'Panza Maurer',
    contactPhone: '(954) 390-0100',
    footerLocations: [
      { _type: 'reference', _ref: 'location-tallahassee', _key: 'fl-1' },
      { _type: 'reference', _ref: 'location-fort-lauderdale', _key: 'fl-2' },
      { _type: 'reference', _ref: 'location-coral-gables', _key: 'fl-3' },
    ],
    navItems: [
      { _key: 'nav-1', label: 'Home', path: '/', hasDropdown: false },
      { _key: 'nav-2', label: 'Professionals', path: '/attorneys', hasDropdown: false },
      { _key: 'nav-3', label: 'Practice Areas', path: '/practice-areas', hasDropdown: true },
      { _key: 'nav-4', label: 'Government Relations', path: '/practice-areas/government-relations', hasDropdown: false },
      { _key: 'nav-5', label: 'News', path: '/news', hasDropdown: false },
      { _key: 'nav-6', label: 'Locations', path: '/locations', hasDropdown: false },
    ],
  }

  await client.createOrReplace(doc)
  console.log('  ✅ Site settings created')
}

// ─── Page seeding ─────────────────────────────────────────────────────────────

function ref(id: string, key: string) {
  return { _type: 'reference' as const, _ref: id, _key: key, _weak: true }
}

async function seedPages() {
  console.log('\n📄 Seeding page documents...')

  const pages = [
    // ── Home ──────────────────────────────────────────────────────────────────
    {
      _id: 'page-home',
      title: 'Home',
      navigationLabel: 'Home',
      slug: 'home',
      seoDescription:
        'Panza Maurer — experienced Florida attorneys in government relations, healthcare, litigation, and more.',
      showInNavigation: true,
      navigationOrder: 1,
      sections: [
        {
          _type: 'teamSection',
          _key: 'section-team',
          heading: 'Our Team',
          attorneys: [
            ref('attorney-thomas-f-panza', 'team-1'),
            ref('attorney-susan-horovitz-maurer', 'team-2'),
            ref('attorney-dana-panza-macdonald', 'team-3'),
            ref('attorney-benjamin-p-bean', 'team-4'),
            ref('attorney-jennifer-maurer-bean', 'team-5'),
          ],
        },
        {
          _type: 'newsSection',
          _key: 'section-news',
          heading: 'Latest News',
          articleCount: 3,
        },
        {
          _type: 'locationsSection',
          _key: 'section-locations',
          heading: 'Our Locations',
          locations: [
            ref('location-tallahassee', 'loc-1'),
            ref('location-fort-lauderdale', 'loc-2'),
            ref('location-coral-gables', 'loc-3'),
          ],
        },
      ],
    },

    // ── Attorneys ─────────────────────────────────────────────────────────────
    {
      _id: 'page-attorneys',
      title: 'Attorneys',
      navigationLabel: 'Professionals',
      slug: 'attorneys',
      seoDescription: 'Meet the experienced attorneys at Panza Maurer.',
      showInNavigation: true,
      navigationOrder: 2,
      sections: [
        {
          _type: 'teamSection',
          _key: 'section-our-attorneys',
          heading: 'Our Attorneys',
          attorneys: [
            ref('attorney-thomas-f-panza', 'team-1'),
            ref('attorney-susan-horovitz-maurer', 'team-2'),
            ref('attorney-dana-panza-macdonald', 'team-3'),
            ref('attorney-benjamin-p-bean', 'team-4'),
            ref('attorney-jennifer-maurer-bean', 'team-5'),
            ref('attorney-richard-a-beauchamp', 'team-6'),
            ref('attorney-robert-m-bulfin', 'team-7'),
            ref('attorney-jose-felix-diaz', 'team-8'),
            ref('attorney-lorraine-duthe', 'team-9'),
            ref('attorney-james-h-horton-iv', 'team-10'),
            ref('attorney-gregory-l-mcdermott', 'team-11'),
            ref('attorney-elizabeth-l-pedersen', 'team-12'),
            ref('attorney-louise-wilhite-st-laurent', 'team-13'),
            ref('attorney-samantha-evans-saltzburg', 'team-14'),
            ref('attorney-jennifer-k-graner', 'team-15'),
            ref('attorney-andrew-l-myers', 'team-16'),
            ref('attorney-trevor-d-scott', 'team-17'),
            ref('attorney-julia-c-marano', 'team-18'),
          ],
        },
        {
          _type: 'teamSection',
          _key: 'section-of-counsel',
          heading: 'Of Counsel',
          attorneys: [
            ref('attorney-brian-ballard', 'oc-1'),
            ref('attorney-brad-burleson', 'oc-2'),
            ref('attorney-david-childs', 'oc-3'),
            ref('attorney-jan-gorrie', 'oc-4'),
            ref('attorney-adrian-lukis', 'oc-5'),
            ref('attorney-syl-luks', 'oc-6'),
            ref('attorney-monica-rodriguez', 'oc-7'),
            ref('attorney-eileen-stuart', 'oc-8'),
            ref('attorney-abby-vail', 'oc-9'),
            ref('attorney-sandra-harris', 'oc-10'),
          ],
        },
      ],
    },

    // ── Practice Areas ────────────────────────────────────────────────────────
    {
      _id: 'page-practice-areas',
      title: 'Practice Areas',
      navigationLabel: 'Practice Areas',
      slug: 'practice-areas',
      seoDescription: 'Explore the legal practice areas at Panza Maurer.',
      showInNavigation: true,
      navigationOrder: 3,
      sections: [
        {
          _type: 'practiceAreasSection',
          _key: 'section-practices',
          heading: 'Our Practice Areas',
          practiceAreas: [
            ref('practicearea-administrative--regulatory-law', 'pa-1'),
            ref('practicearea-healthcare', 'pa-2'),
            ref('practicearea-government-relations', 'pa-3'),
            ref('practicearea-labor--employment', 'pa-4'),
            ref('practicearea-litigation', 'pa-5'),
            ref('practicearea-education-law', 'pa-6'),
            ref('practicearea-compliance', 'pa-7'),
            ref('practicearea-corporate--transactional', 'pa-8'),
            ref('practicearea-land-use--environmental', 'pa-9'),
            ref('practicearea-trusts--estates', 'pa-10'),
            ref('practicearea-technology--it', 'pa-11'),
            ref('practicearea-gaming--hospitality', 'pa-12'),
            ref('practicearea-strategic-planning', 'pa-13'),
            ref('practicearea-procurement', 'pa-14'),
            ref('practicearea-real-property', 'pa-15'),
            ref('practicearea-receivership--conservatorship', 'pa-16'),
            ref('practicearea-medical-marijuana', 'pa-17'),
          ],
        },
      ],
    },

    // ── News ──────────────────────────────────────────────────────────────────
    {
      _id: 'page-news',
      title: 'News',
      navigationLabel: 'News',
      slug: 'news',
      seoDescription: 'Latest news and updates from Panza Maurer.',
      showInNavigation: true,
      navigationOrder: 5,
      sections: [
        { _type: 'newsSection', _key: 'section-news', heading: 'Latest News', articleCount: 6 },
      ],
    },

    // ── News Archive ──────────────────────────────────────────────────────────
    {
      _id: 'page-news-archive',
      title: 'News Archive',
      navigationLabel: 'News Archive',
      slug: 'news-archive',
      seoDescription: 'Browse archived news and articles from Panza Maurer.',
      showInNavigation: false,
      navigationOrder: 6,
      sections: [
        { _type: 'newsSection', _key: 'section-news', heading: 'News Archive', articleCount: 12 },
      ],
    },

    // ── Locations ─────────────────────────────────────────────────────────────
    {
      _id: 'page-locations',
      title: 'Locations',
      navigationLabel: 'Locations',
      slug: 'locations',
      seoDescription:
        'Panza Maurer offices in Tallahassee, Fort Lauderdale, and Coral Gables, Florida.',
      showInNavigation: true,
      navigationOrder: 7,
      sections: [
        {
          _type: 'locationsSection',
          _key: 'section-locations',
          heading: 'Our Locations',
          locations: [
            ref('location-tallahassee', 'loc-1'),
            ref('location-fort-lauderdale', 'loc-2'),
            ref('location-coral-gables', 'loc-3'),
          ],
        },
      ],
    },

    // ── Contact ───────────────────────────────────────────────────────────────
    {
      _id: 'page-contact',
      title: 'Contact',
      navigationLabel: 'Contact',
      slug: 'contact',
      seoDescription:
        'Contact Panza Maurer at our offices in Tallahassee, Fort Lauderdale, and Coral Gables.',
      showInNavigation: false,
      navigationOrder: 8,
      sections: [
        {
          _type: 'locationsSection',
          _key: 'section-locations',
          heading: 'Contact Our Offices',
          locations: [
            ref('location-tallahassee', 'loc-1'),
            ref('location-fort-lauderdale', 'loc-2'),
            ref('location-coral-gables', 'loc-3'),
          ],
        },
      ],
    },

    // ── About ─────────────────────────────────────────────────────────────────
    {
      _id: 'page-about',
      title: 'About',
      navigationLabel: 'About',
      slug: 'about',
      seoDescription:
        'Learn about Panza Maurer, a Florida law firm with more than 50 years of legal excellence.',
      showInNavigation: false,
      navigationOrder: 9,
      sections: [],
    },
  ]

  for (const page of pages) {
    const doc = {
      _type: 'page',
      _id: page._id,
      title: page.title,
      navigationLabel: page.navigationLabel,
      slug: { _type: 'slug', current: page.slug },
      seoDescription: page.seoDescription,
      showInNavigation: page.showInNavigation,
      navigationOrder: page.navigationOrder,
      status: 'published',
      sections: page.sections,
    }
    await client.createOrReplace(doc)
    console.log(`  ✅ Page: ${page.title}`)
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting Sanity migration...')
  console.log(`   Project: ${projectId}`)
  console.log(`   Dataset: ${dataset}`)

  await migrateAttorneys()
  await migrateLocations()
  await migrateNews()
  await migratePracticeAreas()
  await migrateSiteSettings()
  await seedPages()

  console.log('\n✅ Migration complete!')
  console.log('\nNext steps:')
  console.log('  1. Open Sanity Studio at /studio to verify all documents')
  console.log('  2. Check attorney count, location count, and news article count')
  console.log('  3. Start the dev server: npm run dev')
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err)
  process.exit(1)
})
