"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const pathname = usePathname();
  const step = getStepFromPath(pathname);

  return (
    <div className=" relative min-h-screen bg-[#090017] flex flex-col">
      <div className="absolute inset-0 w-screen ">
        <Image
          src="/assets/backgrounds/WelcomeBG-2-3.png"
          alt=""
          className="w-full h-full object-cover object-center"
          fill
        />
      </div>
      <header className="w-full p-4 z-10 my-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="relative">
            {/* <Button
      className="text-sm text-white/80 text-right flex items-center justify-end md:justify-start"
      onClick={() => router.back()}
    >
      {/* Back arrow for mobile view */}
            {/* <span className="block md:hidden">
      <ArrowLeft className="h-8 w-8" />
      </span> */}

            {/* Full text for larger screens */}
            {/* <span className="hidden md:block">Go Back to Previous Step</span>
    </Button> */}
          </div>
          <div className="ml-4"></div>
          <Link
            href="/"
            className="text-2xl font-bold text-white text-center flex-1"
          >
            studybuddy
          </Link>
          <div className="w-24 text-sm text-white/80 text-right">
            Step {step} of 4
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}

function getStepFromPath(pathname: string): number {
  if (pathname.includes("meet")) return 1;
  if (pathname.includes("start")) return 2;
  if (pathname.includes("know")) return 3;
  if (pathname.includes("complete")) return 4;
  return 1;
}
