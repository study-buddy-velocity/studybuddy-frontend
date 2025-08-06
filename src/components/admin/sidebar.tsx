"use client"
import { Home, BookOpen, HelpCircle, AlertTriangle, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface SidebarProps {
  className?: string
}

const menuItems = [
  {
    icon: Home,
    label: "Admin Dashboard",
    href: "/admin",
  },
  {
    icon: BookOpen,
    label: "Subject Topics",
    href: "/admin/subjects",
  },
  {
    icon: HelpCircle,
    label: "Quiz Questions",
    href: "/admin/quiz",
  },
]

export default function Sidebar({ className = "" }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavClick = (href: string) => {
    // Add some debugging
    console.log(`Navigating to: ${href}`)
    //console.log(`Current pathname: ${pathname}`)
  }

  return (
    <div className={`w-48 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-xl font-bold">
          <span className="text-black">study</span>
          <span className="text-primary-blue">buddy</span>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-4">
        <div className="px-4 mb-4">
          <p className="text-sm text-gray-500 font-medium">Main Menu</p>
        </div>

        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-primary-blue text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Issues Raised */}
        <div className="mt-6 px-2">
          <Link
            href="/admin/issues"
            onClick={() => handleNavClick("/admin/issues")}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/admin/issues" || pathname.startsWith("/admin/issues/")
                ? "bg-primary-blue text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <AlertTriangle className="w-4 h-4 mr-3" />
            Issues Raised
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="p-2 border-t border-gray-200">
        <button 
          onClick={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('accessToken')
            }
            router.push('/admin-login')
          }}
          className="flex items-center w-full px-4 py-3 rounded-full text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}