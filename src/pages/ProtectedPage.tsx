import React from 'react';
import { ShieldAlert, Lock, ArrowRight, UserCheck, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedPageProps {
  onNavigate: (view: string) => void;
  targetViewName?: string;
  requiredRole?: 'student' | 'admin';
}

export const ProtectedPage: React.FC<ProtectedPageProps> = ({
  onNavigate,
  targetViewName = 'Dashboard',
  requiredRole = 'student',
}) => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 bg-grid-subtle">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200/90 p-8 sm:p-10 text-center">
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-5 shadow-lg shadow-blue-500/20">
          <Lock className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Authenticated Access Required</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          {requiredRole === 'admin' ? 'Administrator Console Locked' : `Access to ${targetViewName} is Protected`}
        </h2>

        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
          {user && !user.emailVerified
            ? 'Your account email has not been verified yet. Please complete OTP verification to access your dashboard.'
            : requiredRole === 'admin'
            ? 'This area requires administrative privileges. Please log in with an administrator account to continue.'
            : 'This section contains your personalized scholarship applications, saved bookmarks, eligibility profiles, and counselor matches. Please sign in or create a free student account.'}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {user && !user.emailVerified ? (
            <button
              onClick={() => onNavigate('verify-otp')}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Verify Your Email with OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Sign In to Account</span>
              </button>

              <button
                onClick={() => onNavigate('signup')}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => onNavigate('scholarships')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Or browse all public scholarships without signing in</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-left">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-blue-600 font-bold text-xs">🔒 100% Secure</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Encrypted sessions</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-blue-600 font-bold text-xs">⚡ OTP Verified</div>
            <div className="text-[10px] text-slate-500 mt-0.5">5-min secure codes</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-blue-600 font-bold text-xs">🎓 Free for Students</div>
            <div className="text-[10px] text-slate-500 mt-0.5">All features included</div>
          </div>
        </div>
      </div>
    </div>
  );
};
