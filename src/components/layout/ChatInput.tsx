import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSendMessage?: (message: string) => void
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      await onSendMessage?.(message.trim())
      setMessage('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <footer className="border-t border-gray-800 p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
        <Input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask your questions...." 
          className="w-full bg-[#232323] rounded-[14px] border border-[#C6C6C682] focus:ring-purple-500 py-6 pr-24"
          disabled={isSubmitting}
        />
        <Button 
          type="submit"
          disabled={!message.trim() || isSubmitting}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#4024B9] to-[#8640FF] hover:opacity-90 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </footer>
  )
}