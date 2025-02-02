import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface SuggestionBannerProps {
  topic: string
  onClose: () => void
  isVisible: boolean
}

export function SuggestionBanner({ topic, onClose, isVisible }: SuggestionBannerProps) {
  if (!isVisible) return null;
  
  return (
    <div className="flex items-center justify-between bg-[#7C3AED] text-white p-4 rounded-lg mb-4">
      <div className="flex items-center gap-2">
        <button 
          onClick={onClose}
          className="hover:bg-white/10 p-1 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="text-sm">
          Suggested: We suggest you taking a quiz on the topic {topic}
        </span>
      </div>
      <Button 
        variant="secondary" 
        className="bg-white text-[#7C3AED] hover:bg-white/90"
      >
        Take the Quiz
      </Button>
    </div>
  )
}

