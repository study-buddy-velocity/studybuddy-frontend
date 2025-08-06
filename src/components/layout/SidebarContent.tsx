import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useAuth } from '@/hooks/useAuthenticationHook';
import { subjectApi, Subject } from '@/lib/api/quiz';
import QuizCard from './quiz-card';

type HistoryDataItem = {
  _id: string
  date: string
  subjectWise: Array<{
    subject: string
    queries: Array<{
      query: string
      response: string
      tokensUsed: number
      _id: string
      createdAt: string
      updatedAt: string
    }>
    _id: string
  }>
  totalTokensSpent: number
  subjects: string[]
  userId: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface SidebarContentProps {
  onNewSession: () => void
  chatHistory: HistoryDataItem[]
  onSubjectSelect: (subject: string) => void
  currentSubject: string
  isLoading: boolean
  currentTopic?: string
  subjectName?: string
  topicName?: string
}

interface UserStreakProps {
  streak: number | 0;
}

export function SidebarContent({
  onNewSession,
  chatHistory = [],
  onSubjectSelect,
  currentSubject,
  isLoading,
  currentTopic,
  subjectName,
  topicName
}: SidebarContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setUserStreak] = useState<UserStreakProps | null>(null);
  const [, setIsStreakLoading] = useState(true);
  const [subjectMap, setSubjectMap] = useState<{[key: string]: Subject}>({});
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const { getAuthHeaders } = useAuth();
  
  // Fetch subjects for mapping IDs to names
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const allSubjects = await subjectApi.getAll();
        const mapping: {[key: string]: Subject} = {};
        allSubjects.forEach(subject => {
          mapping[subject._id] = subject;
        });
        setSubjectMap(mapping);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const subjects = isLoading || !Array.isArray(chatHistory) ? [] : [...new Set(
    chatHistory.reduce((acc: string[], item) => {
      const itemSubjects = item?.subjects || []
      return acc.concat(itemSubjects)
    }, [])
  )]

  // Function to get display name for subject
  const getSubjectDisplayName = (subjectId: string) => {
    const subject = subjectMap[subjectId];
    return subject ? subject.name : subjectId; // Fallback to ID if not found
  };

  const handleSubjectClick = (subject: string) => {
    onSubjectSelect(subject);
    setIsOpen(false);
  };

  const handleNewSession = () => {
    onNewSession();
    setIsOpen(false);
  };

  const fetchStreakData = async () => {
    setIsStreakLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUserStreak({ streak: 0 });
        setIsStreakLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/chat/chat-streak`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        // For any error, just set streak to 0 instead of throwing
        console.warn(`Chat streak API returned ${response.status}, defaulting to 0`);
        setUserStreak({ streak: 0 });
      } else {
        const data = await response.json();
        setUserStreak(data);
      }
    } catch (error) {
      console.error('Error fetching user streak data:', error);
      setUserStreak({ streak: 0 });
    } finally {
      setIsStreakLoading(false);
    }
  };

  useEffect(() => {
    fetchStreakData();
  }, []); // fetchStreakData is stable, no need to add as dependency

  const SidebarItems = () => (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between mb-4">
        {/* <h1 className="text-xl font-semibold">studybuddy</h1> */}
                  <div className=" py-4 bg-gray-50 w-full">
                <Image
                  src="/assets/logo/studubuddy-logo-new.png" 
                  alt="StudyBuddy Logo"
                  width={160}
                  height={40}
                  className="h-auto"
                />
              </div>
        {/* <div className="flex items-center gap-1">
          <Image
            src="/assets/buddy/streak_profile.svg"
            alt="Fire icon"
            width={18}
            height={18}
            className="opacity-70"
          />
          <span className="text-lg text-muted-foreground">
            {isStreakLoading ? "..." : userStreak?.streak || 0}
          </span>
        </div> */}
      </div>

      <Button
        onClick={handleNewSession}
        className="w-full bg-[#309CEC] text-white text-[18px] font-bold py-2 rounded-[76px] hover:bg-[#309CEC]/80 transition-colors"
      >
        + Start a New Session
      </Button>

      <div className="space-y-2">
        <h2 className="text-sm text-gray-400">Recent Subjects</h2>
        <ScrollArea className="h-[250px] w-full pr-4">
          <div className="space-y-2">
            {isLoading || subjectsLoading ? (
              <div className="text-gray-400 text-center py-4">Loading...</div>
            ) : subjects.length > 0 ? (
              subjects.map((subject, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className={`w-full text-[16px] py-2 rounded-full transition-colors ${
                    currentSubject === subject
                      ? 'bg-[#309CEC] text-[#F9F5FF]'
                      : 'text-[#858585] bg-[#F9F5FF] hover:bg-[#F9F5FF]/70'
                  }`}
                  onClick={() => handleSubjectClick(subject)}
                >
                  {getSubjectDisplayName(subject)}
                </Button>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">No subjects yet</div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="pt-2">
            <QuizCard
              currentSubject={currentSubject}
              currentTopic={currentTopic}
              subjectName={subjectName}
              topicName={topicName}
            />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="fixed top-4 left-4 z-50 w-16 h-16 p-0 hover:bg-[#4024B9]/10"
            >
              <Menu className="h-8 w-8" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-white border-r border-[#309CEC] p-4">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-white"></SheetTitle>
            </SheetHeader>
            <SidebarItems />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
<div className="hidden md:block w-80 bg-white rounded-lg border border-[#309CEC] p-4">
        <SidebarItems />
      </div>
    </>
  );
}