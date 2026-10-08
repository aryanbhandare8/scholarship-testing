import React from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Award,
  BookOpen,
  DollarSign,
  Users,
  Compass,
  FileCheck2,
  ChevronRight,
  Landmark,
  Briefcase,
  HeartHandshake,
  Globe2,
} from 'lucide-react';
import { Scholarship } from '../types';
import { ScholarshipCard } from '../components/ScholarshipCard';

interface HomePageProps {
  onNavigate: (view: string) => void;
  featuredScholarships: Scholarship[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectScholarship: (scholarship: Scholarship) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  featuredScholarships,
  savedIds,
  onToggleSave,
  onSelectScholarship,
}) => {
  const categories = [
    { name: 'Government', icon: Landmark, count: '1,200+', desc: 'Centrally sponsored & state minority schemes' },
    { name: 'CSR Programs', icon: Briefcase, count: '650+', desc: 'Corporate social responsibility foundations' },
    { name: 'NGO & Trusts', icon: HeartHandshake, count: '400+', desc: 'Philanthropic medical and rural grants' },
    { name: 'Merit-Based', icon: Award, count: '850+', desc: 'Top tier academic and STEM competitions' },
    { name: 'Need-Based', icon: DollarSign, count: '920+', desc: 'Income relief and fee waivers' },
    { name: 'Girls & Women', icon: Sparkles, count: '350+', desc: 'Dedicated women in science & technology' },
    { name: 'Research & PhD', icon: BookOpen, count: '180+', desc: 'Doctoral fellowships and lab stipends' },
    { name: 'International', icon: Globe2, count: '120+', desc: 'Study abroad global funding options' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section matching Project Specification */}
      <section className="relative overflow-hidden bg-grid-subtle pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>India’s Most Trusted Scholarship Discovery Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                Find Scholarships That <span className="text-blue-600">Match Your Future.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal mb-8 max-w-2xl">
                Discover scholarships from government organizations, NGOs, CSR programs and private institutions based on your education and eligibility.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <button
                  onClick={() => onNavigate('scholarships')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Explore Scholarships</span>
                </button>

                <button
                  onClick={() => onNavigate('ai-match')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-base transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Find My Scholarships</span>
                </button>
              </div>

              {/* Verified Platform Guarantee */}
              <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Free for Students</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Official Portals</span>
                </span>
              </div>
            </div>

            {/* Right Interactive Education Illustration Card */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20"></div>
                <div className="relative bg-white rounded-3xl border border-slate-200 shadow-xl p-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Live Student Matching
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      98% Match Rate
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="text-xs text-slate-400 font-medium">Top Match Today</div>
                    <div className="text-base font-bold text-slate-900 leading-snug">
                      Reliance Foundation Undergraduate Grant
                    </div>
                    <div className="text-sm font-extrabold text-blue-600">
                      ₹2,00,000 for Degree
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-2">
                    <div className="text-xs text-blue-700 font-medium">Google Women Techmakers</div>
                    <div className="text-xs text-slate-600">
                      ₹74,000 + 1-on-1 Mentorship for Indian Female Engineers
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('ai-match')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Test Your Eligibility Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Key Statistics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-12 mt-12 border-t border-slate-200/80">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                2,500+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Scholarships Available
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                ₹500Cr+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Funding Opportunities
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                10,000+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Registered Students
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                500+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Verified Providers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Browse funding streams tailored for your specific background and career aspirations.
            </p>
          </div>

          <button
            onClick={() => onNavigate('scholarships')}
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => onNavigate('scholarships')}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {cat.count}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Verified Scholarships */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Handpicked Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Scholarships
            </h2>
          </div>

          <button
            onClick={() => onNavigate('scholarships')}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            Browse All 2,500+ Schemes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredScholarships.slice(0, 3).map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              isSaved={savedIds.includes(scholarship.id)}
              onToggleSave={onToggleSave}
              onSelect={onSelectScholarship}
            />
          ))}
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 sm:p-14 text-white">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">
              Streamlined Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How Scholarship Finder Works
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              From finding eligibility to preparing essays and tracking portal deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold">Discover & Filter</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter across 2,500+ Indian scholarships by education level, income limits, gender, score cutoff, and domicile state.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-extrabold text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold">Calculate AI Match</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Answer a 4-step questionnaire. Our weighted criteria engine evaluates your profile compatibility with transparent scores.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-extrabold text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-bold">Apply & Track Status</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Apply directly on official provider portals and monitor your submission stages inside your Student Dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-600 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to claim your education grant?
            </h2>
            <p className="text-sm text-blue-100 max-w-lg">
              Join over 10,000+ students who discovered life-changing scholarship opportunities this academic year.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('scholarships')}
              className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm cursor-pointer"
            >
              Browse Scholarships
            </button>
            <button
              onClick={() => onNavigate('ai-match')}
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm border border-blue-500 transition-colors cursor-pointer"
            >
              Try AI Match Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
