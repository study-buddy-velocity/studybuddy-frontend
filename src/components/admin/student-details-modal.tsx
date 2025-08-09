"use client"

import { X, Download, User, MessageCircle, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect, useRef } from "react"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'


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



interface StudentAnalytics {
  quizStats: {
    totalAttempted: number
    accuracy: number
    subjectWiseAttempts: Record<string, number>
    averageScores: Record<string, number>
    lastQuizDate: string
    topicsCompleted: number
  }
  chatStats: {
    totalMessages: number
    totalDoubts: number
    mostDiscussedSubject: string
    totalTimeSpent: string
    timeOfDayMostActive: string
    streak: number
  }
  leaderboardStats: {
    currentRank: number
    sparkPoints: number
    rankMovement: string
    motivationLevel: string
  }
  activityPattern: {
    dailyActivity: Array<{
      date: string
      queries: number
      timeSpent: number
      subjects: string[]
    }>
    weeklyPattern: Record<string, number>
    monthlyTrend: Array<{
      month: string
      activity: number
    }>
  }
}

interface Subject {
  _id: string
  name: string
  description?: string
}

interface StudentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
}

export default function StudentDetailsModal({ isOpen, onClose, student }: StudentDetailsModalProps) {
  console.log('StudentDetailsModal rendered with:', { isOpen, student: student?._id })
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null)

  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [subjectMap, setSubjectMap] = useState<{[key: string]: Subject}>({})
  const [subjectsLoading, setSubjectsLoading] = useState(false)
  const modalContentRef = useRef<HTMLDivElement>(null)

  // Fetch subjects for mapping IDs to names
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/subjects`, {
          headers: getAuthHeaders()
        })

        if (response.ok) {
          const subjects = await response.json()
          const mapping: {[key: string]: Subject} = {}
          subjects.forEach((subject: Subject) => {
            mapping[subject._id] = subject
          })
          setSubjectMap(mapping)
        }
      } catch (error) {
        console.error('Failed to fetch subjects:', error)
      } finally {
        setSubjectsLoading(false)
      }
    }

    if (isOpen) {
      fetchSubjects()
    }
  }, [isOpen])

  // Fetch student analytics when modal opens
  useEffect(() => {
    if (isOpen && student?._id) {
      console.log('Modal opened for student:', student._id)
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

  // Helper function to convert subject ID to name
  const getSubjectDisplayName = (subjectId: string) => {
    const subject = subjectMap[subjectId]
    return subject ? subject.name : subjectId // Fallback to ID if not found
  }

  // Simple pie chart component for quiz distribution
  const QuizDistributionChart = ({ data }: { data: Record<string, number> }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0)
    if (total === 0) return null

    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']
    let currentAngle = 0

    return (
      <div className="flex flex-col items-center p-4 bg-white rounded-lg border" data-chart="pie" style={{ width: '300px', minHeight: '250px' }}>
        <h4 className="text-center font-medium text-gray-800 mb-4 text-base">Quiz Attempts by Subject</h4>
        <div className="relative mb-4" style={{ width: '180px', height: '180px' }}>
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            className="transform -rotate-90"
            style={{ display: 'block', backgroundColor: 'white' }}
          >
            {/* Background circle for better visibility */}
            <circle
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="2"
            />
            {Object.entries(data).map(([subject, count], index) => {
              const percentage = (count / total) * 100
              const angle = (percentage / 100) * 360
              const startAngle = currentAngle
              currentAngle += angle

              const x1 = 90 + 70 * Math.cos((startAngle * Math.PI) / 180)
              const y1 = 90 + 70 * Math.sin((startAngle * Math.PI) / 180)
              const x2 = 90 + 70 * Math.cos(((startAngle + angle) * Math.PI) / 180)
              const y2 = 90 + 70 * Math.sin(((startAngle + angle) * Math.PI) / 180)

              const largeArcFlag = angle > 180 ? 1 : 0

              return (
                <path
                  key={subject}
                  d={`M 90 90 L ${x1} ${y1} A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={colors[index % colors.length]}
                  stroke="#ffffff"
                  strokeWidth="3"
                  className="hover:opacity-80 transition-opacity"
                />
              )
            })}
          </svg>
        </div>
        <div className="flex flex-wrap justify-center gap-3 text-sm max-w-xs">
          {Object.entries(data).map(([subject, count], index) => (
            <div key={subject} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="font-medium text-gray-700">{getSubjectDisplayName(subject)}: {count}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Simple bar chart for quiz accuracy
  const AccuracyBarChart = ({ data }: { data: Record<string, number> }) => {
    if (!data || Object.keys(data).length === 0) return null

    const maxScore = Math.max(...Object.values(data))
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']

    return (
      <div className="space-y-3 p-4 bg-white rounded-lg border" data-chart="bar" style={{ width: '350px', minHeight: '200px' }}>
        <h4 className="text-center font-medium text-gray-800 mb-4 text-base">Subject-wise Accuracy Performance</h4>
        {Object.entries(data).map(([subject, score], index) => {
          const percentage = Math.round(score * 100)
          const barWidth = maxScore > 0 ? (score / maxScore) * 100 : 0
          return (
            <div key={subject} className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-gray-700 font-semibold">{getSubjectDisplayName(subject)}</span>
                <span className="text-gray-900 font-bold">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6 relative shadow-inner">
                <div
                  className="h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-3 shadow-sm"
                  style={{
                    width: `${Math.max(barWidth, 15)}%`, // Minimum 15% width for visibility
                    backgroundColor: colors[index % colors.length]
                  }}
                >
                  <span className="text-white text-xs font-bold">{percentage}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const fetchStudentAnalytics = async () => {
    if (!student?._id) return

    console.log('Fetching analytics for student:', student._id)
    console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/admin/analytics/student/${student._id}`)

    setIsLoading(true)
    try {

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

      console.log('Analytics API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Analytics data received:', data)
        console.log('Analytics structure:', JSON.stringify(data.analytics, null, 2))

        // Set student info from API response
        if (data.studentInfo) {
          setStudentInfo(data.studentInfo)
        }

        // Set analytics data from API
        if (data.analytics) {
          console.log('Setting analytics data:', data.analytics)
          setAnalytics(data.analytics)
        } else {
          console.log('No analytics data received, showing empty state')
          setAnalytics(createFallbackAnalytics())
        }


      } else {
        console.log('Analytics API not available, status:', response.status)
        // Show empty state instead of dummy data
        setAnalytics(createFallbackAnalytics())

        toast({
          title: "Info",
          description: "Analytics service is not available. Showing empty state.",
        })
      }

    } catch (error) {
      console.error('Error fetching student analytics:', error)

      // Show empty state instead of dummy data
      setAnalytics(createFallbackAnalytics())

      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try refreshing.",
      })
    } finally {
      setIsLoading(false)
    }
  }



  const createFallbackAnalytics = (): StudentAnalytics => {
    // Return empty data when no real analytics available
    return {
      quizStats: {
        totalAttempted: 0,
        accuracy: 0,
        subjectWiseAttempts: {},
        averageScores: {},
        lastQuizDate: 'No quizzes taken yet',
        topicsCompleted: 0
      },
      chatStats: {
        totalMessages: 0,
        totalDoubts: 0,
        mostDiscussedSubject: 'No chat activity yet',
        totalTimeSpent: '0hr 0min',
        timeOfDayMostActive: 'No activity yet',
        streak: 0
      },
      leaderboardStats: {
        currentRank: 0,
        sparkPoints: 0,
        rankMovement: 'No rank yet',
        motivationLevel: 'Getting started'
      },
      activityPattern: {
        dailyActivity: [],
        weeklyPattern: {},
        monthlyTrend: []
      }
    }
  }



  const generatePDFReport = async () => {
    if (!modalContentRef.current || !displayStudentInfo) return

    try {
      // Create a new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      let yPosition = 20

      // Add title
      pdf.setFontSize(20)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Student Analytics Report', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 15

      // Add generation date
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 20

      // Student Information Section
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('Student Information', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      const studentInfo = [
        `Name: ${displayStudentInfo.name || 'Unknown Student'}`,
        `Email: ${displayStudentInfo.email}`,
        `Phone: ${displayStudentInfo.phone || 'Not provided'}`,
        `Class: ${displayStudentInfo.class || 'Not specified'}`,
        `School: ${displayStudentInfo.schoolName || 'Not specified'}`,
        `Registration Date: ${new Date(displayStudentInfo.createdAt).toLocaleDateString()}`,
        `Subjects: ${displayStudentInfo.subjects && displayStudentInfo.subjects.length > 0 ? displayStudentInfo.subjects.join(', ') : 'None specified'}`
      ]

      studentInfo.forEach(info => {
        pdf.text(info, 20, yPosition)
        yPosition += 6
      })
      yPosition += 10

      // Analytics Section
      if (analytics) {
        pdf.setFontSize(14)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Performance Analytics', 20, yPosition)
        yPosition += 10

        // Quiz Statistics
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Quiz Statistics', 20, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const quizStats = [
          `Quizzes Attempted: ${analytics.quizStats?.totalAttempted || 0}`,
          `Quiz Accuracy: ${analytics.quizStats?.accuracy || 0}%`,
          `Topics Completed: ${analytics.quizStats?.topicsCompleted || 0}`,
          `Last Quiz Date: ${analytics.quizStats?.lastQuizDate || 'No quizzes taken'}`
        ]

        quizStats.forEach(stat => {
          pdf.text(stat, 25, yPosition)
          yPosition += 6
        })

        // Add subject-wise performance if available
        if (analytics.quizStats?.averageScores && Object.keys(analytics.quizStats.averageScores).length > 0) {
          yPosition += 5
          pdf.setFontSize(11)
          pdf.setFont('helvetica', 'bold')
          pdf.text('Subject-wise Performance:', 25, yPosition)
          yPosition += 6

          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          Object.entries(analytics.quizStats.averageScores).forEach(([subjectKey, score]) => {
            pdf.text(`${getSubjectDisplayName(subjectKey)}: ${Math.round((score as number) * 100)}%`, 30, yPosition)
            yPosition += 5
          })
        }
        yPosition += 10

        // Chat Statistics
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Chat Statistics', 20, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const chatStats = [
          `Total Messages: ${analytics.chatStats?.totalMessages || 0}`,
          `Total Doubts Asked: ${analytics.chatStats?.totalDoubts || 0}`,
          `Most Discussed Subject: ${analytics.chatStats?.mostDiscussedSubject ? getSubjectDisplayName(analytics.chatStats.mostDiscussedSubject) : 'No chat activity'}`,
          `Total Time Spent: ${analytics.chatStats?.totalTimeSpent || '0hr 0min'}`,
          `Learning Streak: ${analytics.chatStats?.streak || 0} days`
        ]

        chatStats.forEach(stat => {
          pdf.text(stat, 25, yPosition)
          yPosition += 6
        })
        yPosition += 10

        // Leaderboard Stats
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Leaderboard Position', 20, yPosition)
        yPosition += 8

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const leaderboardStats = [
          `Current Rank: ${analytics.leaderboardStats?.currentRank ? `#${analytics.leaderboardStats.currentRank}` : 'Not ranked'}`,
          `Spark Points: ${analytics.leaderboardStats?.sparkPoints || 0}`,
          `Rank Movement: ${analytics.leaderboardStats?.rankMovement || 'No movement'}`,
          `Motivation Level: ${analytics.leaderboardStats?.motivationLevel || 'Getting started'}`
        ]

        leaderboardStats.forEach(stat => {
          pdf.text(stat, 25, yPosition)
          yPosition += 6
        })
        yPosition += 15

        // Add charts on a new page if data exists
        if (analytics.quizStats?.subjectWiseAttempts && Object.keys(analytics.quizStats.subjectWiseAttempts).length > 0) {
          try {
            // Add a new page for charts
            pdf.addPage()
            let chartYPosition = 20

            // Add charts page title
            pdf.setFontSize(18)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Performance Charts', pageWidth / 2, chartYPosition, { align: 'center' })
            chartYPosition += 30

            // Wait longer for charts to render properly
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Find chart elements
            const pieChartElement = document.querySelector('[data-chart="pie"]') as HTMLElement
            const barChartElement = document.querySelector('[data-chart="bar"]') as HTMLElement

            if (pieChartElement) {
              const canvas = await html2canvas(pieChartElement, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                width: pieChartElement.offsetWidth,
                height: pieChartElement.offsetHeight,
                logging: false,
                onclone: (clonedDoc) => {
                  // Ensure all styles are applied to the cloned document
                  const clonedElement = clonedDoc.querySelector('[data-chart="pie"]') as HTMLElement
                  if (clonedElement) {
                    clonedElement.style.backgroundColor = '#ffffff'
                    clonedElement.style.padding = '16px'
                  }
                }
              })
              const imgData = canvas.toDataURL('image/png', 1.0)

              // Add pie chart with better sizing
              const chartWidth = 80
              const chartHeight = 65
              const chartX = (pageWidth - chartWidth) / 2
              pdf.addImage(imgData, 'PNG', chartX, chartYPosition, chartWidth, chartHeight)
              chartYPosition += chartHeight + 20
            }

            if (barChartElement) {
              const canvas = await html2canvas(barChartElement, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                width: barChartElement.offsetWidth,
                height: barChartElement.offsetHeight,
                logging: false,
                onclone: (clonedDoc) => {
                  // Ensure all styles are applied to the cloned document
                  const clonedElement = clonedDoc.querySelector('[data-chart="bar"]') as HTMLElement
                  if (clonedElement) {
                    clonedElement.style.backgroundColor = '#ffffff'
                    clonedElement.style.padding = '16px'
                  }
                }
              })
              const imgData = canvas.toDataURL('image/png', 1.0)

              // Add bar chart with better sizing
              const chartWidth = 90
              const chartHeight = 50
              const chartX = (pageWidth - chartWidth) / 2
              pdf.addImage(imgData, 'PNG', chartX, chartYPosition, chartWidth, chartHeight)
            }
          } catch (chartError) {
            console.error('Error adding charts to PDF:', chartError)
            // Add text note about charts
            pdf.setFontSize(12)
            pdf.text('Charts could not be generated. Please view them in the web interface.', 20, 50)
          }
        }
      }

      // Save the PDF
      const fileName = `student-report-${displayStudentInfo.name || student?.email.split('@')[0] || 'unknown'}-${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

      toast({
        title: "Download Complete",
        description: "Student report has been downloaded as PDF with charts.",
      })

    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  }

  const handleDownload = async () => {
    if (!student?._id) return

    setIsDownloading(true)
    try {
      await generatePDFReport()
    } catch (error) {
      console.error('Error downloading report:', error)
      toast({
        title: "Error",
        description: "Failed to generate PDF report. Please try again.",
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
Subjects: ${studentInfo.subjects && studentInfo.subjects.length > 0 ? studentInfo.subjects.join(', ') : 'None specified'}

PERFORMANCE ANALYTICS
====================
${analytics ? `
QUIZ STATISTICS
--------------
Quizzes Attempted: ${analytics.quizStats?.totalAttempted || 0}
Quiz Accuracy: ${analytics.quizStats?.accuracy || 0}%
Topics Completed: ${analytics.quizStats?.topicsCompleted || 0}
Last Quiz Date: ${analytics.quizStats?.lastQuizDate || 'No quizzes taken'}

SUBJECT SCORES
--------------
${analytics.quizStats?.averageScores && Object.keys(analytics.quizStats.averageScores).length > 0 ?
  Object.entries(analytics.quizStats.averageScores).map(([subject, score]) =>
    `${subject}: ${Math.round((score as number) * 100)}%`
  ).join('\n') : 'No quiz scores available'}

CHAT STATISTICS
--------------
Total Messages Sent: ${analytics.chatStats?.totalMessages || 0}
Total Doubts Asked: ${analytics.chatStats?.totalDoubts || 0}
Most Discussed Subject: ${analytics.chatStats?.mostDiscussedSubject || 'No chat activity'}
Total Time Spent: ${analytics.chatStats?.totalTimeSpent || '0hr 0min'}
Most Active Time: ${analytics.chatStats?.timeOfDayMostActive || 'No activity'}
Learning Streak: ${analytics.chatStats?.streak || 0} days

LEADERBOARD STATS
----------------
Current Rank: ${analytics.leaderboardStats?.currentRank ? `#${analytics.leaderboardStats.currentRank}` : 'Not ranked'}
Spark Points: ${analytics.leaderboardStats?.sparkPoints || 0}
Rank Movement: ${analytics.leaderboardStats?.rankMovement || 'No movement'}
Motivation Level: ${analytics.leaderboardStats?.motivationLevel || 'Getting started'}

RECENT ACTIVITY
--------------
${analytics.activityPattern?.dailyActivity && analytics.activityPattern.dailyActivity.length > 0 ?
  analytics.activityPattern.dailyActivity.slice(-7).map(activity =>
    `${new Date(activity.date).toLocaleDateString()}: ${activity.queries} queries, ${activity.timeSpent} min, Subjects: ${activity.subjects.map(subjectId => getSubjectDisplayName(subjectId)).join(', ') || 'None'}`
  ).join('\n') : 'No recent activity'}
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
        <div ref={modalContentRef} className="p-6 space-y-8">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quiz Stats */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Quiz Performance</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Quizzes Attempted:</span>
                  <span className="text-sm text-gray-900">
                    {analytics?.quizStats?.totalAttempted || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Quiz Accuracy:</span>
                  <span className="text-sm text-gray-900">{analytics?.quizStats?.accuracy || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Topics Completed:</span>
                  <span className="text-sm text-gray-900">{analytics?.quizStats?.topicsCompleted || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Last Quiz Date:</span>
                  <span className="text-sm text-gray-900">{analytics?.quizStats?.lastQuizDate || 'N/A'}</span>
                </div>
                {analytics?.quizStats?.averageScores &&
                 Object.keys(analytics.quizStats.averageScores).length > 0 &&
                 analytics.quizStats.totalAttempted > 0 && (
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-700">Subject-wise Performance:</span>
                    <div className="mt-1 space-y-1">
                      {Object.entries(analytics.quizStats.averageScores).map(([subjectKey, score]) => (
                        <div key={subjectKey} className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 capitalize">{getSubjectDisplayName(subjectKey)}:</span>
                          <span className="text-gray-800">{Math.round((score as number) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Stats */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Chat Activity</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Messages:</span>
                  <span className="text-sm text-gray-900">{analytics?.chatStats?.totalMessages || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Doubts Asked:</span>
                  <span className="text-sm text-gray-900">{analytics?.chatStats?.totalDoubts || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Most Discussed Subject:</span>
                  <span className="text-sm text-gray-900">
                    {analytics?.chatStats?.mostDiscussedSubject ?
                      getSubjectDisplayName(analytics.chatStats.mostDiscussedSubject) : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Time Spent:</span>
                  <span className="text-sm text-gray-900">{analytics?.chatStats?.totalTimeSpent || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Most Active Time:</span>
                  <span className="text-sm text-gray-900">{analytics?.chatStats?.timeOfDayMostActive || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Learning Streak:</span>
                  <span className="text-sm text-gray-900">{analytics?.chatStats?.streak || 0} days</span>
                </div>
              </div>

              {/* Leaderboard Stats */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-500">Leaderboard Position</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Rank:</span>
                  <span className="text-sm text-gray-900">
                    {analytics?.leaderboardStats?.currentRank ? `#${analytics.leaderboardStats.currentRank}` : 'Not ranked'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Spark Points:</span>
                  <span className="text-sm text-gray-900">{analytics?.leaderboardStats?.sparkPoints || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Rank Movement:</span>
                  <span className="text-sm text-gray-900">{analytics?.leaderboardStats?.rankMovement || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Motivation Level:</span>
                  <span className="text-sm text-gray-900">{analytics?.leaderboardStats?.motivationLevel || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section - Show when data exists */}
          {analytics && (
            (analytics.quizStats?.subjectWiseAttempts && Object.keys(analytics.quizStats.subjectWiseAttempts).length > 0) ||
            (analytics.quizStats?.averageScores && Object.keys(analytics.quizStats.averageScores).length > 0)
          ) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Charts</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quiz Distribution Pie Chart */}
                {analytics.quizStats?.subjectWiseAttempts &&
                 Object.keys(analytics.quizStats.subjectWiseAttempts).length > 0 && (
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Quiz Attempts by Subject</h4>
                    <QuizDistributionChart data={analytics.quizStats.subjectWiseAttempts} />
                  </div>
                )}

                {/* Accuracy Bar Chart */}
                {analytics.quizStats?.averageScores &&
                 Object.keys(analytics.quizStats.averageScores).length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-4">Subject-wise Accuracy</h4>
                    <AccuracyBarChart data={analytics.quizStats.averageScores} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Summary */}
          {analytics?.activityPattern?.dailyActivity && analytics.activityPattern.dailyActivity.length > 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.activityPattern.dailyActivity.slice(-7).map((activity, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      {new Date(activity.date).toLocaleDateString()}
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div>Queries: {activity.queries}</div>
                      <div>Time: {activity.timeSpent} min</div>
                      <div>Subjects: {activity.subjects.map(subjectId => getSubjectDisplayName(subjectId)).join(', ') || 'None'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !isLoading && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Data Available</h3>
                <p className="text-gray-600 mb-4">
                  Activity data will appear once the student starts using the platform.
                </p>
                <Button
                  onClick={fetchStudentAnalytics}
                  variant="outline"
                  size="sm"
                  className="flex items-center mx-auto"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
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
