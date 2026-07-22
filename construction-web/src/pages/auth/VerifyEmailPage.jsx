import { useLocation, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormHeader } from '@/components/auth/FormHeader';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your-email@company.com';
  
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  const handleResend = async () => {
    setIsResending(true);
    setResendStatus('');
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsResending(false);
    setResendStatus('A new verification email has been sent successfully.');
  };

  return (
    <AuthLayout type="centered">
      <AuthCard className="max-w-md text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gold-50 text-gold-600 mx-auto mb-6">
          <Mail className="w-8 h-8" />
        </div>

        <FormHeader
          title="Check your email"
          description={`We have sent a password reset link to ${email}. Please check your inbox and click the link to verify your account.`}
          align="center"
        />

        {resendStatus && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{resendStatus}</span>
          </div>
        )}

        <div className="space-y-4">
          <AuthButton
            variant="primary"
            onClick={() => navigate('/reset-password', { state: { email } })}
          >
            Go to Reset Password (Mock)
          </AuthButton>

          <AuthButton
            variant="outline"
            isLoading={isResending}
            onClick={handleResend}
          >
            Resend Email
          </AuthButton>
        </div>

        <p className="mt-8 text-sm text-neutral-500">
          Back to{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-bold text-gold-600 hover:text-gold-700 transition-colors cursor-pointer bg-transparent border-0 focus:outline-none"
          >
            Sign In
          </button>
        </p>

        <AuthFooter />
      </AuthCard>
    </AuthLayout>
  );
}
