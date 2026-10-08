import { pgTable, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('student'),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const otps = pgTable('otps', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  email: text('email').notNull(),
  otpHash: text('otp_hash').notNull(),
  purpose: text('purpose').notNull(), // 'email_verification' | 'password_reset'
  expiresAt: timestamp('expires_at').notNull(),
  attempts: integer('attempts').notNull().default(0),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const scholarships = pgTable('scholarships', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  providerId: text('provider_id'),
  providerName: text('provider_name').notNull(),
  providerLogo: text('provider_logo'),
  description: text('description').notNull(),
  amount: integer('amount').notNull(),
  amountFormatted: text('amount_formatted').notNull(),
  educationLevel: jsonb('education_level').$type<string[]>().notNull().default([]),
  courses: jsonb('courses').$type<string[]>().notNull().default([]),
  states: jsonb('states').$type<string[]>().notNull().default([]),
  category: text('category').notNull(),
  minimumIncome: integer('minimum_income'),
  maximumIncome: integer('maximum_income'),
  minimumScore: integer('minimum_score'),
  eligibleCategories: jsonb('eligible_categories').$type<string[]>().notNull().default([]),
  eligibleGender: text('eligible_gender').notNull().default('All'),
  deadline: text('deadline').notNull(),
  deadlineDisplay: text('deadline_display').notNull(),
  daysLeftText: text('days_left_text').notNull(),
  isClosed: boolean('is_closed').notNull().default(false),
  applicationUrl: text('application_url').notNull(),
  eligibility: text('eligibility').notNull(),
  benefits: jsonb('benefits').$type<string[]>().notNull().default([]),
  requiredDocuments: jsonb('required_documents').$type<string[]>().notNull().default([]),
  selectionProcess: jsonb('selection_process').$type<string[]>().notNull().default([]),
  verified: boolean('verified').notNull().default(true),
  status: text('status').notNull().default('published'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const savedScholarships = pgTable('saved_scholarships', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  scholarshipId: text('scholarship_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const applications = pgTable('applications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  scholarshipId: text('scholarship_id').notNull(),
  status: text('status').notNull().default('Applied'),
  notes: text('notes'),
  appliedAt: timestamp('applied_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const studentProfiles = pgTable('student_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  educationLevel: text('education_level'),
  institution: text('institution'),
  course: text('course'),
  year: text('year'),
  state: text('state'),
  city: text('city'),
  category: text('category'),
  gender: text('gender'),
  annualIncome: integer('annual_income'),
  academicScore: integer('academic_score'),
  disabilityStatus: boolean('disability_status').default(false),
  preferences: jsonb('preferences').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow(),
});

export const studentFormSubmissions = pgTable('student_form_submissions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  age: integer('age'),
  state: text('state'),
  city: text('city'),
  educationLevel: text('education_level'),
  institution: text('institution'),
  course: text('course'),
  year: text('year'),
  academicScore: integer('academic_score'),
  annualIncome: integer('annual_income'),
  category: text('category'),
  gender: text('gender'),
  disabilityStatus: boolean('disability_status').default(false),
  preferences: jsonb('preferences').$type<Record<string, any>>().default({}),
  matchedScholarshipsCount: integer('matched_scholarships_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});
