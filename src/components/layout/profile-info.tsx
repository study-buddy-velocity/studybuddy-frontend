import { Button } from "@/components/ui/button"
import { UserData } from "@/lib/utils"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { useAuth } from '@/hooks/useAuthenticationHook'
import { getTokenSub } from "@/lib/jwt-utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface UserStreakProps {
  streak: number | 0;
}
interface ProfileInfoProps {
  userData: UserData;
}

export function ProfileInfo({ userData }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UserData>(userData);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(userData.profileImage || "/assets/buddy/default_profile_pic.png");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [userStreak, setUserStreak] = useState<UserStreakProps>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getAuthHeaders } = useAuth();
  const userId = getTokenSub();

  useEffect(() => {
    setEditedData(userData);
    setPreviewUrl(userData.profileImage || "/assets/buddy/default_profile_pic.png");
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsEditing(true);
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      try {
        const base64String = await convertToBase64(file);
        setEditedData(prev => ({
          ...prev,
          profileImage: base64String
        }));
        setIsEditing(true);
      } catch (error) {
        console.error('Error converting image to base64:', error);
        alert('Failed to process image');
      }

      setIsImageDialogOpen(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Single PUT request with all data including base64 image
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/user-details`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData), // This now includes the base64 image string
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      setIsEditing(false);
      // console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
    setPreviewUrl(userData.profileImage || "/assets/buddy/default_profile_pic.png");
  };

  const fetchStreakData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/chat-streak`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserStreak(data);
    } catch (error) {
      console.error('Error fetching user streak data:', error);
    }
  };

  useEffect(() => {
    fetchStreakData();
  }, []);

  return (
    <div className="p-6 rounded-[22.5px] border-2 border-[#737373] h-full" style={{ background: "#232323" }}>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-[220px] h-[220px]">
            <Image
              src={previewUrl}
              alt="Profile avatar"
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-muted-foreground">Basic Info</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Image
                  src="/assets/buddy/streak_profile.svg"
                  alt="Fire icon"
                  width={16}
                  height={16}
                  className="opacity-70"
                />
                <span className="text-xs text-muted-foreground">{userStreak?.streak}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <input
              type="text"
              name="name"
              value={editedData.name}
              onChange={handleInputChange}
              className="w-full bg-[#3B3B3B] text-white placeholder:text-white/50 py-4 px-4 rounded-[10.79px]"
              placeholder="Name"
            />
            <input
              type="text"
              name="schoolName"
              value={editedData.schoolName}
              onChange={handleInputChange}
              className="w-full bg-[#3B3B3B] text-white placeholder:text-white/50 py-4 px-4 rounded-[10.79px]"
              placeholder="School Name"
            />
            <input
              type="text"
              name="class"
              value={editedData.class}
              onChange={handleInputChange}
              className="w-full bg-[#3B3B3B] text-white placeholder:text-white/50 py-4 px-4 rounded-[10.79px]"
              placeholder="Class"
              disabled
            />
          </div>
        </div>
      </div>
      <div className="flex gap-4 pt-4">
        {!isEditing && (
          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full text-black bg-[#DEDEDE] hover:bg-white">
                Change Picture
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change Profile Picture</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {isEditing ? (
          <>
            <Button
              className="w-full text-black bg-[#DEDEDE] hover:bg-white"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Save Changes'}
            </Button>
          </>
        ) : (
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
}