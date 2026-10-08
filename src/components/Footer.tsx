import React from 'react';
import { GraduationCap, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-white pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 text-left mb-4 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 tracking-tight block">
                  Scholarship Finder
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  One Place. Every Opportunity.
                </span>
              </div>
            </button>

            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mb-5">
              Empowering students across India with transparent, verified access to higher education funding from Government ministries, CSR initiatives, NGOs and corporate foundations.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>100% Free for all Indian Students</span>
            </div>
          </div>

          {/* Column 1: Discover */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('scholarships')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  All Scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-match')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>AI Scholarship Match</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    Smart
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scholarships')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Government Schemes (NSP)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scholarships')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Corporate CSR Grants
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scholarships')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Girls & Women Scholarships
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Student Services */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Student Hub
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('saved')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Saved Scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('applications')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  My Applications Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profile')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Eligibility Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                >
                  Terms & Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Official Disclaimer Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 leading-relaxed mb-8">
          <strong className="text-slate-700 block mb-1">Important Scholarship Notice & Disclaimer:</strong>
          Scholarship information can change. Always verify eligibility, deadlines, and requirements with the official scholarship provider or portal. Scholarship Finder is an informational discovery catalog and AI recommendation utility. We do not charge application processing fees or guarantee selection results.
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Scholarship Finder India. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-600 cursor-pointer">
              Privacy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-600 cursor-pointer">
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
