import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass',
  },
});

/**
 * Dispatch verification email to user
 * @param {string} email 
 * @param {string} name 
 * @param {string} token 
 */
export const sendVerificationEmail = async (email, name, token) => {
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?verifyToken=${token}&email=${encodeURIComponent(email)}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || '"ConstructIQ Support" <noreply@constructiq.io>',
    to: email,
    subject: 'Verify your ConstructIQ Account',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h2 style="color: #D4AF37; margin-bottom: 20px;">Welcome to ConstructIQ!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up. Please click the button below to verify your email address and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Account</a>
        </div>
        <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #737373;">${verifyUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p style="font-size: 12px; color: #a3a3a3;">This is an automated email. If you did not sign up for ConstructIQ, please ignore this message.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email successfully dispatched to ${email}. Message ID: ${info.messageId}`);
    console.log(`[TESTING ONLY] Verification URL: ${verifyUrl}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending verification email to ${email}:`, error.message);
    console.log(`[FALLBACK LOGGING] Verification URL: ${verifyUrl}`);
    return { success: false, error: error.message };
  }
};

/**
 * Dispatch password reset email link
 * @param {string} email 
 * @param {string} name 
 * @param {string} token 
 */
export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?resetToken=${token}&email=${encodeURIComponent(email)}`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"ConstructIQ Support" <noreply@constructiq.io>',
    to: email,
    subject: 'Reset your ConstructIQ Password',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h2 style="color: #D4AF37; margin-bottom: 20px;">Password Reset Request</h2>
        <p>Hi ${name || 'User'},</p>
        <p>You are receiving this email because a password reset request was initiated for your ConstructIQ account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>This reset link will expire in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>If the button doesn't work, copy and paste this URL:</p>
        <p style="word-break: break-all; color: #737373;">${resetUrl}</p>
        <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
        <p style="font-size: 12px; color: #a3a3a3;">This is an automated email. ConstructIQ Support.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email successfully dispatched to ${email}. Message ID: ${info.messageId}`);
    console.log(`[TESTING ONLY] Reset URL: ${resetUrl}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending password reset email to ${email}:`, error.message);
    console.log(`[FALLBACK LOGGING] Reset URL: ${resetUrl}`);
    return { success: false, error: error.message };
  }
};
