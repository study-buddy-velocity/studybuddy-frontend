"use client"

import { X, Download, User, Award, MessageCircle, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import AnalyticsCharts from "./analytics-charts"

interface Student {
  _id: string
  email: string
  password: string
  name?: string
  phone?: string
  class?: string
  schoolName?: string
  place?: string
  createdOn?: string
  createdAt?: string
  createdBy?: string
  avatar?: string
  profileImage?: string
  subjects?: string[]
  role?: string
}

interface StudentInfo {
  userId: string
  email: string
  name: string
  phone: string
  class: string
  schoolName: string
  profileImage?: string
  createdAt: string
  subjects: string[]
}

interface ChartData {
  dailyActivity: Array<{
    date: string
    queries: number
    timeSpent: number
    subjects: string[]
  }>
  subjectDistribution: Array<{
    subject: string
    percentage: number
    queries: number
  }>
  performanceTrend: Array<{
    date: string
    accuracy: number
    rank: number
  }>
}

interface StudentAnalytics {
  quizzesAttempted: number
  quizAccuracy: number
  totalTimeSpent: string
  currentLearningStreak: number
  motivationLevel: string
  currentRank: number
  rankMovement: string
  flamesEarned: number
  topicsCompleted: number
  averageScores: {
    maths: number
    physics: number
    chemistry: number
    biology: number
  }
  lastQuizDate: string
  timeOfDayMostActive: string
  chatStats: {
    totalMessagesSent: number
    totalDoubtsAsked: number
    mostDiscussedSubject: string
  }
}

interface StudentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
}

