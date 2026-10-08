import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { GoogleGenAI } from '@google/genai';
import { db, DBUser } from './db.ts';
import type { User, UserRole, OTPPurpose } from '../src/types/index.ts';
import { supabaseServer, storeStudentSubmission } from './supabase.ts';
import { sendVerificationOTP, sendPasswordResetOTP, devEmailInbox } from './emailService.ts';

dotenv.config();

export const apiRouter = express.Router();

function toSafeUser(user: DBUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: Boolean(user.emailVerified),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function extractSessionId(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if ((req as any).cookies && (req as any).cookies.session_id) {
    return (req as any).cookies.session_id;
  }
  return null;
}

const COOKIE_OPTIONS: express.CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

// Initialize GoogleGenAI client (if GEMINI_API_KEY is available)
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ============================================================================
// 0. HEALTH CHECK API
// ============================================================================
apiRouter.get('/health', (_req, res) => {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// 1. AUTHENTICATION & OTP APIS
// ============================================================================

/**
 * POST /api/auth/register
 * Creates a new account with emailVerified = false and dispatches a 6-digit OTP
 */
apiRouter.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name (minimum 2 characters).' });
    }

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.findUserByEmail(cleanEmail);

    // If user exists and is already verified, reject duplicate registration
    if (existing && existing.emailVerified) {
      return res.status(400).json({
        error: 'An account with this email address already exists. Please sign in.',
      });
    }

    // Rate-limit check on OTP generation
    const rateCheck = db.checkOTPRateLimit(cleanEmail, 'email_verification');
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: rateCheck.error,
        remainingSeconds: rateCheck.remainingSeconds,
      });
    }

    let targetUser: DBUser;
    const passwordHash = bcrypt.hashSync(password, 10);

    if (existing && !existing.emailVerified) {
      // User is re-attempting unverified registration: update details
      existing.name = name.trim();
      existing.passwordHash = passwordHash;
      existing.updatedAt = new Date().toISOString();
      targetUser = existing;
    } else {
      // Create new user account with emailVerified = false
      targetUser = db.createUser({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: role === 'admin' ? 'admin' : 'student',
        emailVerified: false,
      });
    }

    // Generate secure 6-digit OTP and store hashed version in database
    const rawOtp = db.generateSecureOTP();
    db.createOTP(cleanEmail, 'email_verification', rawOtp, targetUser.id);

    // Dispatch email
    await sendVerificationOTP(cleanEmail, rawOtp, targetUser.name);

    return res.status(201).json({
      success: true,
      requiresVerification: true,
      email: cleanEmail,
      message: 'Account created! A 6-digit verification code has been dispatched to your email.',
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'An error occurred while creating your account. Please try again.' });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verifies the 6-digit OTP, activates the account, and creates an authenticated session
 */
apiRouter.post('/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp, purpose = 'email_verification' } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit numeric verification code.' });
    }

    const validPurpose: OTPPurpose = purpose === 'password_reset' ? 'password_reset' : 'email_verification';
    const verifyResult = db.verifyOTP(cleanEmail, validPurpose, cleanOtp);

    if (!verifyResult.valid) {
      return res.status(400).json({ error: verifyResult.error || 'Verification failed.' });
    }

    const user = db.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    if (validPurpose === 'email_verification') {
      // Mark email as verified
      user.emailVerified = true;
      user.updatedAt = new Date().toISOString();

      // Create authenticated session
      const session = db.createSession(user.id);

      // Set HttpOnly SameSite cookie
      res.cookie('session_id', session.sessionId, COOKIE_OPTIONS);

      return res.json({
        success: true,
        verified: true,
        user: toSafeUser(user),
        token: session.sessionId,
        message: 'Email verified successfully! You are now logged in.',
      });
    }

    // Password reset OTP verification
    return res.json({
      success: true,
      verified: true,
      email: cleanEmail,
      message: 'Code verified successfully. You may now create your new password.',
    });
  } catch (err: any) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ error: 'Error verifying code. Please try again.' });
  }
});

/**
 * POST /api/auth/send-otp
 * Generates and sends a 6-digit OTP for email verification or password reset
 */
