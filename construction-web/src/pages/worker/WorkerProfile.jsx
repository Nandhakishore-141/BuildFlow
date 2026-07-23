import { PageHeader } from '@/components/common/PageHeader';
import { SectionCard } from '@/components/common/SectionCard';
import { Button } from '@/components/common/Button';
import { useAuthStore } from '@/store/authStore';
import { User, Phone, MapPin, Briefcase } from 'lucide-react';

export const WorkerProfile = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Profile" 
        description="View and edit your professional profile to attract more jobs."
        action={
          <Button variant="primary">Edit Profile</Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <SectionCard>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gold-100 flex items-center justify-center text-gold-700 font-bold text-3xl mb-4 border-4 border-white shadow-md">
                {user?.name?.charAt(0) || 'W'}
              </div>
              <h2 className="text-xl font-bold text-neutral-900">{user?.name}</h2>
              <p className="text-sm text-neutral-500 font-medium">{user?.role}</p>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <Briefcase className="w-4 h-4 text-neutral-400" />
                <span>Master Electrician</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <Phone className="w-4 h-4 text-neutral-400" />
                <span>+1 234 567 8900</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <MapPin className="w-4 h-4 text-neutral-400" />
                <span>New York, NY</span>
              </div>
            </div>
          </SectionCard>
        </div>
        
        <div className="col-span-1 md:col-span-2 space-y-6">
          <SectionCard>
            <h3 className="text-lg font-bold text-neutral-900 mb-4">About Me</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              I am a certified master electrician with over 10 years of experience in commercial and residential construction. 
              Specializing in high-voltage installations and smart home wiring. OSHA 30 certified.
            </p>
          </SectionCard>
          
          <SectionCard>
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {['Commercial Wiring', 'Residential Wiring', 'Blueprint Reading', 'Safety Protocols'].map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </SectionCard>
          
          <SectionCard>
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Experience & Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-xs text-neutral-500 uppercase font-semibold">Years of Experience</p>
                <p className="text-lg font-bold text-neutral-900 mt-1">10+ Years</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-xs text-neutral-500 uppercase font-semibold">Expected Wage</p>
                <p className="text-lg font-bold text-neutral-900 mt-1">$45 / hr</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-xs text-neutral-500 uppercase font-semibold">Availability</p>
                <p className="text-lg font-bold text-emerald-600 mt-1">Full-time</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
