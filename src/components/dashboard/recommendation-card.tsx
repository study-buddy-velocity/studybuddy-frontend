"use client"

import { useRouter } from "next/navigation"

interface RecommendationCardProps {
  subject: string
  score: string
  color: string
  buttonColor: string
  subjectId?: string
  topicId?: string
  topicName?: string
}

export function RecommendationCard({
  subject,
  score,
  color,
  buttonColor,
  subjectId,
  topicId,
  topicName
}: RecommendationCardProps) {
  const router = useRouter()

  const handleReviseAgain = () => {
    if (subjectId && topicId) {
      // Navigate to quiz with specific subject and topic
      const topicParam = topicName || 'General'
      router.push(`/quiz?subject=${subjectId}&topic=${topicId}&subjectName=${encodeURIComponent(subject)}&topicName=${encodeURIComponent(topicParam)}`)
    } else if (subjectId) {
      // Navigate to quiz with just subject
      router.push(`/quiz?subject=${subjectId}&subjectName=${encodeURIComponent(subject)}`)
    } else {
      // Navigate to general quiz page
      router.push('/quiz')
    }
  }

  // Create display text for the subject/topic
  const displaySubject = topicName ? `${subject} - ${topicName}` : subject
  return (
    <div className={`${color} rounded-lg p-4 space-y-3`}>
      <div className="text-sm">
        <div className="font-medium">{score}</div>
        <div className="text-sm opacity-90">in {displaySubject}</div>
      </div>
      <button
        className={`w-full ${buttonColor} text-white py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity`}
        onClick={handleReviseAgain}
      >
        Take Quiz
      </button>
    </div>
  )
}
