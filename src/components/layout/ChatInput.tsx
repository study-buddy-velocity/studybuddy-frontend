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
      const maybePromise = onSendMessage?.(message.trim())
      if (maybePromise && typeof (maybePromise as any).then === 'function') {
        await (maybePromise as any)
      }
      setMessage('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
<footer className="py-3 px-3 bg-white">
  <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative bg-white rounded-full border border-[#309CEC] p-1">
    <Input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Ask your questions...."
      className="w-full bg-transparent rounded-full border-0 focus:ring-0 focus:outline-none py-3 pr-28 pl-4 text-[16px] placeholder:text-gray-600"
      disabled={isSubmitting}
    />
    <Button
      type="submit"
      disabled={!message.trim() || isSubmitting}
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#A6D4FA] hover:bg-[#95CBF7] flex items-center gap-2 text-white rounded-full px-5 py-2 h-10"
    >
      <Send className="w-4 h-4" />
      {isSubmitting ? 'Send…' : 'Send'}
    </Button>
  </form>
</footer>


  )
}