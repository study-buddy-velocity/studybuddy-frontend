"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Step1Props {
  onNext: () => void
  onSkip: () => void
}

export default function OnboardingStep1({ onNext, onSkip }: Step1Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <span className="text-2xl font-bold">
            study<span className="text-blue-500">buddy</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Welcome to StudyBuddy 🎉</h1>

        <p className="text-gray-600 max-w-md mx-auto text-sm md:text-base">
          Your smart learning companion for school subjects. Ready to learn, quiz, and grow? Let&apos;s get started!
        </p>
      </div>

      {/* Main Content - Responsive Images */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        {/* Desktop Image */}
        <div className="hidden md:block">
          <Image
            src="/images/desktop-dashboard.png"
            alt="StudyBuddy Dashboard - Desktop View"
            width={800}
            height={500}
            className="w-full h-auto rounded-lg shadow-lg"
            priority
          />
        </div>

        {/* Mobile Image */}
        <div className="block md:hidden">
          <Image
            src="/images/mobile-dashboard.png"
            alt="StudyBuddy Dashboard - Mobile View"
            width={300}
            height={600}
            className="w-full max-w-sm mx-auto h-auto rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button variant="ghost" onClick={onSkip} className="text-gray-600 hover:text-gray-800">
          Skip Intro
        </Button>

        <Button onClick={onNext} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full">
          Continue →
        </Button>
      </div>
    </div>
  )
}
