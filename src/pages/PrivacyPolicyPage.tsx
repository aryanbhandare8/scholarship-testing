import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Student Data Protection</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Effective Date: Academic Year 2026–2027 • Compliance with India DPDP Act
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-6 text-sm text-slate-600 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">1. Commitment to Student Privacy</h2>
          <p>
            Scholarship Finder is committed to safeguarding the personal, academic, and economic privacy of students using our platform. We recognize that information regarding household income, disability status, caste, and academic scores is deeply sensitive.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Demographic Information:</strong> Name, age, domicile state, and city.</li>
            <li><strong>Academic Credentials:</strong> Current institution, course, year, and qualifying percentage/CGPA.</li>
            <li><strong>Eligibility Factors:</strong> Household annual income range, reservation category (General/OBC/SC/ST/Minority), and voluntarily declared disability status.</li>
            <li><strong>Activity Metrics:</strong> Bookmarked scholarships, application progress tags, and custom notes.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">3. How Your Information Is Used</h2>
          <p>
            Your information is used solely to compute transparent AI matching scores, filter regional schemes, and display relevant funding alerts. <strong>We strictly do not sell, rent, or trade student profiles to commercial coaching institutes, loan providers, or advertising brokers.</strong>
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Third-Party Official Portals</h2>
          <p>
            When you click "Apply Now", you are redirected to the official government (e.g. National Scholarship Portal) or corporate CSR application portal. Those respective organizations operate under their own independent privacy terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">5. Student Data Rights & Deletion</h2>
          <p>
            You retain complete ownership of your data. You may update or delete your academic profile and saved records at any time from your Student Dashboard settings.
          </p>
        </section>
      </div>
    </div>
  );
};
