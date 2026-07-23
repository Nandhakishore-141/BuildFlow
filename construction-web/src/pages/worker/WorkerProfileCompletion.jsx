import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export const WorkerProfileCompletion = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleComplete = (e) => {
    e.preventDefault();
    // Logic to update profile would go here
    // Redirect to dashboard
    navigate('/worker/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-neutral-100">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Complete Your Profile</h1>
        <p className="text-neutral-500 mb-8">
          Welcome, {user?.name}! Please provide a few more details so contractors can find and hire you for projects.
        </p>

        <form onSubmit={handleComplete} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">Primary Skill</label>
            <input 
              type="text" 
              placeholder="e.g. Electrician, Mason"
              className="w-full h-11 px-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all outline-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Experience</label>
              <select className="w-full h-11 px-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all outline-none">
                <option>Entry Level</option>
                <option>1-3 Years</option>
                <option>3-5 Years</option>
                <option>5+ Years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">Expected Daily Wage</label>
              <input 
                type="number" 
                placeholder="$"
                className="w-full h-11 px-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">About Me (Bio)</label>
            <textarea 
              rows={4}
              placeholder="Tell contractors about your work ethic..."
              className="w-full p-4 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-gold-500 focus:ring-4 focus:ring-gold-500/10 transition-all outline-none resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full h-12 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-gold-500/25 mt-4"
          >
            Save & Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
