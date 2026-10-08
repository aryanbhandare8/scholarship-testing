const BASE_URL = 'http://localhost:3000/api';

async function runAuthTests() {
  console.log('================================================================');
  console.log('           STARTING COMPLETE AUTHENTICATION & OTP TEST SUITE    ');
  console.log('================================================================');

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition: boolean, testName: string, detail?: any) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      testsPassed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`, detail || '');
      testsFailed++;
    }
  }

  const testEmail = `test.scholar.${Date.now()}@example.com`;
  const testPassword = 'SecurePassword@2026!';

  // Helper to fetch latest OTP from dev-inbox
  async function getLatestOtp(email: string, purpose: string): Promise<string | null> {
    const res = await fetch(`${BASE_URL}/auth/dev-inbox`);
    const data = await res.json();
    const match = data.messages?.find(
      (m: any) => m.to.toLowerCase() === email.toLowerCase() && m.purpose === purpose
    );
    return match ? match.otp : null;
  }

  // -------------------------------------------------------------
  // Scenario 1: Successful Registration
  // -------------------------------------------------------------
  console.log('\n--- Scenario 1: User Registration ---');
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rohan Patil',
      email: testEmail,
      password: testPassword,
    }),
  });
  const regData = await regRes.json();
  assert(
    regRes.status === 201 && regData.requiresVerification === true && regData.email === testEmail,
    'Scenario 1: User registration succeeds and requiresVerification is true',
    regData
  );

  const otp1 = await getLatestOtp(testEmail, 'email_verification');
  assert(Boolean(otp1 && /^\d{6}$/.test(otp1)), 'Scenario 1: 6-digit OTP generated & dispatched for registration', otp1);

  // -------------------------------------------------------------
  // Scenario 8: Login with unverified email
  // -------------------------------------------------------------
  console.log('\n--- Scenario 8: Login with Unverified Email ---');
  const unverifiedLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });
  const unverifiedLoginData = await unverifiedLoginRes.json();
  assert(
    unverifiedLoginRes.status === 403 && unverifiedLoginData.requiresVerification === true,
    'Scenario 8: Login is rejected (403) with requiresVerification: true for unverified email',
    unverifiedLoginData
  );

  // -------------------------------------------------------------
  // Scenario 9: Login with incorrect password
  // -------------------------------------------------------------
  console.log('\n--- Scenario 9: Login with Incorrect Password ---');
  const wrongPassRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'WrongPassword123' }),
  });
  assert(wrongPassRes.status === 401, 'Scenario 9: Login rejected (401) on wrong password');

  // -------------------------------------------------------------
  // Scenario 2: Incorrect OTP
  // -------------------------------------------------------------
  console.log('\n--- Scenario 2: Incorrect OTP Verification ---');
  const badOtpRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      otp: '000000',
      purpose: 'email_verification',
    }),
  });
  const badOtpData = await badOtpRes.json();
  assert(
    badOtpRes.status === 400 && badOtpData.error && badOtpData.error.includes('attempt'),
    'Scenario 2: Incorrect OTP rejected with remaining attempts notice',
    badOtpData
  );

  // -------------------------------------------------------------
  // Scenario 5: Too Many OTP Attempts
  // -------------------------------------------------------------
  console.log('\n--- Scenario 5: Too Many Failed OTP Attempts ---');
  let lastAttemptData: any;
  for (let i = 0; i < 4; i++) {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, otp: '000000', purpose: 'email_verification' }),
    });
    lastAttemptData = await res.json();
  }
  assert(
    lastAttemptData.error && lastAttemptData.error.toLowerCase().includes('maximum attempts exceeded'),
    'Scenario 5: Lockout after 5 failed OTP attempts',
    lastAttemptData
  );

  // -------------------------------------------------------------
  // Scenario 6: OTP Resend Rate Limit
  // -------------------------------------------------------------
  console.log('\n--- Scenario 6: OTP Resend Rate Limit ---');
  // Attempt immediate resend (cooldown is 60s)
  const resendRes1 = await fetch(`${BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, purpose: 'email_verification' }),
  });
  const resendData1 = await resendRes1.json();
  assert(
    resendRes1.status === 429 && Boolean(resendData1.remainingSeconds),
    'Scenario 6: Rate limit enforced on rapid OTP resend (429 Too Many Requests)',
    resendData1
  );

  // Register a new test user to test successful verification, reuse, and expiration
  const testEmail2 = `test.verify.${Date.now()}@example.com`;
  await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Aarav Patel', email: testEmail2, password: testPassword }),
  });
  const otp2 = await getLatestOtp(testEmail2, 'email_verification');

  // -------------------------------------------------------------
  // Scenario 7: Successful Email Verification
  // -------------------------------------------------------------
  console.log('\n--- Scenario 7: Successful Email Verification ---');
  const verifyRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail2, otp: otp2, purpose: 'email_verification' }),
  });
  const verifyData = await verifyRes.json();
  assert(
    verifyRes.status === 200 && verifyData.verified === true && verifyData.user.emailVerified === true && Boolean(verifyData.token),
    'Scenario 7: Successful OTP verification activates account and returns session token',
    verifyData
  );

  const sessionToken = verifyData.token;

  // -------------------------------------------------------------
  // Scenario 4: Reused OTP
  // -------------------------------------------------------------
  console.log('\n--- Scenario 4: Reused OTP Invalidation ---');
  const reuseRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail2, otp: otp2, purpose: 'email_verification' }),
  });
  const reuseData = await reuseRes.json();
  assert(
    reuseRes.status === 400 && reuseData.error && reuseData.error.includes('No active OTP'),
    'Scenario 4: Reusing an already-verified OTP is strictly blocked',
    reuseData
  );

  // -------------------------------------------------------------
  // Scenario 10: Successful Login
  // -------------------------------------------------------------
  console.log('\n--- Scenario 10: Successful Login ---');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail2, password: testPassword }),
  });
  const loginData = await loginRes.json();
  assert(
    loginRes.status === 200 && loginData.success === true && loginData.user.email === testEmail2 && Boolean(loginData.token),
    'Scenario 10: Successful login returns authenticated user and session identifier',
    loginData
  );

  const activeToken = loginData.token;

  // -------------------------------------------------------------
  // Scenario 16: Access with Valid Authentication
  // -------------------------------------------------------------
  console.log('\n--- Scenario 16: Authenticated Session Check ---');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${activeToken}` },
  });
  const meData = await meRes.json();
  assert(
    meRes.status === 200 && meData.authenticated === true && meData.user.email === testEmail2,
    'Scenario 16: /api/auth/me confirms authenticated session with Bearer token',
    meData
  );

  // -------------------------------------------------------------
  // Scenario 11: Logout
  // -------------------------------------------------------------
  console.log('\n--- Scenario 11: Logout ---');
  const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${activeToken}` },
  });
  const logoutData = await logoutRes.json();
  assert(logoutRes.status === 200 && logoutData.success === true, 'Scenario 11: Logout succeeds', logoutData);

  // -------------------------------------------------------------
  // Scenario 15: Access Protected Route Without Authentication
  // -------------------------------------------------------------
  console.log('\n--- Scenario 15: Access Without Authentication ---');
  const afterLogoutRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${activeToken}` },
  });
  const afterLogoutData = await afterLogoutRes.json();
  assert(
    afterLogoutData.authenticated === false && afterLogoutData.user === null,
    'Scenario 15: Invalid/revoked session returns authenticated: false',
    afterLogoutData
  );

  // -------------------------------------------------------------
  // Scenario 12: Forgot Password
  // -------------------------------------------------------------
  console.log('\n--- Scenario 12: Forgot Password ---');
  const forgotRes = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail2 }),
  });
  const forgotData = await forgotRes.json();
  assert(forgotRes.status === 200 && forgotData.success === true, 'Scenario 12: Forgot password dispatches reset code', forgotData);

  const resetOtp = await getLatestOtp(testEmail2, 'password_reset');
  assert(Boolean(resetOtp && /^\d{6}$/.test(resetOtp)), 'Scenario 12: Reset OTP received in inbox', resetOtp);

  // -------------------------------------------------------------
  // Scenario 14: Successful Password Reset
  // -------------------------------------------------------------
  console.log('\n--- Scenario 14: Successful Password Reset ---');
  const newSecretPassword = 'BrandNewPassword@2026!';
  const resetRes = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail2,
      otp: resetOtp,
      newPassword: newSecretPassword,
    }),
  });
  const resetData = await resetRes.json();
  assert(
    resetRes.status === 200 && resetData.success === true && Boolean(resetData.token),
    'Scenario 14: Password reset succeeds with valid OTP and issues fresh session',
    resetData
  );

  // Verify new password works
  const newLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail2, password: newSecretPassword }),
  });
  const newLoginData = await newLoginRes.json();
  assert(newLoginRes.status === 200 && newLoginData.success === true, 'Scenario 14: Login succeeds with newly updated password', newLoginData);

  // -------------------------------------------------------------
  // Scenario 13 & 3: Reused / Expired Reset Token Check
  // -------------------------------------------------------------
  console.log('\n--- Scenario 13 & 3: Expired / Reused Password Reset OTP ---');
  const reusedResetRes = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail2,
      otp: resetOtp,
      newPassword: 'AnotherPassword@123',
    }),
  });
  const reusedResetData = await reusedResetRes.json();
  assert(
    reusedResetRes.status === 400 && reusedResetData.error && reusedResetData.error.includes('expired'),
    'Scenario 13 & 3: Expired / already used reset code is rejected',
    reusedResetData
  );

  console.log('\n================================================================');
  console.log(`TEST RESULTS: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('================================================================');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runAuthTests().catch((err) => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
