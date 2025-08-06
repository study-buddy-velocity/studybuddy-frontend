"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { RaiseIssueModal } from "./raise-issue-modal"
import { userApi, UserDetails } from "@/lib/api/user"
import ProfileDropdown from "@/components/layout/profileDropdown"

export function DashboardHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [, setLoading] = useState(false)

  useEffect(() => {
    loadUserDetails()
  }, [])

  const loadUserDetails = async () => {
    try {
      setLoading(true)
      const details = await userApi.getUserDetails()
      setUserDetails(details)
    } catch (error) {
      console.error('Failed to load user details:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
          <div className="md:hidden flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">study</span>
            <span className="text-lg font-bold text-blue-500">buddy</span>
          </div>
          <h1 className="text-lg md:text-xl font-medium text-gray-800 hidden md:block">
            Welcome back, {userDetails?.name || 'Student'} 👋
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full"
          >
            Raise issue
          </Button>
          <ProfileDropdown userName={userDetails?.name || 'Student'} />
        </div>
      </header>

      <RaiseIssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
