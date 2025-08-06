import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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

            {/* 3D Character Placeholder */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full flex items-center justify-center lg:w-40 lg:h-40">
              <span className="text-6xl">👦</span>
            </div>
          </div>

          {/* Right Content - Leaderboard Image */}
          <div className="relative">
            {/* Desktop Leaderboard Image */}
            <div className="hidden md:block">
              <div className="bg-white rounded-2xl shadow-2xl p-4 transform hover:scale-105 transition-transform duration-300">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#309CEC]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <p className="text-gray-600 font-medium">Desktop Leaderboard</p>
                    <p className="text-sm text-gray-500 mt-2">Leaderboard dashboard image will be displayed here</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Leaderboard Image */}
            <div className="block md:hidden">
              <div className="bg-white rounded-2xl shadow-xl p-3">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#309CEC]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">🏆</span>
                    </div>
                    <p className="text-gray-600 font-medium text-sm">Mobile Leaderboard</p>
                    <p className="text-xs text-gray-500 mt-1">Mobile leaderboard image here</p>
                  </div>
                </div>
              </div>
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
