"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LoginPage from "@/components/onboarding/login"
import OnboardingStep1 from "@/components/onboarding/step-1"
import ProfileSetup from "@/components/onboarding/profile-setup"
import OnboardingStep2 from "@/components/onboarding/step-2"
import OnboardingStep3 from "@/components/onboarding/step-3"
import OnboardingStep4 from "@/components/onboarding/step-4"
import { Toaster } from "@/components/ui/toaster"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0) // Start with login (step 0)
  const router = useRouter()

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipIntro = () => {
    // For existing users, redirect directly to dashboard
    router.push('/dashboard')
  }

  const skipToSubjectSelection = () => {
    setCurrentStep(5) // Skip to final step (subject selection) for new users
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <LoginPage onNext={nextStep} onSkip={skipIntro} />
      case 1:
        return <OnboardingStep1 onNext={nextStep} onSkip={skipToSubjectSelection} />
      case 2:
        return <ProfileSetup onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <OnboardingStep2 onNext={nextStep} onPrev={prevStep} onSkip={skipToSubjectSelection} />
      case 4:
        return <OnboardingStep3 onNext={nextStep} onPrev={prevStep} onSkip={skipToSubjectSelection} />
      case 5:
        return <OnboardingStep4 onPrev={prevStep} />
      default:
        return <LoginPage onNext={nextStep} onSkip={skipIntro} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderStep()}
      <Toaster />
    </div>
  )
}
