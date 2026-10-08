import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  User,
  GraduationCap,
  Scale,
  Sliders,
  Award,
  Bookmark,
  Building2,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Database,
} from 'lucide-react';
import { MatchStepData, MatchResultItem, Scholarship } from '../types';
import { useToast } from '../contexts/ToastContext';
import { saveStudentFormToSupabase } from '../services/supabase';

interface MultiStepAIMatchProps {
  onSelectScholarship: (scholarship: Scholarship) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const MultiStepAIMatch: React.FC<MultiStepAIMatchProps> = ({
  onSelectScholarship,
  savedIds,
  onToggleSave,
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [matchResults, setMatchResults] = useState<MatchResultItem[] | null>(null);
  const [counselorNote, setCounselorNote] = useState<string>('');

  const [formData, setFormData] = useState<MatchStepData>({
    // Step 1: Personal
    name: 'Sujan Bhosale',
    age: 20,
    state: 'Maharashtra',
    city: 'Pune',
    // Step 2: Education
    educationLevel: 'Undergraduate',
    institution: 'Pune Institute of Computer Technology',
    course: 'Computer Science',
    year: '2nd Year',
    // Step 3: Eligibility
    academicScore: 84,
    annualIncome: 350000,
    category: 'General',
    gender: 'Male',
    disabilityStatus: false,
    // Step 4: Preferences
    preferredCategory: 'All',
    preferredState: 'Maharashtra',
    preferredCourse: 'Computer Science',
    minimumFinancialRequirement: 50000,
  });

  const updateField = (field: keyof MatchStepData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Save directly to Supabase client
      saveStudentFormToSupabase({
        name: formData.name,
        age: formData.age,
        state: formData.state,
        city: formData.city,
        education_level: formData.educationLevel,
        institution: formData.institution,
        course: formData.course,
        year: formData.year,
        academic_score: formData.academicScore,
        annual_income: formData.annualIncome,
        category: formData.category,
        gender: formData.gender,
        disability_status: formData.disabilityStatus,
        preferences: {
          preferredCategory: formData.preferredCategory,
          preferredState: formData.preferredState,
          preferredCourse: formData.preferredCourse,
          minimumFinancialRequirement: formData.minimumFinancialRequirement,
        },
      }).catch((e) => console.warn('Supabase client insert:', e));

      // 2. Fetch matches from backend (which also stores to Supabase server-side)
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.matches) {
        setMatchResults(data.matches);
        if (data.counselorInsight) {
          setCounselorNote(data.counselorInsight);
        }
        toast({
          title: 'Matching Complete & Stored in Supabase!',
          message: `Profile saved in Supabase project (veomsjrzqxwcugwyjwym). Found ${data.matches.length} matching schemes.`,
          type: 'success',
        });
      }
    } catch (e) {
      console.error('AI match error:', e);
      toast({
        title: 'Error processing match',
        message: 'Unable to reach matching engine. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-400" />
          <span>Intelligent Scholarship Recommendation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find Scholarships Made for You
        </h1>
        <p className="text-slate-600 text-base mt-2">
          Tell us about your background, marks, and financial needs. We calculate transparent compatibility across hundreds of verified funding programs.
        </p>

        <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Connected to Supabase DB: <code className="font-mono text-emerald-700">veomsjrzqxwcugwyjwym</code></span>
        </div>
      </div>

      {/* Multi-step progress indicator */}
      {!matchResults && (
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500">
            <span className={currentStep >= 1 ? 'text-blue-600' : ''}>1. Personal Info</span>
            <span className={currentStep >= 2 ? 'text-blue-600' : ''}>2. Education</span>
            <span className={currentStep >= 3 ? 'text-blue-600' : ''}>3. Eligibility</span>
            <span className={currentStep >= 4 ? 'text-blue-600' : ''}>4. Preferences</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Multi-step Form Card */}
      {!matchResults ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 max-w-3xl mx-auto">
          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 1 — Personal Information</h3>
                  <p className="text-xs text-slate-500">Provide basic demographic details for regional quota evaluation.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g. Sujan Bhosale"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => updateField('age', Number(e.target.value))}
                    placeholder="e.g. 20"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Home State / Domicile *
                  </label>
                  <select
                    value={formData.state}
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
                    <option value="Other">Other Indian State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City / District
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="e.g. Pune"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Education */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 2 — Education</h3>
                  <p className="text-xs text-slate-500">Your current institution and enrolled stream details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Current Education Level *
                  </label>
                  <select
                    value={formData.educationLevel}
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
                    Course / Major *
                  </label>
                  <select
                    value={formData.course}
                    onChange={(e) => updateField('course', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  >
                    <option value="Computer Science">Computer Science & Engineering</option>
                    <option value="Engineering">Core Engineering (Mech/Civil/Elec)</option>
                    <option value="Medicine">Medicine (MBBS/BDS/Nursing)</option>
                    <option value="Commerce">Commerce & Business (B.Com/BBA/MBA)</option>
                    <option value="Arts">Arts & Humanities / Law</option>
                    <option value="Pure Sciences">Pure Sciences (Physics/Chem/Bio)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    College / School / University
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => updateField('institution', e.target.value)}
                    placeholder="e.g. Pune Institute of Computer Technology"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Year / Semester
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => updateField('year', e.target.value)}
                    placeholder="e.g. 2nd Year"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Eligibility */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 3 — Eligibility</h3>
                  <p className="text-xs text-slate-500">Government schemes require income and score cutoffs.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    <span>Academic Score / Percentage (12th / Previous Exam)</span>
                    <span className="text-sm font-extrabold text-blue-600">{formData.academicScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="99"
                    value={formData.academicScore}
                    onChange={(e) => updateField('academicScore', Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    <span>Annual Family Income</span>
                    <span className="text-sm font-extrabold text-blue-600">
                      ₹{formData.annualIncome.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="1500000"
                    step="25000"
                    value={formData.annualIncome}
                    onChange={(e) => updateField('annualIncome', Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Social Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC (Non-Creamy Layer)</option>
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
                      value={formData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female (Unlocks Women in STEM schemes)</option>
                      <option value="All">Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="text-xs text-slate-700">
                    <span className="font-bold block">Person with Disability (PwD / Divyangjan)</span>
                    <span className="text-slate-500">Voluntary for specialized 3-5% reserved grants</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.disabilityStatus}
                    onChange={(e) => updateField('disabilityStatus', e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Preferences */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 4 — Preferences</h3>
                  <p className="text-xs text-slate-500">Custom priorities to weight your top recommendations.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Scholarship Category
                  </label>
                  <select
                    value={formData.preferredCategory}
                    onChange={(e) => updateField('preferredCategory', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  >
                    <option value="All">All Categories (Highest chance)</option>
                    <option value="Government">Government & National Portal</option>
                    <option value="CSR">Corporate CSR & Foundations</option>
                    <option value="Private">Private Industry Programs</option>
                    <option value="Merit Based">Merit-Based Competitions</option>
                    <option value="Need Based">Need-Based Financial Relief</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Minimum Desired Grant (₹)
                  </label>
                  <select
                    value={formData.minimumFinancialRequirement}
                    onChange={(e) => updateField('minimumFinancialRequirement', Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  >
                    <option value="10000">Any Amount (₹10,000+)</option>
                    <option value="50000">Substantial (₹50,000+)</option>
                    <option value="100000">High Value (₹1,00,000+)</option>
                    <option value="200000">Full UG Grant (₹2,00,000+)</option>
                  </select>
                </div>

                {/* Weighted Formula Transparency Box */}
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed">
                  <span className="font-bold block mb-1">Our Transparent Weighted Scoring Formula:</span>
                  Education (25%) + Course (20%) + Income (20%) + Academic Score (15%) + State (10%) + Category (5%) + Gender/Other (5%) = 100% Match Index.
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{currentStep === 4 ? (loading ? 'Analyzing Matches...' : 'Find My Matches') : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* RESULTS VIEW */
        <div className="space-y-8 animate-in fade-in">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Eligibility Matched for {formData.name}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Your Scholarship Matches
              </h2>
              {counselorNote && (
                <p className="text-sm text-blue-100 mt-2 max-w-xl font-normal leading-relaxed">
                  "{counselorNote}"
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setMatchResults(null);
                setCurrentStep(1);
              }}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition-colors self-start sm:self-auto cursor-pointer shadow-sm"
            >
              Edit Profile
            </button>
          </div>

          {/* Important Legal Disclaimer requested in prompt */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Disclaimer Regarding AI Matching:</strong>
              Scholarship Finder’s AI matching calculates compatibility based on publicly listed criteria. This compatibility score does not constitute a guaranteed award or eligibility verification. The final eligibility decision belongs solely to the scholarship provider or government authority.
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {matchResults.map((result) => {
              const isSaved = savedIds.includes(result.scholarship.id);

              return (
                <div
                  key={result.scholarship.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      {/* Compatibility Badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>{result.matchPercentage}% Match</span>
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {result.eligibilityStatus}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded-md text-slate-600">
                          {result.scholarship.category}
                        </span>
                      </div>

                      {/* Title & Provider */}
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 leading-snug">
                          {result.scholarship.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{result.scholarship.providerName}</span>
                          <span>•</span>
                          <span className="font-extrabold text-blue-600">
                            {result.scholarship.amountFormatted}
                          </span>
                          <span>•</span>
                          <span>Deadline: {result.scholarship.deadlineDisplay}</span>
                        </div>
                      </div>

                      {/* Why you match */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <span className="font-bold text-slate-700 block mb-0.5">Why this matches your profile:</span>
                        <p className="text-slate-600 leading-relaxed">{result.whyMatches}</p>
                      </div>

                      {/* Strategy Tip */}
                      <p className="text-xs text-slate-500 italic">
                        Tip: {result.recommendationTips}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                      <button
                        onClick={() => onSelectScholarship(result.scholarship)}
                        className="w-full px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onToggleSave(result.scholarship.id)}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            isSaved ? 'fill-blue-600 text-blue-600' : 'stroke-[2]'
                          }`}
                        />
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
