import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function MobileMenuButton() {
  return (
    <div className="fixed bottom-6 right-6 sm:hidden">
      <Button className="bg-[#309CEC] hover:bg-[#2589d4] text-white rounded-full p-3 shadow-lg">
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  )
}
