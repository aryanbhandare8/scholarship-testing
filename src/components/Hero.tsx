import React from 'react';
import { Sparkles, Search, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onTryAIMatch: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onTryAIMatch }) => {
  return (
    <section className="relative overflow-hidden bg-grid-subtle pt-16 pb-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-powered scholarship matching</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Every scholarship you deserve, <span className="text-blue-600">in one place.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal mb-10 max-w-2xl">
            Discover verified scholarships from Government, CSR, NGOs and private foundations across India.
            Get personalized AI recommendations, track applications and never miss a deadline again.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Explore Scholarships</span>
            </button>

            <button
              onClick={onTryAIMatch}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-50/80 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold text-base transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Try AI Match</span>
            </button>
          </div>

          {/* Key Metrics Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-6 border-t border-slate-200/80">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                2,500+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Verified scholarships
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ₹500Cr+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Total funding tracked
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                68.6%
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Undergraduate users
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                100%
              </div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Trusted sources
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
