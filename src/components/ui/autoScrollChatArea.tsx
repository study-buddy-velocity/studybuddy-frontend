import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "@/components/layout/MessageBubble";

interface Message {
  content: string;
  isUser: boolean;
  lastMessage : boolean;
}

interface AutoScrollChatAreaProps {
  messages: Message[];
  isTyping: boolean;
}

const AutoScrollChatArea: React.FC<AutoScrollChatAreaProps> = ({ messages, isTyping }) => {
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
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4 max-w-4xl mx-auto pb-28">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            content={message?.content || "Please ask relevent questions."}
            isUser={message.isUser}
            avatarSrc={message.isUser ? "/assets/buddy/default_profile_pic.png" : "/assets/buddy/Joy-profile-icon.svg"}
            lastMessage={message.lastMessage && index === messages.length - 1}
            typingSpeed={10}
          />
        ))}
        {isTyping && (
          <MessageBubble
            content=""
            isUser={false}
            avatarSrc="/assets/buddy/Joy-profile-icon.svg"
            isTyping={true}
          />
        )}
        <div className="h-4" />
      </div>
    </ScrollArea>
  );
};

export default AutoScrollChatArea;