// import { Features } from "@/components/layout/features";
// import { Footer } from "@/components/layout/footer";
// import { Hero } from "@/components/layout/hero";
// import { Navbar } from "@/components/layout/navbar";


// export default function Home() {
//   return (
//     <main className=''>
//       <Navbar/>
//       <Hero/>
//       <Features/>
//       <Footer/>
//     </main>
//   )
// }

import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { StudySmarterSection } from "@/components/landing/study-smarter-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { SmartRecommendationsSection } from "@/components/landing/smart-recommendations-section"
import { LeaderboardSection } from "@/components/landing/leaderboard-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import { BackgroundElements } from "@/components/landing/background-elements"
import { MobileMenuButton } from "@/components/landing/mobile-menu-button"

export default function StudyBuddyLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background Design Elements */}
      <BackgroundElements />

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Study Smarter Section */}
      <StudySmarterSection />

      {/* Features Section */}
      <FeaturesSection id="features" />

      {/* Smart Recommendations Section */}
      <SmartRecommendationsSection />

      {/* Leaderboard Section */}
      <LeaderboardSection />

      {/* CTA Section */}
      <CTASection id="contact" />

      {/* Footer */}
      <Footer />

      {/* Mobile Menu Button */}
      {/* <MobileMenuButton /> */}
    </div>
  )
}