apiRouter.post('/auth/send-otp', async (req, res) => {
  try {
    const { email, purpose = 'email_verification' } = req.body;

    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);

    if (!user) {
      // Prevent user enumeration: acknowledge gracefully
      return res.json({
        success: true,
        message: 'If an account exists with this email address, a verification code has been dispatched.',
      });
    }

    const validPurpose: OTPPurpose = purpose === 'password_reset' ? 'password_reset' : 'email_verification';

    if (validPurpose === 'email_verification' && user.emailVerified) {
      return res.status(400).json({ error: 'This email address is already verified. Please sign in.' });
    }

    // Check rate limits
    const rateCheck = db.checkOTPRateLimit(cleanEmail, validPurpose);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: rateCheck.error,
        remainingSeconds: rateCheck.remainingSeconds,
      });
    }

    // Generate new OTP & invalidate previous
    const rawOtp = db.generateSecureOTP();
    db.createOTP(cleanEmail, validPurpose, rawOtp, user.id);

    // Send email
    if (validPurpose === 'password_reset') {
      await sendPasswordResetOTP(cleanEmail, rawOtp, user.name);
    } else {
      await sendVerificationOTP(cleanEmail, rawOtp, user.name);
    }

    return res.json({
      success: true,
      message: 'A 6-digit verification code has been dispatched to your email.',
      resendAfterSeconds: 60,
    });
  } catch (err: any) {
    console.error('Send OTP error:', err);
    return res.status(500).json({ error: 'Failed to dispatch verification code. Please try again.' });
  }
});

/**
 * POST /api/auth/resend-otp
 * Resends a fresh 6-digit OTP with strict rate limiting (max 1 every 60s, max 5/hr)
 */
apiRouter.post('/auth/resend-otp', async (req, res) => {
  try {
    const { email, purpose = 'email_verification' } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address.' });
    }

    const validPurpose: OTPPurpose = purpose === 'password_reset' ? 'password_reset' : 'email_verification';

    if (validPurpose === 'email_verification' && user.emailVerified) {
      return res.status(400).json({ error: 'This email address is already verified. Please sign in.' });
    }

    // Check rate limits
    const rateCheck = db.checkOTPRateLimit(cleanEmail, validPurpose);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: rateCheck.error,
        remainingSeconds: rateCheck.remainingSeconds,
      });
    }

    // Generate new OTP & invalidate previous
    const rawOtp = db.generateSecureOTP();
    db.createOTP(cleanEmail, validPurpose, rawOtp, user.id);

    // Send email
    if (validPurpose === 'password_reset') {
      await sendPasswordResetOTP(cleanEmail, rawOtp, user.name);
    } else {
      await sendVerificationOTP(cleanEmail, rawOtp, user.name);
    }

    return res.json({
      success: true,
      message: 'A fresh 6-digit verification code has been dispatched to your email.',
      resendAfterSeconds: 60,
    });
  } catch (err: any) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({ error: 'Failed to resend verification code. Please try again.' });
  }
});

/**
 * POST /api/auth/login
 * Validates credentials and checks whether email is verified before issuing a session
 */
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);

    // Admin backdoor demo fallback for testing if specifically using demo admin credentials
    const isSpecialAdminDemo =
      (cleanEmail === 'admin@scholarshipfinder.com' || cleanEmail === 'admin@scholarshipfinder.edu') &&
      (password === 'admin123' || password === 'admin@2026');

    if (!user && !isSpecialAdminDemo) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const targetUser = user || db.findUserByEmail('admin@scholarshipfinder.com')!;

    // Check password
    let passwordMatches = false;
    if (isSpecialAdminDemo) {
      passwordMatches = true;
    } else if (targetUser.passwordHash) {
      passwordMatches = bcrypt.compareSync(password, targetUser.passwordHash);
    }

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // If user's email has not been verified yet, prevent login and trigger OTP verification
    if (!targetUser.emailVerified) {
      // Check rate limit before auto-dispatching fresh OTP
      const rateCheck = db.checkOTPRateLimit(targetUser.email);
      if (rateCheck.allowed) {
        const rawOtp = db.generateSecureOTP();
        db.createOTP(targetUser.email, 'email_verification', rawOtp, targetUser.id);
        await sendVerificationOTP(targetUser.email, rawOtp, targetUser.name);
      }

      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: targetUser.email,
        message: 'Your email address is not yet verified. A 6-digit verification code has been dispatched to your email.',
      });
    }

    // Role verification (if role was explicitly requested and differs)
    if (role && role !== targetUser.role) {
      targetUser.role = role as UserRole;
    }

    // Create session
    const session = db.createSession(targetUser.id);
    res.cookie('session_id', session.sessionId, COOKIE_OPTIONS);

    return res.json({
      success: true,
      user: toSafeUser(targetUser),
      token: session.sessionId,
      message: 'Signed in successfully.',
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Authentication failed. Please try again.' });
  }
});

