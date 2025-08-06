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
              <div className="bg-white rounded-2xl shadow-2xl border-4 border-[#309CEC] p-6 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="aspect-[16/10] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden relative">
                  {/* Dashboard Mockup */}
                  <div className="w-full h-full p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#309CEC] rounded-lg"></div>
                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-3 gap-4 h-full">
                      {/* Sidebar */}
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="space-y-2">
                          <div className="h-3 bg-[#309CEC] rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>

                      {/* Main Dashboard */}
                      <div className="col-span-2 bg-white rounded-lg p-3 shadow-sm">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 text-white">
                            <div className="h-2 bg-white/30 rounded w-1/2 mb-1"></div>
                            <div className="h-4 bg-white/50 rounded w-3/4"></div>
                          </div>
                          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-2 text-white">
                            <div className="h-2 bg-white/30 rounded w-1/2 mb-1"></div>
                            <div className="h-4 bg-white/50 rounded w-3/4"></div>
                          </div>
                        </div>

                        {/* Chart Area */}
                        <div className="bg-gray-50 rounded-lg p-2 h-20">
                          <div className="flex items-end justify-between h-full">
                            <div className="w-2 bg-[#309CEC] rounded-t" style={{height: '60%'}}></div>
                            <div className="w-2 bg-[#309CEC] rounded-t" style={{height: '80%'}}></div>
                            <div className="w-2 bg-[#309CEC] rounded-t" style={{height: '40%'}}></div>
                            <div className="w-2 bg-[#309CEC] rounded-t" style={{height: '90%'}}></div>
                            <div className="w-2 bg-[#309CEC] rounded-t" style={{height: '70%'}}></div>
                            <div className="w-2 bg-[#309CEC] rounded-t" style={{height: '50%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overlay for actual image when available */}
                  <Image
                    src="/dashboard-desktop.png"
                    alt="StudyBuddy Desktop Dashboard"
                    width={1200}
                    height={750}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Dashboard Image */}
            <div className="block md:hidden">
              <div className="bg-white rounded-2xl shadow-xl border-2 border-[#309CEC] p-4">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden relative">
                  {/* Mobile Dashboard Mockup */}
                  <div className="w-full h-full p-3">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#309CEC] rounded-md"></div>
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                      </div>
                      <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2 text-white">
                        <div className="h-1.5 bg-white/30 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-white/50 rounded w-3/4"></div>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-2 text-white">
                        <div className="h-1.5 bg-white/30 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-white/50 rounded w-3/4"></div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-white rounded-lg p-2 shadow-sm">
                      <div className="space-y-2">
                        <div className="h-2 bg-[#309CEC] rounded w-full"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>

                      {/* Mini Chart */}
                      <div className="mt-2 bg-gray-50 rounded p-1">
                        <div className="flex items-end justify-between h-8">
                          <div className="w-1 bg-[#309CEC] rounded-t" style={{height: '50%'}}></div>
                          <div className="w-1 bg-[#309CEC] rounded-t" style={{height: '70%'}}></div>
                          <div className="w-1 bg-[#309CEC] rounded-t" style={{height: '40%'}}></div>
                          <div className="w-1 bg-[#309CEC] rounded-t" style={{height: '80%'}}></div>
                          <div className="w-1 bg-[#309CEC] rounded-t" style={{height: '60%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overlay for actual image when available */}
                  <Image
                    src="/dashboard-mobile.png"
                    alt="StudyBuddy Mobile Dashboard"
                    width={400}
                    height={300}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce hidden lg:block" />
            <div className="absolute -top-2 -right-6 w-6 h-6 bg-pink-400 rounded-full animate-pulse hidden lg:block" />
            <div className="absolute -bottom-6 -left-2 w-10 h-10 bg-green-400 rounded-full animate-bounce delay-300 hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  )
}
