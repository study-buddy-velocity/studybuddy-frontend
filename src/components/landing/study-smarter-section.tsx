"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { SubjectCard } from "./subject-card"

const subjects = [
  {
    name: "Maths",
    bgColor: "bg-gradient-to-br from-[#309CEC] to-[#2589d4]",
    icon: "📊",
  },
  {
    name: "Physics",
    bgColor: "bg-gradient-to-br from-orange-400 to-orange-500",
    icon: "⚛️",
  },
  {
    name: "Biology",
    bgColor: "bg-gradient-to-br from-red-400 to-red-500",
    icon: "🧬",
  },
  {
    name: "Chemistry",
    bgColor: "bg-gradient-to-br from-green-400 to-green-500",
    icon: "🧪",
  },
]

export function StudySmarterSection() {
  const handleSubjectClick = () => {
    //console.log(`Navigate to ${subject} learning page`)
  }

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-2">🏆</span>
            <span className="text-lg font-semibold text-gray-700">Study Smarter</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Covering the Essentials</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Jump straight into your core subjects and explore topic-based help instantly.
          </p>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.name}
              subject={subject.name}
              bgColor={subject.bgColor}
              icon={subject.icon}
              onClick={() => handleSubjectClick()}
            />
          ))}
        </div>

        {/* Start Learning Button */}
        <div className="text-center">
          <Button className="bg-[#309CEC] hover:bg-[#2589d4] text-white px-8 py-3 text-base font-medium rounded-full">
            Start Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
