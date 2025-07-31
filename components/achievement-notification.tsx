"use client"

import { useState, useEffect } from "react"
import { Award, Crown, FlameIcon as Fire, Rocket, Shield, Star, Target, Trophy, X, TrendingUp } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Simplified achievements data structure
const achievements = [
  {
    id: 1,
    type: "rank",
    title: "Rank Improved!",
    description: "You moved up 3 positions in the investor leaderboard!",
    icon: <TrendingUp className="h-6 w-6 text-green-500" />,
    initials: "JD",
    badge: "Top 10 Investor",
    badgeIcon: <Trophy className="h-4 w-4 text-amber-500" />,
    points: 50,
    action: "View Leaderboard",
  },
  {
    id: 2,
    type: "milestone",
    title: "Milestone Achieved!",
    description: "You've invested in 5 startups this month!",
    icon: <Trophy className="h-6 w-6 text-amber-500" />,
    initials: "JD",
    badge: "Power Investor",
    badgeIcon: <Star className="h-4 w-4 text-blue-500" />,
    points: 75,
    action: "View Achievements",
  },
  {
    id: 3,
    type: "award",
    title: "New Badge Unlocked!",
    description: "You've earned the 'Early Adopter' badge!",
    icon: <Award className="h-6 w-6 text-blue-500" />,
    initials: "JD",
    badge: "Early Adopter",
    badgeIcon: <Rocket className="h-4 w-4 text-purple-500" />,
    points: 100,
    action: "View Profile",
  },
  {
    id: 4,
    type: "streak",
    title: "7-Day Streak!",
    description: "You've been active on pLantum for 7 consecutive days!",
    icon: <Fire className="h-6 w-6 text-red-500" />,
    initials: "JD",
    badge: "Consistent",
    badgeIcon: <Shield className="h-4 w-4 text-green-500" />,
    points: 30,
    action: "View Streak",
  },
  {
    id: 5,
    type: "level",
    title: "Level Up!",
    description: "You've reached Level 5! New features unlocked.",
    icon: <Crown className="h-6 w-6 text-amber-500" />,
    initials: "JD",
    badge: "Level 5",
    badgeIcon: <Target className="h-4 w-4 text-blue-500" />,
    points: 150,
    action: "View Rewards",
  },
]

export function AchievementNotification() {
  const [notifications, setNotifications] = useState<typeof achievements>([])
  const [currentNotification, setCurrentNotification] = useState<(typeof achievements)[0] | null>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Simulate receiving notifications
  useEffect(() => {
    // For demo purposes, show a notification after 3 seconds
    const timer = setTimeout(() => {
      setNotifications(achievements)
      showNextNotification()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const showNextNotification = () => {
    if (notifications.length > 0) {
      setCurrentNotification(notifications[0])
      setShowNotification(true)
      setShowConfetti(true)

      // Hide confetti after 2 seconds
      setTimeout(() => {
        setShowConfetti(false)
      }, 2000)

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        dismissNotification()
      }, 5000)
    }
  }

  const dismissNotification = () => {
    setShowNotification(false)

    // Wait for exit animation to complete
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1))
      if (notifications.length > 1) {
        showNextNotification()
      }
    }, 300)
  }

  if (!showNotification || !currentNotification) {
    return null
  }

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="confetti-container">
              {/* This would be replaced with a proper confetti animation in a real implementation */}
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ["#FFD700", "#FF6347", "#4169E1", "#32CD32", "#FF69B4"][
                      Math.floor(Math.random() * 5)
                    ],
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `scale(${Math.random() * 2})`,
                    opacity: Math.random(),
                    animation: `fall ${1 + Math.random() * 3}s linear forwards`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50 max-w-sm transition-all duration-300">
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="flex flex-row items-start gap-4 pb-2">
            <div className="rounded-full bg-primary/10 p-2">{currentNotification.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{currentNotification.title}</CardTitle>
                <Button variant="ghost" size="icon" onClick={dismissNotification} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>{currentNotification.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarFallback>{currentNotification.initials}</AvatarFallback>
                </Avatar>
                {currentNotification.type === "level" && (
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                      5
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">John Doe</span>
                <Badge className="flex items-center gap-1" variant="outline">
                  {currentNotification.badgeIcon}
                  {currentNotification.badge}
                </Badge>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>+{currentNotification.points} XP</span>
                <span className="text-primary font-medium">750/1000 XP</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button variant="outline" size="sm" className="w-full">
              {currentNotification.action}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}

