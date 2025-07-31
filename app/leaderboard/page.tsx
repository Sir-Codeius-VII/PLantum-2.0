import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CalendarDateRangePicker } from "@/components/date-range-picker"
import { Search } from "@/components/search"
import {
  Award,
  Building2,
  Crown,
  FlameIcon as Fire,
  Gift,
  Rocket,
  Shield,
  Star,
  Target,
  Trophy,
  TrendingUp,
  Users,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Top performers in the South African startup ecosystem",
}

// Sample data for the leaderboard
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
    badgeIcon: <Crown className="h-4 w-4 text-amber-500" />,
    level: 8,
    points: 1250,
    achievements: ["First Million", "Consistent Investor", "Diversity Champion"],
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
    badgeIcon: <Rocket className="h-4 w-4 text-blue-500" />,
    level: 6,
    points: 980,
    achievements: ["Quick Starter", "Tech Specialist"],
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
    badgeIcon: <Shield className="h-4 w-4 text-green-500" />,
    level: 5,
    points: 750,
    achievements: ["Steady Hand", "Risk Analyzer"],
    streak: 15,
  },
  {
    id: 4,
    name: "David Okafor",
    company: "Growth Capital",
    initials: "DO",
    investmentsCount: 4,
    investmentsAmount: 6200000,
    change: "+2",
    badge: "New Entry",
    badgeIcon: <Star className="h-4 w-4 text-purple-500" />,
    level: 4,
    points: 620,
    achievements: ["Fresh Perspective"],
    streak: 4,
  },
  {
    id: 5,
    name: "Thabo Molefe",
    company: "Savannah Ventures",
    initials: "TM",
    investmentsCount: 7,
    investmentsAmount: 8900000,
    change: "0",
    badge: "Veteran",
    badgeIcon: <Trophy className="h-4 w-4 text-orange-500" />,
    level: 7,
    points: 890,
    achievements: ["Long-term Vision", "Mentor", "Community Builder"],
    streak: 20,
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
    badgeIcon: <Trophy className="h-4 w-4 text-amber-500" />,
    level: 7,
    points: 850,
    achievements: ["Funding Milestone", "Rapid Growth", "Eco Impact"],
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
    badgeIcon: <Star className="h-4 w-4 text-blue-500" />,
    level: 9,
    points: 1200,
    achievements: ["Series A Success", "Innovation Award"],
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
    badgeIcon: <Fire className="h-4 w-4 text-red-500" />,
    level: 3,
    points: 320,
    achievements: ["Viral Product"],
    streak: 3,
  },
  {
    id: 4,
    name: "FarmTech",
    industry: "AgriTech",
    initials: "FT",
    raisedAmount: 2100000,
    investors: 7,
    change: "+5",
    badge: "Fast Riser",
    badgeIcon: <Rocket className="h-4 w-4 text-green-500" />,
    level: 5,
    points: 520,
    achievements: ["Growth Champion", "Rural Impact"],
    streak: 7,
  },
  {
    id: 5,
    name: "EduLearn",
    industry: "EdTech",
    initials: "EL",
    raisedAmount: 1800000,
    investors: 6,
    change: "+2",
    badge: "Promising",
    badgeIcon: <Target className="h-4 w-4 text-purple-500" />,
    level: 4,
    points: 480,
    achievements: ["User Growth"],
    streak: 5,
  },
]

const topFounders = [
  {
    id: 1,
    name: "Thabo Nkosi",
    company: "EcoSolar Solutions",
    initials: "TN",
    achievements: 8,
    connections: 245,
    change: "+5",
    badge: "Visionary",
    badgeIcon: <Crown className="h-4 w-4 text-amber-500" />,
    level: 9,
    points: 1450,
    achievementsList: ["Thought Leader", "Pitch Master", "Community Builder"],
    streak: 14,
  },
  {
    id: 2,
    name: "Lerato Molefe",
    company: "HealthTech Africa",
    initials: "LM",
    achievements: 6,
    connections: 189,
    change: "+12",
    badge: "Innovator",
    badgeIcon: <Rocket className="h-4 w-4 text-blue-500" />,
    level: 7,
    points: 1280,
    achievementsList: ["Patent Holder", "Research Pioneer"],
    streak: 9,
  },
  {
    id: 3,
    name: "Sipho Dlamini",
    company: "PayQuick",
    initials: "SD",
    achievements: 5,
    connections: 156,
    change: "+3",
    badge: "Disruptor",
    badgeIcon: <Fire className="h-4 w-4 text-red-500" />,
    level: 6,
    points: 980,
    achievementsList: ["Market Challenger", "Fintech Innovator"],
    streak: 7,
  },
  {
    id: 4,
    name: "Nomsa Khumalo",
    company: "FarmTech",
    initials: "NK",
    achievements: 7,
    connections: 178,
    change: "+8",
    badge: "Trailblazer",
    badgeIcon: <Target className="h-4 w-4 text-green-500" />,
    level: 8,
    points: 1120,
    achievementsList: ["Rural Impact", "Sustainability Champion", "Tech Adoption"],
    streak: 11,
  },
  {
    id: 5,
    name: "Kwame Osei",
    company: "EduLearn",
    initials: "KO",
    achievements: 4,
    connections: 132,
    change: "+15",
    badge: "Rising Star",
    badgeIcon: <Star className="h-4 w-4 text-purple-500" />,
    level: 5,
    points: 850,
    achievementsList: ["Fast Networker"],
    streak: 6,
  },
]

