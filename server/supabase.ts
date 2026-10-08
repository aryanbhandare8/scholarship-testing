import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl =
  process.env.SUPABASE_URL || 'https://veomsjrzqxwcugwyjwym.supabase.co';
const supabaseKey =
  process.env.SUPABASE_ANON_KEY || 'sb_publishable_IIU9Y9Tughqf_5jzDNmxJw_ffndU-iU';

export const supabaseServer = createClient(supabaseUrl, supabaseKey);

export async function storeStudentSubmission(payload: {
  name: string;
  email?: string;
  age?: number;
  state: string;
  city: string;
  educationLevel: string;
  institution: string;
  course: string;
  year: string;
  academicScore: number;
  annualIncome: number;
  category: string;
  gender: string;
  disabilityStatus?: boolean;
  preferences?: any;
  matchedCount?: number;
}) {
  try {
    const { data, error } = await supabaseServer
      .from('student_form_submissions')
      .insert([
        {
          name: payload.name,
          email: payload.email || null,
          age: payload.age || null,
          state: payload.state,
          city: payload.city,
          education_level: payload.educationLevel,
          institution: payload.institution,
          course: payload.course,
          year: payload.year,
          academic_score: payload.academicScore,
          annual_income: payload.annualIncome,
          category: payload.category,
          gender: payload.gender,
          disability_status: payload.disabilityStatus ?? false,
          preferences: payload.preferences || {},
          matched_scholarships_count: payload.matchedCount || 0,
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase server-side storage notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase server-side storage exception:', err.message);
    return { success: false, error: err.message };
  }
}