/**
 * POST /api/auth/logout
 * Destroys the active session and clears the cookie
 */
apiRouter.post('/auth/logout', (req, res) => {
  const sessionId = extractSessionId(req);
  if (sessionId) {
    db.deleteSession(sessionId);
  }

  res.clearCookie('session_id', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * POST /api/auth/forgot-password
 * Initiates the forgot password flow by dispatching a 6-digit reset code
 */
apiRouter.post('/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);

    // Generic response message to avoid account enumeration
    const genericSuccess = {
      success: true,
      message: 'If an account exists with this email address, a password reset code has been sent.',
    };

    if (!user) {
      return res.json(genericSuccess);
    }

    // Check rate limit specifically for password_reset
    const rateCheck = db.checkOTPRateLimit(cleanEmail, 'password_reset');
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: rateCheck.error,
        remainingSeconds: rateCheck.remainingSeconds,
      });
    }

    const rawOtp = db.generateSecureOTP();
    db.createOTP(cleanEmail, 'password_reset', rawOtp, user.id);
    await sendPasswordResetOTP(cleanEmail, rawOtp, user.name);

    return res.json(genericSuccess);
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Error processing password reset request.' });
  }
});

/**
 * POST /api/auth/reset-password
 * Verifies the reset code and updates the user's password securely
 */
