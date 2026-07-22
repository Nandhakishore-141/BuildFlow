import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormHeader } from '@/components/auth/FormHeader';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { useState } from 'react';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Mock API request
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    // Simple mock logic: accept any email, redirect to verify-email page
    setSuccessMsg('Reset code has been sent successfully.');
    setTimeout(() => {
      // Navigate to verify email page, passing state so it knows we came from forgot-password
      navigate('/verify-email', { state: { email: data.email } });
    }, 1000);
  };

  return (
    <AuthLayout type="centered">
      <AuthCard className="max-w-md">
        <FormHeader
          title="Forgot Password?"
          description="Enter your registered email below, and we will send you a reset link to verify your account."
          showBackButton
          onBackClick={() => navigate('/login')}
        />

        {errorMsg && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            error={errors.email}
            {...register('email')}
          />

          <div className="pt-2">
            <AuthButton isLoading={isLoading} type="submit">
              Send Reset Link
            </AuthButton>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Remember your password?{' '}
          <Link
            to="/login"
            className="font-bold text-gold-600 hover:text-gold-700 transition-colors"
          >
            Back to Login
          </Link>
        </p>

        <AuthFooter />
      </AuthCard>
    </AuthLayout>
  );
}
