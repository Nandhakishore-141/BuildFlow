import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { WorkerMarketplaceSection } from '@/components/sections/WorkerMarketplaceSection';
import { RoleBasedAccessSection } from '@/components/sections/RoleBasedAccessSection';
import { WhyBuildFlowSection } from '@/components/sections/WhyBuildFlowSection';
import { ScreenshotSection } from '@/components/sections/ScreenshotSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTASection } from '@/components/sections/CTASection';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <HowItWorksSection />
        <WorkerMarketplaceSection />
        <RoleBasedAccessSection />
        <WhyBuildFlowSection />
        <ScreenshotSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