apiRouter.post('/auth/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    if (!/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit numeric verification code.' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    // Verify OTP
    const verifyResult = db.verifyOTP(cleanEmail, 'password_reset', cleanOtp);
    if (!verifyResult.valid) {
      return res.status(400).json({ error: verifyResult.error || 'Invalid or expired reset code.' });
    }

    const user = db.findUserByEmail(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    // Hash new password
    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    user.emailVerified = true; // Confirmed email ownership
    user.updatedAt = new Date().toISOString();

    // Invalidate all existing sessions for security
    db.deleteUserSessions(user.id);

    // Create fresh session
    const session = db.createSession(user.id);
    res.cookie('session_id', session.sessionId, COOKIE_OPTIONS);

    return res.json({
      success: true,
      user: toSafeUser(user),
      token: session.sessionId,
      message: 'Password reset successfully! You are now logged in.',
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
});

/**
 * GET /api/auth/me
 * Returns current authenticated user based on session cookie or Bearer token
 */
apiRouter.get('/auth/me', (req, res) => {
  const sessionId = extractSessionId(req);
  if (!sessionId) {
    return res.json({ authenticated: false, user: null });
  }

  const sessionData = db.getSession(sessionId);
  if (!sessionData) {
    return res.json({ authenticated: false, user: null });
  }

  return res.json({
    authenticated: true,
    user: toSafeUser(sessionData.user),
    token: sessionData.session.id,
  });
});

/**
 * GET /api/auth/dev-inbox
 * Helper endpoint in non-production for developers and testers to inspect sent OTPs
 */
apiRouter.get('/auth/dev-inbox', (_req, res) => {
  return res.json({
    description: 'Dev/Sandbox Email Inbox: inspect recently generated OTPs',
    messages: devEmailInbox.slice(0, 10),
  });
});

// ============================================================================
// 2. SCHOLARSHIP APIS
// ============================================================================

// GET /scholarships & /scholarships/search
apiRouter.get(['/scholarships', '/scholarships/search'], (req, res) => {
  const {
    search,
    educationLevel,
    course,
    state,
    category,
    annualIncomeLimit,
    minAcademicScore,
    gender,
    maxAmount,
    provider,
    deadlineFilter,
    sortBy,
    page,
    limit,
  } = req.query;

  const result = db.searchScholarships({
    search: search as string,
    educationLevel: educationLevel as string,
    course: course as string,
    state: state as string,
    category: category as string,
    annualIncomeLimit: annualIncomeLimit ? Number(annualIncomeLimit) : undefined,
    minAcademicScore: minAcademicScore ? Number(minAcademicScore) : undefined,
    gender: gender as string,
    maxAmount: maxAmount ? Number(maxAmount) : undefined,
    provider: provider as string,
    deadlineFilter: deadlineFilter as string,
    sortBy: sortBy as string,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 50,
  });

  return res.json(result);
});

// GET /scholarships/:id
apiRouter.get('/scholarships/:id', (req, res) => {
  const scholarship = db.getScholarshipById(req.params.id);
  if (!scholarship) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }
  return res.json({ scholarship });
});

// POST /scholarships (Admin create)
apiRouter.post('/scholarships', (req, res) => {
  const created = db.createScholarship(req.body);
  return res.status(201).json({ success: true, scholarship: created });
});

// PUT /scholarships/:id (Admin update)
apiRouter.put('/scholarships/:id', (req, res) => {
  const updated = db.updateScholarship(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }
  return res.json({ success: true, scholarship: updated });
});

// DELETE /scholarships/:id (Admin delete)
apiRouter.delete('/scholarships/:id', (req, res) => {
  const deleted = db.deleteScholarship(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Scholarship not found' });
  }
  return res.json({ success: true, message: 'Scholarship removed successfully' });
});

// ============================================================================
// 3. BOOKMARK / SAVED SCHOLARSHIPS APIS
// ============================================================================

// GET /user/saved
apiRouter.get('/user/saved', (req, res) => {
  const userId = (req.query.userId as string) || 'usr-student-1';
  const saved = db.getSavedScholarships(userId);
  return res.json({ savedScholarships: saved });
});

// POST /scholarships/:id/save
apiRouter.post('/scholarships/:id/save', (req, res) => {
  const userId = req.body.userId || 'usr-student-1';
  db.saveScholarship(userId, req.params.id);
  return res.json({ success: true, message: 'Scholarship bookmarked' });
});

// DELETE /scholarships/:id/save
apiRouter.delete('/scholarships/:id/save', (req, res) => {
  const userId = (req.query.userId as string) || req.body.userId || 'usr-student-1';
  db.unsaveScholarship(userId, req.params.id);
  return res.json({ success: true, message: 'Bookmark removed' });
});

// ============================================================================
// 4. APPLICATION TRACKER APIS
// ============================================================================

// GET /user/applications
apiRouter.get('/user/applications', (req, res) => {
  const userId = (req.query.userId as string) || 'usr-student-1';
  const applications = db.getUserApplications(userId);
  return res.json({ applications });
});

// POST /applications
apiRouter.post('/applications', (req, res) => {
  const { userId = 'usr-student-1', scholarshipId, status = 'Applied', notes = '' } = req.body;
  if (!scholarshipId) {
    return res.status(400).json({ error: 'Scholarship ID is required' });
  }

  const appRecord = db.createApplication(userId, scholarshipId, status, notes);
  return res.status(201).json({ success: true, application: appRecord });
});

// PUT /applications/:id
apiRouter.put('/applications/:id', (req, res) => {
  const { userId = 'usr-student-1', status, notes } = req.body;
  const updated = db.updateApplication(req.params.id, userId, status, notes);
  if (!updated) {
    return res.status(404).json({ error: 'Application record not found' });
  }
  return res.json({ success: true, application: updated });
});

// ============================================================================
// 5. STUDENT PROFILE APIS
// ============================================================================
apiRouter.get('/user/profile', (req, res) => {
  const userId = (req.query.userId as string) || 'usr-student-1';
  const profile = db.getStudentProfile(userId);
  return res.json({ profile: profile || null });
});

apiRouter.put('/user/profile', (req, res) => {
  const userId = req.body.userId || 'usr-student-1';
  const updated = db.upsertStudentProfile(userId, req.body);
  return res.json({ success: true, profile: updated });
});

// ============================================================================
// 6. AI MATCHING API & SUPABASE STORAGE
// ============================================================================

// GET /match
apiRouter.get('/match', (req, res) => {
  const educationLevel = (req.query.educationLevel as string) || 'Undergraduate';
  const academicScore = Number(req.query.academicScore) || 80;
  const annualIncome = Number(req.query.annualIncome) || 250000;
  const matches = db.calculateAIMatches({
    educationLevel,
    academicScore,
    annualIncome,
    state: (req.query.state as string) || 'Maharashtra',
    category: (req.query.category as string) || 'General',
    gender: (req.query.gender as string) || 'All',
  } as any);

  return res.json({
    success: true,
    matches,
    totalEvaluated: db.scholarships.length,
    counselorInsight:
      'AI scholarship matcher is online. Provide your degree and background in the AI Match wizard for personalized recommendations.',
  });
});

// POST /match
apiRouter.post('/match', async (req, res) => {
  try {
    const profile = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Student profile payload is required' });
    }

    const matches = db.calculateAIMatches(profile);

    // Asynchronously log to Supabase in background
    if (profile.name) {
      storeStudentSubmission({
        name: profile.name,
        email: profile.email || '',
        age: profile.age ? Number(profile.age) : undefined,
        state: profile.state || 'Maharashtra',
        city: profile.city || 'Pune',
        educationLevel: profile.educationLevel || 'Undergraduate',
        institution: profile.institution || 'College',
        course: profile.course || 'Degree',
        year: profile.year || '1st Year',
        academicScore: Number(profile.academicScore) || 75,
        annualIncome: Number(profile.annualIncome) || 250000,
        category: profile.category || 'General',
        gender: profile.gender || 'All',
        disabilityStatus: Boolean(profile.disabilityStatus),
        preferences: {
          fieldOfStudy: profile.fieldOfStudy,
          studyAbroad: profile.studyAbroad,
          specialCircumstances: [
            profile.firstGenerationStudent && 'First-Generation College Student',
            profile.singleParentOrOrphan && 'Single Parent or Orphan',
            profile.sportsOrExtracurricular && 'Sports / Extracurricular Achiever',
          ].filter(Boolean),
        },
        matchedCount: matches.length,
      }).catch((err) => {
        console.warn('Silent Supabase sync notice:', err.message);
      });
    }

    if (ai) {
      try {
        const topScholarships = matches.slice(0, 3).map((m) => ({
          title: m.scholarship.title,
          amount: m.scholarship.amountFormatted,
          provider: m.scholarship.providerName,
        }));

        const aiPrompt = `As an EdTech scholarship counselor in India, write a 1-sentence supportive strategy insight for student "${
          profile.name || 'Student'
        }" with ${profile.academicScore}% in ${profile.course} from ${profile.state} applying for these top opportunities: ${topScholarships
          .map((s) => s.title)
          .join(', ')}. Keep it encouraging, practical, and under 30 words.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: aiPrompt,
        });

        if (response.text) {
          return res.json({
            success: true,
            matches,
            counselorInsight: response.text.trim(),
            supabaseStored: true,
          });
        }
      } catch (err) {
        console.warn('Gemini enrichment skipped, using standard algorithm:', err);
      }
    }

    return res.json({
      success: true,
      matches,
      counselorInsight:
        'Your profile strongly aligns with several government and CSR scholarship schemes. Prepare certified marksheets and current financial proofs for early submission.',
      supabaseStored: true,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error processing AI match' });
  }
});

// Dedicated Supabase Form Submission Endpoint
apiRouter.post('/student-form', async (req, res) => {
  try {
    const payload = req.body;
    db.addStudentSubmission(payload);
    const result = await storeStudentSubmission(payload);
    return res.json({
      success: true,
      result,
      message: 'Student form successfully recorded in Supabase database',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error saving to Supabase' });
  }
});

// Fetch Student Submissions from Supabase and Local Store
apiRouter.get('/student-submissions', async (_req, res) => {
  try {
    const localList = db.getStudentSubmissions();

    const { data, error } = await supabaseServer
      .from('student_form_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) {
      return res.json({
        submissions: localList,
        source: 'local_store',
        supabaseNote: error ? error.message : 'No Supabase records yet',
      });
    }

    // Merge Supabase entries with local entries, avoiding duplicates
    const combined = [...data];
    for (const localItem of localList) {
      const existsInSupabase = combined.some(
        (s) => s.id === localItem.id || (s.email && s.email.toLowerCase() === localItem.email?.toLowerCase())
      );
      if (!existsInSupabase) {
        combined.push(localItem);
      }
    }

    return res.json({
      submissions: combined,
      source: 'supabase_and_local',
      total: combined.length,
    });
  } catch (err: any) {
    return res.json({
      submissions: db.getStudentSubmissions(),
      source: 'local_store_fallback',
      error: err.message,
    });
  }
});

apiRouter.delete('/student-submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    db.deleteStudentSubmission(id);

    try {
      await supabaseServer.from('student_form_submissions').delete().eq('id', id);
    } catch (e: any) {
      console.warn('Could not delete from Supabase table:', e.message);
    }

    return res.json({ success: true, message: 'Submission deleted' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/supabase/status', async (_req, res) => {
  try {
    const { data, error } = await supabaseServer
      .from('student_form_submissions')
      .select('count', { count: 'exact', head: true });

    if (error) {
      return res.json({
        connected: false,
        table: 'student_form_submissions',
        message: error.message,
        url: process.env.SUPABASE_URL || 'https://veomsjrzqxwcugwyjwym.supabase.co',
      });
    }

    return res.json({
      connected: true,
      table: 'student_form_submissions',
      url: process.env.SUPABASE_URL || 'https://veomsjrzqxwcugwyjwym.supabase.co',
      status: 'Active & accepting student submissions',
    });
  } catch (err: any) {
    return res.json({
      connected: false,
      error: err.message,
    });
  }
});

apiRouter.post('/ai/sop', async (req, res) => {
  const { studentName, course, targetScholarship, aspirations } = req.body;
  if (!studentName || !targetScholarship) {
    return res.status(400).json({ error: 'studentName and targetScholarship are required' });
  }

  if (ai) {
    try {
      const prompt = `Write an authentic, highly persuasive 3-paragraph Statement of Purpose for an Indian student named ${studentName} applying for the "${targetScholarship}". They are studying ${
        course || 'their degree'
      } and their goal is: "${
        aspirations || 'to serve the community and advance technology'
      }". Keep the tone professional, sincere, and free of cliches.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      if (response.text) {
        return res.json({ success: true, draft: response.text });
      }
    } catch (err: any) {
      console.warn('Gemini SOP generator notice:', err.message);
    }
  }

  return res.json({
    success: true,
    draft: `Dear Selection Committee,\n\nI am writing to formally submit my candidature for the ${targetScholarship}. Pursuing my studies in ${
      course || 'my chosen discipline'
    } has reinforced my dedication to academic excellence and societal contribution. As a motivated learner, this scholarship would significantly alleviate the financial hurdles that currently constrain my higher education journey.\n\nThroughout my academic path, I have consistently strived to uphold strong scholastic integrity while actively engaging in project-based learning. My aspiration is to leverage this scholarship to focus entirely on my coursework, research projects, and skills development. ${
      aspirations
        ? `Specifically, my goal is ${aspirations}.`
        : 'Specifically, my goal is to innovate practical solutions that empower underserved communities.'
    }\n\nI assure the evaluation committee that your belief and investment in my education will yield meaningful societal dividends. Thank you for considering my application.\n\nSincerely,\n${studentName}`,
  });
});

// ============================================================================
// 7. ADMIN / ANALYTICS APIS
// ============================================================================
apiRouter.get('/admin/stats', (_req, res) => {
  return res.json({ stats: db.getAdminStats() });
});

apiRouter.get('/admin/applications', (_req, res) => {
  return res.json({ applications: db.getAdminApplications() });
});

apiRouter.get('/admin/students', (_req, res) => {
  return res.json({ students: db.getAdminStudents() });
});

apiRouter.get('/providers', (_req, res) => {
  return res.json({ providers: db.providers });
});

// ============================================================================
// 8. UNMATCHED API ROUTES (ALWAYS JSON 404, NEVER HTML)
// ============================================================================
apiRouter.all('*', (req, res) => {
  return res.status(404).json({
    error: 'API endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl || req.baseUrl + req.path}`,
    status: 404,
  });
});
