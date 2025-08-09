"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Subject {
  id: string
  name: string
  description?: string
}

interface AddSubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string }) => void
  title?: string
  editSubject?: Subject | null
}

export default function AddSubjectModal({ isOpen, onClose, onSubmit, title = "Add Subject", editSubject = null }: AddSubjectModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  // Populate form fields when editing
  useEffect(() => {
    if (editSubject) {
      setName(editSubject.name)
      setDescription(editSubject.description || "")
    } else {
      setName("")
      setDescription("")
    }
  }, [editSubject, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit({ name: name.trim(), description: description.trim() })
      setName("")
      setDescription("")
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
              <Input
                type="text"
                placeholder="Enter subject name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <Input
                type="text"
                placeholder="Enter subject description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-primary-blue hover:bg-primary-blue/90 text-white py-3 rounded-md font-medium"
          >
            Add Subject
          </Button>
        </form>
      </div>
    </div>
  )
}
