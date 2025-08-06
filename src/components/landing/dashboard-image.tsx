"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface DashboardImageProps {
  desktopSrc?: string
  mobileSrc?: string
  alt?: string
}

export function DashboardImage({
  desktopSrc = "/placeholder.svg?height=600&width=800",
  mobileSrc = "/placeholder.svg?height=400&width=300",
  alt = "StudyBuddy Dashboard",
}: DashboardImageProps) {
  const [, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="relative w-full">
      {/* Desktop Image */}
      <div className="hidden md:block">
        <Image
          src={desktopSrc || "/placeholder.svg"}
          alt={alt}
          width={800}
          height={600}
          className="w-full h-auto rounded-lg shadow-lg"
          priority
        />
      </div>

      {/* Mobile Image */}
      <div className="block md:hidden">
        <Image
          src={mobileSrc || "/placeholder.svg"}
          alt={alt}
          width={300}
          height={400}
          className="w-full h-auto rounded-lg shadow-lg"
          priority
        />
      </div>
    </div>
  )
}
