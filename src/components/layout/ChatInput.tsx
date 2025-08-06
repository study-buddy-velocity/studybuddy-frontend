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
<footer className="py-6 px-4">
  <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
    <Input 
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder="Ask your questions...." 
      className="w-full bg-white rounded-full border border-[#309CEC] focus:ring-purple-500 py-6 pr-24"
      disabled={isSubmitting}
    />
    <Button 
      type="submit"
      disabled={!message.trim() || isSubmitting}
      className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#309CEC] hover:bg-[#309CEC] hover:opacity-80 flex items-center gap-2 text-white"
    >
      <Send className="w-4 h-4" />
      {isSubmitting ? 'Sending...' : 'Send'}
    </Button>
  </form>
</footer>


  )
}