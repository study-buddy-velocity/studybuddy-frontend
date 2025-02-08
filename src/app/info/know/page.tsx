"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuthenticationHook";
import { subjectOptions } from "@/lib/utils";
import {FormData} from "@/lib/types/types"


export default function GetToKnow() {
  const router = useRouter();
  const { getAuthHeaders } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    dob: null,
    name: "",
    phoneno: "",
    schoolName: "",
    class: "",
    subjects: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubjectsChange = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/user-details`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");
      router.push("/info/complete");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative z-10 container mx-auto px-4 flex flex-col flex-1 max-w-4xl py-16">
      <h1 className="text-4xl font-bold text-white mb-12 text-center">
        Let&apos;s get to know each other!
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Personal Information section remains unchanged */}
        <div className="space-y-4">
          <h2 className="text-[#767676] text-[18px]">Personal Information</h2>
          <div className="relative">
            <DatePicker
              selected={formData.dob}
              onChange={(date) => setFormData({ ...formData, dob: date })}
              dateFormat="yyyy-MM-dd"
              placeholderText="Date of Birth"
              className="bg-[#232323] border-none text-white placeholder:text-white/50 py-[1.3rem] rounded-[10.79px] w-full pl-12"
              wrapperClassName="w-full"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              yearDropdownItemNumber={100}
              scrollableYearDropdown
            />
            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
          </div>
          <Input
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-[#232323] border-none text-white placeholder:text-white/50 py-8 rounded-[10.79px]"
          />
          <Input
            name="phoneno"
            placeholder="Phone Number"
            value={formData.phoneno}
            onChange={handleInputChange}
            className="bg-[#232323] border-none text-white placeholder:text-white/50 py-8 rounded-[10.79px]"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-[#767676] text-[18px]">Academic Information</h2>
          <Input
            name="schoolName"
            placeholder="School/University Name"
            value={formData.schoolName}
            onChange={handleInputChange}
            className="bg-[#232323] border-none text-white placeholder:text-white/50 py-8 rounded-[10.79px]"
          />
          <Input
            name="class"
            placeholder="Grade/Class"
            value={formData.class}
            onChange={handleInputChange}
            className="bg-[#232323] border-none text-white placeholder:text-white/50 py-8 rounded-[10.79px]"
          />
          <div className="space-y-2">
            <Select onValueChange={handleSubjectsChange}>
              <SelectTrigger className="bg-[#232323] border-none text-white placeholder:text-white/50 py-2 rounded-[10.79px] min-h-[66px]">
                <div className="flex flex-wrap gap-1">
                  {formData.subjects.length > 0 ? (
                    formData.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="bg-[#843FFD] text-white px-2 py-1 rounded-full text-xs"
                      >
                        {subject}
                      </span>
                    ))
                  ) : (
                    <SelectValue placeholder="Select preferred subjects" />
                  )}
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {subjectOptions.map((subject) => (
                  <SelectItem
                    key={subject}
                    value={subject}
                    className={`${
                      formData.subjects.includes(subject)
                        ? "bg-[#843FFD]/20"
                        : ""
                    } text-black hover:bg-gray-100`}
                  >
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        className="mt-6 w-full bg-gradient-to-r from-[#4024B9] to-[#8640FF] hover:opacity-90 text-[26px] font-bold py-8 rounded-[10.79px]"
        onClick={handleSubmit}
      >
        Customise my Experience
      </Button>
    </div>
  );
}
