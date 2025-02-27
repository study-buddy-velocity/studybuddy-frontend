import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { capitalizeFirstLetter } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface ProfileDropdownProps {
  userName: string;
}

const ProfileDropdown = ({ userName }: ProfileDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleViewProfile = () => {
    router.push('/profile');
    setIsDropdownOpen(false);
  };

  const handleOpenCommunity = () => {
    setIsDropdownOpen(false);
    setIsComingSoonOpen(true);
  };

  const handleLogout = () => {
    try {
      // Clear all items from localStorage
      localStorage.clear();
      
      // Show success toast
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });

      // Redirect to login page
      router.push('/info/start');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
    setIsDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src="/assets/buddy/default_profile_pic.png" />
            <AvatarFallback>{capitalizeFirstLetter(userName)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="bg-white text-black border border-black rounded-[20px] shadow-lg"
        >
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleOpenCommunity();
            }}
            className="hover:bg-gray-100 cursor-pointer"
          >
            Open Community
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleViewProfile();
            }}
            className="hover:bg-gray-100 cursor-pointer"
          >
            View Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200" />
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              handleLogout();
            }}
            className="hover:bg-red-50 text-red-600 cursor-pointer"
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isComingSoonOpen} onOpenChange={setIsComingSoonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Coming Soon</DialogTitle>
            <DialogDescription>
              Community feature will be available soon!
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-[100%] h-[300px] mx-auto">
            <Image
              src="/assets/backgrounds/Open-Community.png"
              alt="Profile avatar"
              layout="fill" 
              className="rounded-lg object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileDropdown;