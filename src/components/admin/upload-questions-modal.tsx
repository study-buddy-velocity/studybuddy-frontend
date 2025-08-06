"use client"

import type React from "react"
import { useState } from "react"
import { X, Upload, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Subject {
  id: string
  name: string
}

interface Topic {
  id: string
  name: string
  subjectId: string
}

interface Class {
  id: string
  name: string
  description?: string
}

interface UploadQuestionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { file: File; classId: string; subjectId: string; topicId: string }) => void
  subjects: Subject[]
  topics: Topic[]
  classes: Class[]
  title?: string
}

export default function UploadQuestionsModal({
  isOpen,
  onClose,
  onSubmit,
  subjects,
  topics,
  classes,
  title = "Upload Questions",
}: UploadQuestionsModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [classId, setClassId] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [topicId, setTopicId] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const filteredTopics = topics.filter((topic) => topic.subjectId === subjectId)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file && classId && subjectId && topicId) {
      onSubmit({ file, classId, subjectId, topicId })
      setFile(null)
      setClassId("")
      setSubjectId("")
      setTopicId("")
      onClose()
    }
  }

  const downloadTemplate = () => {
    const csvContent = `question,option_a,option_b,option_c,option_d,correct_answer,explanation
"What is 2+2?","3","4","5","6","B","Basic addition: 2+2=4"
"What is the capital of France?","London","Berlin","Paris","Madrid","C","Paris is the capital city of France"`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "questions_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
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

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive
                    ? "border-primary-blue bg-blue-50"
                    : file
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {file ? (
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="w-8 h-8 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-green-700">{file.name}</p>
                        <p className="text-xs text-green-600">File selected successfully</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-primary-blue">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">CSV files only</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Template Download */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Need a template?</p>
                  <p className="text-xs text-gray-500">Download our CSV template to get started</p>
                </div>
                <Button
                  type="button"
                  onClick={downloadTemplate}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Template
                </Button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-primary-blue hover:bg-primary-blue/90 text-white py-3 rounded-md font-medium"
            disabled={!file || !subjectId || !topicId}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Questions
          </Button>
        </form>
      </div>
    </div>
  )
}
