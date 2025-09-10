"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Subject {
  id: string
  name: string
}

interface Topic {
  id: string
  name: string
  subjectId: string
  classId?: string
}

interface Class {
  id: string
  name: string
  description?: string
}

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  question: string
  subjectId: string
  topicId: string
  classId?: string
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
  explanation?: string
}

interface AddQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    question: string
    classId: string
    subjectId: string
    topicId: string
    options: Option[]
    explanation?: string
  }) => void
  subjects: Subject[]
  topics: Topic[]
  classes: Class[]
  title?: string
  editQuestion?: Question | null
}

export default function AddQuestionModal({
  isOpen,
  onClose,
  onSubmit,
  subjects,
  topics,
  classes,
  title = "Add Question",
  editQuestion = null,
}: AddQuestionModalProps) {
  const [question, setQuestion] = useState("")
  const [classId, setClassId] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [topicId, setTopicId] = useState("")
  const [explanation, setExplanation] = useState("")
  const [options, setOptions] = useState<Option[]>([
    { id: "1", text: "", isCorrect: false },
    { id: "2", text: "", isCorrect: false },
    { id: "3", text: "", isCorrect: false },
    { id: "4", text: "", isCorrect: false },
  ])

  useEffect(() => {
    if (editQuestion) {
      setQuestion(editQuestion.question)
      setClassId(editQuestion.classId || "")
      setSubjectId(editQuestion.subjectId)
      setTopicId(editQuestion.topicId)
      setExplanation(editQuestion.explanation || "")
      setOptions(editQuestion.options)
    } else {
      // Reset form for add mode
      setQuestion("")
      setClassId("")
      setSubjectId("")
      setTopicId("")
      setExplanation("")
      setOptions([
        { id: "1", text: "", isCorrect: false },
        { id: "2", text: "", isCorrect: false },
        { id: "3", text: "", isCorrect: false },
        { id: "4", text: "", isCorrect: false },
      ])
    }
  }, [editQuestion, isOpen])

  const filteredTopics = topics.filter((topic) => topic.subjectId === subjectId && (!classId || !topic.classId || topic.classId === classId))

  const addOption = () => {
    const newOption: Option = {
      id: Date.now().toString(),
      text: "",
      isCorrect: false,
    }
    setOptions([...options, newOption])
  }

  const removeOption = (optionId: string) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== optionId))
    }
  }

  const updateOption = (optionId: string, text: string) => {
    setOptions(options.map((option) => (option.id === optionId ? { ...option, text } : option)))
  }

  const setCorrectAnswer = (optionId: string) => {
    setOptions(options.map((option) => ({ ...option, isCorrect: option.id === optionId })))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const hasCorrectAnswer = options.some((option) => option.isCorrect)
    const allOptionsHaveText = options.every((option) => option.text.trim())

    if (question.trim() && classId && subjectId && topicId && hasCorrectAnswer && allOptionsHaveText) {
      onSubmit({
        question: question.trim(),
        classId,
        subjectId,
        topicId,
        options: options.filter((option) => option.text.trim()),
        explanation: explanation.trim(),
      })

      // Only reset form if not editing
      if (!editQuestion) {
        setQuestion("")
        setSubjectId("")
        setTopicId("")
        setExplanation("")
        setOptions([
          { id: "1", text: "", isCorrect: false },
          { id: "2", text: "", isCorrect: false },
          { id: "3", text: "", isCorrect: false },
          { id: "4", text: "", isCorrect: false },
        ])
      }
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value)
                  setSubjectId("") // Reset subject when class changes
                  setTopicId("") // Reset topic when class changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                required
              >
                <option value="">Choose Class</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value)
                  setTopicId("") // Reset topic when subject changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                required
                disabled={!classId}
              >
                <option value="">Choose Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                required
                disabled={!subjectId}
              >
                <option value="">Choose Topic</option>
                {filteredTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                rows={3}
                required
              />
            </div>

            {/* Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Options</label>
                <Button
                  type="button"
                  onClick={addOption}
                  className="bg-primary-blue hover:bg-primary-blue/90 text-white px-3 py-1 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={option.isCorrect}
                        onChange={() => setCorrectAnswer(option.id)}
                        className="text-primary-blue focus:ring-primary-blue"
                      />
                      <Input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateOption(option.id, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                        required
                      />
                    </div>
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(option.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Select the radio button next to the correct answer</p>
            </div>

            {/* Explanation (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Provide an explanation for the correct answer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                rows={2}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-primary-blue hover:bg-primary-blue/90 text-white py-3 rounded-md font-medium"
          >
            {editQuestion ? "Update Question" : "Add Question"}
          </Button>
        </form>
      </div>
    </div>
  )
}
