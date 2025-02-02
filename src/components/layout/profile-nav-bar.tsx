import { Button } from "@/components/ui/button"
import { ChevronLeft } from 'lucide-react'
import Link from "next/link"

export function NavBar() {
  return (
    <div className="px-4 py-2">
      <nav 
        className="flex items-center justify-between px-2 py-2 rounded-[22.5px] border-2 border-[#787878]" 
        style={{ background: "#232323" }}
      >
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2 px-4 py-6 bg-white hover:bg-white/90 text-black rounded-[14px]" 
            asChild
          >
            <Link href="/chat">
              <ChevronLeft className="h-4 w-4" />
              {/* <span className="text-sm font-normal">Return to Chat</span> */}
            </Link>
          </Button>
          <span className="text-lg font-normal hidden md:inline">Return to Chat</span>
        </div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-xl font-semibold text-white">studybuddy</span>
        </div>
        
        {/* <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Naazim Jaleel's Profile</span>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src="/placeholder.svg"
              alt="Profile picture"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div> */}
      </nav>
    </div>
  )
}

