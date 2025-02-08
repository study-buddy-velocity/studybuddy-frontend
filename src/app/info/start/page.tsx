'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from '@/components/ui/toaster'

interface AuthResponse {
  accessToken: string;
  isUserDetailsPresent: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true) // Set loading state to true
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data: AuthResponse = await response.json()
      localStorage.setItem('accessToken', data.accessToken)
      if (data.isUserDetailsPresent) {
        router.push('/chat')
      } else {
        router.push('/info/know')
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      })
    } catch (error) {
      console.error('Login error:', error) // Log the error
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid credentials", // Use the error message
      })
    } finally {
      setIsLoading(false) // Set loading state to false
    }
  }

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center flex-1 max-w-md z-10">
      <h1 className="text-4xl font-bold text-white mb-8">
        {`Let's get Started!`}
      </h1>

      <form className="w-full space-y-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#232323] border-none text-white placeholder:text-white/50 py-8 rounded-[14px]"
          disabled={isLoading}
          required
        />
        
        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#232323] border-none text-white placeholder:text-white/50 py-8 rounded-[14px]"
          disabled={isLoading}
          required
        />

        <Button 
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-[#4024B9] to-[#8640FF] hover:opacity-90 text-[26px] font-bold py-8 rounded-[14px]"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Log In"}
        </Button>
      </form>
      <Toaster/>
    </div>
  )
}