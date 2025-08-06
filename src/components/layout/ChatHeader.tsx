'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getFirstWord, UserData } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuthenticationHook"
import ProfileDropdown from "./profileDropdown";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ChatHeaderProps {
  subjectName?: string;
  topicName?: string;
  onRaiseIssue?: () => void;
}

export function ChatHeader({ subjectName, topicName, onRaiseIssue }: ChatHeaderProps) {
  const [userData, setUserData] = useState<UserData>({
    dob: "",
    name: "",
    phoneno: "",
    schoolName: "",
    class: "",
    subjects: []
  });

  const { getAuthHeaders } = useAuth();

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
  }; // Add dependencies here

  useEffect(() => {
    fetchUserData();
  }, []) // fetchUserData is stable, no need to add as dependency; // Now fetchUserData is stable and won't cause unnecessary re-renders

  return (
    <header className="border-b border-[#C6C6C682] p-4 flex items-center justify-between">
      <div className="flex items-center gap-3 pl-10">
        <Avatar>
          <AvatarImage src='/assets/buddy/Joy-profile-icon.svg' />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div>
          {subjectName && topicName ? (
            <>
              <p className="font-medium">{subjectName}</p>
              <p className="text-sm text-[#309CEC]">{topicName}</p>
            </>
          ) : (
            <>
              <p>How are you doing</p>
              <p className="text-sm text-[#309CEC]">{getFirstWord(userData?.name)}<span className="text-white">?</span></p>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onRaiseIssue && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRaiseIssue}
            className="flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            Raise Issue
          </Button>
        )}
        <ProfileDropdown userName={userData?.name} />
      </div>
    </header>
  );
}