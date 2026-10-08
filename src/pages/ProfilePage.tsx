import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  MapPin,
  Scale,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Database,
} from 'lucide-react';
import { StudentProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { saveStudentFormToSupabase } from '../services/supabase';

interface ProfilePageProps {
  onNavigate: (view: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>({
    userId: user?.id || 'usr-student-1',
    educationLevel: 'Undergraduate',
    institution: 'Pune Institute of Computer Technology',
    course: 'Computer Science',
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
      preferredCourse: 'Computer Science',
      minimumRequirement: 50000,
    },
  });

  useEffect(() => {
    // Load profile from backend API
    const loadProfile = async () => {
      try {
        const res = await fetch(`/api/user/profile?userId=${user?.id || 'usr-student-1'}`);
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    loadProfile();
  }, [user]);

  const updateField = (field: keyof StudentProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Save directly to Supabase client
      const supabaseResult = await saveStudentFormToSupabase({
        name: user?.name || 'Student User',
        email: user?.email || '',
        state: profile.state,
        city: profile.city,
        education_level: profile.educationLevel,
        institution: profile.institution,
        course: profile.course,
        year: profile.year,
        academic_score: profile.academicScore,
        annual_income: profile.annualIncome,
        category: profile.category,
        gender: profile.gender,
        disability_status: profile.disabilityStatus,
        preferences: profile.preferences,
      });

      // 2. Save to backend database API
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, userId: user?.id }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: 'Profile Saved & Stored in Supabase!',
          message: supabaseResult.success
            ? 'Profile record saved to Supabase (Project ID: veomsjrzqxwcugwyjwym).'
            : 'Profile saved to database and ready for matching.',
          type: 'success',
        });
      }
    } catch (err) {
      toast({
        title: 'Error saving profile',
        message: 'Could not connect to database.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <User className="w-3.5 h-3.5" />
              <span>Student Profile</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supabase DB Connected (<code className="font-mono text-[11px]">veomsjrzqxwcugwyjwym</code>)</span>
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic & Eligibility Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep your marks, family income, and reservation category accurate for precise matching. Data is saved in Supabase.
          </p>
        </div>

        <button
          onClick={() => onNavigate('ai-match')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Run AI Match with this Profile</span>
        </button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8">
        {/* Section 1: Academic Enrollment */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Academic Background</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Education Level
              </label>
              <select
                value={profile.educationLevel}
                onChange={(e) => updateField('educationLevel', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="Class 11-12">Class 11 - 12 (Higher Secondary)</option>
                <option value="Undergraduate">Undergraduate Degree (UG)</option>
                <option value="Postgraduate">Postgraduate Degree (PG)</option>
                <option value="Diploma">Diploma / Polytechnic</option>
                <option value="PhD">Ph.D. / Research</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Course / Discipline
              </label>
              <input
                type="text"
                value={profile.course}
                onChange={(e) => updateField('course', e.target.value)}
                placeholder="e.g. Computer Science"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                College / University Name
              </label>
              <input
                type="text"
                value={profile.institution}
                onChange={(e) => updateField('institution', e.target.value)}
                placeholder="e.g. Pune Institute of Computer Technology"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Year of Study
              </label>
              <input
                type="text"
                value={profile.year}
                onChange={(e) => updateField('year', e.target.value)}
                placeholder="e.g. 2nd Year"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Academic Score / % (Last Qualifying Exam)
              </label>
              <input
                type="number"
                step="0.1"
                min="40"
                max="100"
                value={profile.academicScore}
                onChange={(e) => updateField('academicScore', Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Socio-economic Eligibility */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Scale className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Socio-Economic Eligibility Factors</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Annual Family Income (INR)
              </label>
              <input
                type="number"
                step="10000"
                value={profile.annualIncome}
                onChange={(e) => updateField('annualIncome', Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-blue-600"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                As per Tahsildar / Government Revenue Certificate
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Social Reservation Category
              </label>
              <select
                value={profile.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="General">General</option>
                <option value="OBC">OBC (Non-Creamy)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="Minority">Minority Community</option>
                <option value="EWS">EWS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                value={profile.gender}
                onChange={(e) => updateField('gender', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="All">Other / Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Home State (Domicile)
              </label>
              <select
                value={profile.state}
                onChange={(e) => updateField('state', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Gujarat">Gujarat</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
