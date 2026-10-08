-- ==============================================================================
-- Scholarship Finder - PostgreSQL Database Schema
-- Compatible with standard PostgreSQL 14+ and Supabase
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Students & Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Providers Table (Government bodies, CSR Foundations, NGOs, Universities)
CREATE TABLE IF NOT EXISTS providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(500),
    logo VARCHAR(500),
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    education_level VARCHAR(100),
    institution VARCHAR(255),
    course VARCHAR(255),
    year VARCHAR(50),
    state VARCHAR(100),
    city VARCHAR(100),
    category VARCHAR(100),
    gender VARCHAR(50),
    annual_income NUMERIC(12, 2),
    academic_score NUMERIC(5, 2),
    disability_status BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Scholarships Table
CREATE TABLE IF NOT EXISTS scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    education_level TEXT[] NOT NULL DEFAULT '{}',
    courses TEXT[] NOT NULL DEFAULT '{}',
    states TEXT[] NOT NULL DEFAULT '{}',
    category VARCHAR(100) NOT NULL, -- Government, CSR, Private, NGO, Merit Based, Need Based, Research, International
    minimum_income NUMERIC(12, 2),
    maximum_income NUMERIC(12, 2),
    minimum_score NUMERIC(5, 2),
    eligible_categories TEXT[] NOT NULL DEFAULT '{}', -- General, OBC, SC, ST, Minority, EWS
    eligible_gender VARCHAR(50) DEFAULT 'All', -- All, Female, Male
    deadline DATE NOT NULL,
    application_url VARCHAR(500) NOT NULL,
    eligibility TEXT NOT NULL,
    benefits TEXT[] NOT NULL DEFAULT '{}',
    required_documents TEXT[] NOT NULL DEFAULT '{}',
    selection_process TEXT[] NOT NULL DEFAULT '{}',
    verified BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Saved Scholarships Table (Bookmarks)
CREATE TABLE IF NOT EXISTS saved_scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_saved_scholarship UNIQUE(user_id, scholarship_id)
);

-- 6. Applications Table (Tracker)
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scholarship_id UUID NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'Applied' 
        CHECK (status IN ('Saved', 'Planning to Apply', 'Application Started', 'Applied', 'Under Review', 'Selected', 'Not Selected')),
    notes TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_application UNIQUE(user_id, scholarship_id)
);

-- 7. Student Form Submissions Table (Direct Supabase storage for Match & Lead Forms)
CREATE TABLE IF NOT EXISTS student_form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    age INT,
    state VARCHAR(100),
    city VARCHAR(100),
    education_level VARCHAR(100),
    institution VARCHAR(255),
    course VARCHAR(255),
    year VARCHAR(50),
    academic_score NUMERIC(5, 2),
    annual_income NUMERIC(12, 2),
    category VARCHAR(100),
    gender VARCHAR(50),
    disability_status BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}'::jsonb,
    matched_scholarships_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) with open public insert for anonymous students
ALTER TABLE student_form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to student_form_submissions" 
    ON student_form_submissions FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public read of student_form_submissions" 
    ON student_form_submissions FOR SELECT 
    USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON scholarships(category);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_amount ON scholarships(amount);
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_scholarships(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created ON student_form_submissions(created_at);
