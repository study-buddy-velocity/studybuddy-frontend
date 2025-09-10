"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
interface CTASectionProps {
  id?: string;
}

export function CTASection({id}:CTASectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    email: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    //console.log("Form submitted:", formData)
    // Handle form submission here
  }

  return (
    <section id = {id} className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card - Ready to Study Smarter */}
          <div className="bg-gradient-to-br from-[#309CEC] to-[#2589d4] rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              {/* Achievement Badge */}
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-6">
                <span className="text-yellow-300 mr-1">⭐</span>
                <span className="text-white text-sm font-medium">15 A</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Study Smarter?</h3>

              <p className="text-blue-100 text-lg mb-8 leading-relaxed max-w-sm">
                Sign up free and start learning in minutes. No credit card needed.
              </p>
<Link href="/intro">
              <Button className="bg-white text-[#309CEC] hover:bg-gray-100 px-8 py-3 text-base font-medium rounded-full">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              </Link>


              {/* 3D Character Placeholder */}
              <div className="absolute bottom-0 right-0 w-40 h-40 flex items-end justify-end">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-6xl">👋</span>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-3 h-3 bg-white/20 rounded-full" />
            <div className="absolute bottom-8 left-4 w-2 h-2 bg-white/30 rounded-full" />
          </div>

          {/* Right Card - Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center mb-6">
                <Phone className="w-6 h-6 text-gray-600 mr-3" />
                <span className="text-lg font-semibold text-gray-700">Contact Us</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Let&apos;s get in touch!</h3>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#309CEC] focus:border-transparent placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="enter your message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#309CEC] focus:border-transparent placeholder-gray-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="mail@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#309CEC] focus:border-transparent placeholder-gray-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#309CEC] hover:bg-[#2589d4] text-white py-3 text-base font-medium rounded-lg"
                >
                  Submit
                </Button>
              </form>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-6 right-6 w-2 h-2 bg-blue-200 rounded-full" />
            <div className="absolute bottom-6 left-6 w-3 h-3 bg-orange-200 rounded-full" />
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl" />
    </section>
  )
}
