"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"

const scoreCards = [
  {
    score: "6/10",
    subject: "Algebra",
    bgColor: "bg-gradient-to-br from-[#309CEC] to-[#2589d4]",
  },
  {
    score: "6/10",
    subject: "Organic Theory",
    bgColor: "bg-gradient-to-br from-green-400 to-green-500",
  },
  {
    score: "6/10",
    subject: "Velocity",
    bgColor: "bg-gradient-to-br from-orange-400 to-orange-500",
  },
  {
    score: "6/10",
    subject: "Evolution",
    bgColor: "bg-gradient-to-br from-red-400 to-red-500",
  },
  {
    score: "6/10",
    subject: "Algebra",
    bgColor: "bg-gradient-to-br from-[#309CEC] to-[#2589d4]",
  },
  {
    score: "6/10",
    subject: "Chemistry",
    bgColor: "bg-gradient-to-br from-purple-400 to-purple-500",
  },
  {
    score: "6/10",
    subject: "Physics",
    bgColor: "bg-gradient-to-br from-teal-400 to-teal-500",
  },
]

interface ScoreCardProps {
  score: string
  subject: string
  bgColor: string
}

function ScoreCard({ score, subject, bgColor }: ScoreCardProps) {
  return (
    <div
      className={`${bgColor} rounded-2xl p-6 text-white min-w-[280px] flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="mb-4">
        <p className="text-white/90 text-sm font-medium mb-1">You Scored {score}</p>
        <p className="text-white text-lg font-bold">in {subject}</p>
      </div>

      <Button
        className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-200"
        variant="outline"
      >
        Revise Again
      </Button>
    </div>
  )
}

export function SmartRecommendationsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">⚡</span>
              <span className="text-lg font-semibold text-gray-700">Smart Recommendations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Study Smarter, Not Harder</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl">
              Your dashboard shows where you scored less and what to focus on next! So you never miss a beat.
            </p>
          </div>

          <div className="hidden lg:block">
            <Link href="/intro">
            <Button className="bg-[#309CEC] hover:bg-[#2589d4] text-white px-6 py-3 text-base font-medium rounded-full">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </div>
        </div>

        {/* Cards Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="hidden md:flex absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              onClick={scrollLeft}
              variant="outline"
              size="icon"
              className="bg-white shadow-lg hover:shadow-xl border-gray-200 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="hidden md:flex absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              onClick={scrollRight}
              variant="outline"
              size="icon"
              className="bg-white shadow-lg hover:shadow-xl border-gray-200 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {scoreCards.map((card, index) => (
              <ScoreCard
                key={`${card.subject}-${index}`}
                score={card.score}
                subject={card.subject}
                bgColor={card.bgColor}
              />
            ))}
          </div>

          {/* Mobile Start Learning Button */}
          <div className="lg:hidden mt-8 text-center">
            <Button className="bg-[#309CEC] hover:bg-[#2589d4] text-white px-6 py-3 text-base font-medium rounded-full">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scroll Indicator Dots */}
        <div className="flex justify-center mt-6 space-x-2 md:hidden">
          {Array.from({ length: Math.ceil(scoreCards.length / 2) }).map((_, index) => (
            <div key={index} className="w-2 h-2 rounded-full bg-gray-300" />
          ))}
        </div>
      </div>
    </section>
  )
}
