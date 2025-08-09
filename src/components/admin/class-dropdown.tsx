"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface Class {
  id: string
  name: string
  description?: string
}

interface ClassDropdownProps {
  classes: Class[]
  selectedClass: string
  onClassChange: (classId: string) => void
  placeholder?: string
  className?: string
}

export default function ClassDropdown({
  classes,
  selectedClass,
  onClassChange,
  placeholder = "Choose Class",
  className = "",
}: ClassDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedClassName = classes.find((c) => c.id === selectedClass)?.name || placeholder

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent flex items-center justify-between"
      >
        <span className={selectedClass ? "text-gray-900" : "text-gray-500"}>{selectedClassName}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                onClassChange("")
                setIsOpen(false)
              }}
              className="w-full px-4 py-2 text-left text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {placeholder}
            </button>
            {classes.map((classItem) => (
              <button
                key={classItem.id}
                type="button"
                onClick={() => {
                  onClassChange(classItem.id)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {classItem.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
