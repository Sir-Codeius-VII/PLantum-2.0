"use client"

import { Award, Gift, Target, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

const missions = [
  {
    id: 1,
    title: "Network Builder",
    description: "Connect with 5 new startups this week",
    reward: "50 points + 'Connector' badge",
    progress: 60,
    icon: <Users className="h-5 w-5 text-blue-500" />,
    deadline: "2 days left",
  },
  {
    id: 2,
    title: "Knowledge Seeker",
    description: "Read 3 industry reports and share insights",
    reward: "30 points + 'Analyst' badge",
    progress: 33,
    icon: <Award className="h-5 w-5 text-amber-500" />,
    deadline: "5 days left",
  },
  {
    id: 3,
    title: "Community Contributor",
    description: "Comment on 10 discussion threads",
    reward: "25 points + 'Engaged' badge",
    progress: 80,
    icon: <Gift className="h-5 w-5 text-green-500" />,
    deadline: "3 days left",
  },
]

export function MissionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Weekly Missions
        </CardTitle>
        <CardDescription>Complete missions to earn points and badges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missions.map((mission) => (
            <div key={mission.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">{mission.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{mission.title}</p>
                    <Badge variant="outline" className="text-xs">
                      {mission.deadline}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{mission.description}</p>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span>{mission.progress}% complete</span>
                    <span className="text-primary">Reward: {mission.reward}</span>
                  </div>
                  <Progress value={mission.progress} className="h-2 mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/missions">View All Missions</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

