"use client";

import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "@/components/layout/ChatHeader";
import { ChatInput } from "@/components/layout/ChatInput";
import { SidebarContent } from "@/components/layout/SidebarContent";
import { useAuth } from "@/hooks/useAuthenticationHook";
import {
  APIResponse,
  HistoryDataItem,
  Query,
  subjectOptions,
} from "@/lib/utils";
import SubjectDialog from "@/components/ui/subjectSectionDialog";
import AutoScrollChatArea from "@/components/ui/autoScrollChatArea";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";

export default function ChatInterface() {
  const { getAuthHeaders } = useAuth();
  const [messages, setMessages] = useState<
    Array<{ content: string; isUser: boolean }>
  >([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showSubjectDialog, setShowSubjectDialog] = useState(true);
  const [chatHistory, setChatHistory] = useState<HistoryDataItem[]>([]);
  const [currentSession, setCurrentSession] = useState<{
    [key: string]: Query[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/chat-history`,
        {
          headers: getAuthHeaders(),
        }
      );
      const responseData: APIResponse = await response.json();
      const historyData = Array.isArray(responseData.data)
        ? responseData.data
        : responseData.data
        ? [responseData.data]
        : [];
      setChatHistory(historyData);

      // Process the history data for the current session
      const sessionData: { [key: string]: Query[] } = {};
      historyData.forEach((item: HistoryDataItem) => {
        item.subjectWise?.forEach((subjectData) => {
          if (!sessionData[subjectData.subject]) {
            sessionData[subjectData.subject] = [];
          }
          sessionData[subjectData.subject] = [
            ...sessionData[subjectData.subject],
            ...subjectData.queries,
          ];
        });
      });
      setCurrentSession(sessionData);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Rest of the component remains the same...
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setShowSubjectDialog(false);

    if (currentSession[subject]) {
      const subjectMessages = currentSession[subject].flatMap((query) => [
        { content: query.query, isUser: true },
        { content: query.response, isUser: false },
      ]);
      setMessages(subjectMessages);
    } else {
      setMessages([]);
    }
  };

  const handleNewSession = () => {
    setShowSubjectDialog(true);
    setMessages([]);
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedSubject || !message.trim()) return;

    setMessages((prev) => [...prev, { content: message, isUser: true }]);
    setIsTyping(true);
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/chat?subject=${selectedSubject}&query=${encodeURIComponent(message)}`,
        {
          headers: getAuthHeaders(),
        }
      );
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { content: data.response, isUser: false },
      ]);
      setIsTyping(false);

      // Update current session with new message
      setCurrentSession((prev) => ({
        ...prev,
        [selectedSubject]: [
          ...(prev[selectedSubject] || []),
          {
            query: message,
            response: data.response,
            tokensUsed: data.tokensUsed || 0,
            _id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, there was an error processing your request.",
          isUser: false,
        },
      ]);
    }
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen p-2 text-white">
      <div className="absolute inset-0 w-screen -z-10">
        <Image
          src="/assets/backgrounds/WelcomeBG-2-3.png"
          alt="Background image"
          className="w-full h-full object-cover object-center"
          fill // This makes the image fill the parent container
          priority // Optional: Prioritize loading this image
        />
      </div>

      {/* Subject Selection Dialog */}
      <SubjectDialog
        open={showSubjectDialog}
        // onOpenChange={setShowSubjectDialog}
        subjectOptions={subjectOptions}
        handleSubjectSelect={handleSubjectSelect}
      />
      {/* Main Layout */}
      <div className="flex w-full gap-2">
        {/* Sidebar */}
        <SidebarContent
          onNewSession={handleNewSession}
          chatHistory={chatHistory}
          onSubjectSelect={handleSubjectSelect}
          currentSubject={selectedSubject}
          isLoading={isLoading}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-[#232323] rounded-[14px] border border-[#C6C6C682]">
          <ChatHeader />
          <AutoScrollChatArea messages={messages} isTyping ={isTyping }/>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
