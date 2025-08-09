"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { subjectApi, Topic } from "@/lib/api/quiz"

interface SubjectCardProps {
  subject: string
  color: string
  textColor?: string
  image: string
  subjectId: string
}

export function SubjectCard({ subject, color, textColor = "text-white", image, subjectId }: SubjectCardProps) {
  const router = useRouter()
  const [showTopicModal, setShowTopicModal] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Get appropriate image based on subject
  const getSubjectImage = () => {
    const subjectLower = subject.toLowerCase()

    // Map subjects to their appropriate images
    if (subjectLower.includes('math')) {
      return '/assets/backgrounds/math-teacher.png'
    }
    if (subjectLower.includes('physics')) {
      return '/assets/backgrounds/physics-teacher.png'
    }
    if (subjectLower.includes('biology') || subjectLower.includes('bio')) {
      return '/assets/backgrounds/bio-teacher.png'
    }
    if (subjectLower.includes('chemistry') || subjectLower.includes('chem')) {
      return '/assets/backgrounds/chem-teacher.png'
    }

    // Default fallback for unknown subjects
    return '/joyImg.png'
  }

  const handleCardClick = async () => {
    try {
      setLoading(true)
      const subjectData = await subjectApi.getById(subjectId)
      setTopics(subjectData.topics)
      setShowTopicModal(true)
    } catch (error) {
      console.error('Failed to load topics:', error)
      // Fallback: navigate to chat without topic
      router.push(`/chat?subject=${subjectId}&subjectName=${encodeURIComponent(`Learn ${subject}`)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleTopicSelect = (topic: Topic) => {
    router.push(`/chat?subject=${subjectId}&topic=${topic._id}&subjectName=${encodeURIComponent(`Learn ${subject}`)}&topicName=${encodeURIComponent(topic.name)}`)
  }

  return (
    <>
      <div
        className={`${color} rounded-xl p-6 relative overflow-hidden min-h-[120px] flex items-center justify-between cursor-pointer hover:scale-105 transition-transform`}
        onClick={handleCardClick}
      >
        <div className="z-10">
          <div className={`text-sm ${textColor} opacity-90 mb-1`}>Learn</div>
          <div className={`text-lg font-semibold ${textColor}`}>{subject}</div>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <img
            src={imageError ? '/joyImg.png' : getSubjectImage()}
            alt={`${subject} character`}
            className="w-24 h-24 object-cover"
            onError={() => {
              console.log(`Failed to load image for ${subject}:`, getSubjectImage())
              setImageError(true)
            }}
          />
        </div>
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <div className="text-white text-sm">Loading...</div>
          </div>
        )}
      </div>

      {/* Topic Selection Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Choose a Topic</h2>
              <p className="text-gray-600 mb-6">Select a topic from {subject} to start learning:</p>

              <div className="space-y-3">
                {topics.map((topic) => (
                  <button
                    key={topic._id}
                    onClick={() => handleTopicSelect(topic)}
                    className="w-full p-4 text-left bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800">{topic.name}</h3>
                    {topic.description && (
                      <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowTopicModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
