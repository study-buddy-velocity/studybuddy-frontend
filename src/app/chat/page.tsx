"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { ChatHeader } from "@/components/layout/ChatHeader";
import { ChatInput } from "@/components/layout/ChatInput";
import { SidebarContent } from "@/components/layout/SidebarContent";
import { useAuth } from "@/hooks/useAuthenticationHook";
import {
  APIResponse,
  HistoryDataItem,
  Query
} from "@/lib/types/types";
// import {subjectOptions} from '@/lib/utils'
// import SubjectDialog from "@/components/ui/subjectSectionDialog";
import AutoScrollChatArea from "@/components/ui/autoScrollChatArea";
import { Toaster } from "@/components/ui/toaster";
import { useRouter, useSearchParams } from "next/navigation";
import RaiseIssueModal from "@/components/ui/raise-issue-modal";

function ChatInterfaceContent() {
  const { getAuthHeaders } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<
    Array<{ content: string; isUser: boolean; lastMessage:boolean }>
  >([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [showDashboard, setShowDashboard] = useState(false);
  const [chatHistory, setChatHistory] = useState<HistoryDataItem[]>([]);
  const [currentSession, setCurrentSession] = useState<{
    [key: string]: Query[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showRaiseIssueModal, setShowRaiseIssueModal] = useState(false);

  // Function to replace subject IDs with subject names in responses
  const replaceSubjectIdsInResponse = (response: string): string => {
    if (!subjectName || !selectedSubject) return response;

    // Replace subject ID with subject name in the response
    const subjectIdPattern = new RegExp(selectedSubject, 'g');
    return response.replace(subjectIdPattern, subjectName);
  };

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
  }, []) // fetchChatHistory is stable, no need to add as dependency;

  // Handle subject and topic parameters from URL
  useEffect(() => {
    const subjectFromUrl = searchParams.get('subject');
    const topicFromUrl = searchParams.get('topic');
    const subjectNameFromUrl = searchParams.get('subjectName');
    const topicNameFromUrl = searchParams.get('topicName');

    if (subjectFromUrl) {
      setSelectedSubject(subjectFromUrl);
      setShowDashboard(false);
    } else {
      // Only show dashboard if no subject parameter is present
      setShowDashboard(true);
    }

    if (topicFromUrl) {
      setSelectedTopic(topicFromUrl);
    }
    if (subjectNameFromUrl) {
      setSubjectName(decodeURIComponent(subjectNameFromUrl));
    }
    if (topicNameFromUrl) {
      setTopicName(decodeURIComponent(topicNameFromUrl));
    }
  }, [searchParams]);

  // Redirect to dashboard if no subject is selected and we should show dashboard
  useEffect(() => {
    // Add a small delay to ensure URL parameters are processed first
    const timer = setTimeout(() => {
      if (showDashboard && !selectedSubject && !searchParams.get('subject')) {
        router.push('/dashboard');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [showDashboard, selectedSubject, router, searchParams]);

  // Rest of the component remains the same...
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setShowDashboard(false);

    if (currentSession[subject]) {
      const subjectMessages = currentSession[subject].flatMap((query) => [
        { content: query.query, isUser: true, lastMessage: false },
        { content: query.response, isUser: false, lastMessage: false },
      ]);
      setMessages(subjectMessages);
    } else {
      setMessages([]);
    }
  };

  const handleNewSession = () => {
    // Navigate to dashboard instead of showing dialog
    router.push('/dashboard');
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedSubject || !message.trim()) return;
  
    setMessages((prev) => [...prev, { content: message, isUser: true, lastMessage:false }]);
    setIsTyping(true);
  
    try {
      const topicParam = topicName ? `&topic=${encodeURIComponent(topicName)}` : '';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat?subject=${selectedSubject}&query=${encodeURIComponent(message)}${topicParam}`,
        {
          headers: getAuthHeaders(),
        }
      );
      const data = await response.json();

      // Replace subject IDs with subject names in the response
      const processedResponse = replaceSubjectIdsInResponse(data.response);

      const newQuery: Query = {
        query: message,
        response: processedResponse,
        tokensUsed: data.tokensUsed || 0,
        // lastMessage: true,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessages((prev) => [
        ...prev,
        { content: processedResponse, isUser: false, lastMessage:true },
      ]);
      setIsTyping(false);
  
      // Ensure lastMessage is updated only for the latest query
      setCurrentSession((prev) => {
        const updatedQueries = [...(prev[selectedSubject] || []), newQuery];
  
        return {
          ...prev,
          [selectedSubject]: updatedQueries,
        };
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, there was an error processing your request.",
          isUser: false,
          lastMessage: false
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
// //console.log(messages,'messages-chat')
  return (
    <div className="flex h-screen p-2 text-black bg-white">
      {/* Main Layout */}
      <div className="flex w-full gap-2">
        {/* Sidebar */}
        <SidebarContent
          onNewSession={handleNewSession}
          chatHistory={chatHistory}
          onSubjectSelect={handleSubjectSelect}
          currentSubject={selectedSubject}
          isLoading={isLoading}
          currentTopic={selectedTopic}
          subjectName={subjectName}
          topicName={topicName}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-lg border border-[#309CEC]">
          <ChatHeader
            subjectName={subjectName}
            topicName={topicName}
            onRaiseIssue={() => setShowRaiseIssueModal(true)}
          />
          <AutoScrollChatArea messages={messages} isTyping ={isTyping }/>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* Raise Issue Modal */}
      <RaiseIssueModal
        isOpen={showRaiseIssueModal}
        onClose={() => setShowRaiseIssueModal(false)}
        currentSubject={subjectName}
        currentTopic={topicName}
      />

      <Toaster />
    </div>
  );
}

export default function ChatInterface() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatInterfaceContent />
    </Suspense>
  );
}
