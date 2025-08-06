"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface TopNavProps {
  title: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  className?: string
  onLogout?: () => void
}

export default function TopNav({ title, breadcrumbs = [], className = "", onLogout }: TopNavProps) {
  return (
    <div className={`bg-white border-b border-gray-200 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

        {breadcrumbs.length > 0 && (
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="text-gray-400 mx-2">{">"}</span>}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-primary-blue hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-900">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}

        {onLogout && (
          <Button size="sm" variant="outline" onClick={onLogout} className="ml-auto">
            Logout
          </Button>
        )}
      </div>
    </div>
  )
}
