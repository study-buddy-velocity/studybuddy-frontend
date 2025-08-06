import { Home, Trophy, LogOut, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  currentPage?: "dashboard" | "dashboard/leaderboard"
}

export function AppSidebar({ currentPage = "dashboard" }: AppSidebarProps) {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    try {
      // Clear all items from localStorage
      localStorage.clear();

      // Show success toast
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });

      // Redirect to intro page with LoginPage component
      router.push('/intro');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800">study</span>
          <span className="text-xl font-bold text-blue-500">buddy</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 text-sm font-medium mb-4">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={currentPage === "dashboard"}
                  className={
                    currentPage === "dashboard"
                      ? "bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  <a href="/dashboard" className="flex items-center gap-3 px-4 py-2">
                    <Home className="h-4 w-4" />
                    <span>My Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={currentPage === "dashboard/leaderboard"}
                  className={
                    currentPage === "dashboard/leaderboard"
                      ? "bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                      : "text-gray-600 hover:text-gray-800"
                  }
                >
                  <a href="/leaderboard" className="flex items-center gap-3 px-4 py-2">
                    <Trophy className="h-4 w-4" />
                    <span>Leaderboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-3">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-700">More features</span>
          </div>
          <span className="text-sm text-orange-600">Coming soon!</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full p-3 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
