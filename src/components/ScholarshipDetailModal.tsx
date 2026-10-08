import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  Bookmark,
  Calendar,
  IndianRupee,
  Clock,
  ExternalLink,
  GraduationCap,
  FileText,
  Sparkles,
  Award,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Scholarship } from '../data/scholarships';

interface ScholarshipDetailModalProps {
  scholarship: Scholarship | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onApply: (scholarship: Scholarship) => void;
  isApplied: boolean;
}

export const ScholarshipDetailModal: React.FC<ScholarshipDetailModalProps> = ({
  scholarship,
  onClose,
  isSaved,
  onToggleSave,
  onApply,
  isApplied,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'sop'>('details');
  const [sopCareerGoals, setSopCareerGoals] = useState('');
  const [sopHardships, setSopHardships] = useState('');
  const [generatedSop, setGeneratedSop] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!scholarship) return null;

  const handleGenerateSop = async () => {
    setIsGenerating(true);
    try {
      const streamVal = typeof scholarship.eligibility === 'object' && scholarship.eligibility?.stream
        ? scholarship.eligibility.stream.join(', ')
        : scholarship.courses?.join(', ') || 'Undergraduate STEM';

      const response = await fetch('/api/ai/sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scholarshipTitle: scholarship.title,
          studentName: 'Sujan Bhosale',
          stream: streamVal,
          careerGoals: sopCareerGoals,
          hardships: sopHardships,
        }),
      });
      const data = await response.json();
      if (data.essay) {
        setGeneratedSop(data.essay);
      }
    } catch (err) {
      console.error('Failed to generate SOP:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSop);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200/80 shrink-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              {((scholarship as any).tags || scholarship.courses || []).map((tag: string) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs"
                >
                  {tag}
                </span>
              ))}
              {scholarship.verified && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  Verified
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave(scholarship.id)}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                title={isSaved ? 'Remove from saved' : 'Save scholarship'}
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    isSaved ? 'fill-blue-600 text-blue-600' : 'stroke-[1.8]'
                  }`}
                />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {scholarship.title}
          </h2>

          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mt-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{(scholarship as any).provider || scholarship.providerName}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-semibold">{(scholarship as any).providerType || scholarship.category}</span>
          </div>

          {/* Key Quick Highlight Banner */}
          <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-white rounded-2xl border border-slate-200/90">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Award Amount
              </div>
              <div className="text-lg font-extrabold text-blue-600 mt-0.5">
                {(scholarship as any).awardText || scholarship.amountFormatted}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Deadline
              </div>
              <div className="text-base font-bold text-slate-800 mt-0.5">
                {scholarship.deadlineDisplay}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status
              </div>
              <div
                className={`text-base font-bold mt-0.5 ${
                  scholarship.isClosed ? 'text-red-500' : 'text-emerald-600'
                }`}
              >
                {scholarship.daysLeftText}
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 mt-5">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Scholarship Details
            </button>
            <button
              onClick={() => setActiveTab('sop')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'sop'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Application Statement Generator</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {activeTab === 'details' ? (
            <>
              {/* About */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  About This Scholarship
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {(scholarship as any).fullDescription || scholarship.description}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Eligibility Criteria
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-400 block font-medium">Education Level</span>
                    <span className="font-semibold text-slate-800">
                      {(typeof scholarship.eligibility === 'object' && scholarship.eligibility?.educationLevel
                        ? scholarship.eligibility.educationLevel
                        : scholarship.educationLevel || []
                      ).join(', ')}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-xs text-slate-400 block font-medium">Gender Requirement</span>
                    <span className="font-semibold text-slate-800">
                      {(typeof scholarship.eligibility === 'object'
                        ? scholarship.eligibility?.gender
                        : scholarship.eligibleGender) === 'Female'
                        ? 'Female Students Only'
                        : 'All Genders'}
                    </span>
                  </div>

                  {scholarship.minimumScore && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs text-slate-400 block font-medium">Academic Cutoff</span>
                      <span className="font-semibold text-slate-800">
                        Minimum {scholarship.minimumScore}% marks in qualifying exam
                      </span>
                    </div>
                  )}

                  {scholarship.maximumIncome && (
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs text-slate-400 block font-medium">Family Income Limit</span>
                      <span className="font-semibold text-slate-800">
                        Less than ₹{scholarship.maximumIncome.toLocaleString('en-IN')}/year
                      </span>
                    </div>
                  )}

                  {scholarship.courses && (
                    <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-xs text-slate-400 block font-medium">Eligible Disciplines / Streams</span>
                      <span className="font-semibold text-slate-800">
                        {scholarship.courses.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Benefits & Perks
                </h3>
                <ul className="space-y-2">
                  {scholarship.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents Required */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Required Documents Checklist
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {((scholarship as any).documentsRequired || scholarship.requiredDocuments || []).map((doc: string, i: number) => (
                    <li
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700 font-medium"
                    >
                      <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selection Process */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Selection Timeline
                </h3>
                <div className="space-y-2">
                  {scholarship.selectionProcess.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* AI Statement of Purpose Helper */
            <div className="space-y-5">
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm mb-1">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Gemini Scholarship Statement of Purpose Generator
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Scholarships like {scholarship.title} evaluate personal essays closely. Tell us a bit about your aspirations and let Gemini create a tailored, compelling draft for you.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  Your Career Goal / Passion
                </label>
                <input
                  type="text"
                  value={sopCareerGoals}
                  onChange={(e) => setSopCareerGoals(e.target.value)}
                  placeholder="e.g. Build AI tools for rural healthcare in India"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  Any Hardship or Background context
                </label>
                <input
                  type="text"
                  value={sopHardships}
                  onChange={(e) => setSopHardships(e.target.value)}
                  placeholder="e.g. First generation college student from a small farming town"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateSop}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Tailored Statement...' : 'Generate Statement of Purpose'}</span>
              </button>

              {generatedSop && (
                <div className="mt-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Generated Statement
                    </span>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Statement</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line font-serif italic">
                    "{generatedSop}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Verified provider: <span className="font-semibold text-slate-800">{(scholarship as any).provider || scholarship.providerName}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onApply(scholarship)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer ${
                isApplied
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tracked in Dashboard</span>
                </>
              ) : (
                <>
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
