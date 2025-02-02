"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MeetBuddy() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full z-10">
      <div className="container mx-auto px-4 mt-12 flex flex-col items-center justify-center flex-1 relative x-10">
        <div className="max-w-[600px] w-full">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Meet your new buddy!
          </h1>

          <Card className="w-full bg-[#232323] backdrop-blur-sm border-none rounded-[23px]">
            <CardContent className="p-2 md:flex md:items-start">
              {/* Add width and height to the Image component */}
              <Image
                src="/assets/buddy/buddy-meet.png"
                alt="Joy character"
                width={207} // Add width
                height={230} // Add height
                className="rounded-[22px] mb-1 mx-auto md:mx-0 md:mr-6"
              />
              <div className="flex flex-col items-center md:items-start px-6 py-2">
                <h2 className="text-2xl font-bold text-white mb-2">
                  A friend for life!
                </h2>
                <p className="text-white/80 text-[18px]">
                  A friend who is always there to make studying simpler, easier,
                  and more effective. StudyBuddy is a personalized learning
                  companion designed to help you tackle your academic challenges
                  and reach your goals.
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-2 my-4 justify-center">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
          <Button
            className="mt-2 w-full bg-gradient-to-r from-[#4024B9] to-[#8640FF] hover:opacity-90 text-[26px] font-bold py-8 rounded-[17.65px]"
            onClick={() => router.push("/info/start")}
          >
            Start Studying
          </Button>
        </div>
      </div>
    </div>
  );
}
