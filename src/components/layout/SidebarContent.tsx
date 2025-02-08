import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useAuth } from '@/hooks/useAuthenticationHook';

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
}

interface UserStreakProps {
  streak: number | 0;
}

export function SidebarContent({ 
  onNewSession, 
  chatHistory = [], 
  onSubjectSelect, 
  currentSubject,
  isLoading 
}: SidebarContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userStreak, setUserStreak] = useState<UserStreakProps | null>(null);
  const [isStreakLoading, setIsStreakLoading] = useState(true);
  const { getAuthHeaders } = useAuth();
  
  const subjects = isLoading || !Array.isArray(chatHistory) ? [] : [...new Set(
    chatHistory.reduce((acc: string[], item) => {
      const itemSubjects = item?.subjects || []
      return acc.concat(itemSubjects)
    }, [])
  )]

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
        setIsStreakLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/chat-streak`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          setUserStreak({ streak: 0 });
        } else {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
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
  }, []);

  const SidebarItems = () => (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">studybuddy</h1>
        <div className="flex items-center gap-1">
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
        </div>
      </div>

      <Button 
        onClick={handleNewSession}
        className="w-full bg-gradient-to-r from-[#4024B9] to-[#8640FF] hover:opacity-90 text-[18px] font-bold py-2 rounded-[76px]"
      >
        + Start a New Session
      </Button>

      <div className="space-y-2">
        <h2 className="text-sm text-gray-400">Recent Subjects</h2>
        <ScrollArea className="h-[250px] w-full pr-4">
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-gray-400 text-center py-4">Loading...</div>
            ) : subjects.length > 0 ? (
              subjects.map((subject, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className={`w-full text-[16px] py-2 rounded-[76px] ${
                    currentSubject === subject 
                      ? 'bg-[#4024B9] text-white hover:bg-[#4024B9]' 
                      : 'text-[#858585] bg-[#F9F5FF] hover:bg-[#858585]'
                  }`}
                  onClick={() => handleSubjectClick(subject)}
                >
                  {subject}
                </Button>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">No subjects yet</div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="pt-2">
        <Card className="p-4 border-none">
          <p className="text-lg font-medium">
            {isStreakLoading 
              ? "Loading streak..." 
              : `You are on a ${userStreak?.streak || 0} Day Streak!`}
          </p>
          <p className="text-xs text-gray-400">Dream big, start small, act now.</p>
          <div className="w-[250px] h-[200px] relative rounded-[22.5px] overflow-hidden flex-shrink-0 p-4">
            <Image
              src="/assets/buddy/Joy-Profile-Priorities.png"
              alt="Priority mascot"
              fill
              className="object-cover"
            />
          </div>
        </Card>
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
          <SheetContent side="left" className="w-80 bg-[#232323] border-r border-[#C6C6C682] p-4">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-white"></SheetTitle>
            </SheetHeader>
            <SidebarItems />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 bg-[#232323] rounded-[14px] border border-[#C6C6C682] p-4">
        <SidebarItems />
      </div>
    </>
  );
}