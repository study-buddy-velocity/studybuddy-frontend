"use client"

import { Podium } from "@/components/dashboard/podium"
import { LeaderboardList } from "@/components/dashboard/leaderboard-list"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Lightbulb } from "lucide-react"
import { useState, useEffect } from "react"
import { LeaderboardAPI, LeaderboardUser, SubjectClassAPI } from "@/lib/api/leaderboard"
import { useAuth } from "@/hooks/useAuthenticationHook"

export default function LeaderboardPage() {
  // Authentication
  useAuth()

  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([])
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null)
  const [topPerformers, setTopPerformers] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filter states
  const [currentPeriod, setCurrentPeriod] = useState<'weekly' | 'monthly' | 'all'>('all')
  const [currentSubject, setCurrentSubject] = useState("")
  const [currentClass, setCurrentClass] = useState("")

  // Data states for dropdowns
  const [subjects, setSubjects] = useState<string[]>([])
  const [classes, setClasses] = useState<string[]>([])
  const [isLoadingOptions, setIsLoadingOptions] = useState(true)

  // Fetch subjects and classes from backend
  const fetchSubjectsAndClasses = async () => {
    try {
      setIsLoadingOptions(true)

      const [fetchedSubjects, fetchedClasses] = await Promise.all([
        SubjectClassAPI.getSubjects(),
        Promise.resolve(SubjectClassAPI.getClasses())
      ])

      setSubjects(fetchedSubjects)
      setClasses(fetchedClasses)
    } catch (error) {
      console.error('Failed to fetch subjects and classes:', error)
      // Set fallback data if API fails
      setSubjects([
        'Mathematics',
        'Physics',
        'Chemistry',
        'Biology',
        'English',
        'Computer Science'
      ])
      setClasses(SubjectClassAPI.getClasses())
    } finally {
      setIsLoadingOptions(false)
    }
  }

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true)
      const filters = {
        period: currentPeriod,
        subject: currentSubject || undefined,
        class: currentClass || undefined,
        limit: 50
      }

      const [leaderboardData, topPerformersData] = await Promise.all([
        LeaderboardAPI.getLeaderboard(filters),
        LeaderboardAPI.getTopPerformers(filters)
      ])

      setLeaderboardUsers(leaderboardData.users)
      setCurrentUser(leaderboardData.currentUser || null)
      setTopPerformers(topPerformersData.topThree)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Search users
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchLeaderboard()
      return
    }

    try {
      setIsLoading(true)
      const filters = {
        period: currentPeriod,
        subject: currentSubject || undefined,
        class: currentClass || undefined
      }

      const searchData = await LeaderboardAPI.searchUsers(query, filters)
      setLeaderboardUsers(searchData.users)
    } catch (error) {
      console.error('Failed to search users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter handlers
  const handlePeriodChange = (period: 'weekly' | 'monthly' | 'all') => {
    setCurrentPeriod(period)
  }

  const handleSubjectChange = (subject: string) => {
    setCurrentSubject(subject)
  }

  const handleClassChange = (classFilter: string) => {
    setCurrentClass(classFilter)
  }

  // Fetch subjects and classes on component mount
  useEffect(() => {
    fetchSubjectsAndClasses()
  }, [])

  // Fetch data on component mount and filter changes
  useEffect(() => {
    fetchLeaderboard()
  }, [currentPeriod, currentSubject, currentClass])
  return (
    <SidebarProvider>
      <AppSidebar currentPage="dashboard/leaderboard" />
      <SidebarInset>
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 space-y-6 bg-white min-h-screen">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              <strong>Earn sparks (🔥)</strong> and climb the leaderboards by showing up every day, staying consistent,
              and getting your answers right.
            </p>
          </div>

          {/* Podium */}
          <Podium
            users={topPerformers}
            onPeriodChange={handlePeriodChange}
            onSubjectChange={handleSubjectChange}
            onClassChange={handleClassChange}
            currentPeriod={currentPeriod}
            currentSubject={currentSubject}
            currentClass={currentClass}
            subjects={subjects}
            classes={classes}
          />

          {/* Desktop Layout: Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leaderboard List */}
            <div className="lg:col-span-2">
              <LeaderboardList
                users={leaderboardUsers}
                onSearch={handleSearch}
                isLoading={isLoading}
              />
            </div>

            {/* Profile Card - Desktop only */}
            <div className="hidden lg:block">
              <ProfileCard user={currentUser} />
            </div>
          </div>

          {/* Profile Card - Mobile only */}
          <div className="lg:hidden">
            <ProfileCard user={currentUser} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
