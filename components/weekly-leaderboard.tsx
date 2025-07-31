"use client"

import { useState } from "react"
import { Award, Crown, FlameIcon as Fire, Rocket, Shield, Star, Trophy, TrendingUp, Users } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Data structure matches existing project patterns
const topInvestors = [
  {
    id: 1,
    name: "Sarah Venter",
    company: "Horizon Capital",
    initials: "SV",
    investmentsCount: 8,
    investmentsAmount: 12500000,
    change: "+3",
    badge: "Top Investor",
    badgeIcon: <Crown className="h-3 w-3 text-amber-500" />,
    level: 8,
    points: 1250,
    streak: 12,
  },
  {
    id: 2,
    name: "James Nkosi",
    company: "Tech Ventures",
    initials: "JN",
    investmentsCount: 6,
    investmentsAmount: 9800000,
    change: "+1",
    badge: "Rising Star",
    badgeIcon: <Rocket className="h-3 w-3 text-blue-500" />,
    level: 6,
    points: 980,
    streak: 8,
  },
  {
    id: 3,
    name: "Priya Patel",
    company: "Innovation Fund",
    initials: "PP",
    investmentsCount: 5,
    investmentsAmount: 7500000,
    change: "-1",
    badge: "Consistent",
    badgeIcon: <Shield className="h-3 w-3 text-green-500" />,
    level: 5,
    points: 750,
    streak: 15,
  },
]

const topStartups = [
  {
    id: 1,
    name: "EcoSolar Solutions",
    industry: "CleanTech",
    initials: "ES",
    raisedAmount: 3500000,
    investors: 12,
    change: "+2",
    badge: "Top Performer",
    badgeIcon: <Trophy className="h-3 w-3 text-amber-500" />,
    level: 7,
    points: 850,
    streak: 10,
  },
  {
    id: 2,
    name: "HealthTech Africa",
    industry: "HealthTech",
    initials: "HT",
    raisedAmount: 12000000,
    investors: 8,
    change: "+3",
    badge: "Featured",
    badgeIcon: <Star className="h-3 w-3 text-blue-500" />,
    level: 9,
    points: 1200,
    streak: 6,
  },
  {
    id: 3,
    name: "PayQuick",
    industry: "Fintech",
    initials: "PQ",
    raisedAmount: 800000,
    investors: 5,
    change: "-1",
    badge: "Trending",
    badgeIcon: <Fire className="h-3 w-3 text-red-500" />,
    level: 3,
    points: 320,
    streak: 3,
  },
]

export function WeeklyLeaderboard() {
  const [timeframe, setTimeframe] = useState("weekly")

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <CardTitle>Weekly Leaderboard</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTimeframe("weekly")}
              className={timeframe === "weekly" ? "bg-primary text-primary-foreground" : ""}
            >
              Weekly
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTimeframe("monthly")}
              className={timeframe === "monthly" ? "bg-primary text-primary-foreground" : ""}
            >
              Monthly
            </Button>
          </div>
        </div>
        <CardDescription>Top performers for the week of March 10 - March 16, 2024</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="investors" className="w-full">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="investors" className="flex-1 rounded-none data-[state=active]:bg-background">
              <Users className="mr-2 h-4 w-4" />
              Top Investors
            </TabsTrigger>
            <TabsTrigger value="startups" className="flex-1 rounded-none data-[state=active]:bg-background">
              <TrendingUp className="mr-2 h-4 w-4" />
              Top Funded Startups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investors" className="p-0">
            <div className="divide-y">
              {topInvestors.map((investor, index) => (
                <div key={investor.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="relative">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback>{investor.initials}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground font-bold">
                        {investor.level}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{investor.name}</p>
                      <Badge className="flex items-center gap-1 text-xs" variant="outline">
                        {investor.badgeIcon}
                        {investor.badge}
                      </Badge>
                      {investor.streak >= 10 && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Fire className="h-2 w-2 text-red-500" />
                          {investor.streak}d
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{investor.company}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">R{(investor.investmentsAmount / 1000000).toFixed(1)}M</div>
                    <div className="flex items-center justify-end gap-1 text-sm">
                      <span
                        className={
                          investor.change.startsWith("+")
                            ? "text-green-500"
                            : investor.change.startsWith("-")
                              ? "text-red-500"
                              : "text-muted-foreground"
                        }
                      >
                        {investor.change}
                      </span>
                      <span className="text-muted-foreground">{investor.points} pts</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 text-center">
                <Button variant="ghost" asChild>
                  <Link href="/leaderboard">View Full Leaderboard</Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="startups" className="p-0">
            <div className="divide-y">
              {topStartups.map((startup, index) => (
                <div key={startup.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div className="relative">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback>{startup.initials}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground font-bold">
                        {startup.level}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{startup.name}</p>
                      <Badge className="flex items-center gap-1 text-xs" variant="outline">
                        {startup.badgeIcon}
                        {startup.badge}
                      </Badge>
                      {startup.streak >= 7 && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Fire className="h-2 w-2 text-red-500" />
                          {startup.streak}d
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{startup.industry}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">R{(startup.raisedAmount / 1000000).toFixed(1)}M</div>
                    <div className="flex items-center justify-end gap-1 text-sm">
                      <span
                        className={
                          startup.change.startsWith("+")
                            ? "text-green-500"
                            : startup.change.startsWith("-")
                              ? "text-red-500"
                              : "text-muted-foreground"
                        }
                      >
                        {startup.change}
                      </span>
                      <span className="text-muted-foreground">{startup.points} pts</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="p-4 text-center">
                <Button variant="ghost" asChild>
                  <Link href="/leaderboard">View Full Leaderboard</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

