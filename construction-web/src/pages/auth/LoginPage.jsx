import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormHeader } from '@/components/auth/FormHeader';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { SocialLoginButton } from '@/components/auth/SocialLoginButton';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { useState } from 'react';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const globalError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    clearError();
    setSuccessMsg('');
    const result = await login(data.email, data.password);
    if (result.success) {
      setSuccessMsg('Successfully logged in! Redirecting...');
      setTimeout(() => {
        const user = useAuthStore.getState().user;
        if (user?.role === 'Admin') navigate('/admin/dashboard');
        else if (user?.role === 'Contractor') navigate('/contractor/dashboard');
        else if (user?.role === 'Worker') navigate('/worker/dashboard');
        else if (user?.role === 'Homeowner') navigate('/homeowner/dashboard');
        else navigate('/');
      }, 1200);
    }
  };

  return (
    <AuthLayout type="split">
      <AuthCard className="border-0 shadow-none sm:p-0 bg-transparent">
        <FormHeader
          title="Sign in to your account"
          description="Enter your credentials below to access your projects and marketplace."
          align="left"
        />

        {globalError && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{globalError}</span>
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

          <div className="relative">
            <PasswordInput
              id="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password}
              {...register('password')}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-neutral-600 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4.5 h-4.5 rounded border-neutral-300 text-gold-500 focus:ring-gold-500 accent-gold-500 cursor-pointer"
                {...register('rememberMe')}
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-gold-600 hover:text-gold-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="pt-2">
            <AuthButton isLoading={isLoading} type="submit">
              Sign In
            </AuthButton>
          </div>


          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-x-0 h-px bg-neutral-200" />
            <span className="relative px-3 bg-white text-xs text-neutral-400 font-semibold uppercase tracking-wider">
              Or continue with
            </span>
          </div>

          <SocialLoginButton />
        </form>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-gold-600 hover:text-gold-700 transition-colors"
          >
            Create an Account
          </Link>
        </p>

        <AuthFooter className="lg:justify-start" />
      </AuthCard>
    </AuthLayout>
  );
}
