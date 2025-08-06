import { Flame } from "lucide-react"
import { LeaderboardUser, getPositionSuffix } from "@/lib/api/leaderboard"

interface ProfileCardProps {
  user: LeaderboardUser | null
}

export function ProfileCard({ user }: ProfileCardProps) {
  if (!user) {
    return (
      <div className="bg-white rounded-xl border border-blue-200 p-6 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-100 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No Data</span>
        </div>
        <h3 className="font-semibold text-lg text-gray-900 mb-2">Not Ranked</h3>
        <p className="text-gray-500 text-sm">Start chatting to get ranked!</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-blue-200 p-6 text-center">
      <img
        src={user.profileImage || "/assets/buddy/default_profile_pic.png"}
        alt={user.name}
        className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-100"
      />

      <h3 className="font-semibold text-lg text-gray-900 mb-2">{user.name}</h3>

      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1 mb-3">
        <Flame className="h-3 w-3" />
        {user.sparkPoints}
      </div>

      <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
        #{user.rank}{getPositionSuffix(user.rank)} Position
      </div>

      <p className="text-gray-500 text-sm mt-4">
        Congrats {user.name.split(' ')[0]},
        <br />
        Keep Crushing!
      </p>
    </div>
  )
}
