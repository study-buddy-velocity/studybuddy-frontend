"use client";

import { useState, useEffect } from "react";
import { ActivityHeatmap } from "@/components/layout/activity-heatmap";
import { Priorities } from "@/components/layout/priorities";
import { ProfileInfo } from "@/components/layout/profile-info";
import { NavBar } from "@/components/layout/profile-nav-bar";
import { Recommendations } from "@/components/layout/recommendations";
import { useAuth } from "@/hooks/useAuthenticationHook";
import { UserData } from "@/lib/utils";

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData>({
    dob: "",
    name: "",
    phoneno: "",
    schoolName: "",
    class: "",
    subjects: [],
  });

  const { getAuthHeaders } = useAuth();

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/user-details`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#090017" }}>
      <NavBar />
      <main className="container p-4 mx-auto space-y-4">
        {/* First Row */}
        <div className="grid gap-4 md:grid-cols-12">
          {/* ProfileInfo takes 5 columns */}
          <div className="md:col-span-5">
            <ProfileInfo userData={userData} />
          </div>
          {/* Priorities takes 7 columns */}
          <div className="md:col-span-7">
            <Priorities userData={userData} />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid gap-4 md:grid-cols-12">
          {/* <ActivityHeatmap />
          <Recommendations /> */}
          <div className="md:col-span-7">
            <ActivityHeatmap userData={userData} />
          </div>
          {/* Priorities takes 7 columns */}
          <div className="md:col-span-5">
            <Recommendations userData={userData} />
          </div>
        </div>
      </main>
    </div>
  );
}
