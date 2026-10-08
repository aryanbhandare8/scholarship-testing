import React, { useState } from 'react';
import { GraduationCap, Mail, Lock, Shield, User, ArrowRight, AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface LoginPageProps {
  onNavigate: (view: string) => void;
  onRequireVerification?: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onRequireVerification }) => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('sujanbhosale94@gmail.com');
  const [password, setPassword] = useState('student@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const result = await login(email, password, role);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Logged in successfully',
        message: `Welcome back! You are logged in as ${role === 'admin' ? 'Admin' : 'Student'}.`,
        type: 'success',
      });
      onNavigate(role === 'admin' ? 'admin' : 'dashboard');
    } else if (result.requiresVerification) {
      toast({
        title: 'Email Verification Required',
        message: 'A 6-digit confirmation code was sent to your email address.',
        type: 'info',
      });
      if (onRequireVerification) {
        onRequireVerification(result.email || email);
      } else {
        onNavigate('verify-otp');
      }
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const handleDemoStudent = () => {
    setEmail('sujanbhosale94@gmail.com');
    setPassword('student@2026');
    setRole('student');
    setErrorMsg(null);
  };

  const handleDemoAdmin = () => {
    setEmail('admin@scholarshipfinder.com');
    setPassword('admin123');
    setRole('admin');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 bg-grid-subtle">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 p-8 sm:p-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-blue-500/20">
            <GraduationCap className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to Scholarship Finder
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to track applications, bookmarks, and match scores.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={handleDemoStudent}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              role === 'student'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student Login</span>
          </button>

          <button
            type="button"
            onClick={handleDemoAdmin}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div className="leading-relaxed font-medium">{errorMsg}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@student.edu.in"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{`Sign In as ${role === 'admin' ? 'Admin' : 'Student'}`}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 pt-6 border-t border-slate-100">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};
