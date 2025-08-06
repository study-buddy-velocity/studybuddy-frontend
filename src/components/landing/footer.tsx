import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              study<span className="text-[#309CEC]">buddy</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              Contact Us
            </button>
            <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              Get Help
            </button>
            <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              Privacy Policy
            </button>
          </div>

          {/* Start Learning Button */}
          <Button className="bg-[#309CEC] hover:bg-[#2589d4] text-white px-6 py-2 text-sm font-medium rounded-full">
            Start Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Navigation - Stacked Layout */}
        <div className="sm:hidden mt-6 pt-6 border-t border-gray-100">
          <div className="flex flex-col space-y-3 text-center">
            <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              Contact Us
            </button>
            <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              Get Help
            </button>
            <button className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
