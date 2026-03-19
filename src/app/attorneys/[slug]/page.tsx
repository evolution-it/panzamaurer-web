import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const attorneyData: Record<
  string,
  {
    name: string;
    firstName: string;
    role: string;
    image: string;
    education: string[];
    barAdmissions: string[];
    courtAdmissions: string[];
    professionalMemberships: string[];
    intro: string;
    sections: { title: string; content: string[] }[];
  }
> = {
  'thomas-f-panza': {
    name: 'Thomas F. Panza',
    firstName: 'Thomas',
    role: 'Founding Partner',
    image: 'thomas-f-panza.png',
    education: [
      'B.A. from Florida State University',
      'J.D. from Stetson University',
      'M.S. in Criminal Justice from Nova Southeastern University',
      'Ed.D. from Florida Atlantic University',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [
      'U.S. District Court for the Southern District of Florida',
    ],
    professionalMemberships: [
      'The Florida Bar — Administrative Law, Business Law, Health Care Law, and Trial Lawyer Sections',
      'National Association of College and University Attorneys (NACUA)',
      'American Health Lawyers Association (AHLA)',
      'American Bar Association (ABA)',
      'American Arbitration Association — Certified Arbitrator',
      'Florida Bar Foundation Fellow',
      'Italian American Lawyers Association — Past President',
    ],
    intro:
      'Tom is an AV-rated attorney with over 50 years of experience in litigation, regulatory affairs, and governmental relations. His broad legal expertise spans multiple sectors, including healthcare, insurance, procurement, education, employment, environmental law, and government affairs. Throughout his distinguished career, Tom has represented numerous Fortune 500 companies, with a focus on corporate, academic, administrative, regulatory matters, and healthcare law.',
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
    name: 'Susan Horovitz Maurer',
    firstName: 'Susan',
    role: 'Founding Partner',
    image: 'susan-horovitz-maurer.png',
    intro:
      'Susan Horovitz Maurer is an A.V. rated member of the Florida Bar admitted to practice in both state and federal court. She became a partner in Panza, Maurer & Maynard, P.A. in 1984, and assumed responsibilities as Managing Partner in 1994.',
    education: [
      'B.A. from Emory University',
      'J.D. from Nova Southeastern University Shepard Broad Law School (1980)',
    ],
    barAdmissions: ['Florida (State and Federal Court)'],
    courtAdmissions: [
      'U.S. District Court for the Southern District of Florida',
    ],
    professionalMemberships: [
      'Broward County Bar Association',
      'The Florida Bar — Administrative Law and General Practice Sections',
      'American Health Lawyers Association (AHLA)',
      'National Association of College and University Attorneys (NACUA)',
      'Florida Bar Fellows',
      'American Arbitration Association — Commercial Arbitrator',
    ],
    sections: [
      {
        title: 'Litigation & Regulatory Practice',
        content: [
          'Her extensive legal background is in litigation with an emphasis in regulatory and administrative work. Her primary practice areas have been in healthcare and academic law. For 40 years, she has provided advice and counsel to regulated industries and academic institutions, both public and private.',
          'As a Commercial Arbitrator with the American Arbitration Association, Mrs. Maurer has arbitrated multiple healthcare, insurance and commercial matters. Mrs. Maurer has represented acute care chains and specialty care hospital providers on issues of licensure, reimbursement and fraud and abuse.',
          'She has developed compliance plans and navigated multi-million dollar investigations for healthcare providers. Her work spans a broad range of regulatory and administrative matters affecting both public and private institutions.',
        ],
      },
      {
        title: 'Healthcare & Academic Law',
        content: [
          'Mrs. Maurer has extensive experience advising healthcare institutions and academic medical centers. She has represented hospitals, specialty care providers, and academic institutions on complex regulatory matters including licensure, reimbursement, fraud and abuse, and compliance.',
          'Her healthcare practice includes developing comprehensive compliance plans, navigating state and federal investigations, and representing providers before regulatory agencies and administrative tribunals.',
        ],
      },
      {
        title: 'Prior Positions & Experience',
        content: [
          "Susan's distinguished career includes service with the United States Senate Committee on Governmental Affairs and the City of Miami Legal Department. She served as Adjunct Faculty and General Counsel for Nova Southeastern University, General Counsel for Community Mental Health Center, Inc., General Counsel for the Florida Workers' Compensation Insurance Guarantee Association, and Assistant General Counsel for the Broward Principals and Assistants Association.",
        ],
      },
      {
        title: 'Community Involvement',
        content: [
          "Susan has served on the boards of numerous community organizations, including the American Lung Association, Fort Lauderdale Historical Society, Temple Bat Yam, Nova Southeastern University President's Advisory Council, and the Fort Lauderdale Museum of Art.",
          'Susan Horovitz Maurer is a native Floridian. Raised in Miami and currently lives in Broward County. She is fortunately married to Laurence Maurer, Esquire and has two awesome children.',
        ],
      },
    ],
  },
  'dana-panza-macdonald': {
    name: 'Dana Panza Macdonald',
    firstName: 'Dana',
    role: 'Managing Partner',
    image: 'dana-panza-macdonald.png',
    education: [
      'J.D. from Stetson University College of Law, cum laude (2001)',
      'B.S. from Florida State University (1998)',
    ],
    barAdmissions: ['Florida', 'New York'],
    courtAdmissions: [
      'U.S. District Court for the Northern District of Florida',
      'U.S. District Court for the Middle District of Florida',
      'U.S. District Court for the Southern District of Florida',
    ],
    professionalMemberships: [
      'Administrative Law Section of The Florida Bar',
      'Labor and Employment Law Section of The Florida Bar',
      'Broward County Bar Association',
      'American Bar Association',
      "Broward County Women Lawyers' Association",
      'Italian American Bar Association',
      'National Association of College and University Attorneys (NACUA)',
    ],
    intro:
      'Dana Panza Macdonald practices primarily in the areas of labor and employment, litigation, and education matters in state and federal courts. Dana is Board Certified in Education Law by the Florida Bar.',
    sections: [
      {
        title: 'Education Law',
        content: [
          'Dana specializes in advising universities, colleges, and academic institutions on regulatory compliance, student rights, faculty/staff issues, and institutional governance. She has represented clients in Title IX, accreditation, student conduct, and employment law matters. She has moderated and spoken at seminars hosted by the National Association of College and University Attorneys (NACUA) regarding workplace discrimination and social media issues.',
        ],
      },
      {
        title: 'Labor & Employment Law',
        content: [
          'Dana advises employers on wage and hour compliance, employee classification, and overtime regulations. She resolves disputes involving wrongful termination, discrimination, and harassment. She represents employers before the Equal Employment Opportunity Commission (EEOC), Florida Commission on Human Relations (FCHR), and in unemployment compensation hearings, Office for Civil Rights complaints, and workplace investigations.',
        ],
      },
      {
        title: 'Community Leadership',
        content: [
          'Dana has been recognized as "Florida Trend\'s Legal Elite NOTABLE \u2013 Women Leaders in Law" (2025) and "Florida Trend\'s Legal Elite NOTABLE \u2013 Managing Partners" (2024). She is a member of Leadership Florida Cornerstone Class 42 and previously served on the Broward County Parks and Recreation Advisory Board from 2014 to 2019. Dana has also served with Gilda\'s Club South Florida, the Broward County Library Foundation, and the Christ Church School Board.',
        ],
      },
      {
        title: 'Education and Background',
        content: [
          'Dana earned her J.D. from Stetson University College of Law, cum laude, in 2001, where she was a Senior Associate Member of the Stetson Law Review and a member of Phi Delta Phi legal honorary fraternity. She interned for Hon. Thomas G. Wilson, U.S. Magistrate Judge. She received her B.S. from Florida State University in 1998.',
        ],
      },
    ],
  },
  'benjamin-p-bean': {
    name: 'Benjamin P. Bean',
    firstName: 'Benjamin',
    role: 'Partner',
    image: 'benjamin-p-bean.png',
    education: [
      'J.D., cum laude, University of Miami School of Law (2009)',
      'B.A. in Political Science from University of Michigan (2004)',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [
      'U.S. District Court for the Southern District of Florida',
      'U.S. District Court for the Middle District of Florida',
    ],
    professionalMemberships: [
      'University of Michigan Alumni Club of Miami-Fort Lauderdale',
    ],
    intro:
      'Ben is a litigator and legal advisor who provides general counsel services to Florida businesses, with a primary focus on litigation in both state and federal courts.',
    sections: [
      {
        title: 'Litigation & General Counsel',
        content: [
          'Ben represents clients in complex disputes across multiple jurisdictions, including commercial litigation, employment law, intellectual property, and corporate matters. His approach combines sharp legal analysis with a practical, business-minded approach to achieve favorable outcomes through trial, mediation, or negotiated settlement.',
          'Beyond litigation, Ben serves as general counsel to various Florida entities, offering strategic guidance on corporate governance, compliance, risk management, and contract negotiations.',
        ],
      },
      {
        title: 'Community Leadership',
        content: [
          "Ben is a current member of the University of Michigan Alumni Club of Miami-Fort Lauderdale. He served on the City of Fort Lauderdale's Community Services Board, evaluating funding allocations for social service programs. Previously, he participated on the Young Leadership Council Steering Committee for Gilda's Club South Florida, an organization supporting individuals affected by cancer.",
        ],
      },
      {
        title: 'Education and Background',
        content: [
          "Ben earned his Juris Doctor, cum laude, from the University of Miami School of Law in 2009, where he served as executive editor of the International and Comparative Law Review. He received his Bachelor's degree in Political Science from the University of Michigan in 2004.",
          'Ben has been named a "Rising Star" by Attorney at Law Magazine, recognized among "40 Under 40 Outstanding Lawyers of South Florida" by the Cystic Fibrosis Foundation, and named an "Up and Comer" by Florida Trend magazine. He was also selected for the 2026 Best Lawyers in America for Commercial Litigation.',
        ],
      },
    ],
  },
  'jennifer-maurer-bean': {
    name: 'Jennifer Maurer Bean',
    firstName: 'Jennifer',
    role: 'Partner',
    image: 'jennifer-maurer-bean.png',
    education: [
      'B.A. in Finance from University of Miami',
      'J.D., cum laude, from University of Miami',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [
      'The Florida Bar \u2014 Administrative Law, Health Law, and Environmental & Land Use Sections',
    ],
    intro:
      'Jennifer Maurer Bean brings over fifteen years of experience in government relations, with a strong track record of advocating before state legislative and executive agencies on matters related to healthcare, higher education, insurance, and environmental issues.',
    sections: [
      {
        title: 'Strategic Focus & Industry Expertise',
        content: [
          'As a skilled strategist and attorney, Jen offers clients forward-looking operational guidance and actionable policy insight, grounded in a deep understanding of state and local government operations. She is particularly focused on initiatives related to public procurements, higher education institutions, healthcare, and resiliency \u2013 areas where legislative and local policy making have a lasting impact on economic development, institutional strength, and long-term sustainability.',
          'Jen partners closely with clients to develop strategies that not only address immediate policy challenges but also support long-term business positioning. Her ability to navigate the intersection of public policy and corporate strategy makes her a valued advisor to companies seeking to advance their strategic goals.',
        ],
      },
      {
        title: 'Community Leadership',
        content: [
          "A committed community leader, Jen currently serves on the Board of Directors for the Broward County Chapter of the South Florida Red Cross as well as the Pace Center for Girls of Broward County. She is an active member of both the Greater Fort Lauderdale Alliance, the Port Everglades Action Team and the Florida Ocean Alliance. Her civic involvement reflects her dedication to supporting Florida's future through economic opportunity and inclusive growth.",
        ],
      },
      {
        title: 'Education and Background',
        content: [
          'Prior to joining the firm, Jen served as Vice President of Government Affairs for a national healthcare technology company. There, she led federal and state-level advocacy initiatives, playing a central role in shaping policies related to healthcare delivery systems and insurance reimbursement.',
          'A native of Florida, Jen earned both her Bachelor of Arts in Finance and her Juris Doctor, cum laude, from the University of Miami. She is a member of the Florida Bar, including its Administrative Law, Health Law, and Environmental & Land Use sections.',
        ],
      },
    ],
  },
  'richard-a-beauchamp': {
    name: 'Richard A. Beauchamp',
    firstName: 'Richard',
    role: 'Partner',
    image: 'richard-a-beauchamp.png',
    education: [
      'B.A. from Stetson University (1982)',
      'J.D. from Stetson College of Law (1984)',
    ],
    barAdmissions: ['Florida', 'District of Columbia', 'Pennsylvania'],
    courtAdmissions: [
      'U.S. District Court for the Northern District of Florida',
      'U.S. District Court for the Middle District of Florida',
      'U.S. District Court for the Southern District of Florida',
      'U.S. Eleventh Circuit Court of Appeals',
    ],
    professionalMemberships: [
      'Labor and Employment Law Section of The Florida Bar',
      'Trial Law Section of The Florida Bar',
      'Business Law Section of The Florida Bar',
    ],
    intro:
      "Richard A. Beauchamp's practice areas include the representation of one of the largest private universities and some of the largest school systems in the nation, as well as representing one of the largest accredited law enforcement agencies in the country.",
    sections: [
      {
        title: 'Litigation Practice',
        content: [
          'Mr. Beauchamp is originally from Detroit, Michigan, and has lived in Florida since 1975. He began his legal career focusing on commercial litigation, construction disputes, personal injury matters, real estate, and insurance. After operating a successful solo practice concentrating on insurance, real estate, personal injury, governmental entity liability and products liability, he joined the firm as partner in 2002.',
          "His practice encompasses educators' liability, civil rights litigation, commercial disputes, nursing home/medical malpractice litigation, and employment matters. He has represented both employees and employers regarding harassment, discrimination, and retaliation claims, as well as E.E.O.C. proceedings and whistleblower matters.",
          "He has managed the firm's statewide nursing home and rehabilitation hospital litigation division since joining. His experience includes multi-million dollar class actions and appellate work.",
        ],
      },
    ],
  },
  'robert-m-bulfin': {
    name: 'Robert M. Bulfin',
    firstName: 'Robert',
    role: 'Partner',
    image: 'robert-m-bulfin.png',
    education: [
      'B.A. in Government from University of Notre Dame (1973)',
      'J.D. from Loyola University of Chicago Law School (1976)',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [
      'U.S. District Court for the Southern District of Florida',
    ],
    professionalMemberships: [
      'Business Law Section of The Florida Bar',
      'General Practice Section of The Florida Bar',
      'Real Property, Probate, and Trust Law Section of The Florida Bar',
      'Broward County Bar Association',
      'St. Thomas More Society of South Florida \u2014 Past President',
      'Notre Dame Club of Fort Lauderdale \u2014 Past President',
    ],
    intro:
      'Bob Bulfin brings nearly 50 years of experience representing individuals, investors, and business owners in complex matters involving corporate structuring, real estate acquisitions and sales, commercial leasing, licensing, and permitting.',
    sections: [
      {
        title: 'Transactional Practice',
        content: [
          'His practice encompasses contract law, corporate structuring, and employment matters. Bob provides comprehensive counsel on drafting, negotiating, and enforcing various business agreements including purchase/sale agreements, leases, and licensing deals. He is known for his ability to anticipate risk, structure favorable terms, provide counsel on corporate practices, and settle disputes.',
          'Bob has extensive experience structuring corporate agreements, supporting sound governance, and business growth, assisting with formations and advising on shareholder agreements, operating agreements, buy-sell arrangements, and corporate resolutions.',
          'He has defended his corporate clients against EEOC and employment discrimination claims, ADA matters, unfair wages, and other governmental and private claims. Additionally, Bob provides trusted counsel on estate planning matters, assisting clients with wills, trusts, powers of attorney, and healthcare directives.',
          'Since 2016 at Panza Maurer, he has represented clients in healthcare, real estate development, medical marijuana licensing, corporate acquisitions, and advised not-for-profits.',
        ],
      },
    ],
  },
  'jose-felix-diaz': {
    name: 'Jose Felix Diaz',
    firstName: 'Jose',
    role: 'Partner',
    image: 'jose-felix-diaz.png',
    education: [
      'B.A. with honors from University of Miami',
      'J.D. from Columbia University School of Law',
      'Certificate in Energy Policy and Planning from University of Idaho',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Jose Felix Diaz is a government law attorney. His practice areas include the representation of individuals, non-profits, major corporations, and various other entities before county and municipal boards throughout the State of Florida and beyond in complex matters involving public contract procurement, public-private partnership deals and solicitations, litigation, zoning, land use, code compliance and enforcement, energy project development and comprehensive planning.',
    sections: [
      {
        title: 'Legislative Experience',
        content: [
          "In 2010, Mr. Diaz was elected to the Florida House of Representatives, where he served as Chairman of the Energy & Utilities, Regulatory Affairs, and Commerce Committees. He served four terms in the Florida Legislature and was elected as the Chairman of the Miami-Dade Legislative Delegation. Mr. Diaz co-sponsored the State's first public-private partnership legislation which paved the way for local governments to codify uniform unsolicited proposal procedures.",
          "Mr. Diaz has served on various committees of statewide and regional significance, including the Public Service Commission's Nominating Council, the Southern States Energy Board, the National Conference of State Legislators, and the Florida Constitution Revision Commission, where he chaired the Legislative Committee. In 2017, Mr. Diaz was nominated as a top candidate for U.S. Attorney for the Southern District of Florida.",
        ],
      },
      {
        title: 'Community Leadership',
        content: [
          'He has been honored by both Miami-Dade County and the City of Miami for his national and local accomplishments, as well as being recognized by numerous state and national publications as a rising star in law and politics. Miami Today News listed Mr. Diaz in their listing of Best Legal Leaders of Miami-Dade County in 2014, and in 2016 recognized him as one of Miami-Dade\'s "Best in Government."',
          "A tireless advocate for children's causes, Mr. Diaz has served on the board of CHARLEE Homes for Children, the Miami-Dade County Children's Trust, and Our Kids of Miami-Dade & Monroe. He is a recipient of the United Way of Miami-Dade's Public Service Leadership Award, the Children's Trust Champion for Children Award, and Volunteer Florida's Champion of Service.",
        ],
      },
    ],
  },
  'lorraine-duthe': {
    name: 'Lorraine Duthe',
    firstName: 'Lorraine',
    role: 'Partner',
    image: 'lorraine-duthe.png',
    education: [
      'Bachelor of Science in Nursing, magna cum laude',
      'Master of Science in Community Health',
      'J.D. from State University of New York at Buffalo School of Law (2006)',
    ],
    barAdmissions: ['New York (2007)'],
    courtAdmissions: [],
    professionalMemberships: [
      'New York State Bar Association \u2014 Health Law Section',
      'New York State Academy of Trial Lawyers',
      'American Health Law Association',
      'Health Care Compliance Association',
      'Certified in HealthCare Research Compliance, Compliance Certification Board',
    ],
    intro:
      "Lorraine Duthe is an accomplished healthcare attorney with over two decades of experience guiding hospitals, health systems, and healthcare technology companies through today's complex and ever-changing regulatory environment. With a unique blend of clinical insight and legal expertise, she helps clients navigate issues involving HIPAA, Stark Law, the Anti-Kickback Statute, clinical research compliance, and patient safety.",
    sections: [
      {
        title: 'Healthcare Law',
        content: [
          'A former nurse and health care executive, Lorraine brings a unique blend of clinical experience and legal expertise to her work with healthcare organizations. Whether collaborating with hospital leadership, compliance teams, or healthcare innovators, she offers guidance on navigating complex legal and regulatory landscapes, including federal and state healthcare laws, the Stark Law, Anti-Kickback Statute, HIPAA/privacy compliance, clinical research, and billing practices.',
        ],
      },
      {
        title: 'Community Leadership',
        content: [
          'From 2018 to 2024, she served as a governor-appointed board member of the Florida Prescription Drug Monitoring Program Foundation.',
        ],
      },
      {
        title: 'Education and Background',
        content: [
          'Lorraine holds a Bachelor of Science in Nursing, graduating magna cum laude, and a Master of Science in Community Health. She earned her J.D. from the State University of New York at Buffalo School of Law in 2006 and was admitted to the New York State Bar in 2007.',
          "For over a decade, Lorraine served as Associate General Counsel for a major hospital system in Western New York, where she provided comprehensive legal guidance on a range of healthcare-related issues, including regulatory compliance, fraud and abuse, HIPAA/privacy, and immigration. She was instrumental in developing the system's Clinical Research Center in collaboration with the State University of New York at Buffalo School of Medicine.",
          'Lorraine later served as General Counsel for a healthcare technology company in Florida, where she advised on a wide range of legal and regulatory matters, including privacy, contracting, employment-related issues, and complex billing compliance.',
        ],
      },
    ],
  },
  'james-h-horton-iv': {
    name: 'James H. Horton, IV',
    firstName: 'James',
    role: 'Partner',
    image: 'james-h-horton-iv.png',
    education: [
      'J.D. from Florida State University College of Law (2008)',
      'B.S. in Legal Studies from University of Central Florida (2005)',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [
      'U.S. District Court for the Northern District of Florida',
      'U.S. District Court for the Middle District of Florida',
      'U.S. District Court for the Southern District of Florida',
    ],
    professionalMemberships: [
      'National Association of College and University Attorneys (NACUA)',
      'Phi Alpha Delta Law Fraternity',
      'Labor & Employment Law Section of the Florida Bar',
    ],
    intro:
      'James Horton has been with the firm since 2008 and serves as a partner. As a member of the National Association of College and University Attorneys (NACUA), James focuses his practice in the areas of higher-education law, employment law, civil rights, disability rights, and information security.',
    sections: [
      {
        title: 'Education Law',
        content: [
          'James regularly advises colleges and universities on compliance with the Americans with Disabilities Act (ADA), Section 504 of the Rehabilitation Act of 1973, Title IV of the Higher Education Act of 1965, Title IX of the Education Amendments of 1972, the Family Educational Rights and Privacy Act (FERPA), and other required regulations of the U.S. Department of Education. His higher-education practice includes policy and student handbook development, governance, student and employee grievances, internal investigations, and responses to complaints and agency inquiries.',
        ],
      },
      {
        title: 'Employment Law',
        content: [
          'James advises employers on compliance with Title VII of the Civil Rights Act of 1964, the Age Discrimination in Employment Act (ADEA), the Americans with Disabilities Act (ADA), the Pregnancy Discrimination Act (PDA), the Pregnant Workers Fairness Act (PWFA), the Family and Medical Leave Act (FMLA), and the Florida Civil Rights Act. His employment law practice includes counseling on discrimination and retaliation claims, disciplinary actions, accommodations, internal investigations, and employee grievances.',
        ],
      },
      {
        title: 'Information Security Law',
        content: [
          'James advises educational institutions and private organizations on information security compliance. His work includes guidance under the Florida Information Protection Act (FIPA), the Family Educational Rights and Privacy Act (FERPA), the Gramm-Leach-Bliley Act (GLBA), the Health Insurance Portability and Accountability Act (HIPAA) Security Rule, and federal rules governing sensitive or bulk data. He assists clients with policy development, data governance, risk assessments, and responses to data breaches.',
        ],
      },
      {
        title: 'Community Involvement',
        content: [
          'James currently serves on the School Board for Christ Church School in Fort Lauderdale.',
        ],
      },
    ],
  },
  'gregory-l-mcdermott': {
    name: 'Gregory L. McDermott',
    firstName: 'Gregory',
    role: 'Partner',
    image: 'gregory-l-mcdermott.png',
    education: [
      'J.D., magna cum laude, from University of Miami School of Law (2009)',
      'B.A. in Mass Communication from Illinois State University (2005)',
    ],
    barAdmissions: ['Colorado'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Gregory L. McDermott engages in civil litigation in state and federal court in a wide range of matters, with focus on commercial litigation and labor and employment.',
    sections: [
      {
        title: 'Administrative & Regulatory Practice',
        content: [
          'His administrative practice involves particular focus on issues related to state and local government. He demonstrates expertise in interpreting and understanding complex legislative issues, development of state agency administrative rules, and navigating through the often complex process of administrative and state agency proceedings.',
          'He works with clients on a complex range of business issues with a focus on increasing bottom lines, while maintaining compliance with an often-times complex myriad of intermingling local, state and federal regulations.',
        ],
      },
      {
        title: 'Education and Background',
        content: [
          'Gregory graduated magna cum laude from the University of Miami School of Law in 2009, where he was a member of the Order of the Coif Honor Society and the Miami Business Law Review. He received First Place in the 2007 Charles C. Papy Jr. Moot Court Competition and earned Highest Honors in the Litigation Skills Pre-trial & Trial Program.',
          'He received his Bachelor of Arts in Mass Communication with a Minor in Political Science from Illinois State University in 2005.',
        ],
      },
    ],
  },
  'elizabeth-l-pedersen': {
    name: 'Elizabeth L. Pedersen',
    firstName: 'Elizabeth',
    role: 'Partner',
    image: 'elizabeth-l-pedersen.png',
    education: [
      'J.D. from University of Miami School of Law',
      'B.A. in History from Tulane University',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [
      'U.S. District Court for the Northern District of Florida',
      'U.S. District Court for the Middle District of Florida',
      'U.S. District Court for the Southern District of Florida',
    ],
    professionalMemberships: [
      'American Health Law Association (AHLA)',
      'The Florida Bar \u2014 Administrative Law, Health Law, and General Practice Sections',
    ],
    intro:
      'Elizabeth L. "Libby" Pedersen is a skilled attorney specializing in administrative law and healthcare law, with extensive experience in navigating the complex regulatory frameworks that govern the procurement and healthcare industries.',
    sections: [
      {
        title: 'Healthcare Law',
        content: [
          'Libby represents clients in health care facility and licensed entity applications, handling licensure and litigation matters before regulatory bodies including the Agency for Health Care Administration (AHCA), Department of Health (DOH), and Department of Children and Families (DCF).',
          'Her healthcare expertise encompasses facility development, certificate of need (CON) applications, trauma center designations, change of ownership (CHOW) transactions, policy development, telehealth compliance, and regulated entity licensure.',
          "Notable clients include Jackson Health System, Tampa General, UF Shands, Broward Health, Nemours Children's Hospital, and numerous hospice and healthcare organizations.",
        ],
      },
      {
        title: 'Procurement Law',
        content: [
          'In procurement law, she advises on government procurement matters and litigation, including bid protests at local and state levels, with focus on challenging and defending bid decisions.',
        ],
      },
      {
        title: 'Community Leadership',
        content: [
          'She serves on the Board of Directors for Arc Broward and the FLITE Center. Since 2015, she has been an advisor to the Upsilon Delta Chapter of Chi Omega at the University of Miami. She is a member of Leadership Broward Class XXXVI.',
        ],
      },
    ],
  },
  'louise-wilhite-st-laurent': {
    name: 'Louise Wilhite St. Laurent',
    firstName: 'Louise',
    role: 'Partner',
    image: 'louise-wilhite-st-laurent.png',
    education: [
      'J.D., Florida State University, Cum Laude',
      'B.A., Florida State University, Cum Laude',
    ],
    barAdmissions: [
      'Florida',
      'U.S. District Court for the Northern District of Florida',
    ],
    courtAdmissions: [],
    professionalMemberships: [
      'Administrative Law Section of The Florida Bar \u2014 Immediate Past Chair',
      'Tallahassee Bar Association \u2014 Director',
      'Health Law Section of The Florida Bar',
      'Government Lawyer Section of The Florida Bar',
      'Florida Government Bar Association',
      'Governmental and Public Policy Advocacy Committee',
    ],
    intro:
      'Louise Wilhite-St. Laurent brings over 15 years of experience in procurements, administrative, healthcare, and marijuana law. Leveraging her experience as General Counsel for the Florida Department of Health, Louise is intimately familiar with navigating governmental processes on behalf of her clients in a variety of complex healthcare and administrative matters.',
    sections: [
      {
        title: 'Administrative Law and Competitive Procurements',
        content: [
          "Louise's career in administrative law began in 2013 when she joined the Florida Department of Health (DOH). There, Louise navigated complex state and federal regulations while overseeing the legal operations related to regulatory compliance, litigation, and rulemaking. As General Counsel for DOH, Louise led a team of more than 80 attorneys, managing high-stakes litigation and providing legal guidance on administrative law matters across Florida's circuit, district, and federal courts, as well as before the Division of Administrative Hearings (DOAH).",
          'Since joining the firm, Louise has provided significant state and federal regulatory support for her clients in complex legal matters involving procurements, protests, and a variety of healthcare matters.',
        ],
      },
      {
        title: 'Healthcare Law',
        content: [
          "Louise offers deep expertise in healthcare law, focusing on regulatory compliance, healthcare policy, and public health law. During her tenure at DOH, she provided strategic legal counsel on complex healthcare regulations, public health initiatives, and delivery systems. Her notable experience includes work with the Office of Medical Marijuana Use (OMMU), where Louise played a key role in developing Florida's medical marijuana program, now the third-largest in the U.S., helping to shape the program's legal frameworks.",
        ],
      },
      {
        title: 'Marijuana Law',
        content: [
          "A recognized expert in marijuana law, Louise specializes in the legal and regulatory aspects of medical marijuana. Louise has provided significant litigation and rulemaking support to the Florida Department of Health's Office of Medical Marijuana Use, where her work involved advising on compliance issues, defending the program's legal standing in various courts, and navigating the complex regulatory environment surrounding licensing, distribution, and policy development in the marijuana industry.",
        ],
      },
      {
        title: 'Community Leadership',
        content: [
          'Louise is the immediate past Chair of the Administrative Law Section of the Florida Bar, a Director of the Tallahassee Bar Association, and a member of the Health Law Section, Government Lawyer Section, and the Florida Government Bar Association. She has delivered numerous continuing legal education presentations on topics such as administrative litigation, constitutional rulemaking, evidence in administrative hearings, and the use of executive power during states of emergency.',
        ],
      },
    ],
  },
  'jennifer-k-graner': {
    name: 'Jennifer K. Graner',
    firstName: 'Jennifer',
    role: 'Senior Associate',
    image: 'jennifer-k-graner.png',
    education: [
      'B.A. in Finance from Florida Atlantic University (1987)',
      'J.D. from Nova Southeastern University Shepard Broad Law Center (1991)',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [
      'Florida Division of Administrative Hearings',
      'First District Court of Appeals',
    ],
    professionalMemberships: ['The Florida Bar'],
    intro:
      'Jennifer K. Graner handles compliance and regulatory matters in the State of Florida including all phases of litigation before the Florida Division of Administrative Hearings and the First District Court of Appeals for health care, pari mutuel and environmental Fortune 500 companies. Her experience also includes real estate, land use and complex litigation.',
    sections: [
      {
        title: 'Government Affairs & Regulatory Practice',
        content: [
          'Mrs. Graner has been involved in lobbying members of the Florida Senate and House of Representatives, interfacing with numerous Florida agencies in Tallahassee and throughout the state to accomplish client objectives. She has represented clients in protracted Administrative Rule challenges and Rule workshops, resulting in changes to the Florida Administrative Code. Mrs. Graner has lectured throughout the State of Florida to various health care groups on licensure and compliance issues. She has advised and litigated on behalf of clients in RFP, RFQ, and RFI matters for various contracts within the state of Florida.',
        ],
      },
    ],
  },
  'samantha-evans-saltzburg': {
    name: 'Samantha Evans Saltzburg',
    firstName: 'Samantha',
    role: 'Senior Associate',
    image: 'samantha-evans-saltzburg.png',
    education: [
      'J.D., magna cum laude, from Nova Southeastern University, Shepard Broad College of Law',
      'B.S. from Nova Southeastern University, School of Business and Entrepreneurship',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [
      'The Florida Bar',
      'National Association of College and University Attorneys (NACUA) \u2014 Legal Resources Committee',
    ],
    intro:
      'Samantha Evans Saltzburg is an experienced attorney with a practice focused on higher education and employment law. She advises institutions and individuals on a wide array of legal and compliance issues, offering strategic guidance with a thoughtful, solutions-oriented approach.',
    sections: [
      {
        title: 'Higher Education',
        content: [
          'Sam provides comprehensive advice on higher education matters related to student affairs, academic policy, and regulatory compliance. Her work includes guiding institutional leadership on issues involving school discipline, student conduct proceedings, academic dismissals, and compliance with federal laws including the ADA and Section 504.',
          'With experience representing both institutions and students, Sam offers a unique, well-rounded perspective. She has counseled students through complex university disciplinary processes, including dismissal proceedings, which deepens her insight into due process and procedural fairness in higher education settings.',
        ],
      },
      {
        title: 'Employment Law',
        content: [
          'Sam provides counsel on a variety of workplace issues affecting corporate institutions, institutions of higher education, as well as employees. She advises institutional clients on employment policies, hiring practices, workplace investigations, and compliance with employment-related laws including Title VII, the FMLA, and wage and hour regulations.',
        ],
      },
      {
        title: 'Education and Background',
        content: [
          'Sam earned her Juris Doctor, magna cum laude, at Nova Southeastern University, Shepard Broad College of Law and a Bachelor of Science at Nova Southeastern University, School of Business and Entrepreneurship. Sam has published articles in The Florida Bar Journal, Vol. 91, No. 8 and The Public Interest Journal, Vol. 5, Issue #2.',
        ],
      },
    ],
  },
  'andrew-l-myers': {
    name: 'Andrew L. Myers',
    firstName: 'Andrew',
    role: 'Senior Associate',
    image: 'andrew-l-myers.png',
    education: [
      'J.D. from Tulane University School of Law (Sports Law specialization)',
      'B.A. in Business Administration, cum laude, from University of Florida',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Andrew ("Andy") Myers is a Senior Associate Attorney whose practice focuses on corporate, estate planning, and administrative and regulatory law, with extensive experience advising clients on matters involving business formation, estate formation and protection, and strategic legal planning across various industries.',
    sections: [
      {
        title: 'Corporate Law',
        content: [
          'Andy supports clients throughout the business lifecycle \u2013 from entity formation and structuring to contract negotiation and day-to-day governance matters. He has worked with startups, small businesses, and mid-sized enterprises across industries. Andy frequently assists clients with reviewing and drafting key corporate documents such as operating agreements, shareholder agreements, and service contracts. In his corporate practice, Andy draws on experience gained from clerking with boutique law firms focused on corporate transactions and intellectual property protection, as well as his education, background, and prior roles in the business and corporate sectors. His work often centers on mitigating risk while advancing clients\u2019 strategic goals, particularly in dynamic and fast-paced business environments.',
        ],
      },
      {
        title: 'Estate Planning',
        content: [
          'Andy also provides legal assistance and counseling on estate planning matters. He assists individuals, families, and organizations with both will and trust-based planning documents, including wills, irrevocable and revocable trusts, durable powers of attorney, and healthcare directives and authorizations.',
        ],
      },
      {
        title: 'Administrative and Regulatory Law',
        content: [
          'Andy\u2019s regulatory experience includes advising clients on compliance with federal, state, and local administrative frameworks. He has supported organizations through various administrative law proceedings, including bid protests and rulemaking challenges. He has also supported large non-profit organizations across various sectors with regulatory compliance.',
        ],
      },
      {
        title: 'Sports Law and Industry Engagement',
        content: [
          'With a background in Sports Law, Andy brings specialized insight into the legal challenges facing sports organizations, athletes, and related businesses. At Tulane Law School, Andy was actively involved in the university\u2019s nationally recognized sports law program. He served as a board member and sponsorship chair for the Tulane Professional Basketball Negotiation Competition, worked as a labor and employment research assistant, and participated as a Tulane legal extern for a well-regarded law firm.',
        ],
      },
      {
        title: 'Education & Background',
        content: [
          'Andy earned his Juris Doctor from Tulane University School of Law, where he specialized in Sports Law. He also graduated cum laude from the University of Florida with a Bachelor of Arts in Business Administration, a specialization in Sports Management, and a minor in Communication Studies. During law school, Andy clerked for several boutique law firms with practice areas including corporate law, intellectual property, and sports law. He also served as an in-house legal intern with a prominent sports and entertainment company, where he supported the legal team on matters involving contracts, compliance, and brand protection.',
          'Andy has a 2-15 Life, Health, and Annuity License. He enjoys playing pickleball and traveling with his wife.',
        ],
      },
    ],
  },
  'trevor-d-scott': {
    name: 'Trevor D. Scott',
    firstName: 'Trevor',
    role: 'Senior Associate',
    image: 'trevor-d-scott.png',
    education: [
      'J.D., cum laude, from Florida State University College of Law',
      'B.A., summa cum laude, in Psychology from University of Alabama',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Trevor represents clients in administrative and regulatory matters at the federal, state, and local levels, including preparing petitions to challenge agency sanctions, advising on compliance with state healthcare and medical marijuana licensing requirements, and drafting public comments and variance applications in response to local ordinance changes.',
    sections: [
      {
        title: 'Administrative & Regulatory Law',
        content: [
          'Trevor represents clients in administrative and regulatory matters at the federal, state, and local levels, including preparing petitions to challenge agency sanctions, advising on compliance with state healthcare and medical marijuana licensing requirements, and drafting public comments and variance applications in response to local ordinance changes. He also represents clients in rulemaking disputes, including challenges to both emergency and standard rules promulgated by state agencies, and advises on strategic responses to agency rulemaking initiatives.',
          'Trevor\u2019s experience extends to delivering formal legal opinions and compliance strategies on emerging regulatory issues for clients in the healthcare, education, emergency management, and public construction sectors. Whether developing policies to align with evolving regulations, engaging with agencies to resolve compliance issues, challenging unlawful agency action, or outlining regulatory pathways for innovative business models, Trevor works closely with clients to ensure they not only meet legal requirements but also advance their operational and strategic goals.',
        ],
      },
    ],
  },
  'julia-c-marano': {
    name: 'Julia C. Marano',
    firstName: 'Julia',
    role: 'Associate',
    image: 'julia-marano.png',
    education: [
      'J.D., cum laude, from Nova Southeastern University Shepard Broad College of Law',
      'B.A., cum laude, from University of Alabama (Political Science, Minor in Business Administration)',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Julia Marano is an Associate Attorney who practices in the area of administrative and regulatory law.',
    sections: [
      {
        title: '',
        content: [
          'Julia’s practice focuses on administrative and regulatory law as well as local procurement matters. She advises clients on navigating complex government regulations and assists public and private entities in ensuring compliance with local, state, and federal procurement requirements.',
          'Julia also brings experience working with legal and policy issues affecting academic medical institutions, including matters involving regulatory compliance, institutional governance, and contracting. Her exposure to the intersection of healthcare and education adds valuable perspective to her work with clients operating in highly regulated environments.',
          'Julia earned her Juris Doctor, cum laude, from Nova Southeastern University Shepard Broad College of Law, where she served as a law clerk for Panza Maurer throughout law school. During law school, she was a board member of the Nova Trial Association where she competed in trial competitions and strengthened her advocacy skills.',
          'Julia earned her undergraduate degree, cum laude, from the University of Alabama, where she majored in Political Science and minored in Business Administration. Her academic background and professional experience reflect her ongoing commitment to public service, regulatory compliance, and effective advocacy.',
          'She is committed to helping clients understand and operate effectively within regulatory frameworks while managing risk and furthering client objectives.',
        ],
      },
    ],
  },
  'david-childs': {
    name: 'David Childs',
    firstName: 'David',
    role: 'Of Counsel Attorney',
    image: 'david-childs.png',
    education: [
      'J.D. from Florida State University College of Law (2005)',
      'B.S. in Biological Engineering from Mississippi State University (2001)',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [
      'Leadership Florida Class 35 \u2014 Graduate and General Counsel',
    ],
    intro:
      'David Childs helps clients solve government-related problems and achieve business objectives. Over 20 years, he has built expertise in water resource and energy policy, legislative appropriations, and administrative procedures.',
    sections: [
      {
        title: 'Legislative & Policy Work',
        content: [
          'David has drafted significant legislation including springs restoration (SB 1228, 2025), phosphogypsum reuse (HB 1191, 2023), essential state infrastructure (SB 7018, 2020), transmission line siting (HB 405, 2018), administrative procedures (HB 183, 2016), and water quality credit trading (HB 713, 2013). He has secured millions in appropriated funds for clients.',
          'David maintains relationships with the Florida Department of Environmental Protection and has shaped regulatory programs affecting developers, landowners, and water utilities \u2014 including potable reuse, collection system asset management, numeric nutrient criteria, and biosolids application.',
        ],
      },
      {
        title: 'Recognition',
        content: [
          "David has been appointed to the Florida Boating Advisory Council by Governors Crist and Scott. He is a Leadership Florida Class 35 graduate, a selectee for Best Lawyers in America for Environmental Law, and was named Florida Politics' Environmental Lobbyist of the Year in 2019.",
        ],
      },
    ],
  },
  'monica-rodriguez': {
    name: 'Monica Rodriguez',
    firstName: 'Monica',
    role: 'Of Counsel Attorney',
    image: 'monica-rodriquez.png',
    education: [
      'B.A. in Psychology from University of Miami',
      'M.S. in Education from University of Miami',
      'J.D., cum laude, from University of Miami',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Monica L. Rodriguez has almost two decades of legislative experience at the state and federal levels representing clients in industries such as health care and insurance, as well as non-profit entities, and local governments.',
    sections: [
      {
        title: 'Legislative Experience',
        content: [
          "Monica received recognition as one of Florida Trend Magazine's Legal Elites in 2008. She held Shareholder status at a large national law firm and served as a legislative aide to former House Speaker and current U.S. Senator Marco Rubio.",
        ],
      },
      {
        title: 'Community Leadership',
        content: [
          "Monica's civic contributions include Board service with Children's Home Society's North Central division and prior involvement with United Way's Power of the Purse and Kristi House Miami boards.",
        ],
      },
    ],
  },
  'eileen-stuart': {
    name: 'Eileen Stuart',
    firstName: 'Eileen',
    role: 'Of Counsel Attorney',
    image: 'eileen-stuart.png',
    education: [
      'J.D. from Florida State University College of Law (2006)',
      'B.A. in History and Political Science from University of Florida (2003)',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Eileen Stuart practices primarily in the areas of Agriculture, Education, Environment and Natural Resources, Healthcare, Industry and Manufacturing, State and Local Appropriations, and Technology and Cybersecurity.',
    sections: [
      {
        title: 'Government & Public Affairs',
        content: [
          'Eileen maintains a broad government and public affairs practice, emphasizing representation in the executive and legislative branches at the local, state, and federal levels. She helps businesses and highly regulated industries devise comprehensive government and public affairs strategies to navigate complex regulatory environments, obtain and maintain a license to operate, identify and secure state and federal funding or incentives, and develop or expand market share.',
          'Eileen is particularly adept at forming coalitions and garnering allies in support of policy or political objectives while formulating strategies to assist businesses in elevating or rehabilitating corporate brand and reputation.',
        ],
      },
      {
        title: 'Prior Experience',
        content: [
          "Prior to entering private practice, Eileen served as Vice President, Government and Regulatory Affairs for Mosaic, one of the world's largest manufacturers of mineral fertilizers. She developed and executed strategic government advocacy plans, particularly regarding local, state, and federal permitting, environmental, energy and tax issues.",
          'Eileen also served as Deputy Policy Director in the Executive Office of the Governor, where she developed and managed multiple policy and appropriations initiatives. Her previous professional experience also includes roles as Deputy Political Director on a statewide gubernatorial campaign, as well as serving as a Legislative Fellow in the Florida Senate and at the Florida Public Service Commission.',
        ],
      },
    ],
  },
  'brian-ballard': {
    name: 'Brian Ballard',
    firstName: 'Brian',
    role: 'Of Counsel Attorney',
    image: 'brian-ballard.png',
    education: [
      'B.S. in Business Administration, University of Florida',
      'J.D., University of Florida',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: ['University of Florida Hall of Fame'],
    intro:
      'Brian D. Ballard is the President and founder of Ballard Partners. A trusted counselor to presidential and gubernatorial candidates, as well as Fortune 100 leaders, Brian has spent his career navigating the intersection of government and business.',
    sections: [
      {
        title: 'Government & Political Leadership',
        content: [
          "Brian served as Chief of Staff in the Florida Governor's Office, where he developed environmental policy expertise and was the chief architect of Preservation 2000, then the largest public land acquisition program for environmentally sensitive areas in the U.S.",
          'He chaired Florida Finance Committees for presidential nominees McCain, Romney, and Trump, and served as Vice Chairman of the Presidential Inaugural Committee. He currently sits on the Board of Trustees for the Trump Kennedy Center.',
        ],
      },
      {
        title: 'Recognition',
        content: [
          "Brian has been featured in Vanity Fair's 'New Establishment' and Politico Playbook's '18 to Watch,' recognizing him as a top political insider and one of the most influential figures at the intersection of government and business.",
        ],
      },
    ],
  },
  'brad-burleson': {
    name: 'Brad Burleson',
    firstName: 'Brad',
    role: 'Of Counsel Attorney',
    image: 'brad-burleson.png',
    education: [
      'J.D., Washington and Lee University School of Law',
      'B.S. in Political Science, Vanderbilt University',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Brad Burleson represents clients across Florida before the legislative and executive branches of government, with a focus on transportation and infrastructure funding and policy, information technology, and tax policy and economic development.',
    sections: [
      {
        title: 'Legislative & Government Affairs',
        content: [
          "Brad helps IT companies and emerging technologies navigate Florida's regulatory framework and assists businesses on tax policy and economic development matters. He also helps clients secure federal and state appropriations.",
          'Prior to joining Ballard Partners, Brad practiced law with an emphasis on transportation and construction litigation, representing highway contractors in disputes with the Florida Department of Transportation and airport authorities.',
        ],
      },
      {
        title: 'Prior Experience',
        content: [
          'Brad previously worked as a legislative correspondent for U.S. Senator Richard Shelby and has experience drafting transportation-related legislation and agency specifications.',
        ],
      },
    ],
  },
  'jan-gorrie': {
    name: 'Jan Gorrie',
    firstName: 'Jan',
    role: 'Of Counsel Attorney',
    image: 'jan-gorrie.png',
    education: [
      'B.S. in Biology, Duke University',
      'M.P.H., University of South Florida',
      'J.D., Stetson College of Law',
    ],
    barAdmissions: ['Florida', 'Hillsborough County Bar Association'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      "Jan Gorrie brings over 20 years of government affairs experience, specializing in healthcare law and policy. She has extensively lobbied Florida's Legislature and Executive Branch on behalf of hospital systems, medical colleges, insurance companies, and economic development organizations.",
    sections: [
      {
        title: 'Healthcare Law & Policy',
        content: [
          "Jan's work has focused on Medicaid reimbursement, healthcare access, and physician and hospital compensation. As a recognized transactional and administrative healthcare attorney, she regularly testifies before Florida's Agency for Health Care Administration and Department of Health on licensure, reimbursement, and provider matters.",
        ],
      },
    ],
  },
  'adrian-lukis': {
    name: 'Adrian Lukis',
    firstName: 'Adrian',
    role: 'Of Counsel Attorney',
    image: 'adrian-lukis.png',
    education: [
      'B.A. from Florida State University',
      'J.D. from Florida State University College of Law',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Adrian Lukis brings extensive experience in Florida government and political advisory work. Most notably, he served as Chief of Staff to Governor Ron DeSantis, where he managed the Executive Office and oversaw executive branch agencies during significant challenges including the Surfside building collapse and the COVID-19 Delta surge.',
    sections: [
      {
        title: 'Government Leadership',
        content: [
          'Prior to serving as Chief of Staff, Adrian held the role of Deputy Chief of Staff, supervising multiple state entities across health care, emergency management, environmental protection, economic development, and professional regulation.',
          "His earlier career included work as a business law attorney specializing in mergers and acquisitions, plus roles with the Florida House of Representatives, the Republican Party of Florida, and Speaker Jose Oliva's office.",
        ],
      },
    ],
  },
  'syl-luks': {
    name: 'Syl Luks',
    firstName: 'Syl',
    role: 'Of Counsel Attorney',
    image: 'syl-luks.png',
    education: [],
    barAdmissions: ['District of Columbia'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Sylvester Lukis brings over 40 years of experience in Florida, national, and international policy and politics. As Senior Partner at Ballard Partners, he collaborates closely with firm founder Brian Ballard on strategic expansion across major U.S. markets and international locations.',
    sections: [
      {
        title: 'Federal Government Relations',
        content: [
          "Syl's practice focuses on U.S. government relations for foreign governments and private entities, emphasizing health care, immigration, trade, tariffs, and tax matters before the legislative and executive branches. He has represented clients before major federal departments including HHS, Justice, State, Transportation, Commerce, Treasury, Interior, and Homeland Security, as well as the Office of the U.S. Trade Representative.",
        ],
      },
      {
        title: 'Prior Government Service',
        content: [
          "Syl's prior government service includes roles as Special Assistant to the General Counsel at HHS, Special Assistant U.S. Attorney in Washington D.C., and Assistant Director of a federal interagency task force at the State Department during the Mariel Boatlift. He served in the United States Air Force.",
        ],
      },
    ],
  },
  'abby-vail': {
    name: 'Abby Vail',
    firstName: 'Abby',
    role: 'Of Counsel Attorney',
    image: 'abby-vail.png',
    education: [
      'B.S. in Communications, Florida State University',
      'M.B.A., Florida State University',
      'J.D., Florida State University',
    ],
    barAdmissions: ['Florida'],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Abby Vail has over 15 years of government affairs experience, providing political, strategic, and policy direction to clients before the legislative and executive branches of government. Her practice focuses on representing financial services clients in insurance, banking, consumer finance, securities, and fintech sectors.',
    sections: [
      {
        title: 'Government Affairs',
        content: [
          'Most recently, Abby served as Chief of Staff of the Florida Office of Financial Regulation, contributing to the Financial Technology Regulatory Sandbox passage and development. Previously, she held positions as Vice President of External Affairs for an international healthcare company and Senior Cabinet Aide to former Florida Chief Financial Officer Jeff Atwater.',
          'She began her career at the Office of Insurance Regulation during significant property and casualty insurance reform following the 2004–2005 hurricane seasons.',
        ],
      },
    ],
  },
  'sandra-harris': {
    name: 'Sandra Harris',
    firstName: 'Sandra',
    role: 'Executive Vice President of Government Affairs',
    image: 'sandra-harris.png',
    education: [],
    barAdmissions: [],
    courtAdmissions: [],
    professionalMemberships: [],
    intro:
      'Sandra Harris is a government relations professional at Panza Maurer, bringing extensive experience in legislative advocacy and public affairs.',
    sections: [],
  },
};

export function generateStaticParams() {
  return Object.keys(attorneyData).map((slug) => ({ slug }));
}

export default async function AttorneyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const attorney = attorneyData[slug];

  if (!attorney) {
    notFound();
  }

  return (
    <div className='flex min-h-screen flex-col items-center'>
      <Navbar />
      <main className='w-full pt-[145px] lg:pt-[109px]'>
        {/* Profile Hero */}
        <section
          className='relative w-full overflow-hidden'
          style={{
            background:
              'linear-gradient(-57.8deg, rgba(100,116,139,0) 57.5%, rgba(0,105,255,0.1) 103.2%), linear-gradient(90deg, rgba(255,255,255,0) 20.3%, rgba(255,255,255,0.7) 85.8%), linear-gradient(90deg, rgba(229,233,241,0.8) 0%, rgba(229,233,241,0.8) 100%), linear-gradient(90deg, #f3f4f6 0%, #f3f4f6 100%)',
          }}
        >
          <div className='mx-auto flex max-w-[1440px] flex-col items-center px-6 pb-0 pt-16 sm:px-8 lg:flex-row lg:items-end lg:px-28'>
            <div className='flex flex-1 flex-col gap-2 pb-6 text-center lg:pb-12 lg:text-left'>
              <Image
                src='/images/underline-1.svg'
                alt=''
                width={80}
                height={4}
                className='lg:mx-0'
              />
              <span className='font-[family-name:var(--font-inter)] text-sm font-semibold uppercase tracking-[3px] text-slate-500'>
                Profile
              </span>
              <h1 className='font-[family-name:var(--font-hanken)] text-3xl font-semibold text-slate-800 sm:text-4xl lg:text-[52px] lg:leading-[1.3]'>
                {attorney.name}
              </h1>
              <p className='font-[family-name:var(--font-noto)] text-lg text-slate-500'>
                {attorney.role}
              </p>
            </div>
            {/* Mobile profile image — below name, above breadcrumbs */}
            <div className='relative mb-0 h-[250px] w-[220px] flex-shrink-0 lg:hidden'>
              <Image
                src={`/images/attorneys/${attorney.image}`}
                alt={attorney.name}
                fill
                className='rounded-t-xl object-cover object-top'
              />
            </div>
            {/* Desktop profile image */}
            <div className='relative hidden h-[280px] w-[240px] flex-shrink-0 lg:block'>
              <Image
                src={`/images/attorneys/${attorney.image}`}
                alt={attorney.name}
                fill
                className='rounded-t-xl object-cover object-top'
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <section className='w-full bg-white py-16'>
          <div className='mx-auto flex max-w-[1440px] flex-col gap-12 px-8 lg:flex-row lg:gap-20 lg:px-28'>
            {/* Left: Bio */}
            <div className='flex-1'>
              <h2 className='mb-8 font-[family-name:var(--font-hanken)] text-3xl font-semibold text-gray-900 lg:text-[36px]'>
                About {attorney.firstName}
              </h2>

              <div className='font-[family-name:var(--font-noto)] text-base leading-7 text-gray-700'>
                {/* Intro paragraph */}
                <p className='mb-6 text-justify'>{attorney.intro}</p>

                {attorney.sections.map((section) => (
                  <div key={section.title} className='mb-8'>
                    <h3 className='mb-4 font-[family-name:var(--font-noto)] text-xl font-bold text-gray-900'>
                      {section.title}
                    </h3>
                    {section.content.map((paragraph, i) => (
                      <p key={i} className='mb-4 text-justify'>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className='w-full flex-shrink-0 lg:sticky lg:top-[130px] lg:w-[340px] lg:self-start'>
              <div className='flex flex-col gap-6'>
                {/* Credentials Header */}
                <div>
                  <h3 className='font-[family-name:var(--font-noto)] text-lg font-bold text-gray-900'>
                    Credentials
                  </h3>
                  <div className='mt-2 h-[3px] w-10 bg-primary-red' />
                </div>

                {/* Education */}
                {attorney.education.length > 0 && (
                  <div>
                    <h4 className='mb-2 font-[family-name:var(--font-noto)] text-sm font-bold text-gray-900'>
                      Education
                    </h4>
                    <ul className='flex flex-col gap-1'>
                      {attorney.education.map((item) => (
                        <li
                          key={item}
                          className='flex items-start gap-2 font-[family-name:var(--font-noto)] text-sm text-gray-600'
                        >
                          <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bar Admissions */}
                {attorney.barAdmissions.length > 0 && (
                  <div>
                    <h4 className='mb-2 font-[family-name:var(--font-noto)] text-sm font-bold text-gray-900'>
                      Bar Admissions
                    </h4>
                    <ul className='flex flex-col gap-1'>
                      {attorney.barAdmissions.map((item) => (
                        <li
                          key={item}
                          className='flex items-start gap-2 font-[family-name:var(--font-noto)] text-sm text-gray-600'
                        >
                          <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Court Admissions */}
                {attorney.courtAdmissions.length > 0 && (
                  <div>
                    <h4 className='mb-2 font-[family-name:var(--font-noto)] text-sm font-bold text-gray-900'>
                      Court Admissions
                    </h4>
                    <ul className='flex flex-col gap-1'>
                      {attorney.courtAdmissions.map((item) => (
                        <li
                          key={item}
                          className='flex items-start gap-2 font-[family-name:var(--font-noto)] text-sm text-gray-600'
                        >
                          <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400' />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Professional Memberships */}
                {attorney.professionalMemberships.length > 0 && (
                <div>
                  <h4 className='mb-2 font-[family-name:var(--font-noto)] text-sm font-bold text-gray-900'>
                    Professional Memberships and Associations
                  </h4>
                  <ul className='flex flex-col gap-1'>
                    {attorney.professionalMemberships.map((item) => (
                      <li
                        key={item}
                        className='flex items-start gap-2 font-[family-name:var(--font-noto)] text-sm text-gray-600'
                      >
                        <span className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400' />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
