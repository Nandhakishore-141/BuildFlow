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
import { useState, useRef } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

const workerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
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
    skill: z.string().min(1, 'Please select your primary skill'),
    experience: z.string().min(1, 'Please select your years of experience'),
    location: z.string().min(2, 'Please enter your current work location'),
    availability: z.enum(['Available', 'Busy', 'Unavailable'], {
      required_error: 'Please select your availability',
    }),
    dailyWage: z.string().optional(),
    aboutMe: z.string().max(300, 'About me can be at most 300 characters').optional(),
    acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const SKILL_OPTIONS = [
  'Mason',
  'Electrician',
  'Painter',
  'Plumber',
  'Carpenter',
  'Welder',
  'Tile Worker',
  'Steel Fixer',
];

const EXPERIENCE_OPTIONS = [
  '1-2 years',
  '3-5 years',
  '6-9 years',
  '10+ years',
];

export function WorkerRegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const globalError = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const [successMsg, setSuccessMsg] = useState('');

  // Photo uploads
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [portfolioPhoto, setPortfolioPhoto] = useState(null);
  const profileInputRef = useRef(null);
  const portfolioInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      skill: '',
      experience: '',
      location: '',
      availability: 'Available',
      dailyWage: '',
      aboutMe: '',
      acceptTerms: false,
    },
  });

  const handlePhotoChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfilePhoto(reader.result);
        } else {
          setPortfolioPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    clearError();
    setSuccessMsg('');
    const registerData = {
      name: data.fullName,
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: 'Worker',
      skill: data.skill,
      experience: data.experience,
      location: data.location,
      availability: data.availability,
      dailyWage: data.dailyWage,
      aboutMe: data.aboutMe,
      avatarImg: profilePhoto,
      portfolioImg: portfolioPhoto,
    };

    const result = await registerUser(registerData);
    if (result.success) {
      setSuccessMsg('Worker profile created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  const selectedAvailability = watch('availability');

  return (
    <AuthLayout type="centered">
      <AuthCard className="max-w-xl w-full">
        <FormHeader
          title="Create Worker Profile"
          description="Build your professional profile to showcase skills, experience, and receive job invites."
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Avatar Upload Block */}
          <div className="flex flex-col items-center justify-center gap-2.5 pb-2">
            <div
              onClick={() => profileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 group"
            >
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-neutral-400">
                  <Camera className="w-6 h-6 mx-auto mb-1 group-hover:scale-105 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-wider block">Upload</span>
                </div>
              )}
              {profilePhoto && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold">
                  Change
                </div>
              )}
            </div>
            <input
              type="file"
              ref={profileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoChange(e, 'profile')}
            />
            <p className="text-[11px] text-neutral-400 font-medium">Profile Photo (Recommended)</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <AuthInput
              id="fullName"
              label="Full Name"
              placeholder="Rajesh Kumar"
              error={errors.fullName}
              {...register('fullName')}
            />

            <AuthInput
              id="email"
              label="Email Address"
              type="email"
              placeholder="rajesh@gmail.com"
              error={errors.email}
              {...register('email')}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <AuthInput
              id="phone"
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              error={errors.phone}
              {...register('phone')}
            />

            <AuthInput
              id="location"
              label="Work Location / City"
              placeholder="Mumbai, MH"
              error={errors.location}
              {...register('location')}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Skill Selector */}
            <div className="w-full">
              <label htmlFor="skill" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                Primary Skill
              </label>
              <select
                id="skill"
                className={cn(
                  'w-full px-4 py-3 text-sm text-neutral-900 bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-gold-500 focus:bg-white transition-all duration-200 cursor-pointer',
                  errors.skill && 'border-red-500 focus:border-red-500 bg-red-50/10'
                )}
                {...register('skill')}
              >
                <option value="">Select skill...</option>
                {SKILL_OPTIONS.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              {errors.skill && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.skill.message}</p>
              )}
            </div>

            {/* Experience Selector */}
            <div className="w-full">
              <label htmlFor="experience" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                Experience
              </label>
              <select
                id="experience"
                className={cn(
                  'w-full px-4 py-3 text-sm text-neutral-900 bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-gold-500 focus:bg-white transition-all duration-200 cursor-pointer',
                  errors.experience && 'border-red-500 focus:border-red-500 bg-red-50/10'
                )}
                {...register('experience')}
              >
                <option value="">Select experience...</option>
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
              {errors.experience && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.experience.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Availability */}
            <div className="w-full">
              <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2.5">
                Current Availability
              </label>
              <div className="flex gap-4">
                {['Available', 'Busy'].map((option) => (
                  <label
                    key={option}
                    className={cn(
                      'flex-1 flex items-center justify-center py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all duration-200',
                      selectedAvailability === option
                        ? option === 'Available'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-amber-50 border-amber-500 text-amber-700'
                        : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50'
                    )}
                  >
                    <input
                      type="radio"
                      value={option}
                      className="sr-only"
                      {...register('availability')}
                    />
                    <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: option === 'Available' ? '#10B981' : '#F59E0B' }} />
                    {option}
                  </label>
                ))}
              </div>
              {errors.availability && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.availability.message}</p>
              )}
            </div>

            <AuthInput
              id="dailyWage"
              label="Expected Daily Wage (Optional)"
              type="text"
              placeholder="e.g. ₹800"
              error={errors.dailyWage}
              {...register('dailyWage')}
            />
          </div>

          <div>
            <label htmlFor="aboutMe" className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
              About Me (Brief Bio)
            </label>
            <textarea
              id="aboutMe"
              rows="3"
              placeholder="Tell contractors about your specialties and work style..."
              className={cn(
                'w-full px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-gold-500 focus:bg-white transition-all duration-200 resize-none',
                errors.aboutMe && 'border-red-500 focus:border-red-500 bg-red-50/10'
              )}
              {...register('aboutMe')}
            />
            {errors.aboutMe && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.aboutMe.message}</p>
            )}
          </div>

          {/* Portfolio Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
              Portfolio Work Photo (Optional)
            </label>
            <div
              onClick={() => portfolioInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center bg-neutral-50/50 hover:bg-neutral-50 hover:border-gold-400 cursor-pointer overflow-hidden transition-all duration-200 group"
            >
              {portfolioPhoto ? (
                <img
                  src={portfolioPhoto}
                  alt="Portfolio Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-neutral-400">
                  <ImageIcon className="w-7 h-7 mx-auto mb-1.5 group-hover:scale-105 transition-transform" />
                  <p className="text-xs font-semibold text-neutral-600">Select a project picture</p>
                  <p className="text-[10px] mt-0.5 text-neutral-400">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={portfolioInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhotoChange(e, 'portfolio')}
            />
          </div>

          {/* Accept Terms */}
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
              Create Worker Profile
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
