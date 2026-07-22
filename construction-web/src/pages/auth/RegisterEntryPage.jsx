import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { FormHeader } from '@/components/auth/FormHeader';
import { RoleCard } from '@/components/auth/RoleCard';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthFooter } from '@/components/auth/AuthFooter';
import { Link } from 'react-router-dom';

export function RegisterEntryPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'contractor',
      emoji: '👷',
      role: 'Contractor',
      description: 'Full control and oversight of all projects, team hiring, and materials.',
      features: ['Manage projects & budget', 'Hire skilled workers', 'Track expenses', 'Approve submitted work'],
    },
    {
      id: 'homeowner',
      emoji: '🏡',
      role: 'Homeowner',
      description: 'Transparent visibility into updates, budgets, and timeline of your building.',
      features: ['Track project progress', 'View approved updates', 'Monitor expenses', 'Receive notifications'],
    },
    {
      id: 'worker',
      emoji: '🛠',
      role: 'Worker',
      description: 'Find premium contract jobs, show off your skills, and manage daily tasks.',
      features: ['Create professional profile', 'Receive job invitations', 'Upload completed work', 'Track assigned tasks'],
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/register/${selectedRole}`);
    }
  };

  return (
    <AuthLayout type="centered">
      <div className="w-full max-w-5xl px-4 sm:px-6">
        <FormHeader
          title="Choose your account type"
          description="Select the role that fits your needs to get started with BuildFlow."
          showBackButton
          onBackClick={() => navigate('/login')}
        />

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto my-8">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              emoji={role.emoji}
              role={role.role}
              description={role.description}
              features={role.features}
              isSelected={selectedRole === role.id}
              onSelect={() => setSelectedRole(role.id)}
            />
          ))}
        </div>

        <div className="max-w-xs mx-auto flex flex-col items-center gap-4">
          <AuthButton
            disabled={!selectedRole}
            onClick={handleContinue}
          >
            Continue
          </AuthButton>

          <p className="text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-gold-600 hover:text-gold-700 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

        <AuthFooter />
      </div>
    </AuthLayout>
  );
}
