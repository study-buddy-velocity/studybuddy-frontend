"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Class {
  id: string
  name: string
  description?: string
}

interface Topic {
  id: string
  name: string
  subjectId: string
  classId?: string
}

interface AddTopicModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; classId: string; subjectId: string }) => void
  subjects: Array<{ id: string; name: string }>
  classes: Class[]
  title?: string
  editTopic?: Topic | null
}

export default function AddTopicModal({
  isOpen,
  onClose,
  onSubmit,
  subjects,
  classes,
  title = "Add Topic",
  editTopic = null,
}: AddTopicModalProps) {
  const [name, setName] = useState("")
  const [classId, setClassId] = useState("")
  const [subjectId, setSubjectId] = useState("")

  // Populate form fields when editing
  useEffect(() => {
    if (editTopic) {
      setName(editTopic.name)
      setSubjectId(editTopic.subjectId)
      setClassId(editTopic.classId || "")
    } else {
      setName("")
      setClassId("")
      setSubjectId("")
    }
  }, [editTopic, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && classId && subjectId) {
      onSubmit({ name: name.trim(), classId, subjectId })
      setName("")
      setClassId("")
      setSubjectId("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
              <select
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value)
                  setSubjectId("") // Reset subject when class changes
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic Name</label>
              <Input
                type="text"
                placeholder="Enter topic name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-primary-blue hover:bg-primary-blue/90 text-white py-3 rounded-md font-medium"
          >
            Add Topic
          </Button>
        </form>
      </div>
    </div>
  )
}
