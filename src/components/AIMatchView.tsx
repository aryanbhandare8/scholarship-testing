import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  Percent,
  Bookmark,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Building2,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import { Scholarship, SCHOLARSHIPS_DATA } from '../data/scholarships';

interface AIMatchViewProps {
  onSelectScholarship: (scholarship: Scholarship) => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

interface MatchResult {
  id: string;
  matchScore: number;
  eligibilityStatus: 'Highly Eligible' | 'Eligible' | 'Borderline Eligible';
  whyYouMatch: string;
  applicationTips: string;
}

export const AIMatchView: React.FC<AIMatchViewProps> = ({
  onSelectScholarship,
  savedIds,
  onToggleSave,
}) => {
  const [educationLevel, setEducationLevel] = useState('Undergraduate');
  const [stream, setStream] = useState('Computer Science');
  const [gender, setGender] = useState<'Female' | 'Male' | 'All'>('Female');
  const [category, setCategory] = useState('General');
  const [annualFamilyIncome, setAnnualFamilyIncome] = useState<number>(350000);
  const [percentage, setPercentage] = useState<number>(85);
  const [state, setState] = useState('Maharashtra');

  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<MatchResult[] | null>(null);

  const handleRunMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          educationLevel,
          gender,
          category,
          annualFamilyIncome,
          percentage,
          stream,
          state,
        }),
      });

      const data = await response.json();
      if (data.matches && data.matches.length > 0) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error('Error fetching AI matches:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>AI Eligibility & Recommendation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Find Your Perfect Scholarship Match
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mt-2 font-normal">
          Fill in your academic profile and socioeconomic background. Our Gemini-powered engine scans hundreds of verified schemes to match your profile with 95%+ accuracy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Your Profile Details</span>
          </h2>

          <form onSubmit={handleRunMatch} className="space-y-4">
            {/* Education Level */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Current Education Level
              </label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Class 11-12">Class 11 - 12 (Higher Secondary)</option>
                <option value="Undergraduate">Undergraduate Degree (B.Tech, MBBS, B.Sc, B.Com, etc.)</option>
                <option value="Postgraduate">Postgraduate Degree (M.Tech, MBA, M.Sc, etc.)</option>
                <option value="Diploma">Diploma / Polytechnic</option>
                <option value="PhD">Ph.D. / Doctoral Research</option>
              </select>
            </div>

            {/* Field / Stream */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Field of Study / Stream
              </label>
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Computer Science">Computer Science & Information Tech</option>
                <option value="Engineering">Engineering (Mechanical, Electrical, Civil, etc.)</option>
                <option value="Medicine">Medicine & Healthcare (MBBS, BDS, Nursing)</option>
                <option value="Commerce">Commerce & Business (B.Com, BBA, Finance)</option>
                <option value="Arts & Humanities">Arts, Humanities & Law</option>
                <option value="Pure Sciences">Pure Sciences (Physics, Chemistry, Bio)</option>
              </select>
            </div>

            {/* Gender & Category Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="All">Other / Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Social Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC (Non-Creamy)</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="Minority">Minority Community</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
            </div>

            {/* Academic Percentage */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                <span>Academic Score / Percentage</span>
                <span className="text-blue-600 text-sm font-extrabold">{percentage}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="99"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Annual Family Income */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                <span>Annual Family Income</span>
                <span className="text-blue-600 text-sm font-extrabold">
                  ₹{annualFamilyIncome.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="50000"
                max="1500000"
                step="25000"
                value={annualFamilyIncome}
                onChange={(e) => setAnnualFamilyIncome(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                State of Domicile
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Other">Other State</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing with AI Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Calculate AI Match Scores</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Matches Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>Recommended Scholarships</span>
            </h2>
            {matches && (
              <span className="text-xs font-semibold text-slate-500">
                Sorted by AI Compatibility
              </span>
            )}
          </div>

          {!matches && !isLoading && (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Discover your highest probability scholarships
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Adjust your details on the left and click "Calculate AI Match Scores" to receive a tailored eligibility rating and winning strategy.
              </p>
              <button
                onClick={handleRunMatch}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Run Instant Profile Match</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Evaluating criteria across 2,500+ Indian scholarships...
              </h3>
              <p className="text-xs text-slate-500">
                Cross-referencing cutoff marks, income ceilings, and diversity preferences
              </p>
            </div>
          )}

          {matches && !isLoading && (
            <div className="space-y-4">
              {matches.map((item) => {
                const scholarship = SCHOLARSHIPS_DATA.find((s) => s.id === item.id);
                if (!scholarship) return null;
                const isSaved = savedIds.includes(scholarship.id);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        {/* Match Score Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>{item.matchScore}% Compatibility</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {scholarship.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{(scholarship as any).provider || scholarship.providerName}</span>
                          <span>•</span>
                          <span className="font-semibold text-blue-600">
                            {(scholarship as any).awardText || scholarship.amountFormatted}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleSave(scholarship.id)}
                        className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        title={isSaved ? 'Remove from saved' : 'Save'}
                      >
                        <Bookmark
                          className={`w-5 h-5 ${
                            isSaved ? 'fill-blue-600 text-blue-600' : 'stroke-[1.8]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Why You Match Note */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3 text-xs">
                      <span className="font-bold text-slate-700 block mb-0.5">Why you match:</span>
                      <p className="text-slate-600">{item.whyYouMatch}</p>
                    </div>

                    {/* Tip Note */}
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 mb-4 text-xs text-amber-900">
                      <span className="font-bold text-amber-800 block mb-0.5">Winning Strategy:</span>
                      <p>{item.applicationTips}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">
                        Deadline: {scholarship.deadlineDisplay} ({scholarship.daysLeftText})
                      </span>

                      <button
                        onClick={() => onSelectScholarship(scholarship)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>View & Prepare</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
