import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Target,
  Sparkles,
  Users,
  Award,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-2xs">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>About Scholarship Finder</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Democratizing Higher Education Funding in India
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          Every year, thousands of crores in government welfare and corporate CSR scholarships go unutilized simply because deserving students never discover their eligibility. We’re changing that.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            To provide every Indian student with a transparent, free, and intelligent gateway to discover, prepare, and apply for financial aid without deceptive agents or processing fees.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Vision</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            A future where no student in India is forced to drop out of higher education or vocational degrees due to financial hardship or lack of timely information.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-8 shadow-xs">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-slate-900">Our Guiding Values</h2>
          <p className="text-sm text-slate-500 mt-1">
            Built with integrity to protect and empower students from diverse socio-economic backgrounds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">100% Free Forever</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never charge students for browsing, matching or application counseling.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Direct Official Links</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students are routed directly to authentic NSP and CSR application websites.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Transparent AI Scoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our eligibility matching algorithms use clear, weighted mathematical criteria.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center py-6">
        <button
          onClick={() => onNavigate('scholarships')}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>Explore Verified Scholarships</span>
        </button>
      </div>
    </div>
  );
};
