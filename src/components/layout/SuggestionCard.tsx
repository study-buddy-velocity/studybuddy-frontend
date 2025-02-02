import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from 'lucide-react'

interface SuggestionCardProps {
  suggestion: string
  action: string
}

export function SuggestionCard({ suggestion, action }: SuggestionCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 p-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <X className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-400">Suggested</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">{suggestion}</span>
          <Button size="sm" variant="secondary" className="bg-purple-600 hover:bg-purple-700 text-white">
            {action}
          </Button>
        </div>
      </div>
    </Card>
  )
}

