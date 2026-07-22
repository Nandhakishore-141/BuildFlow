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
import { AuthFooter } from '@/components/auth/AuthFooter';
import { useState } from 'react';

const contractorSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^\+?[0-9\s-]{10,15}$/, 'Please enter a valid phone number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function ContractorRegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const globalError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      fullName: '',
      companyName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const onSubmit = async (data) => {
    clearError();
    setSuccessMsg('');
    const registerData = {
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: 'Contractor',
      companyName: data.companyName,
    };

    const result = await registerUser(registerData);
    if (result.success) {
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <AuthLayout type="centered">
      <AuthCard className="max-w-md">
        <FormHeader
          title="Contractor Signup"
          description="Create a contractor profile to manage construction projects and hire talent."
          showBackButton
          onBackClick={() => navigate('/register')}
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
            id="fullName"
            label="Full Name"
            placeholder="John Doe"
            error={errors.fullName}
            {...register('fullName')}
          />

          <AuthInput
            id="companyName"
            label="Company Name"
            placeholder="BuildWise Solutions"
            error={errors.companyName}
            {...register('companyName')}
          />

          <AuthInput
            id="email"
            label="Email Address"
            type="email"
            placeholder="john@company.com"
            error={errors.email}
            {...register('email')}
          />

          <AuthInput
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="+91 98765 43210"
            error={errors.phone}
            {...register('phone')}
          />

          <PasswordInput
            id="password"
            label="Password"
            placeholder="••••••••"
            error={errors.password}
            {...register('password')}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            error={errors.confirmPassword}
            {...register('confirmPassword')}
          />

          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-neutral-600 font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4.5 h-4.5 mt-0.5 rounded border-neutral-300 text-gold-500 focus:ring-gold-500 accent-gold-500 cursor-pointer"
                {...register('acceptTerms')}
              />
              <span className="leading-tight">
                I accept the{' '}
                <a href="#" className="text-gold-600 hover:text-gold-700 font-bold transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-gold-600 hover:text-gold-700 font-bold transition-colors">
                  Privacy Policy
                </a>.
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          <div className="pt-2">
            <AuthButton isLoading={isLoading} type="submit">
              Create Account
            </AuthButton>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-gold-600 hover:text-gold-700 transition-colors"
          >
            Sign In
          </Link>
        </p>

        <AuthFooter />
      </AuthCard>
    </AuthLayout>
  );
}
