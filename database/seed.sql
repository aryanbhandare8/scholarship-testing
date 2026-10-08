-- ==============================================================================
-- Scholarship Finder - PostgreSQL Seed Data
-- ==============================================================================

-- Insert Providers
INSERT INTO providers (id, name, description, website, logo, verified) VALUES
('11111111-1111-1111-1111-111111111111', 'Ministry of Minority Affairs', 'Government of India central ministry empowering minority students across India.', 'https://scholarships.gov.in', '🏛️', true),
('22222222-2222-2222-2222-222222222222', 'Reliance Foundation', 'Philanthropic arm of Reliance Industries focused on nation building and youth empowerment.', 'https://www.scholarships.reliancefoundation.org', '🔷', true),
('33333333-3333-3333-3333-333333333333', 'Google India', 'Global technology leader investing in diversity, equality and STEM access for women in India.', 'https://buildyourfuture.withgoogle.com', '🌐', true),
('44444444-4444-4444-4444-444444444444', 'HDFC Bank Parivartan', 'Social initiative program by HDFC Bank driving social change in education.', 'https://www.hdfcbank.com/parivartan', '🏦', true),
('55555555-5555-5555-5555-555555555555', 'AICTE (Ministry of Education)', 'All India Council for Technical Education regulatory body for engineering and polytechnic.', 'https://www.aicte-india.org', '🇮🇳', true),
('66666666-6666-6666-6666-666666666666', 'Tata Trusts', 'One of India''s oldest philanthropic organizations supporting medical and healthcare education.', 'https://www.tatatrusts.org', '🏥', true),
('77777777-7777-7777-7777-777777777777', 'Wipro Cares', 'Community initiatives arm of Wipro focusing on rural women education.', 'https://www.santoorscholarship.com', '🌸', true),
('88888888-8888-8888-8888-888888888888', 'ONGC Foundation', 'CSR wing of Oil and Natural Gas Corporation providing grants to underprivileged engineering and medical scholars.', 'https://ongcscholar.org', '⚡', true),
('99999999-9999-9999-9999-999999999999', 'L''Oréal India', 'Leading cosmetics company fostering women researchers and science graduates in India.', 'https://www.loreal.com/en/india', '🔬', true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Colgate-Palmolive India', 'Corporate social responsibility providing higher education funding for sports and academics.', 'https://www.colgate.com/en-in', '✨', true)
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Users (Passwords are pre-hashed for testing)
INSERT INTO users (id, name, email, password_hash, role) VALUES
('b1111111-1111-1111-1111-111111111111', 'Sujan Bhosale', 'student@scholarshipfinder.edu', 'demo_hash_student_2026', 'student'),
('b2222222-2222-2222-2222-222222222222', 'Administrator', 'admin@scholarshipfinder.edu', 'demo_hash_admin_2026', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Insert Student Profile
INSERT INTO student_profiles (user_id, education_level, institution, course, year, state, city, category, gender, annual_income, academic_score, disability_status, preferences) VALUES
('b1111111-1111-1111-1111-111111111111', 'Undergraduate', 'Pune Institute of Computer Technology', 'Computer Engineering', '2nd Year', 'Maharashtra', 'Pune', 'General', 'Male', 350000.00, 84.50, false, '{"preferred_categories": ["CSR", "Merit Based", "Government"]}'::jsonb)
ON CONFLICT (user_id) DO NOTHING;
