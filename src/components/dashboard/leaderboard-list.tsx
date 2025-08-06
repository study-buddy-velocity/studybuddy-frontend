import { Search, Flame } from "lucide-react"
import { LeaderboardUser, getPositionColor } from "@/lib/api/leaderboard"
import { useState } from "react"

interface LeaderboardListProps {
  users: LeaderboardUser[]
  onSearch: (query: string) => void
  isLoading?: boolean
}

export function LeaderboardList({ users, onSearch, isLoading }: LeaderboardListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Users are already sorted by rank from the API
  const displayUsers = users

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  return (
    <div className="bg-white rounded-xl border border-blue-200 p-4 md:p-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search for a friend..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Leaderboard List */}
      {!isLoading && (
        <div className="space-y-3">
          {displayUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found matching your search.
            </div>
          ) : (
            displayUsers.map((user) => (
              <div key={user.userId} className="flex items-center gap-4 p-3 hover:bg-blue-50 rounded-lg transition-colors">
                <div
                  className={`w-8 h-8 ${getPositionColor(user.rank)} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                >
                  {user.rank}
                </div>

                <img
                  src={user.profileImage || "/assets/buddy/default_profile_pic.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />

                <div className="flex-1">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.studentId}</div>
                </div>

                <div className="flex items-center gap-1 text-orange-500 font-medium">
                  {user.sparkPoints}
                  <Flame className="h-4 w-4" />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