const topFirms = [
  {
    id: 1,
    name: "Savannah Ventures",
    industry: "Venture Capital",
    initials: "SV",
    investmentsCount: 24,
    investmentsAmount: 45000000,
    change: "+2",
    badge: "Top VC",
    badgeIcon: <Crown className="h-4 w-4 text-amber-500" />,
    level: 10,
    points: 2450,
    achievements: ["Ecosystem Builder", "Series A Leader", "Mentor Network"],
    streak: 18,
  },
  {
    id: 2,
    name: "Horizon Capital",
    industry: "Private Equity",
    initials: "HC",
    investmentsCount: 18,
    investmentsAmount: 38000000,
    change: "+1",
    badge: "Growth Expert",
    badgeIcon: <TrendingUp className="h-4 w-4 text-blue-500" />,
    level: 9,
    points: 2100,
    achievements: ["Scale-up Specialist", "Cross-Border Investments"],
    streak: 14,
  },
  {
    id: 3,
    name: "Innovation Fund",
    industry: "Early Stage VC",
    initials: "IF",
    investmentsCount: 32,
    investmentsAmount: 28000000,
    change: "+4",
    badge: "Seed Champion",
    badgeIcon: <Rocket className="h-4 w-4 text-green-500" />,
    level: 8,
    points: 1850,
    achievements: ["First Check Leader", "Founder Favorite"],
    streak: 22,
  },
  {
    id: 4,
    name: "Tech Ventures",
    industry: "Tech-focused VC",
    initials: "TV",
    investmentsCount: 15,
    investmentsAmount: 22000000,
    change: "-1",
    badge: "Tech Specialist",
    badgeIcon: <Shield className="h-4 w-4 text-purple-500" />,
    level: 7,
    points: 1650,
    achievements: ["Deep Tech Investor", "AI Portfolio"],
    streak: 9,
  },
  {
    id: 5,
    name: "Growth Capital",
    industry: "Growth Equity",
    initials: "GC",
    investmentsCount: 12,
    investmentsAmount: 35000000,
    change: "+3",
    badge: "Scale Master",
    badgeIcon: <Target className="h-4 w-4 text-orange-500" />,
    level: 8,
    points: 1800,
    achievements: ["Series B+ Leader", "International Expansion"],
    streak: 11,
  },
]

// Weekly challenges for gamification
const weeklyMissions = [
  {
    id: 1,
    title: "Network Builder",
    description: "Connect with 5 new startups this week",
    reward: "50 points + 'Connector' badge",
    progress: 60,
    icon: <Users className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 2,
    title: "Knowledge Seeker",
    description: "Read 3 industry reports and share insights",
    reward: "30 points + 'Analyst' badge",
    progress: 33,
    icon: <Award className="h-5 w-5 text-amber-500" />,
  },
  {
    id: 3,
    title: "Community Contributor",
    description: "Comment on 10 discussion threads",
    reward: "25 points + 'Engaged' badge",
    progress: 80,
    icon: <Gift className="h-5 w-5 text-green-500" />,
  },
]

