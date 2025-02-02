import { FeatureCard } from './feature-card'

export function Features() {
  return (
    <section className="py-16 px-4 container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-3 gap-4">
        {/* Top row */}
        <FeatureCard
          title="Personalized Learning"
          description="Custom study plans tailored for IIT JEE and NEET success."
          className="md:col-span-2 md:row-span-1"
        />
        <FeatureCard
          title="Study 24/7"
          description="Round-the-clock IIT & NEET prep support"
          className="md:col-span-2 md:row-span-1"
        />
        <FeatureCard
          title="Quick Response"
          description="Get your doubts solved instantly—no waiting!"
          className="md:col-span-2 md:row-span-1"
        />

        {/* Bottom section */}
        <div className="md:col-span-2 md:row-span-2 grid grid-cols-1 gap-4">
          <FeatureCard
            title="Affordable"
            description=""
            className="md:row-span-1"
          />
          <FeatureCard
            title="Mock Tests"
            description=""
            className="md:row-span-1"
          />
        </div>
        
        <FeatureCard
          title="Game-like Experience"
          description="Earn rewards, track progress, and ace the leaderboards like a pro!"
          className="md:col-span-2 md:row-span-2"
        />
        
        <FeatureCard
          title="Community"
          description="Connect with like-minded IIT JEE and NEET aspirants for shared success."
          className="md:col-span-2 md:row-span-2"
        />
      </div>
    </section>
  )
}

