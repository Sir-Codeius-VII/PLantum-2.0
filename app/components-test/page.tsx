import { WeeklyLeaderboard } from "@/components/weekly-leaderboard"
import { AchievementNotification } from "@/components/achievement-notification"
import { UserProfileCard } from "@/components/user-profile-card"
import { MissionsCard } from "@/components/missions-card"

export default function ComponentsTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Gamification Components</h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Weekly Leaderboard</h2>
            <WeeklyLeaderboard />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">User Profile Card</h2>
            <UserProfileCard />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Missions & Challenges</h2>
            <MissionsCard />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Achievement Notifications</h2>
            <p className="mb-4 text-muted-foreground">
              Achievement notifications will appear in the bottom-right corner after a few seconds.
            </p>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Gamification Features:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>User levels with progress tracking</li>
                <li>Achievement badges with visual indicators</li>
                <li>Daily streaks with rewards</li>
                <li>Weekly missions and challenges</li>
                <li>Leaderboards with rankings</li>
                <li>Points system for engagement</li>
                <li>Visual celebration effects (confetti)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AchievementNotification />
    </div>
  )
}