export default function LeaderboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
          <p className="text-muted-foreground">Compete, achieve, and rise through the ranks</p>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Search />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-5 space-y-4">
          <Tabs defaultValue="investors" className="space-y-4">
            <TabsList>
              <TabsTrigger value="investors">
                <Users className="mr-2 h-4 w-4" />
                Top Investors
              </TabsTrigger>
              <TabsTrigger value="startups">
                <TrendingUp className="mr-2 h-4 w-4" />
                Top Startups
              </TabsTrigger>
              <TabsTrigger value="founders">
                <Award className="mr-2 h-4 w-4" />
                Top Founders
              </TabsTrigger>
              <TabsTrigger value="firms">
                <Building2 className="mr-2 h-4 w-4" />
                Top Firms
              </TabsTrigger>
            </TabsList>

            <TabsContent value="investors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Investors</CardTitle>
                  <CardDescription>Ranked by investment amount and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {topInvestors.map((investor, index) => (
                      <div
                        key={investor.id}
                        className="flex items-center gap-4 py-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                          {index + 1}
                        </div>
                        <div className="relative">
                          <Avatar className="h-12 w-12 border">
                            <AvatarFallback>{investor.initials}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                              {investor.level}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-lg">{investor.name}</p>
                            <Badge className="flex items-center gap-1" variant="outline">
                              {investor.badgeIcon}
                              {investor.badge}
                            </Badge>
                            {investor.streak >= 10 && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Fire className="h-3 w-3 text-red-500" />
                                {investor.streak} day streak
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{investor.company}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {investor.achievements.map((achievement, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg">
                            R{(investor.investmentsAmount / 1000000).toFixed(1)}M
                          </div>
                          <div className="flex items-center justify-end gap-2 text-sm">
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
                            <span className="text-muted-foreground">{investor.investmentsCount} investments</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{investor.points} points</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="startups" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Startups</CardTitle>
                  <CardDescription>Ranked by funding raised and growth metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {topStartups.map((startup, index) => (
                      <div
                        key={startup.id}
                        className="flex items-center gap-4 py-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                          {index + 1}
                        </div>
                        <div className="relative">
                          <Avatar className="h-12 w-12 border">
                            <AvatarFallback>{startup.initials}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                              {startup.level}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-lg">{startup.name}</p>
                            <Badge className="flex items-center gap-1" variant="outline">
                              {startup.badgeIcon}
                              {startup.badge}
                            </Badge>
                            {startup.streak >= 7 && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Fire className="h-3 w-3 text-red-500" />
                                {startup.streak} week streak
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{startup.industry}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {startup.achievements.map((achievement, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg">R{(startup.raisedAmount / 1000000).toFixed(1)}M</div>
                          <div className="flex items-center justify-end gap-2 text-sm">
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
                            <span className="text-muted-foreground">{startup.investors} investors</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{startup.points} points</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="founders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Founders</CardTitle>
                  <CardDescription>Ranked by achievements and network growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {topFounders.map((founder, index) => (
                      <div
                        key={founder.id}
                        className="flex items-center gap-4 py-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                          {index + 1}
                        </div>
                        <div className="relative">
                          <Avatar className="h-12 w-12 border">
                            <AvatarFallback>{founder.initials}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                              {founder.level}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-lg">{founder.name}</p>
                            <Badge className="flex items-center gap-1" variant="outline">
                              {founder.badgeIcon}
                              {founder.badge}
                            </Badge>
                            {founder.streak >= 7 && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Fire className="h-3 w-3 text-red-500" />
                                {founder.streak} day streak
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{founder.company}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {founder.achievementsList.map((achievement, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg">{founder.connections} connections</div>
                          <div className="flex items-center justify-end gap-2 text-sm">
                            <span
                              className={
                                founder.change.startsWith("+")
                                  ? "text-green-500"
                                  : founder.change.startsWith("-")
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                              }
                            >
                              {founder.change}
                            </span>
                            <span className="text-muted-foreground">{founder.achievements} achievements</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{founder.points} points</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="firms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Firms</CardTitle>
                  <CardDescription>Ranked by investment portfolio and ecosystem impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {topFirms.map((firm, index) => (
                      <div key={firm.id} className="flex items-center gap-4 py-4 hover:bg-muted/50 transition-colors">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                          {index + 1}
                        </div>
                        <div className="relative">
                          <Avatar className="h-12 w-12 border">
                            <AvatarFallback>{firm.initials}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                              {firm.level}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-lg">{firm.name}</p>
                            <Badge className="flex items-center gap-1" variant="outline">
                              {firm.badgeIcon}
                              {firm.badge}
                            </Badge>
                            {firm.streak >= 10 && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Fire className="h-3 w-3 text-red-500" />
                                {firm.streak} week streak
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{firm.industry}</p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {firm.achievements.map((achievement, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg">R{(firm.investmentsAmount / 1000000).toFixed(1)}M</div>
                          <div className="flex items-center justify-end gap-2 text-sm">
                            <span
                              className={
                                firm.change.startsWith("+")
                                  ? "text-green-500"
                                  : firm.change.startsWith("-")
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                              }
                            >
                              {firm.change}
                            </span>
                            <span className="text-muted-foreground">{firm.investmentsCount} investments</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{firm.points} points</div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Your Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    24
                  </div>
                  <Avatar className="h-12 w-12 border">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Your Position</p>
                    <p className="text-sm text-green-500">+3 this week</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level 5</span>
                    <span>Level 6</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">750/1000 XP</p>
                </div>
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Badges</span>
                    <Badge variant="outline" className="text-xs">
                      12 Total
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Trophy className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Star className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Shield className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Target className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      +8
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Your Profile
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Weekly Missions
              </CardTitle>
              <CardDescription>Complete missions to earn points and badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyMissions.map((mission) => (
                  <div key={mission.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1.5">{mission.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{mission.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {mission.progress}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{mission.description}</p>
                        <Progress value={mission.progress} className="h-2 mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">Reward: {mission.reward}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Missions
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Achievement Showcase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Trophy className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">First Investment</p>
                      <p className="text-xs text-muted-foreground">Completed your first investment</p>
                    </div>
                    <Badge className="ml-auto">+50 XP</Badge>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">Network Builder</p>
                      <p className="text-xs text-muted-foreground">Connected with 100+ professionals</p>
                    </div>
                    <Badge className="ml-auto">+75 XP</Badge>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Fire className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">7-Day Streak</p>
                      <p className="text-xs text-muted-foreground">Active for 7 consecutive days</p>
                    </div>
                    <Badge className="ml-auto">+30 XP</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Achievements
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

