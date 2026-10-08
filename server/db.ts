import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import type {
  Scholarship,
  Provider,
  User,
  UserRole,
  StudentProfile,
  Application,
  MatchStepData,
  MatchResultItem,
  MatchScoreBreakdown,
  OTPPurpose,
} from '../src/types/index.ts';

export interface DBUser extends User {
  passwordHash: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DBOTP {
  id: string;
  userId?: string;
  email: string;
  otpHash: string;
  purpose: OTPPurpose;
  expiresAt: number; // ms
  attempts: number;
  usedAt?: number | null;
  createdAt: number; // ms
}

export interface DBSession {
  id: string;
  userId: string;
  expiresAt: number; // ms
  createdAt: number; // ms
}

const OTP_PEPPER = process.env.OTP_SECRET || 'scholarship_finder_otp_salt_2026';

// In-Memory Database store with rich seed data matching Indian EdTech domain
class DatabaseStore {
  public users: DBUser[] = [
    {
      id: 'usr-student-1',
      name: 'Sujan Bhosale',
      email: 'sujanbhosale94@gmail.com',
      passwordHash: bcrypt.hashSync('student@2026', 10),
      role: 'student',
      emailVerified: true,
      createdAt: '2026-08-01T10:00:00Z',
      updatedAt: '2026-08-01T10:00:00Z',
    },
    {
      id: 'usr-admin-1',
      name: 'Administrator',
      email: 'admin@scholarshipfinder.com',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      emailVerified: true,
      createdAt: '2026-07-01T08:00:00Z',
      updatedAt: '2026-07-01T08:00:00Z',
    },
    {
      id: 'usr-admin-2',
      name: 'System Administrator',
      email: 'admin@scholarshipfinder.edu',
      passwordHash: bcrypt.hashSync('admin123', 10),
      role: 'admin',
      emailVerified: true,
      createdAt: '2026-07-01T08:00:00Z',
      updatedAt: '2026-07-01T08:00:00Z',
    },
  ];

  public otps: DBOTP[] = [];
  public sessions: Map<string, DBSession> = new Map();

