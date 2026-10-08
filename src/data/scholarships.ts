import { Scholarship, ScholarshipFilters } from '../types';

export const SCHOLARSHIPS_DATA: Scholarship[] = [
  {
    id: 'sch-google-wtm',
    title: 'Google India Women Techmakers Scholarship',
    providerId: 'prov-1',
    providerName: 'Google India',
    providerLogo: '🌐',
    description: 'Empowers women pursuing computer science with financial assistance and mentorship from Google engineers.',
    amount: 74000,
    amountFormatted: '₹74,000',
    educationLevel: ['Undergraduate', 'Postgraduate'],
    courses: ['Computer Science', 'Information Technology', 'Software Engineering', 'STEM'],
    states: ['All India', 'Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu', 'Telangana'],
    category: 'Private',
    minimumScore: 70,
    eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS'],
    eligibleGender: 'Female',
    deadline: '2026-08-30',
    deadlineDisplay: '30 Aug',
    daysLeftText: 'Closed',
    isClosed: true,
    applicationUrl: 'https://buildyourfuture.withgoogle.com/scholarships',
    eligibility: 'Must identify as female, currently enrolled in full-time CS or STEM degree, strong academic standing and leadership demonstration.',
    benefits: [
      '₹74,000 direct grant towards college tuition or technology tooling',
      'Direct 1-on-1 mentorship with Google tech leaders',
      'Invitation to the Google Scholars Retreat',
      'Global network of women technologists and alumni',
    ],
    requiredDocuments: [
      'Current semester official academic transcript',
      'Technical Resume/CV highlighting open-source or academic projects',
      'Short essay on community contribution to women in technology',
      'Letter of recommendation from academic professor',
    ],
    selectionProcess: [
      'Round 1: Academic merit and resume review',
      'Round 2: Evaluation of technical leadership essay',
      'Round 3: Virtual interview with Google panel',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-06-01',
  },
  {
    id: 'sch-maulana-azad',
    title: 'Maulana Azad National Scholarship',
    providerId: 'prov-2',
    providerName: 'Ministry of Minority Affairs',
    providerLogo: '🏛️',
    description: 'Financial assistance to meritorious girl students belonging to national minority communities to pursue higher education.',
    amount: 12000,
    amountFormatted: '₹12,000',
    educationLevel: ['Class 11-12', 'Diploma', 'Undergraduate'],
    courses: ['Arts', 'Science', 'Commerce', 'Engineering', 'Medical'],
    states: ['All India'],
    category: 'Government',
    maximumIncome: 200000,
    minimumScore: 55,
    eligibleCategories: ['Minority'],
    eligibleGender: 'Female',
    deadline: '2026-09-25',
    deadlineDisplay: '25 Sept',
    daysLeftText: 'Closed',
    isClosed: true,
    applicationUrl: 'https://scholarships.gov.in',
    eligibility: 'Meritorious girl students belonging to Muslim, Christian, Jain, Buddhist, Sikh, Parsi communities with family income below ₹2 Lakhs.',
    benefits: [
      '₹12,000 per academic year for course fees and textbooks',
      'Direct Benefit Transfer (DBT) directly into student bank account',
      'Renewable annually until degree completion',
    ],
    requiredDocuments: [
      'Minority Community Certificate / Self Declaration',
      'Income certificate issued by competent authority (< ₹2,00,000)',
      'Marksheet of qualifying previous exam (>55% marks)',
      'Institute Bonafide Certificate with principal seal',
      'Aadhaar seeded bank account passbook copy',
    ],
    selectionProcess: [
      'Online application submission on National Scholarship Portal',
      'School/College institutional nodal officer verification',
      'State clearance and direct DBT disbursement',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-05-15',
  },
  {
    id: 'sch-reliance-foundation',
    title: 'Reliance Foundation Undergraduate Scholarship',
    providerId: 'prov-3',
    providerName: 'Reliance Foundation',
    providerLogo: '🔷',
    description: 'Up to ₹2,00,000 for the entire UG programme. Awarded to 5,000 meritorious students across India.',
    amount: 200000,
    amountFormatted: '₹2,00,000',
    educationLevel: ['Undergraduate'],
    courses: ['Engineering', 'Computer Science', 'Commerce', 'Medicine', 'Law', 'Arts'],
    states: ['All India'],
    category: 'CSR',
    maximumIncome: 1500000,
    minimumScore: 60,
    eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS'],
    eligibleGender: 'All',
    deadline: '2026-09-30',
    deadlineDisplay: '30 Sept',
    daysLeftText: 'Closed',
    isClosed: true,
    applicationUrl: 'https://www.scholarships.reliancefoundation.org',
    eligibility: 'First-year undergraduate students enrolled in a recognized regular full-time degree program in India with Class 12 score above 60%.',
    benefits: [
      'Up to ₹2,00,000 scholarship grant over the course of study',
      'Access to Reliance Scholars networking and thought leadership seminars',
      'Leadership retreats and career development bootcamps',
    ],
    requiredDocuments: [
      'Class 12th board marksheet',
      'College admission allotment proof and fee receipt',
      'Income proof (ITR / Form 16 / Tehsildar certificate)',
      'Aadhaar card copy',
    ],
    selectionProcess: [
      'Online application and preliminary eligibility screening',
      'Mandatory 60-minute aptitude test (verbal, numerical, logic)',
      'Merit-cum-means final scholarship ranking list',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-06-20',
  },
  {
    id: 'sch-hdfc-badhte-kadam',
    title: 'HDFC Badhte Kadam Scholarship',
    providerId: 'prov-4',
    providerName: 'HDFC Bank Parivartan',
    providerLogo: '🏦',
    description: 'Supports high-potential students from underprivileged backgrounds who faced hardship or parent loss.',
    amount: 100000,
    amountFormatted: '₹1,00,000',
    educationLevel: ['Class 11-12', 'Undergraduate', 'Postgraduate', 'Diploma'],
    courses: ['Engineering', 'Medicine', 'Commerce', 'Science', 'Arts'],
    states: ['All India'],
    category: 'CSR',
    maximumIncome: 600000,
    minimumScore: 60,
    eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS'],
    eligibleGender: 'All',
    deadline: '2026-10-31',
    deadlineDisplay: '31 Oct',
    daysLeftText: '34 days left',
    isClosed: false,
    applicationUrl: 'https://www.hdfcbank.com/parivartan',
    eligibility: 'Students pursuing general/professional undergraduate or postgraduate degrees with family income under ₹6,00,000 and minimum 60% marks.',
    benefits: [
      'Financial aid from ₹30,000 up to ₹1,00,000 per academic year',
      'Mentorship by HDFC corporate leaders',
      'Work readiness training modules',
    ],
    requiredDocuments: [
      'Previous year marksheets (minimum 60%)',
      'Family income proof from competent revenue authority',
      'Current college admission receipt',
      'Aadhaar card and bank account details',
    ],
    selectionProcess: [
      'Document screening based on financial distress and merit',
      'Telephonic background check and interview',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-07-01',
  },
  {
    id: 'sch-aicte-pragati',
    title: 'AICTE Pragati Scholarship for Girls',
    providerId: 'prov-5',
    providerName: 'AICTE (Ministry of Education)',
    providerLogo: '🇮🇳',
    description: 'Central Government scheme to assist girl students pursuing technical diploma and degree programs across approved colleges.',
    amount: 50000,
    amountFormatted: '₹50,000',
    educationLevel: ['Undergraduate', 'Diploma'],
    courses: ['Engineering', 'Technology', 'Architecture', 'Pharmacy', 'Polytechnic'],
    states: ['All India'],
    category: 'Government',
    maximumIncome: 800000,
    eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS'],
    eligibleGender: 'Female',
    deadline: '2026-10-15',
    deadlineDisplay: '15 Oct',
    daysLeftText: '18 days left',
    isClosed: false,
    applicationUrl: 'https://scholarships.gov.in',
    eligibility: 'Female candidates admitted to 1st year of technical degree/diploma or 2nd year lateral entry with annual income < ₹8,00,000.',
    benefits: [
      '₹50,000 per annum towards college fee, computer, books & equipment purchase',
      'Valid for full 4-year degree or 3-year diploma duration',
    ],
    requiredDocuments: [
      'Centralized Admission Process (CAP) allotment letter',
      'Class 10 and 12 marksheets',
      'State revenue authority Income Certificate',
      'Institute Bonafide Certificate on letterhead',
      'Aadhaar seeded bank account passbook',
    ],
    selectionProcess: [
      'Online application via National Scholarship Portal (NSP)',
      'Institute Nodal Officer clearance',
      'Direct State & Central AICTE validation and DBT release',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-06-10',
  },
  {
    id: 'sch-tata-trusts-med',
    title: 'Tata Trusts Medical & Healthcare Scholarship',
    providerId: 'prov-6',
    providerName: 'Tata Trusts',
    providerLogo: '🏥',
    description: 'Tuition support grants for students pursuing MBBS, BDS, Nursing and allied healthcare programs across recognized medical colleges.',
    amount: 150000,
    amountFormatted: '₹1,50,000',
    educationLevel: ['Undergraduate', 'Postgraduate'],
    courses: ['Medicine', 'MBBS', 'BDS', 'Nursing', 'Pharmacy'],
    states: ['All India'],
    category: 'NGO',
    maximumIncome: 500000,
    minimumScore: 65,
    eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS'],
    eligibleGender: 'All',
    deadline: '2026-11-15',
    deadlineDisplay: '15 Nov',
    daysLeftText: '49 days left',
    isClosed: false,
    applicationUrl: 'https://www.tatatrusts.org',
    eligibility: 'Undergraduate or PG medical students enrolled in recognized government or private medical colleges with solid academic merit.',
    benefits: [
      'Up to ₹1,50,000 direct tuition fee waiver',
      'Eligibility for clinical research fellowship opportunities',
    ],
    requiredDocuments: [
      'NEET scorecard and admission rank allotment letter',
      'Previous academic marksheets',
      'Income certificate and college fee structure quote',
    ],
    selectionProcess: [
      'NEET merit ranking and economic assessment',
      'Virtual panel interview with Tata Trusts Medical Board',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-07-15',
  },
  {
    id: 'sch-santoor-women',
    title: 'Santoor Women’s Scholarship',
    providerId: 'prov-7',
    providerName: 'Wipro Cares & Santoor',
    providerLogo: '🌸',
    description: 'Financial aid program for young women from rural areas pursuing undergraduate degrees in Humanities, Sciences or Commerce.',
    amount: 24000,
    amountFormatted: '₹24,000',
    educationLevel: ['Undergraduate'],
    courses: ['Arts', 'Science', 'Commerce', 'Humanities'],
    states: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Chhattisgarh'],
    category: 'CSR',
    minimumScore: 60,
    eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS'],
    eligibleGender: 'Female',
    deadline: '2026-10-20',
    deadlineDisplay: '20 Oct',
    daysLeftText: '23 days left',
    isClosed: false,
    applicationUrl: 'https://www.santoorscholarship.com',
    eligibility: 'Women from rural backgrounds in specified states who studied in government school and enrolled in full-time degree.',
    benefits: [
      '₹24,000 per annum till degree completion',
      'Career counseling and soft skills workshops',
    ],
    requiredDocuments: [
      'Class 10 and 12 certificates from government school',
      'College ID & admission proof',
      'Aadhaar card copy',
    ],
    selectionProcess: [
      'Application verification and rural schooling check',
      'Direct fund disbursement',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-06-18',
  },
  {
    id: 'sch-ongc-merit',
    title: 'ONGC Merit Scholarship for SC/ST/OBC Students',
    providerId: 'prov-8',
    providerName: 'ONGC Foundation',
    providerLogo: '⚡',
    description: 'Annual scholarship for meritorious SC, ST and OBC students studying Engineering, MBBS, Geology or MBA.',
    amount: 48000,
    amountFormatted: '₹48,000',
    educationLevel: ['Undergraduate', 'Postgraduate'],
    courses: ['Engineering', 'MBBS', 'MBA', 'Geology', 'Geophysics'],
    states: ['All India'],
    category: 'Government',
    maximumIncome: 450000,
    minimumScore: 60,
    eligibleCategories: ['SC', 'ST', 'OBC'],
    eligibleGender: 'All',
    deadline: '2026-11-30',
    deadlineDisplay: '30 Nov',
    daysLeftText: '64 days left',
    isClosed: false,
    applicationUrl: 'https://ongcscholar.org',
    eligibility: 'SC, ST or OBC students enrolled in 1st year of professional technical courses with family income below ₹4.5 Lakhs.',
    benefits: [
      '₹48,000 per annum (₹4,000 per month) for course duration',
      '50% quota reserved for female candidates',
    ],
    requiredDocuments: [
      'Caste certificate issued by Sub-Divisional Magistrate',
      'Income certificate and JEE/NEET scorecard',
      'Bank passbook linked with Aadhaar',
    ],
    selectionProcess: [
      'Online application and merit ranking by ONGC Foundation',
      'Document verification at nearest ONGC operational base',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-07-20',
  },
  {
    id: 'sch-loreal-stem',
    title: 'L’Oréal India For Young Women in Science',
    providerId: 'prov-9',
    providerName: 'L’Oréal India',
    providerLogo: '🔬',
    description: 'Awards up to ₹2,50,000 to promising young women pursuing pure sciences, biotechnology, engineering, or medical sciences.',
    amount: 250000,
    amountFormatted: '₹2,50,000',
    educationLevel: ['Undergraduate'],
    courses: ['Pure Sciences', 'Biotechnology', 'Engineering', 'Medicine', 'Chemistry'],
    states: ['All India'],
    category: 'Private',
    maximumIncome: 600000,
    minimumScore: 85,
    eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS'],
    eligibleGender: 'Female',
    deadline: '2026-10-05',
    deadlineDisplay: '05 Oct',
    daysLeftText: '8 days left',
    isClosed: false,
    applicationUrl: 'https://www.loreal.com/en/india',
    eligibility: 'Girl students who passed Class 12 with at least 85% in PCB/PCM and enrolled in a science-related UG degree.',
    benefits: [
      'Up to ₹2,50,000 covering tuition, lab fees, and textbooks',
      'Mentorship by top Indian women scientists',
    ],
    requiredDocuments: [
      'Class 10 and 12 marksheets with >=85% score in science subjects',
      'College admission proof and income certificate',
      'Statement of purpose on scientific passion',
    ],
    selectionProcess: [
      'Application and academic merit shortlisting',
      'Interview with jury of senior scientists',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-06-25',
  },
  {
    id: 'sch-colgate-smiling',
    title: 'Keep India Smiling Foundational Scholarship',
    providerId: 'prov-10',
    providerName: 'Colgate-Palmolive India',
    providerLogo: '✨',
    description: 'Supports deserving individuals from low-income households in completing vocational or undergraduate studies.',
    amount: 75000,
    amountFormatted: '₹75,000',
    educationLevel: ['Class 11-12', 'Diploma', 'Undergraduate'],
    courses: ['Commerce', 'Science', 'Arts', 'Vocational', 'Sports'],
    states: ['All India'],
    category: 'CSR',
    maximumIncome: 500000,
    minimumScore: 60,
    eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS'],
    eligibleGender: 'All',
    deadline: '2026-11-20',
    deadlineDisplay: '20 Nov',
    daysLeftText: '54 days left',
    isClosed: false,
    applicationUrl: 'https://www.colgate.com/en-in',
    eligibility: 'Deserving students with family income under ₹5 Lakhs, enrolled in school, vocational, or undergraduate programs.',
    benefits: [
      'Up to ₹75,000 per year towards tuition and study supplies',
      'Career mentorship by Colgate executives',
    ],
    requiredDocuments: [
      'Previous year marksheet (at least 60%)',
      'Income proof from municipal/Panchayat authority',
      'Fee receipt and ID proof',
    ],
    selectionProcess: [
      'Academic and financial assessment',
      'Telephonic evaluation',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-07-05',
  },
  {
    id: 'sch-post-matric-minority',
    title: 'Post Matric Scholarships Scheme for Minorities',
    providerId: 'prov-2',
    providerName: 'Ministry of Minority Affairs',
    providerLogo: '🏛️',
    description: 'Centrally sponsored scholarship scheme encouraging minority students to pursue higher education from Class 11th to PhD.',
    amount: 10000,
    amountFormatted: '₹10,000',
    educationLevel: ['Class 11-12', 'Undergraduate', 'Postgraduate', 'PhD'],
    courses: ['Arts', 'Science', 'Commerce', 'Technical', 'Professional'],
    states: ['All India'],
    category: 'Government',
    maximumIncome: 200000,
    minimumScore: 50,
    eligibleCategories: ['Minority'],
    eligibleGender: 'All',
    deadline: '2026-10-31',
    deadlineDisplay: '31 Oct',
    daysLeftText: '34 days left',
    isClosed: false,
    applicationUrl: 'https://scholarships.gov.in',
    eligibility: 'Minority students with family income below ₹2 Lakhs and at least 50% marks in the last examination.',
    benefits: [
      'Admission and course fee reimbursement up to ₹10,000/year',
      'Monthly maintenance allowance directly via DBT',
    ],
    requiredDocuments: [
      'Self-declaration of minority community',
      'Income certificate from Tehsildar or SDM',
      'Previous marksheet with >=50% marks',
      'Aadhaar seeded bank passbook',
    ],
    selectionProcess: [
      'Application on National Scholarship Portal',
      'School/College verification and State nodal clearance',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-06-15',
  },
  {
    id: 'sch-aditya-birla-need',
    title: 'Aditya Birla Capital COVID & Need Scholarship',
    providerId: 'prov-4',
    providerName: 'Aditya Birla Capital Foundation',
    providerLogo: '🏢',
    description: 'Financial assistance for professional undergraduate students facing severe socio-economic distress to prevent dropouts.',
    amount: 60000,
    amountFormatted: '₹60,000',
    educationLevel: ['Undergraduate'],
    courses: ['Engineering', 'Medicine', 'Commerce', 'Law', 'Science'],
    states: ['All India'],
    category: 'CSR',
    maximumIncome: 600000,
    minimumScore: 60,
    eligibleCategories: ['General', 'OBC', 'SC', 'ST', 'Minority', 'EWS'],
    eligibleGender: 'All',
    deadline: '2026-10-28',
    deadlineDisplay: '28 Oct',
    daysLeftText: '31 days left',
    isClosed: false,
    applicationUrl: 'https://www.adityabirlacapital.com',
    eligibility: 'Students pursuing professional degrees with household financial distress.',
    benefits: [
      '₹60,000 one-time annual financial grant',
      'Financial literacy and guidance webinars',
    ],
    requiredDocuments: [
      'Marksheet of qualifying exam',
      'Government income certificate',
      'College fee receipt',
    ],
    selectionProcess: [
      'Evaluation of hardship proof and academic continuity',
      'Disbursement to institution account',
    ],
    verified: true,
    status: 'published',
    createdAt: '2026-07-10',
  },
];

// Helper to filter scholarships on client or server identically
export function filterScholarships(
  list: Scholarship[],
  params: Partial<ScholarshipFilters> & { page?: number; limit?: number }
) {
  let result = [...list].filter((s) => s.status !== 'archived');

  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    result = result.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.providerName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.courses.some((c) => c.toLowerCase().includes(q)) ||
        s.states.some((st) => st.toLowerCase().includes(q))
    );
  }

  if (params.educationLevel && params.educationLevel !== 'All') {
    result = result.filter((s) =>
      s.educationLevel.some((lvl) => lvl.toLowerCase() === params.educationLevel!.toLowerCase())
    );
  }

  if (params.course && params.course !== 'All') {
    result = result.filter((s) =>
      s.courses.some((c) => c.toLowerCase().includes(params.course!.toLowerCase()))
    );
  }

  if (params.state && params.state !== 'All') {
    result = result.filter(
      (s) =>
        s.states.includes('All India') ||
        s.states.some((st) => st.toLowerCase() === params.state!.toLowerCase())
    );
  }

  if (params.category && params.category !== 'All') {
    result = result.filter((s) => s.category.toLowerCase() === params.category!.toLowerCase());
  }

  if (params.gender && params.gender !== 'All') {
    result = result.filter(
      (s) => s.eligibleGender === 'All' || s.eligibleGender.toLowerCase() === params.gender!.toLowerCase()
    );
  }

  if (params.annualIncomeLimit && params.annualIncomeLimit > 0) {
    result = result.filter(
      (s) => !s.maximumIncome || params.annualIncomeLimit! <= s.maximumIncome
    );
  }

  if (params.minAcademicScore && params.minAcademicScore > 0) {
    result = result.filter(
      (s) => !s.minimumScore || params.minAcademicScore! >= s.minimumScore
    );
  }

  if (params.maxAmount && params.maxAmount > 0) {
    result = result.filter((s) => s.amount <= params.maxAmount!);
  }

  if (params.provider && params.provider !== 'All') {
    result = result.filter(
      (s) =>
        s.providerName.toLowerCase().includes(params.provider!.toLowerCase()) ||
        s.providerId === params.provider
    );
  }

  if (params.deadlineFilter === 'open') {
    result = result.filter((s) => !s.isClosed);
  } else if (params.deadlineFilter === 'closed') {
    result = result.filter((s) => s.isClosed);
  }

  if (params.sortBy === 'highest-amount') {
    result.sort((a, b) => b.amount - a.amount);
  } else if (params.sortBy === 'deadline') {
    result.sort((a, b) => a.deadline.localeCompare(b.deadline));
  } else if (params.sortBy === 'recently-added') {
    result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  } else {
    result.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
  }

  const page = params.page || 1;
  const limit = params.limit || 12;
  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const paginated = result.slice((page - 1) * limit, page * limit);

  return {
    scholarships: paginated,
    total,
    page,
    totalPages,
  };
}

export type { Scholarship };
