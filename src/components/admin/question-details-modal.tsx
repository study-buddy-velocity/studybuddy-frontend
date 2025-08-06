"use client"

import { X, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Question {
  id: string
  question: string
  subjectId: string
  topicId: string
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
  explanation?: string
}

interface Subject {
  id: string
  name: string
}

interface Topic {
  id: string
  name: string
  subjectId: string
}

interface QuestionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  question: Question | null
  subjects: Subject[]
  topics: Topic[]
}

export default function QuestionDetailsModal({
  isOpen,
  onClose,
  onEdit,
  question,
  subjects,
  topics,
}: QuestionDetailsModalProps) {
  if (!isOpen || !question) return null

  const subject = subjects.find((s) => s.id === question.subjectId)
  const topic = topics.find((t) => t.id === question.topicId)
  const correctOption = question.options.find((option) => option.isCorrect)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Question Details</h2>
          <div className="flex items-center space-x-2">
            <Button
              onClick={onEdit}
              className="bg-primary-blue hover:bg-primary-blue/90 text-white px-3 py-2 text-sm flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Subject and Topic */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                <span className="text-sm text-gray-900">{subject?.name || "Unknown Subject"}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                <span className="text-sm text-gray-900">{topic?.name || "Unknown Topic"}</span>
              </div>
            </div>
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-gray-900">{question.question}</p>
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={option.id}
                  className={`flex items-center p-3 rounded-md border-2 ${
                    option.isCorrect ? "border-green-200 bg-green-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        option.isCorrect ? "border-green-500 bg-green-500" : "border-gray-300"
                      }`}
                    >
                      {option.isCorrect && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="text-sm font-medium text-gray-600">{String.fromCharCode(65 + index)}.</span>
                    <span className={`text-sm ${option.isCorrect ? "text-green-800 font-medium" : "text-gray-900"}`}>
                      {option.text}
                    </span>
                  </div>
                  {option.isCorrect && (
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      Correct Answer
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Correct Answer Summary */}
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">Correct Answer:</span>
              <span className="text-sm text-green-700">
                {correctOption
                  ? `${String.fromCharCode(65 + question.options.findIndex((opt) => opt.isCorrect))}. ${correctOption.text}`
                  : "Not specified"}
              </span>
            </div>
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
              <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-900">{question.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
