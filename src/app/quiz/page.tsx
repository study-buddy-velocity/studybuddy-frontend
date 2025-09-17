"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Star } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { quizApi } from "@/lib/api/quiz"
import RaiseIssueModal from "@/components/ui/raise-issue-modal"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

import { useAuth } from "@/hooks/useAuthenticationHook"
interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  quizId?: string
}

interface QuizSettings {
  difficulty: string
  numQuestions: number
  questionType: string
}

interface UserAnswer {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the value of x in the equation 3x + 7 = 22?",
    options: ["x = 5", "x = 3", "x = 4", "x = 7"],
    correctAnswer: 0,
    explanation: "To solve 3x + 7 = 22, subtract 7 from both sides: 3x = 15, then divide by 3: x = 5",
  },
  {
    id: 2,
    question: "Simplify: 2x + 3x - x",
    options: ["4x", "5x", "6x", "3x"],
    correctAnswer: 0,
    explanation: "Combine like terms: 2x + 3x - x = (2 + 3 - 1)x = 4x",
  },
  {
    id: 3,
    question: "What is the slope of the line y = 2x + 5?",
    options: ["2", "5", "-2", "1/2"],
    correctAnswer: 0,
    explanation: "In the form y = mx + b, m is the slope. Here m = 2",
  },
  {
    id: 4,
    question: "Factor: x² - 9",
    options: ["(x - 3)(x + 3)", "(x - 9)(x + 1)", "(x - 3)²", "Cannot be factored"],
    correctAnswer: 0,
    explanation: "This is a difference of squares: x² - 9 = x² - 3² = (x - 3)(x + 3)",
  },
  {
    id: 5,
    question: "Solve for y: 2y - 6 = 10",
    options: ["y = 8", "y = 2", "y = 4", "y = 6"],
    correctAnswer: 0,
    explanation: "Add 6 to both sides: 2y = 16, then divide by 2: y = 8",
  },
  {
    id: 6,
    question: "What is the y-intercept of y = -3x + 7?",
    options: ["7", "-3", "3", "-7"],
    correctAnswer: 0,
    explanation: "In the form y = mx + b, b is the y-intercept. Here b = 7",
  },
  {
    id: 7,
    question: "Expand: (x + 2)(x + 3)",
    options: ["x² + 5x + 6", "x² + 6x + 5", "x² + 5x + 5", "x² + 6x + 6"],
    correctAnswer: 0,
    explanation: "Use FOIL: (x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6",
  },
  {
    id: 8,
    question: "If 4x - 8 = 12, what is x?",
    options: ["x = 5", "x = 3", "x = 4", "x = 1"],
    correctAnswer: 0,
    explanation: "Add 8 to both sides: 4x = 20, then divide by 4: x = 5",
  },
  {
    id: 9,
    question: "What is the vertex of y = x² - 4x + 3?",
    options: ["(2, -1)", "(1, 0)", "(3, 0)", "(2, 1)"],
    correctAnswer: 0,
    explanation: "For y = ax² + bx + c, vertex x = -b/2a = -(-4)/2(1) = 2. When x = 2: y = 4 - 8 + 3 = -1",
  },
  {
    id: 10,
    question: "Solve: x² - 5x + 6 = 0",
    options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = 5, 1"],
    correctAnswer: 0,
    explanation: "Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3",
  },
]

function AlgebraQuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentScreen, setCurrentScreen] = useState<"setup" | "quiz" | "results">("setup")
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    difficulty: "easy",
    numQuestions: 10,
    questionType: "multiple-choice",
  })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([])

  // Context from URL parameters
  const [subjectId, setSubjectId] = useState("")
  const [classId, setClassId] = useState("")
  const [topicId, setTopicId] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [topicName, setTopicName] = useState("")
  const [loading, setLoading] = useState(false)
  const [showRaiseIssueModal, setShowRaiseIssueModal] = useState(false)
  const { getAuthHeaders } = useAuth()

  // Handle URL parameters (always reset so stale values aren't reused)
  useEffect(() => {
    // Support both ...Id and legacy param names from various entry points
    const subjectFromUrl = searchParams.get('subjectId') || searchParams.get('subject') || ''
    const topicFromUrl = searchParams.get('topicId') || searchParams.get('topic') || ''
    const subjectNameFromUrl = searchParams.get('subjectName') || ''
    const classFromUrl = searchParams.get('classId') || ''
    const topicNameFromUrl = searchParams.get('topicName') || ''

    setSubjectId(subjectFromUrl)
    setTopicId(topicFromUrl)
    if (classFromUrl) setClassId(classFromUrl)
    setSubjectName(decodeURIComponent(subjectNameFromUrl))
    setTopicName(decodeURIComponent(topicNameFromUrl))
  }, [searchParams])

  // Load user classId from profile if not already present from URL
  useEffect(() => {
    if (classId) return
    const fetchUserClass = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/user-details`, {
          headers: getAuthHeaders(),
        })
        if (res.ok) {
          const data = await res.json()
          // Backend stores class as name (e.g., "6th Standard"); map to ID expected by quiz filters
          const mapping: Record<string, string> = {
            '6th Standard': '6th', '7th Standard': '7th', '8th Standard': '8th',
            '9th Standard': '9th', '10th Standard': '10th', '11th Standard': '11th', '12th Standard': '12th'
          }
          const className = (data?.class || '').trim()
          const classIdVal = mapping[className] || ''
          if (classIdVal) setClassId(classIdVal)
        }
      } catch (e) {
        console.error('Failed to fetch user details to determine classId', e)
      }
    }
    fetchUserClass()
  }, [classId, getAuthHeaders])

  // Timer effect
  useEffect(() => {
    if (currentScreen === "quiz" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeRemaining === 0 && currentScreen === "quiz") {
      handleFinishQuiz()
    }
  }, [currentScreen, timeRemaining])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startQuiz = async () => {
    // Require explicit context so we don't fall back to unrelated questions
    if (!topicId || !subjectId) {
      alert('Please start the quiz from a specific topic (subject and topic are required).')
      return
    }

    try {
      setLoading(true)

      // Try to fetch questions from API
      let apiQuestions: Question[] = []

      // Attempt with whatever filters are currently available
      const filter: { subjectId?: string; topicId?: string; classId?: string; noOfQuestions: number; difficulty_level?: 'easy' | 'medium' | 'hard' } = {
        noOfQuestions: quizSettings.numQuestions,
        difficulty_level: (quizSettings.difficulty as 'easy' | 'medium' | 'hard')
      }
      if (subjectId) filter.subjectId = subjectId
      if (topicId) filter.topicId = topicId
      if (classId) filter.classId = classId

      try {
        const quizzes = await quizApi.getAll(filter)

        if (quizzes && quizzes.length > 0) {
          apiQuestions = quizzes.map((quiz, index) => ({
            id: index + 1,
            question: quiz.question,
            options: quiz.options.map(opt => opt.text),
            correctAnswer: quiz.options.findIndex(opt => opt.isCorrect),
            explanation: quiz.explanation || "",
            quizId: quiz._id
          }))
        }
      } catch (error) {
        console.error('Failed to fetch quizzes with filters:', error)
      }

      // If no questions found with filters, show an error
      if (apiQuestions.length === 0) {
        alert('No questions found for this topic. Please try another topic.')
        setLoading(false)
        return
      }

      // Use API questions if available, otherwise fall back to sample questions
      const questionsToUse = apiQuestions.length > 0 ? apiQuestions : sampleQuestions
      const shuffledQuestions = [...questionsToUse].sort(() => Math.random() - 0.5).slice(0, quizSettings.numQuestions)

      setQuizQuestions(shuffledQuestions)
      setCurrentScreen("quiz")
      setTimeRemaining(quizSettings.numQuestions * 30) // 30 seconds per question
    } catch (error) {
      console.error('Error starting quiz:', error)
      alert('Failed to start quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const currentQuestion = quizQuestions[currentQuestionIndex]
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    setUserAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedAnswer,
        isCorrect,
      },
    ])

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
    } else {
      handleFinishQuiz()
    }
  }

  const handleFinishQuiz = async () => {
    setCurrentScreen("results")

    try {
      // Build attempt payload only if we have quiz IDs
      const answers = userAnswers.map((ua, idx) => ({
        quizId: quizQuestions[idx]?.quizId || '',
        selectedAnswer: ua.selectedAnswer,
      })).filter(a => a.quizId)

      if (answers.length > 0 && subjectId && topicId) {
        const totalTime = (quizSettings.numQuestions * 30) - timeRemaining
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/quiz-attempts`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            subjectId,
            topicId,
            answers,
            totalTimeSpent: totalTime > 0 ? totalTime : undefined,
          })
        })
      }
    } catch (e) {
      console.error('Failed to record quiz attempt', e)
    }
  }

  const getScore = () => {
    return userAnswers.filter((answer) => answer.isCorrect).length
  }

  const getScoreMessage = () => {
    const score = getScore()
    const percentage = (score / quizQuestions.length) * 100

    if (percentage >= 80) return "🎉 You did it!"
    if (percentage >= 60) return "Nice effort!"
    if (percentage >= 40) return "Keep practicing!"
    return "Don't give up!"
  }

  const toggleQuestionExpansion = (questionId: number) => {
    setExpandedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId],
    )
  }

  const resetQuiz = () => {
    setCurrentScreen("setup")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setUserAnswers([])
    setQuizQuestions([])
    setExpandedQuestions([])
    setQuizSettings({
      difficulty: "easy",
      numQuestions: 10,
      questionType: "multiple-choice",
    })
  }

  if (currentScreen === "setup") {
    return (
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div
          className="max-w-4xl mx-auto border-2 rounded-2xl p-6 md:p-8 min-h-[100%]"
          style={{ borderColor: "#309CEC" }}
        >
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-xl font-medium" style={{ color: "#309CEC" }}>
              Topic: {topicName || "Topic"}
            </h1>
            <Button
              variant="outline"
              className="px-6 py-2 rounded-full border-red-200 text-red-500 hover:bg-red-50"
              onClick={() => router.push('/dashboard')}
            >
              Exit Quiz
            </Button>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Customize Your Quiz</h2>

            <div className="space-y-6 max-w-lg mx-auto">
              <Select
                value={quizSettings.difficulty}
                onValueChange={(value) => setQuizSettings((prev) => ({ ...prev, difficulty: value }))}
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-200">
                  <SelectValue placeholder="Choose Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Number of Questions"
                value={quizSettings.numQuestions}
                onChange={(e) =>
                  setQuizSettings((prev) => ({ ...prev, numQuestions: Number.parseInt(e.target.value) || 10 }))
                }
                className="h-12 rounded-xl border-gray-200"
                min="1"
                max="10"
              />

              <div className="h-12 rounded-xl border border-gray-200 flex items-center px-4 text-gray-500 bg-gray-50 select-none">
                Multiple choice
              </div>

              <Button
                onClick={startQuiz}
                className="w-full h-12 rounded-xl text-white font-medium"
                style={{ backgroundColor: "#309CEC" }}
              >
                Start Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "quiz") {
    const currentQuestion = quizQuestions[currentQuestionIndex]

    return (
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div
          className="max-w-4xl mx-auto border-2 rounded-2xl p-6 md:p-8 min-h-[100%]"
          style={{ borderColor: "#309CEC" }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-medium" style={{ color: "#309CEC" }}>
              Topic: {topicName || "Topic"}
            </h1>
            <Button
              variant="outline"
              className="px-6 py-2 rounded-full border-red-200 text-red-500 hover:bg-red-50"
              onClick={resetQuiz}
            >
              Exit Quiz
            </Button>
          </div>

          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">
              Question {currentQuestionIndex + 1} of {quizQuestions.length}
            </p>
            <h2 className="text-xl font-semibold text-gray-900 mb-8">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {currentQuestion.question}
              </ReactMarkdown>
            </h2>

            <div className="space-y-3 mb-8 max-w-md mx-auto">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4"
                    style={{
                      borderColor: selectedAnswer === index ? "#309CEC" : "#CBD5E1",
                      backgroundColor: selectedAnswer === index ? "#309CEC" : "transparent",
                    }}
                  >
                    {selectedAnswer === index && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {option}
                    </ReactMarkdown>
                  </span>
                </div>
              ))}
            </div>

            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="w-full max-w-xs h-10 rounded-lg text-white font-medium mb-8"
              style={{ backgroundColor: "#309CEC" }}
            >
              {currentQuestionIndex === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
            </Button>

            <p className="text-gray-500 text-sm">Time Remaining: {formatTime(timeRemaining)}</p>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "results") {
    const score = getScore()
    const totalQuestions = quizQuestions.length

    return (
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div
          className="max-w-4xl mx-auto border-2 rounded-2xl p-6 md:p-8 min-h-[100%]"
          style={{ borderColor: "#309CEC" }}
        >
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium mb-4"
              style={{ backgroundColor: "#309CEC" }}
            >
              <Star className="w-4 h-4 mr-1" />+{score * 10}
            </div>

            <p className="text-gray-600 mb-2">
              You scored {score} out of {totalQuestions}
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{getScoreMessage()}</h2>

            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <p className="text-gray-600 mb-8">{"Let's review your mistakes to get even better."}</p>
          </div>

          <div className="space-y-4 mb-8">
            {quizQuestions.map((question) => {
              const userAnswer = userAnswers.find((a) => a.questionId === question.id)
              const isExpanded = expandedQuestions.includes(question.id)
              const wasCorrect = userAnswer?.isCorrect || false

              return (
                <Collapsible key={question.id}>
                  <CollapsibleTrigger
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 flex justify-between items-center"
                    onClick={() => toggleQuestionExpansion(question.id)}
                  >
                    <span className="font-medium">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {question.question}
                          </ReactMarkdown>
                        </span>
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-x border-b border-gray-200 rounded-b-lg p-4 bg-blue-50">
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">
                        The Correct Answer Is: {question.options[question.correctAnswer]}
                      </p>
                      {!wasCorrect && (
                        <div className="text-red-600">
                          Your Answer: {userAnswer ? (
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {question.options[userAnswer.selectedAnswer]}
                            </ReactMarkdown>
                          ) : "No answer"}
                        </div>
                      )}
                      <div className="flex items-start space-x-2">
                        <Star className="w-4 h-4 mt-0.5" style={{ color: "#309CEC" }} />
                        <div>
                          <p className="font-medium" style={{ color: "#309CEC" }}>
                            Why?
                          </p>
                          <div className="text-gray-700 prose max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {question.explanation}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )
            })}
          </div>

          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full h-12 rounded-xl text-white font-medium"
            style={{ backgroundColor: "#309CEC" }}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Raise Issue Modal */}
        <RaiseIssueModal
          isOpen={showRaiseIssueModal}
          onClose={() => setShowRaiseIssueModal(false)}
          currentSubject={subjectName}
          currentTopic={topicName}
        />
      </div>
    )
  }

  return null
}

export default function AlgebraQuiz() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AlgebraQuizContent />
    </Suspense>
  );
}