  public studentSubmissions: any[] = [
    {
      id: 'sub-101',
      name: 'Sujan Bhosale',
      email: 'sujanbhosale94@gmail.com',
      phone: '+91 98231 45678',
      age: 20,
      state: 'Maharashtra',
      city: 'Pune',
      education_level: 'Undergraduate',
      institution: 'Pune Institute of Computer Technology (PICT)',
      course: 'B.E. Computer Engineering',
      year: '2nd Year',
      academic_score: 84.5,
      annual_income: 350000,
      category: 'General',
      gender: 'Male',
      disability_status: false,
      preferences: {
        preferredCategory: 'CSR',
        preferredState: 'Maharashtra',
        preferredCourse: 'Computer Engineering',
        minimumFinancialRequirement: 50000,
      },
      matched_scholarships_count: 5,
      status: 'Verified',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'sub-102',
      name: 'Pooja Deshmukh',
      email: 'pooja.deshmukh@coep.ac.in',
      phone: '+91 97654 32109',
      age: 19,
      state: 'Maharashtra',
      city: 'Pune',
      education_level: 'Undergraduate',
      institution: 'College of Engineering Pune (COEP)',
      course: 'B.Tech Information Technology',
      year: '2nd Year',
      academic_score: 92.4,
      annual_income: 240000,
      category: 'OBC',
      gender: 'Female',
      disability_status: false,
      preferences: {
        preferredCategory: 'All',
        preferredState: 'Maharashtra',
        preferredCourse: 'Information Technology',
        minimumFinancialRequirement: 75000,
      },
      matched_scholarships_count: 8,
      status: 'Under Review',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'sub-103',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@nitk.edu.in',
      phone: '+91 94123 78901',
      age: 21,
      state: 'Karnataka',
      city: 'Mangaluru',
      education_level: 'Undergraduate',
      institution: 'National Institute of Technology Karnataka (NITK)',
      course: 'B.Tech Mechanical Engineering',
      year: '3rd Year',
      academic_score: 87.0,
      annual_income: 180000,
      category: 'EWS',
      gender: 'Male',
      disability_status: false,
      preferences: {
        preferredCategory: 'Government',
        preferredState: 'Karnataka',
        preferredCourse: 'Mechanical Engineering',
        minimumFinancialRequirement: 50000,
      },
      matched_scholarships_count: 6,
      status: 'New Submission',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'sub-104',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@iitm.ac.in',
      phone: '+91 98401 23456',
      age: 22,
      state: 'Tamil Nadu',
      city: 'Chennai',
      education_level: 'Postgraduate',
      institution: 'IIT Madras',
      course: 'M.Tech Data Science & AI',
      year: '1st Year',
      academic_score: 94.8,
      annual_income: 420000,
      category: 'General',
      gender: 'Female',
      disability_status: false,
      preferences: {
        preferredCategory: 'Private',
        preferredState: 'Tamil Nadu',
        preferredCourse: 'Data Science',
        minimumFinancialRequirement: 100000,
      },
      matched_scholarships_count: 7,
      status: 'Verified',
      created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    },
    {
      id: 'sub-105',
      name: 'Rahul K. Meena',
      email: 'rahul.meena@du.ac.in',
      phone: '+91 98112 34567',
      age: 18,
      state: 'Delhi',
      city: 'New Delhi',
      education_level: 'Undergraduate',
      institution: 'Delhi University - Hansraj College',
      course: 'B.Sc Physics Honours',
      year: '1st Year',
      academic_score: 81.2,
      annual_income: 120000,
      category: 'ST',
      gender: 'Male',
      disability_status: false,
      preferences: {
        preferredCategory: 'Government',
        preferredState: 'Delhi',
        preferredCourse: 'Physics',
        minimumFinancialRequirement: 30000,
      },
      matched_scholarships_count: 9,
      status: 'New Submission',
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ];

  public studentProfiles: Map<string, StudentProfile> = new Map([
    [
      'usr-student-1',
      {
        userId: 'usr-student-1',
        educationLevel: 'Undergraduate',
        institution: 'Pune Institute of Computer Technology',
        course: 'Computer Engineering',
        year: '2nd Year',
        state: 'Maharashtra',
        city: 'Pune',
        category: 'General',
        gender: 'Male',
        annualIncome: 350000,
        academicScore: 84.5,
        disabilityStatus: false,
        preferences: {
          scholarshipType: 'CSR',
          preferredState: 'Maharashtra',
          preferredCourse: 'Computer Engineering',
          minimumRequirement: 50000,
        },
      },
    ],
  ]);

  public providers: Provider[] = [
    {
      id: 'prov-1',
      name: 'Google India',
      description: 'Global tech leader investing in diversity and tech inclusion in India.',
      website: 'https://buildyourfuture.withgoogle.com',
      logo: '🌐',
      verified: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'prov-2',
      name: 'Ministry of Minority Affairs',
      description: 'Government of India central ministry empowering minority students.',
      website: 'https://scholarships.gov.in',
      logo: '🏛️',
      verified: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'prov-3',
      name: 'Reliance Foundation',
      description: 'CSR foundation dedicated to empowering India’s youth through higher education.',
      website: 'https://www.scholarships.reliancefoundation.org',
      logo: '🔷',
      verified: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'prov-4',
      name: 'HDFC Bank Parivartan',
      description: 'Flagship CSR initiative fostering financial empowerment and educational access.',
      website: 'https://www.hdfcbank.com/parivartan',
      logo: '🏦',
      verified: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'prov-5',
      name: 'AICTE (Ministry of Education)',
      description: 'Statutory body for technical and engineering education in India.',
      website: 'https://www.aicte-india.org',
      logo: '🇮🇳',
      verified: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'prov-6',
      name: 'Tata Trusts',
      description: 'Historic institution providing grants for higher medical and specialized education.',
      website: 'https://www.tatatrusts.org',
      logo: '🏥',
      verified: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'prov-7',
      name: 'Wipro Cares & Santoor',
      description: 'Corporate foundation advancing women higher education in southern & central India.',
      website: 'https://www.santoorscholarship.com',
      logo: '🌸',
      verified: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'prov-8',
      name: 'ONGC Foundation',
      description: 'Government PSU foundation awarding STEM & medical scholarships for underprivileged categories.',
      website: 'https://ongcscholar.org',
      logo: '⚡',
      verified: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'prov-9',
      name: 'L’Oréal India',
      description: 'Global brand supporting Indian young women scientists.',
      website: 'https://www.loreal.com/en/india',
      logo: '🔬',
      verified: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'prov-10',
      name: 'Colgate-Palmolive India',
      description: 'CSR scholarship program for vocational, diploma, and undergraduate students.',
      website: 'https://www.colgate.com/en-in',
      logo: '✨',
      verified: true,
      createdAt: '2026-01-01',
    },
  ];

  public scholarships: Scholarship[] = [
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
        'Economic vulnerability verification and telephonic screening',
      ],
      verified: true,
      status: 'published',
      createdAt: '2026-07-10',
    },
  ];

