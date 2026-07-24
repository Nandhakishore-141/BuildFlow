import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormHeader } from '@/components/auth/FormHeader';
import { RoleCard } from '@/components/auth/RoleCard';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Step 3 Schemas
const contractorSchema = z.object({
  name: z.string().min(2, 'Name must contain at least 2 characters').optional(),
  companyName: z.string().min(2, 'Company name is required'),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Valid email is required').optional(), // Only for email flow
  password: z.string().min(6, 'Min 6 characters').optional(), // Only for email flow
});

const homeownerSchema = z.object({
  name: z.string().min(2, 'Name must contain at least 2 characters').optional(),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

const workerSchema = z.object({
  name: z.string().min(2, 'Name must contain at least 2 characters').optional(),
  phone: z.string().min(5, 'Phone number is required'),
  skill: z.string().min(2, 'Trade/Skill is required'),
  experience: z.string().min(1, 'Experience is required'),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

export function RegisterEntryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const registerAction = useAuthStore((state) => state.register);
  const googleRegisterAction = useAuthStore((state) => state.googleRegister);
  
  const [step, setStep] = useState(1);
  const [authMethod, setAuthMethod] = useState(null); // 'google' | 'email'
  const [googleData, setGoogleData] = useState(null); // { credential, profile }
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [serverErrors, setServerErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // If redirected from login page's Google button needing onboarding
  useEffect(() => {
    if (location.state?.authMethod === 'google' && location.state?.credential) {
      setAuthMethod('google');
      setGoogleData({
        credential: location.state.credential,
        profile: location.state.googleProfile,
      });
      setStep(2);
    }
  }, [location]);

  const handleGoogleSuccess = (credentialResponse) => {
    setAuthMethod('google');
    // We don't have the decoded profile here unless we decode the JWT locally, but we just need the credential
    setGoogleData({ credential: credentialResponse.credential, profile: {} });
    setStep(2);
  };

  const handleRoleSelect = () => {
    if (role) setStep(3);
  };

  const submitWizard = async (formData) => {
    setError(null);
    setIsLoading(true);

    let result;
    if (authMethod === 'google') {
      const data = { role, phone: formData.phone };
      if (role === 'Contractor') data.companyName = formData.companyName;
      if (role === 'Worker') {
        data.skill = formData.skill;
        data.experience = formData.experience;
      }
      result = await googleRegisterAction(googleData.credential, data);
    } else {
      const data = { ...formData, role };
      // Normal register action expects specific fields
      result = await registerAction(data);
    }

    setIsLoading(false);
    if (result.success) {
      if (authMethod === 'google') {
        navigate(role === 'Admin' ? '/admin/dashboard' : role === 'Contractor' ? '/contractor/dashboard' : role === 'Worker' ? '/worker/dashboard' : '/homeowner/dashboard');
      } else {
        navigate('/verify-email', { state: { email: formData.email } });
      }
    } else {
      setError(result.error);
      setServerErrors(result.errors || null);
    }
  };

  return (
    <AuthLayout type={step === 2 ? 'centered' : 'split'}>
      <div className="w-full max-w-5xl px-4 sm:px-6 mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <FormHeader title="Create your account" description="Join BuildFlow to manage your construction projects." align="center" />
              <div className="max-w-sm mx-auto mt-8 space-y-6">
                <div className="flex justify-center w-full">
                  <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google Sign-in failed')} width="100%" size="large" text="signup_with" theme="outline" />
                </div>
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-x-0 h-px bg-neutral-200" />
                  <span className="relative px-3 bg-white text-xs text-neutral-400 font-semibold uppercase">Or</span>
                </div>
                <AuthButton onClick={() => { setAuthMethod('email'); setStep(2); }} variant="outline">
                  Continue with Email
                </AuthButton>
                
                {error && <p className="text-red-500 text-sm text-center font-medium mt-4">{error}</p>}

                <p className="mt-8 text-center text-sm text-neutral-500">
                  Already have an account? <Link to="/login" className="font-bold text-gold-600">Sign In</Link>
                </p>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <FormHeader title="Choose your role" description="Select the role that fits your needs." showBackButton onBackClick={() => setStep(1)} />
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto my-8">
                <RoleCard emoji="👷" role="Contractor" description="Manage projects, teams, and materials." isSelected={role === 'Contractor'} onSelect={() => setRole('Contractor')} />
                <RoleCard emoji="🏡" role="Homeowner" description="Track progress, budget, and timeline." isSelected={role === 'Homeowner'} onSelect={() => setRole('Homeowner')} />
                <RoleCard emoji="🛠" role="Worker" description="Find contract jobs and manage tasks." isSelected={role === 'Worker'} onSelect={() => setRole('Worker')} />
              </div>
              <div className="max-w-xs mx-auto flex flex-col items-center gap-4">
                <AuthButton disabled={!role} onClick={handleRoleSelect}>Continue</AuthButton>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <FormHeader title={`Complete ${role} Profile`} description="Just a few more details." showBackButton onBackClick={() => setStep(2)} />
              
              <div className="max-w-md mx-auto mt-8">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-semibold rounded-lg">
                    {error}
                  </div>
                )}
                <Step3Form role={role} authMethod={authMethod} onSubmit={submitWizard} isLoading={isLoading} serverErrors={serverErrors} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AuthFooter />
      </div>
    </AuthLayout>
  );
}

const Step3Form = ({ role, authMethod, onSubmit, isLoading, serverErrors }) => {
  const schema = role === 'Contractor' ? contractorSchema : role === 'Worker' ? workerSchema : homeownerSchema;
  
  const { register, handleSubmit, setError: setFormError, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    if (serverErrors) {
      Object.keys(serverErrors).forEach((field) => {
        setFormError(field, { type: 'server', message: serverErrors[field] });
      });
    }
  }, [serverErrors, setFormError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {authMethod === 'email' && (
        <>
          <AuthInput id="name" label="Full Name" {...register('name')} required />
          <AuthInput id="email" label="Email Address" type="email" error={errors.email} {...register('email')} />
          <PasswordInput id="password" label="Password" error={errors.password} {...register('password')} />
        </>
      )}

      {role === 'Contractor' && (
        <AuthInput id="companyName" label="Company Name *" error={errors.companyName} {...register('companyName')} />
      )}
      
      {role === 'Worker' && (
        <>
          <AuthInput id="skill" label="Primary Trade/Skill *" error={errors.skill} {...register('skill')} />
          <div className="space-y-1">
            <label className="block text-sm font-bold text-neutral-700">Experience Level *</label>
            <select {...register('experience')} className="w-full h-12 px-4 rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-900 focus:bg-white focus:ring-2 focus:ring-gold-500 transition-all outline-none">
              <option value="Entry level">Entry level (0-2 years)</option>
              <option value="Intermediate">Intermediate (3-5 years)</option>
              <option value="Expert">Expert (5+ years)</option>
            </select>
          </div>
        </>
      )}

      <AuthInput id="phone" label="Phone Number *" error={errors.phone} {...register('phone')} />

      <div className="pt-4">
        <AuthButton type="submit" isLoading={isLoading}>Complete Registration</AuthButton>
      </div>
    </form>
  );
};
