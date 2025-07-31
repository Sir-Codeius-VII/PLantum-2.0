"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ArrowUpRight,
  Users,
  Zap,
  Calendar,
  TrendingUp,
  Heart,
  MessageSquare,
  Share2,
  MapPin,
  Clock,
  Ticket,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Mock data for platform metrics
const platformMetrics = [
  {
    id: 1,
    title: "Total Funding",
    value: "R 789M",
    change: "+30%",
    trend: "up",
    icon: <ArrowUpRight className="h-5 w-5 text-primary" />,
    description: "Total capital raised through the platform",
  },
  {
    id: 2,
    title: "Startups",
    value: "1,234",
    change: "+20%",
    trend: "up",
    icon: <Zap className="h-5 w-5 text-indigo-500" />,
    description: "Active startups on the platform",
  },
  {
    id: 3,
    title: "Investors",
    value: "567",
    change: "+15%",
    trend: "up",
    icon: <Users className="h-5 w-5 text-emerald-500" />,
    description: "Active investors seeking opportunities",
  },
  {
    id: 4,
    title: "Live Funding Rounds",
    value: "78",
    change: "+25%",
    trend: "up",
    icon: <Calendar className="h-5 w-5 text-amber-500" />,
    description: "Funding rounds currently active",
  },
]

// Mock data for social feed
const feedItems = [
  {
    id: 1,
    type: "funding",
    author: {
      name: "TechNova Solutions",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Startup"
    },
    content: "Excited to announce our R5M seed funding round! 🚀 We're now looking to expand our team and accelerate product development.",
    timestamp: "2 hours ago",
    stats: {
    likes: 124,
      comments: 32,
      shares: 18
    },
    funding: {
      amount: "R5M",
      round: "Seed",
      lead: "Savannah Ventures"
    }
  },
  {
    id: 2,
    type: "event",
    author: {
      name: "Startup Africa",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Organizer"
    },
    content: "Join us for the biggest startup networking event of the year! Connect with investors, founders, and industry leaders.",
    timestamp: "5 hours ago",
    stats: {
      likes: 89,
    comments: 15,
      shares: 7
    },
    event: {
      title: "Startup Africa Summit 2024",
      date: "March 15, 2024",
      time: "09:00 - 18:00",
      location: "Cape Town International Convention Centre",
      type: "Conference",
      tickets: {
        available: 150,
        price: "R1,500"
      }
    }
  },
  {
    id: 3,
    type: "milestone",
    author: {
      name: "HealthTech Africa",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Startup"
    },
    content: "We've just reached 10,000 active users on our platform! 🎉 Thank you to our amazing community for the support.",
    timestamp: "5 hours ago",
    stats: {
      likes: 89,
    comments: 15,
      shares: 7
    }
  },
  {
    id: 4,
    type: "event",
    author: {
      name: "Innovation Capital",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Investor"
    },
    content: "We're hosting our quarterly pitch day for early-stage startups. Selected companies will get the chance to pitch to our investment committee.",
    timestamp: "1 day ago",
    stats: {
      likes: 156,
      comments: 43,
      shares: 29
    },
    event: {
      title: "Innovation Capital Pitch Day",
      date: "March 20, 2024",
      time: "14:00 - 17:00",
      location: "Innovation Hub, Johannesburg",
      type: "Pitch Event",
      tickets: {
        available: 20,
        price: "Free"
      }
    }
  },
  {
    id: 5,
    type: "investor",
    author: {
      name: "Innovation Capital",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Investor"
    },
    content: "We're actively looking to invest in early-stage fintech startups in South Africa. Focus areas: payments, lending, and insurtech.",
    timestamp: "1 day ago",
    stats: {
      likes: 156,
      comments: 43,
      shares: 29
    }
  }
]

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

        return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background opacity-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0YzAgMi4yMS0xLjc5IDQtNC00cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-5" />
        <div className="max-w-screen-xl mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center flex items-center justify-center min-h-[50vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: [0.21, 0.45, 0.32, 0.9]
              }}
              className="w-full relative z-30"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 text-foreground relative z-40">
                <motion.span 
                  className="bg-clip-text text-transparent bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-200 font-['Helvetica',sans-serif] font-thin tracking-widest relative z-50"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.2,
                    ease: [0.21, 0.45, 0.32, 0.9]
                  }}
                >
                  pLantum
                </motion.span>
              </h1>
            </motion.div>
          </div>
        </div>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      </section>

      {/* Platform Stats */}
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mt-4">
          {isLoading ? (
              // Show skeletons while loading
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                      <CardHeader className="pb-2">
                          <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                      </CardContent>
                    </Card>
              ))
          ) : (
            // Show actual metrics
            platformMetrics.map((metric) => (
              <Card key={metric.id}>
                <CardHeader className="pb-1">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                      </div>
                    </CardHeader>
                <CardContent className="pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center gap-1 text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-sm">{metric.change}</span>
                        </div>
                      </div>
                  <span className="text-xs text-muted-foreground">{metric.description}</span>
                    </CardContent>
                  </Card>
              ))
            )}
          </div>
        </div>

      {/* Social Feed */}
      <div className="max-w-screen-xl mx-auto px-4 mt-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
          <div className="space-y-6">
            {isLoading ? (
              // Show skeletons while loading
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-start gap-4 pb-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="grid gap-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                </div>
              </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
                ))
            ) : (
              // Show actual feed items
              feedItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-row items-start gap-4 pb-2">
                    <Avatar>
                      <AvatarImage src={item.author.avatar} />
                      <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                          </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.author.name}</span>
                        <Badge variant="outline">{item.author.role}</Badge>
                          </div>
                      <div className="text-sm text-muted-foreground">{item.timestamp}</div>
                        </div>
              </CardHeader>
                  <CardContent>
                    <p className="mb-4">{item.content}</p>
                    {item.type === "funding" && item.funding && (
                      <div className="rounded-lg border bg-muted/40 p-4 mb-4">
                        <div className="font-semibold">Funding Update</div>
                        <p className="text-sm text-muted-foreground">
                          {item.funding.round} round: {item.funding.amount}
                          <br />
                          Lead investor: {item.funding.lead}
                        </p>
                          </div>
                    )}
                    {item.type === "event" && item.event && (
                      <div className="rounded-lg border bg-muted/40 p-4 mb-4">
                        <div className="font-semibold mb-2">{item.event.title}</div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{item.event.date} at {item.event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{item.event.location}</span>
                        </div>
              <div className="flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            <span>{item.event.tickets.available} tickets available - {item.event.tickets.price}</span>
              </div>
                          <Button className="w-full mt-2" size="sm">
                            Register Now
                </Button>
              </div>
            </div>
          )}
                    <div className="flex items-center gap-4 border-t pt-4">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Heart className="h-4 w-4" />
                        {item.stats.likes}
          </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {item.stats.comments}
          </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        {item.stats.shares}
          </Button>
        </div>
                  </CardContent>
                </Card>
              ))
            )}
        </div>
        </div>
      </div>
    </div>
  )
}