  public savedScholarships: { id: string; userId: string; scholarshipId: string; createdAt: string }[] = [
    {
      id: 'save-1',
      userId: 'usr-student-1',
      scholarshipId: 'sch-google-wtm',
      createdAt: '2026-08-10T12:00:00Z',
    },
    {
      id: 'save-2',
      userId: 'usr-student-1',
      scholarshipId: 'sch-reliance-foundation',
      createdAt: '2026-08-12T14:30:00Z',
    },
  ];

  public applications: Application[] = [
    {
      id: 'app-1',
      userId: 'usr-student-1',
      scholarshipId: 'sch-reliance-foundation',
      status: 'Under Review',
      notes: 'Submitted online application and completed 60-min aptitude test. Awaiting interview schedule.',
      appliedAt: '2026-09-18T10:00:00Z',
      updatedAt: '2026-09-22T16:00:00Z',
    },
    {
      id: 'app-2',
      userId: 'usr-student-1',
      scholarshipId: 'sch-google-wtm',
      status: 'Applied',
      notes: 'Submitted resume and leadership essay on National Scholarship portal.',
      appliedAt: '2026-08-25T11:00:00Z',
      updatedAt: '2026-08-25T11:00:00Z',
    },
    {
      id: 'app-3',
      userId: 'usr-student-1',
      scholarshipId: 'sch-hdfc-badhte-kadam',
      status: 'Planning to Apply',
      notes: 'Preparing income certificate renewal from Tehsildar office.',
      appliedAt: '2026-09-20T09:00:00Z',
      updatedAt: '2026-09-20T09:00:00Z',
    },
  ];

