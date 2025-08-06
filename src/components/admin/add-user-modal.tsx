"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { email: string; password: string }) => void
  title?: string
}

export default function AddUserModal({ isOpen, onClose, onSubmit, title = "Add User" }: AddUserModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(result)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onSubmit({ email, password })
      setEmail("")
      setPassword("")
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter Details</label>
              <Input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Input
                  type="text"
                  placeholder="enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="ml-2 text-primary-blue hover:underline text-sm font-medium"
                >
                  generate
                </button>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-primary-blue hover:bg-primary-blue/90 text-white py-3 rounded-md font-medium"
          >
            Add user
          </Button>
        </form>
      </div>
    </div>
  )
}
