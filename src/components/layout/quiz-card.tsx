"use client"

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

interface QuizCardProps {
  currentSubject?: string;
  currentTopic?: string;
  subjectName?: string;
  topicName?: string;
}

export default function QuizCard({
  currentSubject,
  currentTopic,
  subjectName,
  topicName
}: QuizCardProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTakeQuiz = () => {
    // Get subject and topic from props or URL params
    const subject = currentSubject || searchParams.get('subject') || ''
    const topic = currentTopic || searchParams.get('topic') || ''
    const subjName = subjectName || searchParams.get('subjectName') || ''
    const topName = topicName || searchParams.get('topicName') || ''

    if (subject && topic) {
      // Navigate to quiz with subject and topic context
      router.push(`/quiz?subject=${subject}&topic=${topic}&subjectName=${encodeURIComponent(subjName)}&topicName=${encodeURIComponent(topName)}`)
    } else {
      // Navigate to quiz without context
      router.push('/quiz')
    }
  }
  return (
    <div>
      <Card className="w-full max-w-sm bg-blue-50 border-blue-200 shadow-lg rounded-lg">
        <CardContent className="p-6 text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-semibold" style={{ color: "#309CEC" }}>
              Take a Quiz to Test your Knowledge
            </h2>
          </div>

          <Button
            className="w-full text-white font-medium py-1.5 px-4 rounded-md text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#309CEC" }}
            size="sm"
            onClick={handleTakeQuiz}
          >
            Take Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
