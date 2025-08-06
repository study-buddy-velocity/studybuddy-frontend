"use client"

import { useState, useEffect } from "react"
import { SubjectCard } from "@/components/dashboard/subject-card"
import { RecommendationCard } from "@/components/dashboard/recommendation-card"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Zap } from "lucide-react"
import { subjectApi, Subject } from "@/lib/api/quiz"
import { useAuth } from "@/hooks/useAuthenticationHook"

interface LocalSubject {
  subject: string
  color: string
  image: string
  id: string
}

interface QuizRecommendation {
  subject: string
  score: string
  color: string
  buttonColor: string
  subjectId?: string
  topicId?: string
  topicName?: string
}

interface AnalysisData {
  subject: Subject
  queryCount: number
  topics: Set<string>
  recentActivity: boolean
}

interface ChatHistoryItem {
  _id: string
  date: string
  subjectWise: Array<{
    subject: string
    queries: Array<{
      query: string
      response: string
      tokensUsed: number
      summary?: string
      _id: string
      createdAt: string
      updatedAt: string
    }>
    _id: string
  }>
  totalTokensSpent: number
  subjects: string[]
  userId: string
  createdAt: string
  updatedAt: string
}

const subjectColors = ["bg-blue-500", "bg-orange-500", "bg-red-500", "bg-green-500", "bg-purple-500", "bg-yellow-500"]

