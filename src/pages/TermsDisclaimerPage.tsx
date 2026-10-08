import React from 'react';
import { AlertTriangle, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export const TermsDisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Legal & Regulatory Terms</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms of Service & Official Disclaimer
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Last Updated: Academic Year 2026–2027
        </p>
      </div>

      {/* Prominent Mandatory Disclaimer Banner */}
      <div className="p-6 bg-amber-50 border-2 border-amber-200 rounded-3xl space-y-2 text-amber-950">
        <h2 className="text-base font-extrabold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-700" />
          <span>Mandatory Disclaimer on Scholarship Information</span>
        </h2>
        <p className="text-xs sm:text-sm leading-relaxed text-amber-900 font-medium">
          “Scholarship information can change. Always verify eligibility, deadlines and requirements with the official scholarship provider.”
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 space-y-6 text-sm text-slate-600 leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">1. Nature of Service</h3>
          <p>
            Scholarship Finder is an independent informational discovery catalog and AI recommendation utility designed for educational purposes. We aggregate publicly available scholarship notifications from Central Ministries, State Welfare Boards, CSR Foundations, and NGOs across India.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">2. No Guarantee of Award or Selection</h3>
          <p>
            The final selection, verification of income/caste certificates, merit ranking, and disbursement decisions belong exclusively to the official awarding body or government scholarship nodal committee. <strong>A high AI Match percentage (e.g. 95% Compatibility) does not constitute a guaranteed award or institutional approval.</strong>
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">3. Application Fees Warning</h3>
          <p>
            Scholarship Finder never requests monetary compensation or processing fees for applying to any scholarship. If you encounter third-party intermediaries demanding money in exchange for guaranteed government scholarships, report them immediately to national cybercrime authorities.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-slate-900">4. Third-Party Links & Deadlines</h3>
          <p>
            Application deadlines, eligibility criteria, and quota allocations can be amended at short notice by issuing authorities. Users are strongly advised to cross-verify all guidelines directly on the official application URL provided on each scholarship card.
          </p>
        </section>
      </div>
    </div>
  );
};
