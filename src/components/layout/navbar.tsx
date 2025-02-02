'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          studybuddy
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Button variant="ghost" asChild className="justify-start bg-white text-[#4024B9] hover:bg-gray-100 hover:text-[#4024B9] rounded-[14px]">
            <Link href="/info/meet">Log In</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#090017]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" asChild className="justify-start bg-white text-[#4024B9] hover:bg-gray-100 hover:text-[#4024B9] rounded-[14px]" onClick={() => setIsOpen(false)}>
                  <Link href="/info/meet">Log In</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div> 
      </div>
    </nav>
  )
}