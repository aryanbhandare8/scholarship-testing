import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://veomsjrzqxwcugwyjwym.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_IIU9Y9Tughqf_5jzDNmxJw_ffndU-iU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface StudentFormPayload {
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  state: string;
  city: string;
  education_level: string;
  institution: string;
  course: string;
  year: string;
  academic_score: number;
  annual_income: number;
  category: string;
  gender: string;
  disability_status: boolean;
  preferences?: Record<string, any>;
  matched_scholarships_count?: number;
}

/**
 * Saves student form submission directly to Supabase
 */
export async function saveStudentFormToSupabase(formData: StudentFormPayload) {
  try {
    const { data, error } = await supabase
      .from('student_form_submissions')
      .insert([
        {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          age: formData.age || null,
          state: formData.state,
          city: formData.city,
          education_level: formData.education_level,
          institution: formData.institution,
          course: formData.course,
          year: formData.year,
          academic_score: formData.academic_score,
          annual_income: formData.annual_income,
          category: formData.category,
          gender: formData.gender,
          disability_status: formData.disability_status,
          preferences: formData.preferences || {},
          matched_scholarships_count: formData.matched_scholarships_count || 0,
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase direct insert notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase client exception:', err);
    return { success: false, error: err.message };
  }
}