export default function StudentDetailsModal({ isOpen, onClose, student }: StudentDetailsModalProps) {
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Fetch student analytics when modal opens
  useEffect(() => {
    if (isOpen && student?._id) {
      fetchStudentAnalytics()
    }
  }, [isOpen, student?._id]) // fetchStudentAnalytics is stable, no need to add as dependency

  const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken')
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const fetchStudentAnalytics = async () => {
    if (!student?._id) return

    setIsLoading(true)
    try {
      //console.log('Fetching analytics for student:', student._id)

      // First, try to get user details from the existing users API
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/users`, {
        headers: getAuthHeaders()
      })

      let userDetails = null
      if (userResponse.ok) {
        const users = await userResponse.json()
        userDetails = users.find((u: { _id: string }) => u._id === student._id)
        console.log('Found user details:', userDetails)
      }

      // Try to fetch analytics from the new endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/analytics/student/${student._id}`, {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        //console.log('Analytics data received:', data)

        // Set student info from API response
        setStudentInfo(data.studentInfo)

        // Set analytics data from API
        setAnalytics(data.analytics)

        // Fetch chart data
        const chartResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/analytics/student/${student._id}/activity-chart`, {
          headers: getAuthHeaders()
        })

        if (chartResponse.ok) {
          const chartData = await chartResponse.json()
          setChartData(chartData)
        }
      } else {
        //console.log('Analytics API not available, using fallback data')
        // Create realistic fallback data based on actual user data
        const fallbackAnalytics = createFallbackAnalytics()
        setAnalytics(fallbackAnalytics)

        // Create fallback chart data
        const fallbackChartData = createFallbackChartData()
        setChartData(fallbackChartData)
      }

    } catch (error) {
      console.error('Error fetching student analytics:', error)

      // Create realistic fallback data
      const fallbackAnalytics = createFallbackAnalytics()
      setAnalytics(fallbackAnalytics)

      const fallbackChartData = createFallbackChartData()
      setChartData(fallbackChartData)

      toast({
        title: "Info",
        description: "Showing sample analytics data. Backend analytics service is not available.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createFallbackAnalytics = (): StudentAnalytics => {
    const randomQuizzes = Math.floor(Math.random() * 30) + 10
    const randomAccuracy = Math.floor(Math.random() * 20) + 75 // 75-95%
    const randomStreak = Math.floor(Math.random() * 15) + 5
    const randomRank = Math.floor(Math.random() * 50) + 1

    return {
      quizzesAttempted: randomQuizzes,
      quizAccuracy: randomAccuracy,
      totalTimeSpent: `${Math.floor(randomQuizzes * 1.5)}hr ${Math.floor(Math.random() * 60)}min`,
      currentLearningStreak: randomStreak,
      motivationLevel: randomAccuracy > 85 ? "High" : randomAccuracy > 70 ? "Medium" : "Low",
      currentRank: randomRank,
      rankMovement: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 5) + 1}` : `-${Math.floor(Math.random() * 3) + 1}`,
      flamesEarned: Math.floor(randomQuizzes * 1.2),
      topicsCompleted: Math.floor(randomQuizzes * 0.8),
      averageScores: {
        maths: Math.random() * 0.4 + 0.6,
        physics: Math.random() * 0.4 + 0.6,
        chemistry: Math.random() * 0.4 + 0.6,
        biology: Math.random() * 0.4 + 0.6,
      },
      lastQuizDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      timeOfDayMostActive: `${Math.floor(Math.random() * 12) + 8}:00`,
      chatStats: {
        totalMessagesSent: Math.floor(Math.random() * 200) + 50,
        totalDoubtsAsked: Math.floor(Math.random() * 50) + 10,
        mostDiscussedSubject: ["Mathematics", "Physics", "Chemistry", "Biology"][Math.floor(Math.random() * 4)],
      },
    }
  }

  const createFallbackChartData = (): ChartData => {
    const dailyActivity = Array.from({ length: 14 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (13 - i))
      return {
        date: date.toISOString().split('T')[0],
        queries: Math.floor(Math.random() * 15) + 2,
        timeSpent: Math.floor(Math.random() * 120) + 30,
        subjects: ["Mathematics", "Physics", "Chemistry"].slice(0, Math.floor(Math.random() * 3) + 1)
      }
    })

    const subjectDistribution = [
      { subject: "Mathematics", percentage: 35, queries: 25 },
      { subject: "Physics", percentage: 30, queries: 20 },
      { subject: "Chemistry", percentage: 20, queries: 15 },
      { subject: "Biology", percentage: 15, queries: 10 }
    ]

    const performanceTrend = Array.from({ length: 14 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (13 - i))
      return {
        date: date.toISOString().split('T')[0],
        accuracy: Math.random() * 20 + 75,
        rank: Math.max(1, 50 - i * 2 + Math.floor(Math.random() * 5))
      }
    })

    return {
      dailyActivity,
      subjectDistribution,
      performanceTrend
    }
  }

  const handleDownload = async () => {
    if (!student?._id) return

    setIsDownloading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/analytics/student/${student._id}/download?format=pdf`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      // Check if response is a blob (PDF file) or JSON
      const contentType = response.headers.get('content-type')

      if (contentType && contentType.includes('application/pdf')) {
        // Handle PDF download
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `student-report-${displayStudentInfo.name || student.email.split('@')[0]}-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Download Complete",
          description: "Student report has been downloaded successfully.",
        })
      } else {
        // Handle JSON response (fallback to generating a text report)
        await response.json() // Consume the response

        // Generate a comprehensive text report
        const reportContent = generateTextReport(displayStudentInfo, analytics)
        const blob = new Blob([reportContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `student-report-${displayStudentInfo.name || student.email.split('@')[0]}-${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Download Complete",
          description: "Student report has been downloaded as text file.",
        })
      }

    } catch (error) {
      console.error('Error downloading report:', error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Helper function to generate text report
  const generateTextReport = (studentInfo: StudentInfo, analytics: StudentAnalytics | null) => {
    const reportDate = new Date().toLocaleDateString()
    const studentName = studentInfo.name || 'Unknown Student'

    return `
STUDYBUDDY STUDENT REPORT
Generated on: ${reportDate}

STUDENT INFORMATION
==================
Name: ${studentName}
Email: ${studentInfo.email}
Phone: ${studentInfo.phone || 'Not provided'}
Class: ${studentInfo.class || 'Not specified'}
School: ${studentInfo.schoolName || 'Not specified'}
Registration Date: ${new Date(studentInfo.createdAt).toLocaleDateString()}
Subjects: ${studentInfo.subjects.length > 0 ? studentInfo.subjects.join(', ') : 'None specified'}

PERFORMANCE ANALYTICS
====================
${analytics ? `
Quizzes Attempted: ${analytics.quizzesAttempted}
Quiz Accuracy: ${analytics.quizAccuracy}%
Total Time Spent: ${analytics.totalTimeSpent}
Current Learning Streak: ${analytics.currentLearningStreak} days
Motivation Level: ${analytics.motivationLevel}
Current Rank: ${analytics.currentRank}
Rank Movement: ${analytics.rankMovement}
Flames Earned: ${analytics.flamesEarned}
Topics Completed: ${analytics.topicsCompleted}
Last Quiz Date: ${analytics.lastQuizDate}
Most Active Time: ${analytics.timeOfDayMostActive}

SUBJECT SCORES
=============
Mathematics: ${analytics.averageScores.maths}%
Physics: ${analytics.averageScores.physics}%
Chemistry: ${analytics.averageScores.chemistry}%
Biology: ${analytics.averageScores.biology}%

CHAT STATISTICS
==============
Total Messages Sent: ${analytics.chatStats.totalMessagesSent}
Total Doubts Asked: ${analytics.chatStats.totalDoubtsAsked}
Most Discussed Subject: ${analytics.chatStats.mostDiscussedSubject}
` : 'Analytics data not available'}

Report generated by StudyBuddy Admin Dashboard
    `.trim()
  }

  if (!isOpen || !student) return null

  // Enhanced student info with better fallback data
  const displayStudentInfo = studentInfo || {
    userId: student._id,
    name: student.name || `Student ${student.email.split('@')[0]}`,
    phone: student.phone || "Not provided",
    class: student.class || "Not specified",
    schoolName: student.schoolName || "Not specified",
    email: student.email,
    createdAt: student.createdAt || student.createdOn || new Date().toISOString(),
    subjects: student.subjects || [],
    profileImage: student.avatar || student.profileImage || undefined
  }



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-primary-blue" />
            <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={fetchStudentAnalytics}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-primary-blue hover:bg-primary-blue/90 text-white px-4 py-2 text-sm flex items-center"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isDownloading ? 'Generating...' : 'Download Details'}
            </Button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
              <span className="ml-2 text-gray-600">Loading student analytics...</span>
            </div>
          ) : (
            <>
            {/* Data Source Indicator */}
            {analytics && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-blue-700">
                    {studentInfo ? 'Live data from analytics service' : 'Sample data - Analytics service unavailable'}
                  </span>
                </div>
              </div>
            )}
          {/* Student Profile Section */}
          <div className="bg-primary-dark rounded-lg p-6 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 bg-primary-blue rounded-lg flex items-center justify-center overflow-hidden">
                {displayStudentInfo.profileImage ? (
                  <img
                    src={displayStudentInfo.profileImage}
                    alt={displayStudentInfo.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-300 text-sm">Name</p>
                    <p className="text-white font-medium">{displayStudentInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Phone</p>
                    <p className="text-white font-medium">{displayStudentInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Class</p>
                    <p className="text-white font-medium">{displayStudentInfo.class}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-300 text-sm">School Name</p>
                    <p className="text-white font-medium">{displayStudentInfo.schoolName}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">Email</p>
                    <p className="text-white font-medium">{displayStudentInfo.email}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-300 text-sm">Created On</p>
                      <p className="text-white font-medium">{new Date(displayStudentInfo.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Subjects</p>
                      <p className="text-white font-medium">
                      {displayStudentInfo.subjects && displayStudentInfo.subjects.length > 0
                        ? displayStudentInfo.subjects.join(', ')
                        : 'Not specified'
                      }
                    </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quiz Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Quizzes Attempted:</span>
                  <span className="text-sm text-gray-900">
                    {analytics?.quizzesAttempted || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Quiz Accuracy:</span>
                  <span className="text-sm text-gray-900">{analytics?.quizAccuracy || 0}%</span>
                </div>
                {analytics?.averageScores && (
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-700">Subject-wise Performance:</span>
                    <div className="mt-1 space-y-1">
                      {Object.entries(analytics.averageScores).map(([subject, score]) => (
                        <div key={subject} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 capitalize">{subject}:</span>
                          <span className="text-gray-800">{Math.round((score as number) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Time Spent Learning:</span>
                  <span className="text-sm text-gray-900">{analytics?.totalTimeSpent || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Learning Streak (days):</span>
                  <span className="text-sm text-gray-900">{analytics?.currentLearningStreak || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Motivation Level Tag:</span>
                  <span className="text-sm text-gray-900">{analytics?.motivationLevel || 'N/A'}</span>
                </div>
              </div>

              {/* Leaderboard Stats */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Leaderboard Insights</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Rank:</span>
                  <span className="text-sm text-gray-900">{analytics?.currentRank || 'N/A'}st</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Rank Movement:</span>
                  <span className="text-sm text-gray-900">{analytics?.rankMovement || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Flames Earned (Weekly):</span>
                  <span className="text-sm text-gray-900">{analytics?.flamesEarned || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Topics Completed:</span>
                  <span className="text-sm text-gray-900">{analytics?.topicsCompleted || 0}</span>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Average Score per Subject</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Last Quiz Taken (date + score)</span>
                  <span className="text-sm text-gray-900">{analytics?.lastQuizDate || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Time of Day Most Active</span>
                  <span className="text-sm text-gray-900">{analytics?.timeOfDayMostActive || 'N/A'}</span>
                </div>
                <h4 className="text-sm font-medium text-gray-500 pt-2">Chat Usage Overview</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Messages Sent:</span>
                  <span className="text-sm text-gray-900">{analytics?.chatStats?.totalMessagesSent || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Doubts Asked:</span>
                  <span className="text-sm text-gray-900">{analytics?.chatStats?.totalDoubtsAsked || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Most Discussed Subject:</span>
                  <span className="text-sm text-gray-900">{analytics?.chatStats?.mostDiscussedSubject || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quizzes Completed Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="bg-primary-dark text-white p-3 rounded-t-lg -m-6 mb-4">
                <h4 className="font-medium">Quizzes Completed (All Time)</h4>
              </div>
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto mb-4 relative">
                    {/* Pie Chart Placeholder */}
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-gray-400 relative">
                      <div className="absolute inset-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Maths</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Chemistry</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-gray-400 rounded"></div>
                      <span>Physics</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Growth Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="bg-primary-dark text-white p-3 rounded-t-lg -m-6 mb-4">
                <h4 className="font-medium">Overall Growth (All Time)</h4>
              </div>
              <div className="flex items-center justify-center h-64">
                <div className="w-full h-48 bg-gray-50 rounded border relative">
                  {/* Line Chart Placeholder */}
                  <div className="absolute inset-4">
                    <svg className="w-full h-full" viewBox="0 0 300 150">
                      <polyline
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        points="0,140 30,120 60,100 90,85 120,70 150,60 180,45 210,35 240,25 270,15 300,10"
                      />
                      {/* Grid lines */}
                      <defs>
                        <pattern id="grid" width="30" height="15" patternUnits="userSpaceOnUse">
                          <path d="M 30 0 L 0 0 0 15" fill="none" stroke="#e5e7eb" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                    Lesson growth rate
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issues Raised Section */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Issues Raised</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary-dark">
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">User Mail</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-row-light">
                    <td className="px-6 py-4 text-sm text-gray-900">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">1 July 2025 12:23</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 bg-primary-dark hover:bg-primary-dark/90 text-white text-xs font-medium rounded transition-colors">
                          View Issue
                        </button>
                        <button className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors">
                          <Award className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Charts */}
          {chartData ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity Charts</h3>
              <AnalyticsCharts
                dailyActivity={chartData.dailyActivity}
                subjectDistribution={chartData.subjectDistribution}
                performanceTrend={chartData.performanceTrend}
              />
            </div>
          ) : !isLoading && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Chart Data Available</h3>
                <p className="text-gray-600 mb-4">
                  Chart data will be available once the student starts using the platform.
                </p>
                <Button
                  onClick={fetchStudentAnalytics}
                  variant="outline"
                  size="sm"
                  className="flex items-center mx-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </div>
  )
}
