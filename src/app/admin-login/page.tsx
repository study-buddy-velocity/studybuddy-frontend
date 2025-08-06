"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface AuthResponse {
  accessToken: string
  isUserDetailsPresent: boolean
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // //console.log("Attempting login with:", { email, password: "***" })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      // //console.log("Response status:", response.status)
      // //console.log("Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Login failed with response:", errorText)
        throw new Error(`Login failed: ${response.status}`)
      }

      const data: AuthResponse = await response.json()
      // //console.log("Login response data:", data)

      localStorage.setItem("accessToken", data.accessToken)
      // //console.log("Token stored in localStorage")

      router.push("/admin")
      // //console.log("Redirecting to /admin")

      toast({
        title: "Success",
        description: "Logged in successfully",
      })
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid credentials",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-4">
      {/* Logo Section - Fixed at top */}
      <div className="flex justify-center pt-8 pb-4 w-full">
        <Image
          src="/assets/logo/studubuddy-logo-new.png"
          alt="StudyBuddy Logo"
          width={160}
          height={40}
          className="h-auto"
        />
      </div>

      {/* Login Form - Centered in remaining space */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Login</h2>
          <p className="text-gray-600">Welcome Back!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="h-12 bg-white border border-gray-200 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter your password"
              className="h-12 bg-white border border-gray-200 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-[12px]"
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors rounded-[12px]"
          >
            Log In
          </Button>
        </form>
        </div>
      </div>
    </div>
  )
}
