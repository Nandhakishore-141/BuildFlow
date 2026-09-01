import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

export function AuthLayout({ children, type = 'centered' }) {
  if (type === 'split') {
    return (
      <div className="min-h-screen flex bg-zinc-950 font-sans text-zinc-100">
        {/* Left Side: Dark branding panel */}
        <div className="hidden lg:flex lg:w-1/2 bg-black text-white relative items-center justify-center overflow-hidden p-16 border-r border-zinc-800/80">
          {/* Background effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-[100px]" />
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative z-10 max-w-lg w-full flex flex-col justify-between h-full">
            {/* Top branding */}
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-gold">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 20h20" />
                  <path d="M5 20V8l7-5 7 5v12" />
                  <path d="M10 20v-6h4v6" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Build<span className="gradient-gold-text">Flow</span>
              </span>
            </a>

            {/* Illustration details */}
            <div className="my-auto py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gold-400 bg-zinc-900/90 border border-zinc-800 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                  ConstructIQ Platform v1.2
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15] text-zinc-100">
                  Welcome Back to <br />
                  <span className="gradient-gold-text">BuildFlow</span>
                </h1>
                <p className="text-base text-zinc-400 leading-relaxed max-w-md">
                  Log in to manage contractors, update homeowners, request resources, track invoices, and keep your site running seamlessly.
                </p>
              </motion.div>

              {/* Graphic abstract mockup */}
              <div className="mt-12 relative flex items-center justify-center">
                <div className="absolute w-72 h-72 rounded-full border border-white/5 animate-pulse" />
                <div className="absolute w-56 h-56 rounded-full border border-gold-500/10" />
                <div className="w-64 h-48 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-gold-500/20" />
                      <div className="h-2 w-16 bg-zinc-700 rounded" />
                    </div>
                    <div className="h-4 w-12 bg-gold-500/20 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full bg-zinc-800 rounded" />
                    <div className="h-2 w-5/6 bg-zinc-800 rounded" />
                    <div className="h-2 w-4/6 bg-zinc-800 rounded" />
                    <div className="flex justify-between pt-4">
                      <div className="h-4 w-10 bg-zinc-800 rounded" />
                      <div className="h-4 w-16 bg-gold-500 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} BuildFlow Technologies. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side: Form content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-zinc-950">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Centered design (for registration & forgot password pages)
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 relative overflow-hidden font-sans">
      {/* Background radial effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-gold-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Centered logo */}
      <div className="relative z-10 flex justify-center pt-8 pb-4">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-gold">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 20h20" />
              <path d="M5 20V8l7-5 7 5v12" />
              <path d="M10 20v-6h4v6" />
            </svg>
          </div>
          <span className="text-lg font-bold text-zinc-100 tracking-tight">
            Build<span className="gradient-gold-text">Flow</span>
          </span>
        </a>
      </div>

      {/* Main card wrapper */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        {children}
      </div>
    </div>
  );
}
