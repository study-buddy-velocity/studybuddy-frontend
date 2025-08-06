"use client"

interface SubjectCardProps {
  subject: string
  bgColor: string
  icon: string
  onClick?: () => void
}

export function SubjectCard({ subject, bgColor, icon, onClick }: SubjectCardProps) {
  return (
    <div
      className={`${bgColor} rounded-2xl p-8 text-white relative overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className="relative z-10">
        <h3 className="text-2xl sm:text-3xl font-bold mb-2">Learn</h3>
        <h3 className="text-2xl sm:text-3xl font-bold">{subject}</h3>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full flex items-center justify-center">
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 group-hover:to-white/10 transition-colors duration-300" />
    </div>
  )
}
