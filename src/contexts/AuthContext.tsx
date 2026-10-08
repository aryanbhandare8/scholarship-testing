import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, OTPPurpose } from '../types';

interface AuthResponse {
  success: boolean;
  requiresVerification?: boolean;
  email?: string;
  error?: string;
  message?: string;
  remainingSeconds?: number;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  unverifiedEmail: string | null;
  setUnverifiedEmail: (email: string | null) => void;
  login: (email: string, password: string, role?: UserRole) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<AuthResponse>;
  verifyOtp: (email: string, otp: string, purpose?: OTPPurpose) => Promise<AuthResponse>;
  resendOtp: (email: string, purpose?: OTPPurpose) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sf_auth_token'));
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(() => sessionStorage.getItem('sf_unverified_email'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const role = user?.role || 'student';
  const isAuthenticated = Boolean(user && user.emailVerified);

  // Sync token to localStorage
  const saveSession = (newToken: string | null, newUser: User | null) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      localStorage.setItem('sf_auth_token', newToken);
    } else {
      localStorage.removeItem('sf_auth_token');
    }
  };

  // Sync unverifiedEmail to sessionStorage
  const handleSetUnverifiedEmail = (email: string | null) => {
    setUnverifiedEmail(email);
    if (email) {
      sessionStorage.setItem('sf_unverified_email', email);
    } else {
      sessionStorage.removeItem('sf_unverified_email');
    }
  };

  // Check active session on initial load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedToken = localStorage.getItem('sf_auth_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (storedToken) {
          headers['Authorization'] = `Bearer ${storedToken}`;
        }

        const res = await fetch('/api/auth/me', {
          method: 'GET',
          headers,
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            setToken(data.token || storedToken);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Session check notice:', err);
      }

      // If no valid active session, ensure user is unauthenticated
      setUser(null);
      setToken(null);
      localStorage.removeItem('sf_auth_token');
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    requestedRole: UserRole = 'student'
  ): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: requestedRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Failed to create account.',
        };
      }

      if (data.requiresVerification) {
        handleSetUnverifiedEmail(data.email || email);
        return {
          success: true,
          requiresVerification: true,
          email: data.email || email,
          message: data.message,
        };
      }

      return { success: true };
    } catch (e: any) {
      console.error('Registration exception:', e);
      return { success: false, error: 'Network error. Please verify your connection and try again.' };
    }
  };

  const verifyOtp = async (
    email: string,
    otp: string,
    purpose: OTPPurpose = 'email_verification'
  ): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp, purpose }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Invalid verification code.',
        };
      }

      if (purpose === 'email_verification' && data.user) {
        saveSession(data.token, data.user);
        handleSetUnverifiedEmail(null);
      }

      return {
        success: true,
        message: data.message,
      };
    } catch (e: any) {
      console.error('OTP verification exception:', e);
      return { success: false, error: 'Network error while verifying OTP.' };
    }
  };

  const resendOtp = async (
    email: string,
    purpose: OTPPurpose = 'email_verification'
  ): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Failed to resend verification code.',
          remainingSeconds: data.remainingSeconds,
        };
      }

      return {
        success: true,
        message: data.message,
        remainingSeconds: data.resendAfterSeconds || 60,
      };
    } catch (e: any) {
      console.error('Resend OTP exception:', e);
      return { success: false, error: 'Network error while resending OTP.' };
    }
  };

  const login = async (
    email: string,
    password: string,
    requestedRole: UserRole = 'student'
  ): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, role: requestedRole }),
      });

      const data = await res.json();

      if (res.status === 403 && data.requiresVerification) {
        handleSetUnverifiedEmail(data.email || email);
        return {
          success: false,
          requiresVerification: true,
          email: data.email || email,
          error: data.message || 'Please verify your email address to log in.',
        };
      }

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Invalid email or password.',
        };
      }

      if (data.success && data.user) {
        saveSession(data.token, data.user);
        handleSetUnverifiedEmail(null);
        return { success: true };
      }

      return { success: false, error: 'Authentication failed.' };
    } catch (e: any) {
      console.error('Login exception:', e);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const forgotPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Error processing request.',
        };
      }

      return {
        success: true,
        message: data.message || 'If an account exists with this email, a reset code has been sent.',
      };
    } catch (e: any) {
      console.error('Forgot password exception:', e);
      return { success: false, error: 'Network error while requesting password reset.' };
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Failed to reset password.',
        };
      }

      if (data.user && data.token) {
        saveSession(data.token, data.user);
      }

      return {
        success: true,
        message: data.message || 'Password reset successfully.',
      };
    } catch (e: any) {
      console.error('Reset password exception:', e);
      return { success: false, error: 'Network error while resetting password.' };
    }
  };

  const logout = async () => {
    try {
      const storedToken = localStorage.getItem('sf_auth_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

      await fetch('/api/auth/logout', {
        method: 'POST',
        headers,
        credentials: 'include',
      });
    } catch (e) {
      console.warn('Logout network notice:', e);
    } finally {
      saveSession(null, null);
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      const updated: User = { ...user, role: newRole };
      if (newRole === 'admin') {
        updated.name = 'Administrator';
        updated.email = 'admin@scholarshipfinder.com';
      } else {
        updated.name = 'Sujan Bhosale';
        updated.email = 'sujanbhosale94@gmail.com';
      }
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        isLoading,
        unverifiedEmail,
        setUnverifiedEmail: handleSetUnverifiedEmail,
        login,
        register,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
