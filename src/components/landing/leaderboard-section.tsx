import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export function LeaderboardSection() {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-[#309CEC] to-[#2589d4] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-white relative z-10">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">🏆</span>
              <span className="text-xl font-semibold">Leaderboard Motivation</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Climb the Ranks,
              <br />
              Beat Your Best
            </h2>

            <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-md">
              Challenge friends and track your rank by subject or class. Stay motivated with weekly goals.
            </p>

            <Button className="bg-white text-[#309CEC] hover:bg-gray-100 px-8 py-3 text-base font-medium rounded-full">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Right Content - Leaderboard Image */}
          <div className="relative">
            {/* Desktop Leaderboard Image */}
            <div className="hidden md:block">
              {/* <div className="rounded-2xl overflow-hidden border-4 border-white shadow-2xl"> */}
                <Image
                  src="/assets/backgrounds/Leadership-dashboard.png"
                  alt="Desktop Leaderboard"
                  width={1200}
                  height={900}
                  className="w-full h-auto object-cover"
                />
              {/* </div> */}
            </div>

            {/* Mobile Leaderboard Image */}
            <div className="block md:hidden">
              {/* <div className="rounded-2xl overflow-hidden border-2 border-white shadow-xl"> */}
                <Image
                  src="/assets/backgrounds/Leadership-dashboard.png"
                  alt="Mobile Leaderboard"
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              {/* </div> */}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce hidden lg:block" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-white/30 rounded-full animate-pulse hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
    </section>
  )
}
