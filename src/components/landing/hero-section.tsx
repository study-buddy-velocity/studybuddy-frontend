import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gray-600 text-sm sm:text-base mb-4">AI learning partner for quick, smart studying</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Your smart companion for
            <br />
            acing every exam
          </h1>
          <Link href="/intro"><Button className="bg-[#309CEC] hover:bg-[#2589d4] text-white px-8 py-3 text-base font-medium rounded-full">
            <MessageCircle className="mr-2 h-5 w-5" />
            Chat with Buddy
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button></Link>
        </div>
      </div>
    </section>
  )
}