  // -------------------------------------------------------------
  // Scholarship Operations
  // -------------------------------------------------------------
  public searchScholarships(params: {
    search?: string;
    educationLevel?: string;
    course?: string;
    state?: string;
    category?: string;
    annualIncomeLimit?: number;
    minAcademicScore?: number;
    gender?: string;
    maxAmount?: number;
    provider?: string;
    deadlineFilter?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) {
    let result = [...this.scholarships].filter((s) => s.status !== 'archived');

    // Search query
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

    // Education Level
    if (params.educationLevel && params.educationLevel !== 'All') {
      result = result.filter((s) =>
        s.educationLevel.some((lvl) => lvl.toLowerCase() === params.educationLevel!.toLowerCase())
      );
    }

    // Course
    if (params.course && params.course !== 'All') {
      result = result.filter((s) =>
        s.courses.some((c) => c.toLowerCase().includes(params.course!.toLowerCase()))
      );
    }

    // State
    if (params.state && params.state !== 'All') {
      result = result.filter(
        (s) =>
          s.states.includes('All India') ||
          s.states.some((st) => st.toLowerCase() === params.state!.toLowerCase())
      );
    }

    // Category
    if (params.category && params.category !== 'All') {
      result = result.filter((s) => s.category.toLowerCase() === params.category!.toLowerCase());
    }

    // Gender
    if (params.gender && params.gender !== 'All') {
      result = result.filter(
        (s) => s.eligibleGender === 'All' || s.eligibleGender.toLowerCase() === params.gender!.toLowerCase()
      );
    }

    // Income limit filter (only scholarships where user qualifies)
    if (params.annualIncomeLimit && params.annualIncomeLimit > 0) {
      result = result.filter(
        (s) => !s.maximumIncome || params.annualIncomeLimit! <= s.maximumIncome
      );
    }

    // Academic score filter (scholarships where user score meets minimum)
    if (params.minAcademicScore && params.minAcademicScore > 0) {
      result = result.filter(
        (s) => !s.minimumScore || params.minAcademicScore! >= s.minimumScore
      );
    }

    // Max amount slider
    if (params.maxAmount && params.maxAmount > 0) {
      result = result.filter((s) => s.amount <= params.maxAmount!);
    }

    // Provider filter
    if (params.provider && params.provider !== 'All') {
      result = result.filter(
        (s) =>
          s.providerName.toLowerCase().includes(params.provider!.toLowerCase()) ||
          s.providerId === params.provider
      );
    }

    // Deadline filter
    if (params.deadlineFilter === 'open') {
      result = result.filter((s) => !s.isClosed);
    } else if (params.deadlineFilter === 'closed') {
      result = result.filter((s) => s.isClosed);
    }

    // Sorting
    if (params.sortBy === 'highest-amount') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (params.sortBy === 'deadline') {
      result.sort((a, b) => a.deadline.localeCompare(b.deadline));
    } else if (params.sortBy === 'recently-added') {
      result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    } else {
      // Default: recommended / verified first
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

  public getScholarshipById(id: string): Scholarship | undefined {
    return this.scholarships.find((s) => s.id === id);
  }

  public createScholarship(data: Partial<Scholarship>): Scholarship {
    const id = `sch-${Date.now()}`;
    const newScholarship: Scholarship = {
      id,
      title: data.title || 'Untitled Scholarship',
      providerId: data.providerId || 'prov-custom',
      providerName: data.providerName || 'Scholarship Foundation',
      providerLogo: data.providerLogo || '🎓',
      description: data.description || '',
      amount: Number(data.amount) || 50000,
      amountFormatted: `₹${(Number(data.amount) || 50000).toLocaleString('en-IN')}`,
      educationLevel: data.educationLevel || ['Undergraduate'],
      courses: data.courses || ['All Courses'],
      states: data.states || ['All India'],
      category: data.category || 'Private',
      minimumIncome: data.minimumIncome,
      maximumIncome: data.maximumIncome,
      minimumScore: data.minimumScore,
      eligibleCategories: data.eligibleCategories || ['General', 'OBC', 'SC', 'ST'],
      eligibleGender: data.eligibleGender || 'All',
      deadline: data.deadline || '2026-12-31',
      deadlineDisplay: data.deadlineDisplay || '31 Dec',
      daysLeftText: data.daysLeftText || 'Open',
      isClosed: data.isClosed ?? false,
      applicationUrl: data.applicationUrl || 'https://scholarships.gov.in',
      eligibility: data.eligibility || 'Check official guidelines for complete eligibility.',
      benefits: data.benefits || ['Direct tuition assistance grant'],
      requiredDocuments: data.requiredDocuments || ['Aadhaar card', 'Marksheet', 'Income proof'],
      selectionProcess: data.selectionProcess || ['Application review and verification'],
      verified: data.verified ?? true,
      status: data.status || 'published',
      createdAt: new Date().toISOString(),
    };

    this.scholarships.unshift(newScholarship);
    return newScholarship;
  }

  public updateScholarship(id: string, data: Partial<Scholarship>): Scholarship | null {
    const idx = this.scholarships.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    const existing = this.scholarships[idx];
    const updated: Scholarship = {
      ...existing,
      ...data,
      amount: data.amount ? Number(data.amount) : existing.amount,
      amountFormatted: data.amount
        ? `₹${Number(data.amount).toLocaleString('en-IN')}`
        : existing.amountFormatted,
    };

    this.scholarships[idx] = updated;
    return updated;
  }

  public deleteScholarship(id: string): boolean {
    const initialLen = this.scholarships.length;
    this.scholarships = this.scholarships.filter((s) => s.id !== id);
    return this.scholarships.length < initialLen;
  }

  // -------------------------------------------------------------
  // Bookmarks (Saved Scholarships)
  // -------------------------------------------------------------
  public getSavedScholarships(userId: string): Scholarship[] {
    const savedIds = this.savedScholarships
      .filter((s) => s.userId === userId)
      .map((s) => s.scholarshipId);

    return this.scholarships.filter((sch) => savedIds.includes(sch.id));
  }

  public saveScholarship(userId: string, scholarshipId: string): boolean {
    const exists = this.savedScholarships.some(
      (s) => s.userId === userId && s.scholarshipId === scholarshipId
    );
    if (!exists) {
      this.savedScholarships.push({
        id: `save-${Date.now()}`,
        userId,
        scholarshipId,
        createdAt: new Date().toISOString(),
      });
    }
    return true;
  }

  public unsaveScholarship(userId: string, scholarshipId: string): boolean {
    const before = this.savedScholarships.length;
    this.savedScholarships = this.savedScholarships.filter(
      (s) => !(s.userId === userId && s.scholarshipId === scholarshipId)
    );
    return this.savedScholarships.length < before;
  }

  // -------------------------------------------------------------
  // Applications
  // -------------------------------------------------------------
  public getUserApplications(userId: string): Application[] {
    return this.applications
      .filter((a) => a.userId === userId)
      .map((app) => ({
        ...app,
        scholarship: this.getScholarshipById(app.scholarshipId),
      }));
  }

  public createApplication(
    userId: string,
    scholarshipId: string,
    status: Application['status'] = 'Applied',
    notes: string = ''
  ): Application {
    const existing = this.applications.find(
      (a) => a.userId === userId && a.scholarshipId === scholarshipId
    );

    if (existing) {
      existing.status = status;
      if (notes) existing.notes = notes;
      existing.updatedAt = new Date().toISOString();
      return {
        ...existing,
        scholarship: this.getScholarshipById(scholarshipId),
      };
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      userId,
      scholarshipId,
      status,
      notes,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scholarship: this.getScholarshipById(scholarshipId),
    };

    this.applications.unshift(newApp);
    return newApp;
  }

  public updateApplication(
    id: string,
    userId: string,
    status: Application['status'],
    notes?: string
  ): Application | null {
    const app = this.applications.find((a) => a.id === id && a.userId === userId);
    if (!app) return null;

    app.status = status;
    if (notes !== undefined) app.notes = notes;
    app.updatedAt = new Date().toISOString();

    return {
      ...app,
      scholarship: this.getScholarshipById(app.scholarshipId),
    };
  }

  // -------------------------------------------------------------
  // Student Profile
  // -------------------------------------------------------------
  public getStudentProfile(userId: string): StudentProfile | undefined {
    return this.studentProfiles.get(userId);
  }

  public upsertStudentProfile(userId: string, data: Partial<StudentProfile>): StudentProfile {
    const existing = this.studentProfiles.get(userId) || {
      userId,
      educationLevel: 'Undergraduate',
      institution: '',
      course: '',
      year: '1st Year',
      state: 'Maharashtra',
      city: 'Pune',
      category: 'General',
      gender: 'Male',
      annualIncome: 300000,
      academicScore: 75,
      disabilityStatus: false,
    };

    const updated: StudentProfile = {
      ...existing,
      ...data,
      userId,
    };

    this.studentProfiles.set(userId, updated);
    return updated;
  }

  // -------------------------------------------------------------
  // AI Matching Logic (Configurable Weighted Scoring System)
  // -------------------------------------------------------------
  public calculateAIMatches(rawProfile: Partial<MatchStepData>): MatchResultItem[] {
    const profile: MatchStepData = {
      name: rawProfile?.name || 'Student',
      city: rawProfile?.city || 'Pune',
      institution: rawProfile?.institution || 'College',
      year: rawProfile?.year || '1st Year',
      educationLevel: rawProfile?.educationLevel || 'Undergraduate',
      course: rawProfile?.course || 'Engineering',
      academicScore: typeof rawProfile?.academicScore === 'number' ? rawProfile.academicScore : 75,
      annualIncome: typeof rawProfile?.annualIncome === 'number' ? rawProfile.annualIncome : 250000,
      state: rawProfile?.state || 'Maharashtra',
      category: rawProfile?.category || 'General',
      gender: rawProfile?.gender || 'All',
      disabilityStatus: Boolean(rawProfile?.disabilityStatus),
      firstGenerationStudent: Boolean(rawProfile?.firstGenerationStudent),
      singleParentOrOrphan: Boolean(rawProfile?.singleParentOrOrphan),
      sportsOrExtracurricular: Boolean(rawProfile?.sportsOrExtracurricular),
    };

    const results: MatchResultItem[] = [];

    for (const scholarship of this.scholarships) {
      if (scholarship.status === 'archived') continue;

      let educationScore = 0; // Max 25
      let courseScore = 0;    // Max 20
      let incomeScore = 0;    // Max 20
      let academicScore = 0;  // Max 15
      let stateScore = 0;     // Max 10
      let categoryScore = 0;  // Max 5
      let otherScore = 0;     // Max 5

      const matchReasons: string[] = [];

      // 1. Education Level Match (25%)
      const profEdu = (profile.educationLevel || '').toLowerCase();
      const eduMatch = scholarship.educationLevel.some(
        (lvl) => (lvl || '').toLowerCase() === profEdu
      );
      if (eduMatch) {
        educationScore = 25;
        matchReasons.push(`Matches your ${profile.educationLevel} degree level`);
      } else {
        educationScore = 5;
      }

      // 2. Course / Stream Match (20%)
      const profCourse = (profile.course || '').toLowerCase();
      const courseMatch = scholarship.courses.some(
        (c) => {
          const courseLower = (c || '').toLowerCase();
          return (
            courseLower === 'all' ||
            courseLower === 'all courses' ||
            (profCourse && profCourse.includes(courseLower)) ||
            (courseLower && courseLower.includes(profCourse))
          );
        }
      );
      if (courseMatch) {
        courseScore = 20;
        matchReasons.push(`Open to students in ${profile.course}`);
      } else {
        courseScore = 5;
      }

      // 3. Annual Income Match (20%)
      if (scholarship.maximumIncome) {
        if (profile.annualIncome <= scholarship.maximumIncome) {
          incomeScore = 20;
          matchReasons.push(
            `Family income is well within the ₹${scholarship.maximumIncome.toLocaleString(
              'en-IN'
            )} limit`
          );
        } else {
          incomeScore = 0;
        }
      } else {
        incomeScore = 20; // No income cap
      }

      // 4. Academic Score Match (15%)
      if (scholarship.minimumScore) {
        if (profile.academicScore >= scholarship.minimumScore) {
          academicScore = 15;
          matchReasons.push(
            `Your ${profile.academicScore}% score exceeds the ${scholarship.minimumScore}% cutoff`
          );
        } else if (profile.academicScore >= scholarship.minimumScore - 5) {
          academicScore = 8;
        } else {
          academicScore = 0;
        }
      } else {
        academicScore = 15;
      }

      // 5. State Match (10%)
      const profState = (profile.state || '').toLowerCase();
      const stateMatch =
        scholarship.states.includes('All India') ||
        scholarship.states.some((st) => (st || '').toLowerCase() === profState);
      if (stateMatch) {
        stateScore = 10;
        matchReasons.push(`Applicable in your domicile state (${profile.state})`);
      } else {
        stateScore = 0;
      }

      // 6. Category Match (5%)
      const profCat = (profile.category || '').toLowerCase();
      const categoryMatch =
        scholarship.eligibleCategories.includes('All') ||
        scholarship.eligibleCategories.includes('General') ||
        scholarship.eligibleCategories.some(
          (cat) => (cat || '').toLowerCase() === profCat
        );
      if (categoryMatch) {
        categoryScore = 5;
      } else {
        categoryScore = 0;
      }

      // 7. Gender & Preference Match (5%)
      if (
        !profile.gender ||
        profile.gender === 'All' ||
        scholarship.eligibleGender === 'All' ||
        scholarship.eligibleGender === profile.gender
      ) {
        otherScore = 5;
        if (scholarship.eligibleGender === profile.gender && profile.gender === 'Female') {
          matchReasons.push('Exclusively dedicated to supporting women in higher education');
        }
      } else {
        otherScore = 0;
      }

      const totalScore = Math.min(
        99,
        Math.max(
          40,
          educationScore +
            courseScore +
            incomeScore +
            academicScore +
            stateScore +
            categoryScore +
            otherScore
        )
      );

      const eligibilityStatus: MatchResultItem['eligibilityStatus'] =
        totalScore >= 85 ? 'High Match' : totalScore >= 70 ? 'Good Match' : 'Possible Match';

      const breakdown: MatchScoreBreakdown = {
        educationScore,
        courseScore,
        incomeScore,
        academicScore,
        stateScore,
        categoryScore,
        otherScore,
        totalScore,
      };

      const whyMatches =
        matchReasons.length > 0
          ? `You appear to match based on your ${matchReasons.slice(0, 3).join(', ')}.`
          : 'General qualification match based on active enrollment in an accredited institution.';

      const recommendationTips =
        totalScore >= 85
          ? 'Strong candidacy! Apply early on the official portal and verify required income/bonafide documents.'
          : 'Good potential. Ensure your recommendation letter and marksheet attestations are ready.';

      results.push({
        scholarship,
        matchPercentage: totalScore,
        eligibilityStatus,
        whyMatches,
        breakdown,
        recommendationTips,
      });
    }

    return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  // -------------------------------------------------------------
  // Admin Operations
  // -------------------------------------------------------------
  public getAdminStats() {
    const totalScholarships = this.scholarships.length;
    const verifiedScholarships = this.scholarships.filter((s) => s.verified).length;
    const totalStudents = this.users.filter((u) => u.role === 'student').length;
    const totalApplications = this.applications.length;
    const expiringSoon = this.scholarships.filter((s) => !s.isClosed).length;
    const totalFundingOffered = this.scholarships.reduce((acc, s) => acc + s.amount, 0);

    return {
      totalScholarships,
      verifiedScholarships,
      totalStudents,
      totalApplications,
      expiringSoon,
      totalFundingOffered,
    };
  }

  public getAdminApplications() {
    return this.applications.map((app) => {
      const student = this.users.find((u) => u.id === app.userId);
      const scholarship = this.getScholarshipById(app.scholarshipId);
      return {
        ...app,
        studentName: student?.name || 'Student',
        studentEmail: student?.email || '',
        scholarshipTitle: scholarship?.title || '',
        amount: scholarship?.amount || 0,
      };
    });
  }

  public getAdminStudents() {
    return this.users
      .filter((u) => u.role === 'student')
      .map((student) => {
        const profile = this.studentProfiles.get(student.id);
        const appsCount = this.applications.filter((a) => a.userId === student.id).length;
        const savedCount = this.savedScholarships.filter((s) => s.userId === student.id).length;

        return {
          id: student.id,
          name: student.name,
          email: student.email,
          createdAt: student.createdAt,
          institution: profile?.institution || 'Pune Institute of Computer Technology',
          course: profile?.course || 'Computer Engineering',
          state: profile?.state || 'Maharashtra',
          academicScore: profile?.academicScore || 84.5,
          applicationsCount: appsCount,
          savedCount,
        };
      });
  }

  public addStudentSubmission(data: any) {
    const newSubmission = {
      id: data.id || `sub-${Date.now()}`,
      name: data.name || 'Anonymous Student',
      email: data.email || null,
      phone: data.phone || '+91 98000 00000',
      age: data.age || 20,
      state: data.state || 'Maharashtra',
      city: data.city || 'Pune',
      education_level: data.educationLevel || data.education_level || 'Undergraduate',
      institution: data.institution || 'Government Engineering College',
      course: data.course || 'B.Tech / B.E.',
      year: data.year || '2nd Year',
      academic_score: Number(data.academicScore || data.academic_score || 80),
      annual_income: Number(data.annualIncome || data.annual_income || 300000),
      category: data.category || 'General',
      gender: data.gender || 'All',
      disability_status: data.disabilityStatus ?? data.disability_status ?? false,
      preferences: data.preferences || {},
      matched_scholarships_count: data.matchedCount || data.matched_scholarships_count || 5,
      status: 'New Submission',
      created_at: new Date().toISOString(),
    };
    this.studentSubmissions.unshift(newSubmission);
    return newSubmission;
  }

  public getStudentSubmissions() {
    return this.studentSubmissions;
  }

  public deleteStudentSubmission(id: string) {
    const initialLen = this.studentSubmissions.length;
    this.studentSubmissions = this.studentSubmissions.filter((s) => s.id !== id);
    return this.studentSubmissions.length < initialLen;
  }

  // -------------------------------------------------------------
  // User Management
  // -------------------------------------------------------------
  public findUserByEmail(email: string): DBUser | undefined {
    if (!email) return undefined;
    const clean = email.trim().toLowerCase();
    return this.users.find((u) => u.email.toLowerCase() === clean);
  }

  public findUserById(id: string): DBUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  public createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    emailVerified?: boolean;
  }): DBUser {
    const cleanEmail = data.email.trim().toLowerCase();
    const newUser: DBUser = {
      id: `usr-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      name: data.name.trim(),
      email: cleanEmail,
      passwordHash: data.passwordHash,
      role: data.role || 'student',
      emailVerified: data.emailVerified ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  public updateUser(
    id: string,
    updates: Partial<Pick<DBUser, 'name' | 'passwordHash' | 'emailVerified' | 'role'>>
  ): DBUser | null {
    const user = this.findUserById(id);
    if (!user) return null;
    if (updates.name !== undefined) user.name = updates.name.trim();
    if (updates.passwordHash !== undefined) user.passwordHash = updates.passwordHash;
    if (updates.emailVerified !== undefined) user.emailVerified = updates.emailVerified;
    if (updates.role !== undefined) user.role = updates.role;
    user.updatedAt = new Date().toISOString();
    return user;
  }

  // -------------------------------------------------------------
  // Cryptographic OTP Management
  // -------------------------------------------------------------
  public hashOTP(otp: string): string {
    return crypto
      .createHmac('sha256', OTP_PEPPER)
      .update(otp)
      .digest('hex');
  }

  public generateSecureOTP(): string {
    // 6-digit numeric OTP cryptographically random (100000 - 999999)
    return crypto.randomInt(100000, 1000000).toString();
  }

  /**
   * Check rate limits for requesting OTP:
   * 1) Min 60 seconds between requests
   * 2) Max 5 requests per hour per email
   */
  public checkOTPRateLimit(email: string, purpose?: OTPPurpose): { allowed: boolean; remainingSeconds?: number; error?: string } {
    const clean = email.trim().toLowerCase();
    const now = Date.now();
    const emailOTPs = this.otps.filter((o) => o.email === clean && (!purpose || o.purpose === purpose));

    // 1. Min 60s cooldown from last request of this purpose
    if (emailOTPs.length > 0) {
      const lastOTP = emailOTPs[emailOTPs.length - 1];
      const diffSec = Math.floor((now - lastOTP.createdAt) / 1000);
      if (diffSec < 60) {
        return {
          allowed: false,
          remainingSeconds: 60 - diffSec,
          error: `Please wait ${60 - diffSec} seconds before requesting a new code.`,
        };
      }
    }

    // 2. Max 5 OTPs within 60 minutes across all purposes
    const oneHourAgo = now - 3600 * 1000;
    const allEmailOTPs = this.otps.filter((o) => o.email === clean);
    const lastHourCount = allEmailOTPs.filter((o) => o.createdAt > oneHourAgo).length;
    if (lastHourCount >= 5) {
      return {
        allowed: false,
        error: 'Too many OTP requests for this email. Please try again after 1 hour.',
      };
    }

    return { allowed: true };
  }

  /**
   * Creates a new hashed OTP record and invalidates any previous active OTP
   */
  public createOTP(
    email: string,
    purpose: OTPPurpose,
    rawOtp: string,
    userId?: string
  ): DBOTP {
    const clean = email.trim().toLowerCase();
    const now = Date.now();

    // Invalidate previous unused OTPs for this email and purpose
    for (const otp of this.otps) {
      if (otp.email === clean && otp.purpose === purpose && !otp.usedAt) {
        otp.usedAt = now; // superseded
      }
    }

    const record: DBOTP = {
      id: `otp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      userId,
      email: clean,
      otpHash: this.hashOTP(rawOtp),
      purpose,
      expiresAt: now + 5 * 60 * 1000, // 5 minutes validity
      attempts: 0,
      usedAt: null,
      createdAt: now,
    };

    this.otps.push(record);
    return record;
  }

  /**
   * Verifies an OTP with timing-safe comparison, attempt limits, and expiration checks
   */
  public verifyOTP(
    email: string,
    purpose: OTPPurpose,
    rawOtp: string
  ): { valid: boolean; error?: string; otpRecord?: DBOTP } {
    const clean = email.trim().toLowerCase();
    const now = Date.now();

    // Find the latest active OTP for this email and purpose
    const record = this.otps
      .slice()
      .reverse()
      .find((o) => o.email === clean && o.purpose === purpose && !o.usedAt);

    if (!record) {
      const anyRecent = this.otps
        .slice()
        .reverse()
        .find((o) => o.email === clean && o.purpose === purpose);
      if (anyRecent && anyRecent.usedAt) {
        return { valid: false, error: 'No active OTP found. Verification code has already been used or expired. Please request a new code.' };
      }
      return { valid: false, error: 'No active OTP found or code expired. Please request a new verification code.' };
    }

    // Check expiration
    if (now > record.expiresAt) {
      record.usedAt = now; // Expired
      return { valid: false, error: 'Verification code has expired (valid for 5 minutes). Please request a new code.' };
    }

    // Check max attempts
    if (record.attempts >= 5) {
      record.usedAt = now; // Locked out
      return { valid: false, error: 'Maximum verification attempts exceeded. Please request a new OTP.' };
    }

    // Compare hash with timingSafeEqual
    const computedHash = this.hashOTP(rawOtp.trim());
    const bufStored = Buffer.from(record.otpHash, 'hex');
    const bufComputed = Buffer.from(computedHash, 'hex');

    const matches =
      bufStored.length === bufComputed.length &&
      crypto.timingSafeEqual(bufStored, bufComputed);

    if (!matches) {
      record.attempts += 1;
      const remaining = 5 - record.attempts;
      if (remaining <= 0) {
        record.usedAt = now;
        return { valid: false, error: 'Incorrect code. Maximum attempts exceeded. Please request a new code.' };
      }
      return {
        valid: false,
        error: `Invalid verification code. You have ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      };
    }

    // Successful verification: mark used
    record.usedAt = now;
    return { valid: true, otpRecord: record };
  }

  // -------------------------------------------------------------
  // Session Management
  // -------------------------------------------------------------
  public createSession(userId: string): { sessionId: string; expiresAt: Date } {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    const session: DBSession = {
      id: sessionId,
      userId,
      expiresAt,
      createdAt: Date.now(),
    };

    this.sessions.set(sessionId, session);
    return { sessionId, expiresAt: new Date(expiresAt) };
  }

  public getSession(sessionId: string): { session: DBSession; user: DBUser } | null {
    if (!sessionId) return null;
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    const user = this.findUserById(session.userId);
    if (!user) {
      this.sessions.delete(sessionId);
      return null;
    }

    return { session, user };
  }

  public deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  public deleteUserSessions(userId: string): void {
    for (const [key, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.sessions.delete(key);
      }
    }
  }
}

export const db = new DatabaseStore();
