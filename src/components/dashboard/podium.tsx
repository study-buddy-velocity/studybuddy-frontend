import { Crown, Flame, ChevronDown } from "lucide-react"
import { LeaderboardUser } from "@/lib/api/leaderboard"

interface PodiumProps {
  users: LeaderboardUser[]
  onPeriodChange: (period: 'weekly' | 'monthly' | 'all') => void
  onSubjectChange: (subject: string) => void
  onClassChange: (classFilter: string) => void
  currentPeriod: string
  currentSubject: string
  currentClass: string
  subjects: string[]
  classes: string[]
}

export function Podium({
  users,
  onPeriodChange,
  onSubjectChange,
  onClassChange,
  currentPeriod,
  currentSubject,
  currentClass,
  subjects,
  classes
}: PodiumProps) {
  const sortedUsers = [...users].sort((a, b) => b.sparkPoints - a.sparkPoints)
  const [first, second, third] = sortedUsers

  return (
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl p-6 md:p-8 relative overflow-hidden">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 mb-12 justify-between items-center">
        <div className="relative">
          <select
            className="appearance-none bg-white rounded-full px-6 py-3 pr-10 text-sm font-medium text-gray-700 border-0 focus:ring-2 focus:ring-blue-300 cursor-pointer"
            value={currentPeriod}
            onChange={(e) => onPeriodChange(e.target.value as 'weekly' | 'monthly' | 'all')}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="all">All Time</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <select
              className="appearance-none bg-white rounded-full px-6 py-3 pr-10 text-sm font-medium text-gray-700 border-0 focus:ring-2 focus:ring-blue-300 cursor-pointer"
              value={currentSubject}
              onChange={(e) => onSubjectChange(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white rounded-full px-6 py-3 pr-10 text-sm font-medium text-gray-700 border-0 focus:ring-2 focus:ring-blue-300 cursor-pointer"
              value={currentClass}
              onChange={(e) => onClassChange(e.target.value)}
            >
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-8 md:gap-16">
        {/* Second Place */}
        {second && (
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <img
                src={second.profileImage || "/assets/buddy/default_profile_pic.png"}
                alt={second.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <div className="text-white text-center mb-4">
              <div className="font-semibold text-lg md:text-xl mb-2">{second.name}</div>
              <div className="bg-white rounded-lg px-3 py-2 text-gray-800 font-semibold flex items-center gap-1 shadow-md">
                {second.sparkPoints}
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
            </div>
            <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-t-xl w-20 h-16 md:w-24 md:h-20 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl md:text-4xl font-bold">2</span>
            </div>
          </div>
        )}

        {/* First Place */}
        {first && (
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full p-1">
                <Crown className="h-5 w-5 text-yellow-600" />
              </div>
              <img
                src={first.profileImage || "/assets/buddy/default_profile_pic.png"}
                alt={first.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-yellow-300 shadow-lg"
              />
            </div>
            <div className="text-white text-center mb-4">
              <div className="font-semibold text-xl md:text-2xl mb-2">{first.name}</div>
              <div className="bg-white rounded-lg px-4 py-2 text-gray-800 font-semibold flex items-center gap-1 shadow-md">
                {first.sparkPoints}
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
            </div>
            <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-t-xl w-24 h-24 md:w-28 md:h-28 flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl md:text-5xl font-bold">1</span>
            </div>
          </div>
        )}

        {/* Third Place */}
        {third && (
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <img
                src={third.profileImage || "/assets/buddy/default_profile_pic.png"}
                alt={third.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <div className="text-white text-center mb-4">
              <div className="font-semibold text-lg md:text-xl mb-2">{third.name}</div>
              <div className="bg-white rounded-lg px-3 py-2 text-gray-800 font-semibold flex items-center gap-1 shadow-md">
                {third.sparkPoints}
                <Flame className="h-4 w-4 text-orange-500" />
              </div>
            </div>
            <div className="bg-white bg-opacity-40 backdrop-blur-sm rounded-t-xl w-20 h-12 md:w-24 md:h-16 flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl md:text-4xl font-bold">3</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
