import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Mail, ArrowRight, RefreshCw, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { OTPPurpose } from '../types';

interface VerifyOtpPageProps {
  onNavigate: (view: string) => void;
  email?: string;
  purpose?: OTPPurpose;
  onSuccess?: () => void;
}

export const VerifyOtpPage: React.FC<VerifyOtpPageProps> = ({
  onNavigate,
  email: initialEmail,
  purpose = 'email_verification',
  onSuccess,
}) => {
  const { verifyOtp, resendOtp, unverifiedEmail } = useAuth();
  const { toast } = useToast();

  const targetEmail = initialEmail || unverifiedEmail || '';
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();

    // In local development, check dev-inbox to show helpful test hint
    const fetchDevHint = async () => {
      try {
        const res = await fetch('/api/auth/dev-inbox');
        if (res.ok) {
          const data = await res.json();
          const latestForUser = data.messages?.find((m: any) => m.to.toLowerCase() === targetEmail.toLowerCase());
          if (latestForUser) {
            setDevOtpHint(latestForUser.otp);
          }
        }
      } catch {}
    };
    if (targetEmail) {
      fetchDevHint();
    }
  }, [targetEmail]);

  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg(null);
    // Allow only numeric characters
    const numericChar = value.replace(/\D/g, '');

    if (!numericChar) {
      const nextDigits = [...digits];
      nextDigits[index] = '';
      setDigits(nextDigits);
      return;
    }

    // Handle single character
    const char = numericChar.slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = char;
    setDigits(nextDigits);

    // Auto-advance focus to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Move back on backspace if current cell is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const nextDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      nextDigits[i] = pastedData[i] || '';
    }
    setDigits(nextDigits);

    // Focus the cell following the pasted digits
    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const fullOtp = digits.join('');

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (fullOtp.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }

    if (!targetEmail) {
      setErrorMsg('No email specified. Please return to the registration or login page.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const result = await verifyOtp(targetEmail, fullOtp, purpose);
    setIsLoading(false);

    if (result.success) {
      setSuccessMsg(result.message || 'Verification successful!');
      toast({
        title: 'Verification Complete',
        message: purpose === 'password_reset'
          ? 'Code confirmed. Please set your new password.'
          : 'Your email has been verified. Welcome to Scholarship Finder!',
        type: 'success',
      });

      if (onSuccess) {
        onSuccess();
      } else if (purpose === 'password_reset') {
        onNavigate('reset-password');
      } else {
        onNavigate('dashboard');
      }
    } else {
      setErrorMsg(result.error || 'Verification failed. Please double check the code.');
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    if (!targetEmail) {
      setErrorMsg('No email address provided to resend verification code.');
      return;
    }

    setIsResending(true);
    setErrorMsg(null);

    const result = await resendOtp(targetEmail, purpose);
    setIsResending(false);

    if (result.success) {
      setCountdown(result.remainingSeconds || 60);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      toast({
        title: 'New Code Dispatched',
        message: `A fresh 6-digit code was sent to ${targetEmail}.`,
        type: 'info',
      });

      // Refresh test hint in dev
      try {
        const res = await fetch('/api/auth/dev-inbox');
        if (res.ok) {
          const data = await res.json();
          const latestForUser = data.messages?.find((m: any) => m.to.toLowerCase() === targetEmail.toLowerCase());
          if (latestForUser) setDevOtpHint(latestForUser.otp);
        }
      } catch {}
    } else {
      setErrorMsg(result.error || 'Unable to resend code right now.');
      if (result.remainingSeconds) {
        setCountdown(result.remainingSeconds);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center p-4 bg-grid-subtle">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/90 p-8 sm:p-10">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => onNavigate(purpose === 'password_reset' ? 'forgot-password' : 'login')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {purpose === 'password_reset' ? 'Password Reset' : 'Sign in'}</span>
        </button>

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-3 shadow-xs">
            <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {purpose === 'password_reset' ? 'Authorize Password Reset' : 'Verify Your Email'}
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            We sent a 6-digit confirmation code to:
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full mt-1.5 border border-slate-200">
            <Mail className="w-3 h-3 text-slate-500" />
            <span className="text-xs font-bold text-slate-800">{targetEmail || 'your email'}</span>
          </div>
        </div>

        {/* Feedback Alert Banners */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div className="leading-relaxed font-medium">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="leading-relaxed font-medium">{successMsg}</div>
          </div>
        )}

        {/* Dev OTP Helper Banner */}
        {devOtpHint && (
          <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-800">Demo Code: </span>
              <span className="font-mono font-extrabold tracking-widest text-blue-700 bg-white px-2 py-0.5 rounded border border-amber-300">
                {devOtpHint}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const arr = devOtpHint.split('').slice(0, 6);
                setDigits(arr);
              }}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer ml-2"
            >
              Auto-fill
            </button>
          </div>
        )}

        {/* 6-Digit OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-center text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Enter 6-Digit Verification Code
            </label>
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-extrabold font-mono rounded-xl border transition-all focus:outline-none ${
                    digit
                      ? 'border-blue-600 bg-blue-50/30 text-blue-900 ring-2 ring-blue-500/20'
                      : 'border-slate-300 bg-slate-50 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                  }`}
                  required
                />
              ))}
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
              Code is valid for 5 minutes
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || fullOtp.length !== 6}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <span>Verify & Proceed</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend OTP Section with Countdown */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-2">
            Didn't receive the email or code expired?
          </p>
          {countdown > 0 ? (
            <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
              <span>Resend available in</span>
              <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                0:{countdown < 10 ? `0${countdown}` : countdown}
              </span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer inline-flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Sending New Code...' : 'Resend Verification Code'}</span>
            </button>
          )}
        </div>

        {/* Re-enter Email Link */}
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Wrong email address? Click here to register with another.
          </button>
        </div>
      </div>
    </div>
  );
};