// Helper function to analyze user's learning patterns from chat history
const analyzeUserLearningPatterns = (chatHistory: ChatHistoryItem[], subjects: Subject[]) => {
  const subjectMap = new Map<string, Subject>()
  subjects.forEach(subject => {
    subjectMap.set(subject._id, subject)
  })

  const analysis = new Map<string, AnalysisData>()

  chatHistory.forEach(historyItem => {
    // Check if this is recent activity (within last 7 days)
    const isRecent = new Date(historyItem.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    historyItem.subjectWise.forEach(subjectData => {
      const subject = subjectMap.get(subjectData.subject)
      if (subject) {
        const existing = analysis.get(subject._id) || {
          subject,
          queryCount: 0,
          topics: new Set(),
          recentActivity: false
        }

        existing.queryCount += subjectData.queries.length
        existing.recentActivity = existing.recentActivity || isRecent

        // Extract topics from queries (simplified - could be enhanced with NLP)
        subjectData.queries.forEach(query => {
          subject.topics.forEach(topic => {
            if (query.query.toLowerCase().includes(topic.name.toLowerCase()) ||
                query.response.toLowerCase().includes(topic.name.toLowerCase())) {
              existing.topics.add(topic.name)
            }
          })
        })

        analysis.set(subject._id, existing)
      }
    })
  })

  return analysis
}

// Helper function to generate quiz recommendations based on analysis
const generateQuizRecommendations = (analysis: Map<string, AnalysisData>): QuizRecommendation[] => {
  const recommendations: QuizRecommendation[] = []
  const colors = [
    { bg: "bg-blue-50", button: "bg-blue-500" },
    { bg: "bg-green-50", button: "bg-green-500" },
    { bg: "bg-orange-50", button: "bg-orange-500" },
    { bg: "bg-purple-50", button: "bg-purple-500" },
    { bg: "bg-red-50", button: "bg-red-500" },
    { bg: "bg-indigo-50", button: "bg-indigo-500" },
  ]

  // Sort subjects by query count (most asked questions first)
  const sortedSubjects = Array.from(analysis.entries())
    .sort(([, a], [, b]) => b.queryCount - a.queryCount)
    .slice(0, 6) // Limit to top 6 subjects

  sortedSubjects.forEach(([_, data], index) => {
    console.log(_);
    const colorIndex = index % colors.length
    const { subject, queryCount, topics, recentActivity } = data

    // Generate recommendation score based on activity
    let score = "Quick Review"
    if (queryCount > 10) {
      score = "Practice Needed"
    } else if (queryCount > 5) {
      score = "Review Required"
    } else if (recentActivity) {
      score = "Fresh Topic"
    }

    // If we have specific topics, recommend quiz for the most discussed topic
    const topicArray = Array.from(topics)
    const recommendedTopic = topicArray.length > 0 ? topicArray[0] : undefined
    const topicObj = recommendedTopic ? subject.topics.find((t: { name: string; _id?: string }) => t.name === recommendedTopic) : undefined

    recommendations.push({
      subject: subject.name,
      score,
      color: colors[colorIndex].bg,
      buttonColor: colors[colorIndex].button,
      subjectId: subject._id,
      topicId: topicObj?._id,
      topicName: topicObj?.name
    })
  })

  // If no chat history, provide some default recommendations
  if (recommendations.length === 0) {
    return [
      { subject: "Mathematics", score: "Get Started", color: "bg-blue-50", buttonColor: "bg-blue-500" },
      { subject: "Physics", score: "Explore", color: "bg-green-50", buttonColor: "bg-green-500" },
      { subject: "Chemistry", score: "Try Now", color: "bg-orange-50", buttonColor: "bg-orange-500" },
    ]
  }

  return recommendations
}

export default function Dashboard() {
  const [subjects, setSubjects] = useState<LocalSubject[]>([])
  const [recommendations, setRecommendations] = useState<QuizRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const { getAuthHeaders } = useAuth()
console.log(loading);
  useEffect(() => {
    loadSubjects()
    loadRecommendations()
  }, []) // Functions are stable, no need to add as dependencies

  const loadSubjects = async () => {
    try {
      setLoading(true)
      const apiSubjects = await subjectApi.getAll()

      const localSubjects: LocalSubject[] = apiSubjects.map((subject, index) => ({
        id: subject._id,
        subject: subject.name,
        color: subjectColors[index % subjectColors.length],
        image: "/placeholder.svg?height=64&width=64"
      }))

      setSubjects(localSubjects)
    } catch (error) {
      console.error('Failed to load subjects:', error)
      // Fallback to default subjects
      setSubjects([
        { id: "1", subject: "Maths", color: "bg-blue-500", image: "/placeholder.svg?height=64&width=64" },
        { id: "2", subject: "Physics", color: "bg-orange-500", image: "/placeholder.svg?height=64&width=64" },
        { id: "3", subject: "Biology", color: "bg-red-500", image: "/placeholder.svg?height=64&width=64" },
        { id: "4", subject: "Chemistry", color: "bg-green-500", image: "/placeholder.svg?height=64&width=64" },
      ])
    } finally {
      setLoading(false)
    }
  }

  const loadRecommendations = async () => {
    try {
      setLoading(true)

      // Fetch chat history to analyze user's learning patterns
      const chatResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/chat-history`,
        {
          headers: getAuthHeaders(),
        }
      )

      if (!chatResponse.ok) {
        throw new Error('Failed to fetch chat history')
      }

      const chatData = await chatResponse.json()
      const chatHistory: ChatHistoryItem[] = Array.isArray(chatData.data) ? chatData.data : [chatData.data]

      // Fetch all subjects to get subject and topic details
      const allSubjects = await subjectApi.getAll()

      // Analyze chat history to generate intelligent recommendations
      const subjectAnalysis = analyzeUserLearningPatterns(chatHistory, allSubjects)

      // Generate recommendations based on analysis
      const intelligentRecommendations = generateQuizRecommendations(subjectAnalysis)

      setRecommendations(intelligentRecommendations)
    } catch (error) {
      console.error('Error loading recommendations:', error)
      // Fallback to some default recommendations
      setRecommendations([
        { subject: "Mathematics", score: "Practice Needed", color: "bg-blue-50", buttonColor: "bg-blue-500" },
        { subject: "Physics", score: "Review Required", color: "bg-orange-50", buttonColor: "bg-orange-500" },
        { subject: "Chemistry", score: "Quick Quiz", color: "bg-green-50", buttonColor: "bg-green-500" },
      ])
    } finally {
      setLoading(false)
    }
  }
  return (
    <SidebarProvider>
      <AppSidebar currentPage="dashboard" />
      <SidebarInset>
        <DashboardHeader />

        <main className="flex-1 p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
          {/* Mobile Welcome Message */}
          <div className="md:hidden">
            <h1 className="text-xl font-medium text-gray-800 mb-4">Welcome back, Student 👋</h1>
          </div>

          {/* Continue Learning Section */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Continue Learning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjects.map((subject, index) => (
                <SubjectCard
                  key={index}
                  subject={subject.subject}
                  color={subject.color}
                  image={subject.image}
                  subjectId={subject.id}
                />
              ))}
            </div>
          </section>

          {/* Smart Recommendations Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">Smart Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendations.map((rec, index) => (
                <RecommendationCard
                  key={index}
                  subject={rec.subject}
                  score={rec.score}
                  color={rec.color}
                  buttonColor={rec.buttonColor}
                  subjectId={rec.subjectId}
                  topicId={rec.topicId}
                  topicName={rec.topicName}
                />
              ))}
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
