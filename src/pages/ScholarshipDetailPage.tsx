import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Bookmark,
  Share2,
  ExternalLink,
  Calendar,
  FileText,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Award,
  Layers,
  GraduationCap,
  Clock,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Scholarship } from '../types';
import { ShareModal } from '../components/ShareModal';
import { useToast } from '../contexts/ToastContext';

interface ScholarshipDetailPageProps {
  scholarship: Scholarship;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onApply: (scholarship: Scholarship) => void;
  isApplied: boolean;
}

export const ScholarshipDetailPage: React.FC<ScholarshipDetailPageProps> = ({
  scholarship,
  onBack,
  isSaved,
  onToggleSave,
  onApply,
  isApplied,
}) => {
  const { toast } = useToast();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'sop'>('details');

  // AI SOP Generator state
  const [sopCareerGoals, setSopCareerGoals] = useState('');
  const [sopHardships, setSopHardships] = useState('');
  const [generatedSop, setGeneratedSop] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateSop = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scholarshipTitle: scholarship.title,
          studentName: 'Sujan Bhosale',
          stream: scholarship.courses.join(', '),
          careerGoals: sopCareerGoals,
          hardships: sopHardships,
        }),
      });
      const data = await response.json();
      if (data.essay) {
        setGeneratedSop(data.essay);
        toast({
          title: 'Statement of Purpose Generated!',
          message: 'Review and customize your personalized scholarship draft.',
          type: 'success',
        });
      }
    } catch (err) {
      console.error('Failed to generate SOP:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySop = () => {
    navigator.clipboard.writeText(generatedSop);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Scholarships Directory</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {scholarship.category}
              </span>
              {scholarship.verified && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Official Opportunity</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {scholarship.title}
            </h1>

            {/* Provider Line */}
            <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-base">
                {scholarship.providerLogo || '🏛️'}
              </div>
              <span className="font-bold text-slate-800">{scholarship.providerName}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onToggleSave(scholarship.id)}
              className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              title={isSaved ? 'Remove from saved' : 'Save scholarship'}
            >
              <Bookmark
                className={`w-5 h-5 ${isSaved ? 'fill-blue-600 text-blue-600' : 'stroke-[2]'}`}
              />
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
              title="Share Scholarship"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => onApply(scholarship)}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{isApplied ? 'Applied (Tracked)' : 'Apply Now'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Grant Amount
            </div>
            <div className="text-xl font-extrabold text-blue-600 mt-1">
              {scholarship.amountFormatted}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Deadline
            </div>
            <div className="text-base font-bold text-slate-800 mt-1">
              {scholarship.deadlineDisplay}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Application Status
            </div>
            <div
              className={`text-base font-bold mt-1 ${
                scholarship.isClosed ? 'text-red-500' : 'text-emerald-600'
              }`}
            >
              {scholarship.daysLeftText}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Education Level
            </div>
            <div className="text-sm font-bold text-slate-800 mt-1 truncate">
              {scholarship.educationLevel.join(', ')}
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar: Details vs AI SOP */}
        <div className="flex items-center gap-2 mt-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Scholarship Overview
          </button>
          <button
            onClick={() => setActiveTab('sop')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sop'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Application Essay / SOP Drafter</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Detailed Overview */}
      {activeTab === 'details' && (
        <div className="space-y-8">
          {/* About & Eligibility */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Description & Mission</h2>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {scholarship.description}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Eligibility Requirements</h2>
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-sm text-slate-800 leading-relaxed mb-4">
                {scholarship.eligibility}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-bold">Academic Cutoff</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {scholarship.minimumScore ? `${scholarship.minimumScore}% or above` : 'Open'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-bold">Income Ceiling</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {scholarship.maximumIncome
                      ? `Up to ₹${scholarship.maximumIncome.toLocaleString('en-IN')}/year`
                      : 'No income barrier'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-bold">Gender Preference</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {scholarship.eligibleGender === 'Female' ? 'Female Only' : 'All Genders'}
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits & Inclusions */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Benefits & Award Breakdown</h2>
              <div className="space-y-2.5">
                {scholarship.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Required Documents Checklist</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scholarship.requiredDocuments.map((doc, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5 text-xs font-semibold text-slate-800"
                  >
                    <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Timeline */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-3">Selection Process & Steps</h2>
              <div className="space-y-3">
                {scholarship.selectionProcess.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Official Provider Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-slate-900">
                Official Application Website
              </h3>
              <p className="text-xs text-slate-500">
                Direct external link to the accredited government or corporate submission portal.
              </p>
            </div>

            <button
              onClick={() => onApply(scholarship)}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Visit Official Application Portal</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Mandatory Section 3 Disclaimer */}
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl text-xs text-amber-900 leading-relaxed flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-amber-950 mb-1">
                Official Verification Notice:
              </strong>
              Scholarship information can change. Always verify eligibility, deadlines and requirements with the official scholarship provider. Scholarship Finder is not liable for changes in admission cutoffs or portal downtime on third-party government servers.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Gemini Statement of Purpose Generator */}
      {activeTab === 'sop' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 animate-in fade-in">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl">
            <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI Application Statement & Essay Drafter</span>
            </div>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Scholarship panels evaluate your personal conviction. Input your career aspirations and let our AI draft a compelling Statement of Purpose tailored for {scholarship.title}.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Your Career Aspiration / Long-Term Vision
            </label>
            <input
              type="text"
              value={sopCareerGoals}
              onChange={(e) => setSopCareerGoals(e.target.value)}
              placeholder="e.g. Build low-cost agricultural robotics for farmers in rural Maharashtra"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Personal Hardships / Background Context (Optional)
            </label>
            <input
              type="text"
              value={sopHardships}
              onChange={(e) => setSopHardships(e.target.value)}
              placeholder="e.g. First-generation engineer from a family dependent on seasonal farming"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            onClick={handleGenerateSop}
            disabled={isGenerating}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Generating Tailored Statement...' : 'Generate Statement of Purpose'}</span>
          </button>

          {generatedSop && (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Generated Scholarship Statement
                </span>
                <button
                  onClick={handleCopySop}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-800 leading-relaxed font-serif whitespace-pre-line italic">
                "{generatedSop}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        scholarship={scholarship}
      />
    </div>
  );
};
