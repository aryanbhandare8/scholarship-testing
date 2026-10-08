export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type OTPPurpose = 'email_verification' | 'password_reset';

export interface OTPRecord {
  id: string;
  userId?: string;
  email: string;
  otpHash: string;
  purpose: OTPPurpose;
  expiresAt: string;
  attempts: number;
  usedAt?: string | null;
  createdAt: string;
}

export interface SessionRecord {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export interface StudentProfile {
  id?: string;
  userId: string;
  educationLevel: string;
  institution: string;
  course: string;
  year: string;
  state: string;
  city: string;
  category: string;
  gender: string;
  annualIncome: number;
  academicScore: number;
  disabilityStatus: boolean;
  preferences?: {
    scholarshipType?: string;
    preferredState?: string;
    preferredCourse?: string;
    minimumRequirement?: number;
  };
}

export interface Provider {
  id: string;
  name: string;
  description: string;
  website: string;
  logo: string;
  verified: boolean;
  createdAt?: string;
}

export type ScholarshipCategory =
  | 'Government'
  | 'Private'
  | 'NGO'
  | 'CSR'
  | 'Merit Based'
  | 'Need Based'
  | 'Research'
  | 'International';

export interface Scholarship {
  id: string;
  title: string;
  providerId?: string;
  providerName: string;
  provider?: string;
  providerType?: string;
  providerLogo?: string;
  description: string;
  fullDescription?: string;
  amount: number;
  amountFormatted: string;
  awardAmount?: number;
  awardText?: string;
  educationLevel: string[];
  courses: string[];
  states: string[];
  category: ScholarshipCategory;
  tags?: string[];
  minimumIncome?: number;
  maximumIncome?: number;
  minimumScore?: number;
  eligibleCategories: string[];
  eligibleGender: 'All' | 'Female' | 'Male';
  deadline: string; // YYYY-MM-DD
  deadlineDate?: string;
  deadlineDisplay: string;
  daysLeftText: string;
  isClosed: boolean;
  applicationUrl: string;
  eligibility: any;
  benefits: string[];
  requiredDocuments: string[];
  documentsRequired?: string[];
  selectionProcess: string[];
  verified: boolean;
  status: 'published' | 'draft' | 'archived';
  createdAt?: string;
}

export type ApplicationStatus =
  | 'Saved'
  | 'Planning to Apply'
  | 'Application Started'
  | 'Applied'
  | 'Under Review'
  | 'Selected'
  | 'Not Selected';

export interface Application {
  id: string;
  userId: string;
  scholarshipId: string;
  scholarship?: Scholarship;
  status: ApplicationStatus;
  notes?: string;
  appliedAt: string;
  updatedAt?: string;
}

export interface MatchStepData {
  // Step 1: Personal
  name: string;
  age?: number;
  state: string;
  city: string;
  // Step 2: Education
  educationLevel: string;
  institution: string;
  course: string;
  year: string;
  // Step 3: Eligibility
  academicScore: number;
  annualIncome: number;
  category: string;
  gender: string;
  disabilityStatus: boolean;
  firstGenerationStudent?: boolean;
  singleParentOrOrphan?: boolean;
  sportsOrExtracurricular?: boolean;
  // Step 4: Preferences
  preferredCategory?: string;
  preferredState?: string;
  preferredCourse?: string;
  minimumFinancialRequirement?: number;
}

export interface MatchScoreBreakdown {
  educationScore: number; // Max 25
  courseScore: number;    // Max 20
  incomeScore: number;    // Max 20
  academicScore: number;  // Max 15
  stateScore: number;     // Max 10
  categoryScore: number;  // Max 5
  otherScore: number;     // Max 5
  totalScore: number;     // Max 100
}

export interface MatchResultItem {
  scholarship: Scholarship;
  matchPercentage: number;
  eligibilityStatus: 'High Match' | 'Good Match' | 'Possible Match';
  whyMatches: string;
  breakdown: MatchScoreBreakdown;
  recommendationTips: string;
}

export interface ScholarshipFilters {
  search: string;
  educationLevel: string;
  course: string;
  state: string;
  category: string;
  annualIncomeLimit: number;
  minAcademicScore: number;
  gender: string;
  maxAmount: number;
  deadlineFilter: string; // 'all' | 'open' | 'closed'
  provider: string;
  sortBy: 'recommended' | 'deadline' | 'highest-amount' | 'recently-added';
}
