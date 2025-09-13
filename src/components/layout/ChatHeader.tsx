
'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getFirstWord, UserData } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuthenticationHook"
import ProfileDropdown from "./profileDropdown";
import { Button } from "@/components/ui/button";
import { AlertCircle, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  subjectName?: string;
  topicName?: string;
  onRaiseIssue?: () => void;
  // New: provide an optional opener callback to open the sidebar
  onOpenSidebar?: () => void;
}

export function ChatHeader({ subjectName, topicName, onRaiseIssue, onOpenSidebar }: ChatHeaderProps) {
  const [userData, setUserData] = useState<UserData>({
    dob: "",
    name: "",
    phoneno: "",
    schoolName: "",
    class: "",
    subjects: []
  });

  const { getAuthHeaders } = useAuth();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/user-details`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
<header className="border-b border-[#C6C6C682] p-3 sm:p-4 flex items-center justify-between">
  {/* Left Section */}
  <div className="flex items-center gap-2 sm:gap-3">
    {/* Back Button */}
    {/* Mobile hamburger to open sidebar (replaces back button) */}
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onOpenSidebar?.()}
      className="h-8 w-8 text-[#309CEC] hover:bg-[#309CEC]/10 md:hidden"
      aria-label="Open menu"
    >
      <Menu className="w-5 h-5" />
    </Button>

    {/* Avatar + Subject */}
    <div className="flex items-center gap-2">
      <Avatar className="w-9 h-9 sm:w-10 sm:h-10">
        <AvatarImage src='/assets/buddy/Joy-profile-icon.svg' />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="leading-tight">
        {subjectName && topicName ? (
          <>
            <p className="font-medium text-sm sm:text-base">{subjectName}</p>
            <p className="text-xs sm:text-sm text-[#309CEC]">{topicName}</p>
          </>
        ) : (
          <>
            <p className="text-sm sm:text-base">How are you doing</p>
            <p className="text-xs sm:text-sm text-[#309CEC]">
              {getFirstWord(userData?.name)}<span className="text-white">?</span>
            </p>
          </>
        )}
      </div>
    </div>
  </div>

  {/* Right Section */}
  <div className="flex items-center gap-2">
    {onRaiseIssue && (
      <Button
        variant="ghost"
        size="icon"
        onClick={onRaiseIssue}
        className="h-8 w-8 text-[#309CEC] hover:bg-[#309CEC]/10"
      >
        <AlertCircle className="w-5 h-5" />
      </Button>
    )}
    <ProfileDropdown userName={userData?.name} />
  </div>
</header>

  );
}
