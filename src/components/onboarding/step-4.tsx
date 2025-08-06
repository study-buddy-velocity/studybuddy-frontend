"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { subjectApi, Topic } from "@/lib/api/quiz"
import { useRouter } from "next/navigation"

interface Step4Props {
  onPrev: () => void
}

interface LocalSubject {
  id: string
  title: string
  color: string
  teacher: string
  description: string
  topics: Topic[]
}

const subjectColors = ["#309CEC", "#FFAE38", "#FF4240", "#82C610", "#9C27B0", "#FF9800"]
const subjectEmojis = ["👨‍🏫", "👨‍🔬", "👩‍🔬", "👨‍🔬", "👩‍🏫", "👨‍💻"]

export default function OnboardingStep4({ onPrev }: Step4Props) {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState<LocalSubject | null>(null)
  const [subjects, setSubjects] = useState<LocalSubject[]>([])
  const [loading, setLoading] = useState(false)
  const [showTopicModal, setShowTopicModal] = useState(false)

  // Load subjects on component mount
  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      setLoading(true)
      const apiSubjects = await subjectApi.getAll()

      const localSubjects: LocalSubject[] = apiSubjects.map((subject, index) => ({
        id: subject._id,
        title: `Learn ${subject.name}`,
        color: subjectColors[index % subjectColors.length],
        teacher: subjectEmojis[index % subjectEmojis.length],
        description: subject.description || `Master ${subject.name.toLowerCase()} concepts`,
        topics: subject.topics
      }))

      setSubjects(localSubjects)
    } catch (error) {
      console.error('Failed to load subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubjectSelect = (subject: LocalSubject) => {
    setSelectedSubject(subject)
  }

  const handleGetStarted = () => {
    if (selectedSubject) {
      setShowTopicModal(true)
    }
  }

  const handleTopicSelect = (topic: Topic) => {
    // Navigate to chat page with subject and topic context
    router.push(`/chat?subject=${selectedSubject?.id}&topic=${topic._id}&subjectName=${encodeURIComponent(selectedSubject?.title || '')}&topicName=${encodeURIComponent(topic.name)}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <span className="text-2xl font-bold">
            study<span className="text-blue-500">buddy</span>
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Choose a Subject to Learn</h1>

        <p className="text-gray-600 max-w-md mx-auto text-sm md:text-base">Which subject are you diving into today?</p>
      </div>

      {/* Subject Selection Cards */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading subjects...</div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg border-2 ${
                  selectedSubject?.id === subject.id ? "border-gray-800 shadow-lg" : "border-transparent"
                }`}
                onClick={() => handleSubjectSelect(subject)}
              >
                <CardContent
                  className="p-0 h-32 md:h-40 rounded-lg flex items-center justify-between overflow-hidden"
                  style={{ backgroundColor: subject.color }}
                >
                  <div className="flex-1 p-4 md:p-6">
                    <h3 className="text-white font-bold text-lg md:text-xl mb-1">{subject.title.split(" ")[0]}</h3>
                    <h3 className="text-white font-bold text-lg md:text-xl">{subject.title.split(" ")[1]}</h3>
                  </div>
                  <div className="flex-shrink-0 p-4">
                    <div className="text-4xl md:text-5xl">{subject.teacher}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedSubject && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Selected: <span className="font-semibold">{selectedSubject.title}</span>
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button variant="outline" onClick={onPrev} className="px-6 bg-transparent">
          ← Back
        </Button>

        <Button
          onClick={handleGetStarted}
          disabled={!selectedSubject}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full text-lg"
        >
          {selectedSubject ? "Get Started! 🚀" : "Choose a Subject"}
        </Button>
      </div>

      {/* Topic Selection Modal */}
      {showTopicModal && selectedSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Choose a Topic</h2>
              <p className="text-gray-600 mb-6">Select a topic from {selectedSubject.title.replace('Learn ', '')} to start learning:</p>

              <div className="space-y-3">
                {selectedSubject.topics.map((topic) => (
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
    </div>
  )
}
