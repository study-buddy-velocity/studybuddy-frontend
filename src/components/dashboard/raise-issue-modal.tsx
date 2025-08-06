"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { feedbackApi } from "@/lib/api/feedback"

interface RaiseIssueModalProps {
  isOpen: boolean
  onClose: () => void
  currentSubject?: string
  currentTopic?: string
}

export function RaiseIssueModal({
  isOpen,
  onClose,
  currentSubject = "",
  currentTopic = ""
}: RaiseIssueModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("medium")
  const [category, setCategory] = useState("General")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim()) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      await feedbackApi.create({
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        subject: currentSubject || undefined
      })

      // Reset form
      setTitle("")
      setDescription("")
      setPriority("medium")
      setCategory("General")

      alert("Issue raised successfully! Our team will review it soon.")
      onClose()
    } catch (error) {
      console.error('Failed to raise issue:', error)
      alert('Failed to raise issue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Report an Issue</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="General">General</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Account Issue">Account Issue</option>
              <option value="Quiz Issue">Quiz Issue</option>
              <option value="Chat Issue">Chat Issue</option>
              <option value="Feature Request">Feature Request</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Current Context */}
          {(currentSubject || currentTopic) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Context
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
                {currentSubject && <div>Subject: {currentSubject}</div>}
                {currentTopic && <div>Topic: {currentTopic}</div>}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide detailed information about the issue..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  )
}
