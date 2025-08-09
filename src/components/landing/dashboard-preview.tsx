"use client"

import Image from "next/image"

export function DashboardPreview() {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center">
          <div className="relative max-w-4xl w-full">

            {/* Desktop Dashboard Image */}
            <div className="hidden md:block">
              {/* <div className="bg-white rounded-2xl shadow-2xl border-4 border-[#309CEC] p-0 overflow-hidden"> */}
                <Image
                  src="/assets/backgrounds/hero-desk.png"
                  alt="StudyBuddy Desktop Dashboard"
                  width={1200}
                  height={750}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              {/* </div> */}
            </div>

            {/* Mobile Dashboard Image */}
            <div className="block md:hidden">
              {/* <div className="bg-white rounded-2xl shadow-xl border-2 border-[#309CEC] p-0 overflow-hidden"> */}
                <Image
                  src="/assets/backgrounds/hero-mobile.png"
                  alt="StudyBuddy Mobile Dashboard"
                  width={400}
                  height={300}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              {/* </div> */}
            </div>

            {/* Floating Decorations */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce hidden lg:block" />
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-pink-400 rounded-full animate-pulse hidden lg:block" />
            <div className="absolute -bottom-6 -left-2 w-10 h-10 bg-green-400 rounded-full animate-bounce delay-300 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
