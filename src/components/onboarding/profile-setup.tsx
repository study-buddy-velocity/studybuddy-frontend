"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuthenticationHook"
import { subjectOptions } from "@/lib/utils"

import { Calendar, User, Phone, School, GraduationCap, BookOpen } from "lucide-react"

interface ProfileSetupProps {
  onNext: () => void
  onPrev: () => void
}

const subjects = subjectOptions

// Predefined classes (6th to 12th standard) - consistent with admin interface
const classes = [
  { id: "6th", name: "6th Standard", description: "Class 6" },
  { id: "7th", name: "7th Standard", description: "Class 7" },
  { id: "8th", name: "8th Standard", description: "Class 8" },
  { id: "9th", name: "9th Standard", description: "Class 9" },
  { id: "10th", name: "10th Standard", description: "Class 10" },
  { id: "11th", name: "11th Standard", description: "Class 11" },
  { id: "12th", name: "12th Standard", description: "Class 12" },
]

export default function ProfileSetup({ onNext, onPrev }: ProfileSetupProps) {
  const { getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState({
    dateOfBirth: "",
    fullName: "",
    phoneNumber: "",
    schoolName: "",
    grade: "",
    preferredSubjects: [] as string[],
  })

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubjectSelect = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredSubjects: prev.preferredSubjects.includes(subject)
        ? prev.preferredSubjects.filter((s) => s !== subject)
        : [...prev.preferredSubjects, subject],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Find the selected class name from the classes array
      const selectedClass = classes.find(c => c.id === formData.grade);
      const className = selectedClass ? selectedClass.name : formData.grade;

      const payload = {
        dob: formData.dateOfBirth,
        name: formData.fullName,
        phoneno: formData.phoneNumber,
        class: className,
        schoolName: formData.schoolName,
        subjects: formData.preferredSubjects,
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/user-details`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      onNext();
    } catch (error) {
      console.error("Profile update error:", error);
      alert((error as Error).message || "Failed to update profile");
    }
  }

  const isFormValid = formData.fullName && formData.dateOfBirth && formData.grade

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold">
            study<span className="text-blue-500">buddy</span>
          </span>
          <span className="text-sm text-gray-500">Step 3 of 6</span>
        </div>

        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Let&apos;s get to know each other!</h1>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Personal Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="pl-10 py-3"
                    required
                  />
                </div>

                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="pl-10 py-3"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="pl-10 py-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic Information
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <School className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="School/University Name"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange("schoolName", e.target.value)}
                    className="pl-10 py-3"
                  />
                </div>

                <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                  <SelectTrigger className="py-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                      <SelectValue placeholder="Grade/Class" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Select preferred subjects</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {subjects.map((subject) => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => handleSubjectSelect(subject)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          formData.preferredSubjects.includes(subject)
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                  {formData.preferredSubjects.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.preferredSubjects.length} subject(s) selected
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Button variant="outline" onClick={onPrev} className="px-6 bg-transparent">
            ← Back
          </Button>

          <Button
            type="submit"
            disabled={!isFormValid}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-full text-lg"
          >
            Customise my Experience →
          </Button>
        </div>
      </form>
    </div>
  )
}
