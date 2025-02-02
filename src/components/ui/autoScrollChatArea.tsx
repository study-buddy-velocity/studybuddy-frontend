import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "@/components/layout/MessageBubble";

interface Message {
  content: string;
  isUser: boolean;
}

interface AutoScrollChatAreaProps {
  messages: Message[];
}

const AutoScrollChatArea: React.FC<AutoScrollChatAreaProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
      
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  // Scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial scroll - using multiple timeouts to ensure it works across different load scenarios
  useEffect(() => {
    // Immediate scroll
    scrollToBottom();
    
    // Scroll after a short delay to catch late-rendering content
    const shortDelay = setTimeout(scrollToBottom, 100);
    
    // Scroll after a longer delay to catch very late-rendering content
    const longDelay = setTimeout(scrollToBottom, 500);

    return () => {
      clearTimeout(shortDelay);
      clearTimeout(longDelay);
    };
  }, []);

  return (
    <ScrollArea 
      className="flex-1 p-4" 
      ref={scrollRef}
    >
      <div className="space-y-4 max-w-4xl mx-auto">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            content={message.content}
            isUser={message.isUser}
            avatarSrc={message.isUser ? "/placeholder.svg" : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-yIzYHQqhgUwtCjc2YWKjb57l0xGxV8.png"}
          />
        ))}
        <div className="h-4" />
      </div>
    </ScrollArea>
  );
};

export default AutoScrollChatArea;