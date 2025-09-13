"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { ChatHeader } from "@/components/layout/ChatHeader";
import { ChatInput } from "@/components/layout/ChatInput";
import { SidebarContent } from "@/components/layout/SidebarContent";
import { useAuth } from "@/hooks/useAuthenticationHook";
import {
  APIResponse,
  HistoryDataItem
} from "@/lib/types/types";
import AutoScrollChatArea from "@/components/ui/autoScrollChatArea";
import { Toaster } from "@/components/ui/toaster";
import { useRouter, useSearchParams } from "next/navigation";
import RaiseIssueModal from "@/components/ui/raise-issue-modal";

function ChatInterfaceContent() {
  const { getAuthHeaders } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Simplified state management - one conversation at a time
  const [currentConversation, setCurrentConversation] = useState<{
    topicId: string;
    topicName: string;
    subjectId: string;
    subjectName: string;
    messages: Array<{ content: string; isUser: boolean; lastMessage: boolean }>;
  } | null>(null);
  
  const [showDashboard, setShowDashboard] = useState(false);
  const [chatHistory, setChatHistory] = useState<HistoryDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showRaiseIssueModal, setShowRaiseIssueModal] = useState(false);
  const [refreshTopics, setRefreshTopics] = useState(0); // Counter to trigger topic refresh
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Opener provided by SidebarContent so ChatHeader can open it via hamburger
  const [openSidebar, setOpenSidebar] = useState<(() => void) | null>(null);

  // Function to replace subject/topic IDs with names in responses
  const replaceIdsInResponse = (response: string): string => {
    if (!currentConversation) return response;
    let out = response;
    // Replace subject ID with subject name
    if (currentConversation.subjectId && currentConversation.subjectName) {
      const subjectIdPattern = new RegExp(currentConversation.subjectId, 'g');
      out = out.replace(subjectIdPattern, currentConversation.subjectName);
    }
    // Replace topic ID with topic name (if topicId looks like ObjectId)
    if (currentConversation.topicId && currentConversation.topicName) {
      const looksLikeId = /^[a-f0-9]{24}$/i.test(currentConversation.topicId);
      if (looksLikeId) {
        const topicIdPattern = new RegExp(currentConversation.topicId, 'g');
        out = out.replace(topicIdPattern, currentConversation.topicName);
      }
    }
    return out;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/chat-history`,
        { headers: getAuthHeaders() }
      );
      const responseData: APIResponse = await response.json();
      const historyData = Array.isArray(responseData.data) ? responseData.data : [];
      setChatHistory(historyData);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load topic conversation from backend
  const loadTopicConversation = async (topicName: string, topicId: string, subjectId: string, subjectName: string) => {
    console.log('[loadTopicConversation] Loading:', { topicName, topicId, subjectId, subjectName });

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/topic-history?topic=${encodeURIComponent(topicName)}`,
        { headers: getAuthHeaders() }
      );
      const responseData = await response.json();
      const historyData = Array.isArray(responseData.data) ? responseData.data : [];

      console.log('[loadTopicConversation] History data:', historyData);

      // Infer subject name from history if not provided
      const inferredSubjectName = subjectName || historyData?.[0]?.subjectWise?.[0]?.subject || '';

      // Helper to replace IDs with names without relying on state
      const localReplaceIds = (text: string): string => {
        let out = text || '';
        if (subjectId && inferredSubjectName) {
          const idRegex = new RegExp(subjectId, 'g');
          out = out.replace(idRegex, inferredSubjectName);
        }
        if (topicId && topicName) {
          const looksLikeId = /^[a-f0-9]{24}$/i.test(topicId);
          if (looksLikeId) {
            const tRegex = new RegExp(topicId, 'g');
            out = out.replace(tRegex, topicName);
          }
        }
        return out;
      };

      // Convert history to messages (sanitized)
      const messages: Array<{ content: string; isUser: boolean; lastMessage: boolean }> = [];

      historyData.forEach((day: HistoryDataItem) => {
        day.subjectWise?.forEach((subjectData) => {
          subjectData.queries.forEach((query) => {
            messages.push({ content: localReplaceIds(query.query), isUser: true, lastMessage: false });
            messages.push({ content: localReplaceIds(query.response), isUser: false, lastMessage: false });
          });
        });
      });

      // Set current conversation
      setCurrentConversation({
        topicId,
        topicName,
        subjectId,
        subjectName: inferredSubjectName,
        messages
      });

      console.log('[loadTopicConversation] Loaded', messages.length, 'messages for topic:', topicName);
    } catch (error) {
      console.error('[loadTopicConversation] Error:', error);
      // Start fresh conversation if loading fails
      setCurrentConversation({
        topicId,
        topicName,
        subjectId,
        subjectName,
        messages: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle subject and topic parameters from URL
  useEffect(() => {
    const subjectFromUrl = searchParams.get('subject');
    const topicFromUrl = searchParams.get('topic');
    const subjectNameFromUrl = searchParams.get('subjectName');
    const topicNameFromUrl = searchParams.get('topicName');

    console.log('[URL Params]', { subjectFromUrl, topicFromUrl, subjectNameFromUrl, topicNameFromUrl });

    if (subjectFromUrl && topicFromUrl && topicNameFromUrl) {
      // Topic-based conversation from dashboard
      const decodedTopicName = decodeURIComponent(topicNameFromUrl);
      const decodedSubjectName = subjectNameFromUrl ? decodeURIComponent(subjectNameFromUrl) : '';
      
      console.log('[URL] Loading topic conversation:', decodedTopicName);
      loadTopicConversation(decodedTopicName, topicFromUrl, subjectFromUrl, decodedSubjectName);
      setShowDashboard(false);
    } else if (!subjectFromUrl && !topicFromUrl) {
      // No parameters - show dashboard
      setShowDashboard(true);
      setCurrentConversation(null);
    }
  }, [searchParams]);

  // Redirect to dashboard if no conversation is active
  useEffect(() => {
    const timer = setTimeout(() => {
      if (showDashboard && !currentConversation && !searchParams.get('subject')) {
        router.push('/dashboard');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [showDashboard, currentConversation, router, searchParams]);

  // Handle topic selection from recent topics
  const handleTopicSelect = async (topicName: string) => {
    console.log('[handleTopicSelect] Selected topic:', topicName);
    await loadTopicConversation(topicName, '', '', '');
  };

  const handleNewSession = () => {
    router.push('/dashboard');
  };

  const handleSendMessage = async (message: string) => {
    if (!currentConversation || !message.trim()) return;
  
    // Add user message to UI
    setCurrentConversation(prev => prev ? {
      ...prev,
      messages: [...prev.messages, { content: message, isUser: true, lastMessage: false }]
    } : null);
    
    setIsTyping(true);
  
    try {
      const topicParam = currentConversation.topicName ? `&topic=${encodeURIComponent(currentConversation.topicName)}` : '';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat?subject=${currentConversation.subjectId}&query=${encodeURIComponent(message)}${topicParam}`,
        { headers: getAuthHeaders() }
      );
      const data = await response.json();

      const processedResponse = replaceIdsInResponse(data.response);

      // Add AI response to UI
      setCurrentConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, { content: processedResponse, isUser: false, lastMessage: true }]
      } : null);

      // Trigger topic refresh in sidebar after successful message
      setRefreshTopics(prev => prev + 1);

      setIsTyping(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setCurrentConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, { 
          content: "Sorry, there was an error processing your request.", 
          isUser: false, 
          lastMessage: false 
        }]
      } : null);
      setIsTyping(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  return (
    <div className="flex h-screen text-black bg-white overflow-hidden">
      <div className="flex w-full gap-2 overflow-hidden">
        {/* Sidebar */}
        <SidebarContent
          onNewSession={handleNewSession}
          chatHistory={chatHistory}
          onSubjectSelect={() => {}} // Not used in new design
          onTopicSelect={handleTopicSelect}
          currentSubject={currentConversation?.subjectId || ""}
          currentTopic={currentConversation?.topicName || ""}
          isLoading={isLoading}
          subjectName={currentConversation?.subjectName || ""}
          topicName={currentConversation?.topicName || ""}
          refreshTrigger={refreshTopics}
          onProvideOpenSidebar={(opener) => setOpenSidebar(() => opener)}
          hideTrigger
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-lg border border-[#309CEC] overflow-hidden">
          <ChatHeader
            subjectName={currentConversation?.subjectName}
            topicName={currentConversation?.topicName}
            onRaiseIssue={() => setShowRaiseIssueModal(true)}
            onOpenSidebar={() => openSidebar?.()}
          />
          <AutoScrollChatArea messages={currentConversation?.messages || []} isTyping={isTyping} />
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* Raise Issue Modal */}
      <RaiseIssueModal
        isOpen={showRaiseIssueModal}
        onClose={() => setShowRaiseIssueModal(false)}
        currentSubject={currentConversation?.subjectName || ""}
        currentTopic={currentConversation?.topicName || ""}
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
