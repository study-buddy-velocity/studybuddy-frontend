"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Step3Props {
  onNext: () => void
  onPrev: () => void
  onSkip: () => void
}

export default function OnboardingStep3({ onNext, onPrev, onSkip }: Step3Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <span className="text-2xl font-bold">
            study<span className="text-blue-500">buddy</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Test Your Knowledge 🧠</h1>

        <p className="text-gray-600 max-w-md mx-auto text-sm md:text-base">
          Challenge yourself with quizzes designed to boost your understanding and track your progress.
        </p>
      </div>

      {/* Main Content - Image */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <Image
          src="/images/step3-test-knowledge.png"
          alt="Test Your Knowledge - StudyBuddy Quiz Interface"
          width={800}
          height={500}
          className="w-full h-auto rounded-lg shadow-lg"
          priority
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button variant="ghost" onClick={onSkip} className="text-gray-600 hover:text-gray-800">
          Skip Intro
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onPrev} className="px-6 bg-transparent">
            ← Back
          </Button>

          <Button onClick={onNext} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full">
            Continue →
          </Button>
        </div>
      </div>
    </div>
  )
}
