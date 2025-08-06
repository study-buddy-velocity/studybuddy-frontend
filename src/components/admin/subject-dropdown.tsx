"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface Subject {
  id: string
  name: string
}

interface SubjectDropdownProps {
  subjects: Subject[]
  selectedSubject: string
  onSubjectChange: (subjectId: string) => void
  placeholder?: string
  className?: string
}

export default function SubjectDropdown({
  subjects,
  selectedSubject,
  onSubjectChange,
  placeholder = "Choose Subject",
  className = "",
}: SubjectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedSubjectName = subjects.find((s) => s.id === selectedSubject)?.name || placeholder

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent flex items-center justify-between"
      >
        <span className={selectedSubject ? "text-gray-900" : "text-gray-500"}>{selectedSubjectName}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                onSubjectChange("")
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {placeholder}
            </button>
            {subjects.map((subject) => (
              <button
                key={subject.id}
                type="button"
                onClick={() => {
                  onSubjectChange(subject.id)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
