"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface LoginProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function LoginPage({ onNext, onSkip }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
      })
      return
    }

    setIsLoading(true)

    try {
      //console.log("Attempting login with:", { email, password: "***" })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      //console.log("Response status:", response.status)
      //console.log("Response ok:", response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Login failed with response:", errorText)

        let errorMessage = "Login failed"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch {
          // If response is not JSON, use default message
        }

        throw new Error(errorMessage)
      }

      const data: { accessToken: string; isUserDetailsPresent: boolean } = await response.json();
      //console.log("Login response data:", data)

      localStorage.setItem("accessToken", data.accessToken);
      //console.log("Token stored in localStorage")

      toast({
        title: "Success",
        description: "Logged in successfully!",
      })

      // Decide navigation based on profile presence
      if (data.isUserDetailsPresent) {
        //console.log("User has profile details, skipping to dashboard")
        onSkip();
      } else {
        //console.log("User needs to complete profile, proceeding to onboarding")
        onNext();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid credentials. Please check your email and password.",
      })
    } finally {
      setIsLoading(false);
    }
  }

  const handleSignUp = () => {
    toast({
      title: "Sign Up",
      description: "Please contact your administrator to create a new account.",
    })
  }

  const handleGetHelp = () => {
    toast({
      title: "Help",
      description: "For login assistance, please contact your administrator or IT support.",
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-12">
          <span className="text-3xl md:text-4xl font-bold">
            study<span className="text-blue-500">buddy</span>
          </span>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-sm md:text-base">Let&apos;s get back to Learning!</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 rounded-lg font-medium text-sm md:text-base transition-colors"
            >
              {isLoading ? "Logging In..." : "Log In"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{" "}
              <button onClick={handleSignUp} className="text-blue-500 hover:text-blue-600 font-medium hover:underline">
                Sign Up
              </button>
            </p>

            <button onClick={handleGetHelp} className="text-gray-500 hover:text-gray-700 text-sm hover:underline">
              Get Help
            </button>
          </div>
        </div>

        {/* Login Help */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-xs text-blue-600">Use the credentials provided by your administrator</p>
        </div>
      </div>
    </div>
  )
}
