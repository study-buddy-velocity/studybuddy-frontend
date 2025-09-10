"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="relative z-50 px-4 sm:px-6 lg:px-8 py-6 bg-white">
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between max-w-6xl mx-auto">
        {/* Left Navigation */}
        <div className="flex items-center space-x-8">
          <button
  onClick={() => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }}  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
            Contact Us
          </button>
          {/* <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">Get Help</button> */}
        </div>

        {/* Center Logo */}
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gray-900">
            study<span className="text-[#309CEC]">buddy</span>
          </span>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center space-x-8">
          <button onClick={() => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  }}  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">Features</button>
          <Link href="/intro"><Button className="bg-[#309CEC] hover:bg-[#2589d4] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">
            Start Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button></Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">
              study<span className="text-[#309CEC]">buddy</span>
            </span>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={toggleMobileMenu} />

            {/* Menu Panel */}
            <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
              <div className="p-6">
                {/* Close button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="space-y-6">
                  <button
                    className="block w-full text-left text-lg font-medium text-gray-900 hover:text-[#309CEC] transition-colors py-3"
                        onClick={() => {
      toggleMobileMenu();
      const element = document.getElementById("contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }}
                  >
                    Contact Us
                  </button>
                  {/* <button
                    className="block w-full text-left text-lg font-medium text-gray-900 hover:text-[#309CEC] transition-colors py-3"
                    onClick={toggleMobileMenu}
                  >
                    Get Help
                  </button> */}
                  <button
                    className="block w-full text-left text-lg font-medium text-gray-900 hover:text-[#309CEC] transition-colors py-3"
                        onClick={() => {
      toggleMobileMenu();
      const element = document.getElementById("features");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }}
                  >
                    Features
                  </button>

                  {/* Start Learning Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <Link href="/intro"><Button
                      className="w-full bg-[#309CEC] hover:bg-[#2589d4] text-white text-base font-medium py-3 rounded-lg"
                      onClick={toggleMobileMenu}
                    >
                      Start Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button></Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
