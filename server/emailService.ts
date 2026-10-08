import dotenv from 'dotenv';

dotenv.config();

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

// In-memory debug log of last generated OTPs (for easy testing & dev server verification)
export const devEmailInbox: Array<{
  to: string;
  subject: string;
  otp: string;
  purpose: string;
  sentAt: string;
}> = [];

/**
 * Sends a 6-digit OTP for email verification
 */
export async function sendVerificationOTP(
  email: string,
  otp: string,
  name?: string
): Promise<EmailSendResult> {
  const recipientName = name ? name.trim() : 'Scholar';
  const subject = `${otp} is your Scholarship Finder verification code`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your Scholarship Finder Account</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); text-align: center;">
        <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; font-size: 24px; color: #ffffff; margin-bottom: 8px;">🎓</div>
        <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">Scholarship Finder</h1>
        <p style="margin: 4px 0 0 0; color: #bfdbfe; font-size: 13px;">Empowering Students Across India</p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 32px 32px 24px 32px;">
        <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 18px; font-weight: 700;">Hello ${recipientName},</h2>
        <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.6;">
          Thank you for joining Scholarship Finder. Please enter the following 6-digit verification code to confirm your email address and activate your account:
        </p>
        
        <!-- OTP Card -->
        <div style="background-color: #eff6ff; border: 1.5px dashed #3b82f6; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; display: inline-block;">${otp}</span>
          <p style="margin: 8px 0 0 0; color: #64748b; font-size: 12px; font-weight: 600;">Valid for 5 minutes only</p>
        </div>

        <p style="margin: 0 0 16px 0; color: #475569; font-size: 13px; line-height: 1.5;">
          If you didn't create an account on Scholarship Finder, you can safely ignore this email.
        </p>

        <!-- Security Notice -->
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 12px 16px; margin-top: 20px;">
          <p style="margin: 0; color: #64748b; font-size: 11px; line-height: 1.4;">
            🔒 <strong>Security Tip:</strong> Never share this code with anyone. Scholarship Finder staff will never ask for your verification code.
          </p>
        </div>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="margin: 0; color: #94a3b8; font-size: 11px;">
          © ${new Date().getFullYear()} Scholarship Finder India. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return await dispatchEmail(email, subject, htmlContent, otp, 'email_verification');
}

/**
 * Sends a 6-digit OTP for password reset
 */
export async function sendPasswordResetOTP(
  email: string,
  otp: string,
  name?: string
): Promise<EmailSendResult> {
  const recipientName = name ? name.trim() : 'Scholar';
  const subject = `${otp} is your Scholarship Finder password reset code`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your Scholarship Finder Password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%); text-align: center;">
        <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; background: rgba(255,255,255,0.2); border-radius: 12px; font-size: 24px; color: #ffffff; margin-bottom: 8px;">🔑</div>
        <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">Password Reset Request</h1>
        <p style="margin: 4px 0 0 0; color: #fecaca; font-size: 13px;">Scholarship Finder Security Center</p>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding: 32px 32px 24px 32px;">
        <h2 style="margin: 0 0 12px 0; color: #0f172a; font-size: 18px; font-weight: 700;">Hello ${recipientName},</h2>
        <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.6;">
          We received a request to reset the password associated with this email address. Use the 6-digit authorization code below to complete your password reset:
        </p>
        
        <!-- OTP Card -->
        <div style="background-color: #fef2f2; border: 1.5px dashed #ef4444; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #b91c1c; display: inline-block;">${otp}</span>
          <p style="margin: 8px 0 0 0; color: #7f1d1d; font-size: 12px; font-weight: 600;">Valid for 5 minutes only</p>
        </div>

        <p style="margin: 0 0 16px 0; color: #475569; font-size: 13px; line-height: 1.5;">
          If you did not request this password reset, someone may have entered your email by mistake. Your account remains secure and no changes have been made.
        </p>

        <!-- Security Notice -->
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 12px 16px; margin-top: 20px;">
          <p style="margin: 0; color: #64748b; font-size: 11px; line-height: 1.4;">
            🔒 <strong>Notice:</strong> Never share this reset code with anyone.
          </p>
        </div>
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
        <p style="margin: 0; color: #94a3b8; font-size: 11px;">
          © ${new Date().getFullYear()} Scholarship Finder India. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  return await dispatchEmail(email, subject, htmlContent, otp, 'password_reset');
}

/**
 * Internal dispatcher with support for Resend API, SendGrid API, or Console/Dev Sandbox
 */
async function dispatchEmail(
  to: string,
  subject: string,
  html: string,
  otp: string,
  purpose: string
): Promise<EmailSendResult> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const sendgridApiKey = process.env.SENDGRID_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'Scholarship Finder <auth@scholarshipfinder.com>';

  // Log to in-memory dev inbox for fast testing and inspection
  devEmailInbox.unshift({
    to,
    subject,
    otp,
    purpose,
    sentAt: new Date().toISOString(),
  });
  if (devEmailInbox.length > 50) devEmailInbox.pop();

  // 1. Resend API integration (if configured)
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [to],
          subject,
          html,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { id: string };
        console.log(`[EmailService] Dispatched via Resend to ${to}: ${data.id}`);
        return { success: true, messageId: data.id };
      }
      const errData = await res.text();
      console.warn('[EmailService] Resend API error:', errData);
    } catch (err: any) {
      console.error('[EmailService] Resend call failed:', err.message);
    }
  }

  // 2. SendGrid API integration (if configured)
  if (sendgridApiKey) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: emailFrom.includes('<') ? emailFrom.split('<')[1].replace('>', '') : emailFrom },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });
      if (res.ok || res.status === 202) {
        console.log(`[EmailService] Dispatched via SendGrid to ${to}`);
        return { success: true };
      }
      const errData = await res.text();
      console.warn('[EmailService] SendGrid API error:', errData);
    } catch (err: any) {
      console.error('[EmailService] SendGrid call failed:', err.message);
    }
  }

  // 3. Fallback Development & Sandbox Mode:
  // Output a clean, high-visibility OTP notice to the backend console
  console.log(`
╔════════════════════════════════════════════════════════════════════════╗
║                   EMAIL SERVICE SIMULATION                             ║
╠════════════════════════════════════════════════════════════════════════╣
║ To:      ${to.padEnd(58)}║
║ Purpose: ${purpose.padEnd(58)}║
║ Subject: ${subject.padEnd(58)}║
║ CODE:    >>>  ${otp}  <<< (Valid for 5 mins)                       ║
╚════════════════════════════════════════════════════════════════════════╝
`);

  return {
    success: true,
    simulated: true,
    messageId: `sim_${Date.now()}_${otp}`,
  };
}
