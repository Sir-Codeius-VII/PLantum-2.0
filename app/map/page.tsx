"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertCircle,
  BarChart2,
  Bell,
  Bookmark,
  Clock,
  FlameIcon as Fire,
  LineChart,
  Search,
  Star,
  Trophy,
  TrendingUp,
  User,
  X,
  Play,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

// Enhanced mock data with more engaging metrics
const ecosystemEntities = [
  // Startups (enhanced with engagement metrics)
  {
    id: "s1",
    type: "startup",
    name: "EcoSolar Solutions",
    industry: "CleanTech",
    description: "Renewable energy solutions for South African homes and businesses",
    location: "Cape Town",
    funding: "R5.2M",
    fundingStage: "Seed",
    foundedYear: 2021,
    employeeCount: "11-50",
    trending: true,
    growthRate: "+215%",
    completeness: 92,
    views: 1240,
    connections: 156,
    followers: 432,
    lastActive: "3h ago",
    verified: true,
    topPerformer: true,
    avatar: "ES",
    activeFundingRound: true,
    pitchDeck: "/pitch-decks/ecosolar-pitch.pdf",
    seeking: "R10M Series A",
  },
  {
    id: "s2",
    type: "startup",
    name: "HealthTech Africa",
    industry: "HealthTech",
    description: "Healthcare platform connecting patients with providers across South Africa",
    location: "Johannesburg",
    funding: "R12M",
    fundingStage: "Series A",
    foundedYear: 2019,
    employeeCount: "51-100",
    trending: true,
    growthRate: "+180%",
    completeness: 85,
    views: 980,
    connections: 203,
    followers: 587,
    lastActive: "1h ago",
    verified: true,
    topPerformer: false,
    avatar: "HT",
    activeFundingRound: true,
    pitchDeck: "/pitch-decks/healthtech-pitch.pdf",
    seeking: "R25M Series B",
  },
  {
    id: "s3",
    type: "startup",
    name: "PayQuick",
    industry: "Fintech",
    description: "Mobile payment solutions for small businesses and informal traders",
    location: "Durban",
    funding: "R800K",
    fundingStage: "Pre-seed",
    foundedYear: 2022,
    employeeCount: "1-10",
    trending: false,
    growthRate: "+120%",
    completeness: 68,
    views: 750,
    connections: 89,
    followers: 245,
    lastActive: "6h ago",
    verified: false,
    hotOpportunity: true,
    avatar: "PQ",
    activeFundingRound: true,
    pitchDeck: "/pitch-decks/payquick-pitch.pdf",
    seeking: "R3M Seed",
  },
  {
    id: "s4",
    type: "startup",
    name: "FarmTech",
    industry: "AgriTech",
    description: "Smart farming solutions using IoT and data analytics for improved crop yields",
    location: "Stellenbosch",
    funding: "R3.5M",
    fundingStage: "Seed",
    foundedYear: 2020,
    employeeCount: "11-50",
    trending: false,
    growthRate: "+85%",
    completeness: 78,
    views: 625,
    connections: 112,
    followers: 328,
    lastActive: "2d ago",
    verified: true,
    topPerformer: false,
    avatar: "FT",
    activeFundingRound: false,
  },

  // Investors (enhanced with engagement metrics)
  {
    id: "i1",
    type: "investor",
    name: "Savannah Ventures",
    focus: "Early-stage VC",
    description: "Seed and Series A investments in technology startups across Southern Africa",
    location: "Cape Town",
    portfolioSize: 24,
    avgInvestment: "R2.5M - R8M",
    totalInvested: "R120M+",
    topIndustries: ["Fintech", "HealthTech", "CleanTech"],
    trending: true,
    activeDeals: 3,
    completeness: 95,
    views: 1456,
    connections: 278,
    followers: 821,
    lastActive: "2h ago",
    verified: true,
    topPerformer: true,
    avatar: "SV",
  },
  {
    id: "i2",
    type: "investor",
    name: "Tech Growth Capital",
    focus: "Series A/B",
    description: "Growth stage investments in established technology companies with proven traction",
    location: "Johannesburg",
    portfolioSize: 16,
    avgInvestment: "R5M - R20M",
    totalInvested: "R250M+",
    topIndustries: ["E-commerce", "Fintech", "SaaS"],
    trending: false,
    activeDeals: 2,
    completeness: 88,
    views: 1020,
    connections: 195,
    followers: 645,
    lastActive: "5h ago",
    verified: true,
    topPerformer: false,
    avatar: "TG",
  },
  {
    id: "i3",
    type: "investor",
    name: "Innovation Fund",
    focus: "Government-backed",
    description: "Public-private partnership fund supporting innovative solutions to national challenges",
    location: "Pretoria",
    portfolioSize: 32,
    avgInvestment: "R1M - R10M",
    totalInvested: "R180M+",
    topIndustries: ["GovTech", "CleanTech", "EdTech"],
    trending: true,
    activeDeals: 5,
    completeness: 82,
    views: 876,
    connections: 154,
    followers: 520,
    lastActive: "1d ago",
    verified: true,
    newDeals: true,
    avatar: "IF",
  },

  // Events (enhanced with engagement metrics)
  {
    id: "e1",
    type: "event",
    name: "Cape Town Startup Week",
    date: "April 15-18, 2024",
    description: "The largest startup event in South Africa, featuring pitches, workshops, and networking",
    location: "Cape Town",
    attendees: 1500,
    speakers: 45,
    partners: 12,
    categories: ["Networking", "Pitching", "Workshops"],
    trending: true,
    daysLeft: 12,
    completeness: 100,
    views: 2340,
    interested: 876,
    rsvps: 423,
    lastUpdated: "1d ago",
    verified: true,
    featured: true,
    avatar: "CT",
  },
  {
    id: "e2",
    type: "event",
    name: "Fintech Founders Meetup",
    date: "April 22, 2024",
    description: "Monthly virtual meetup for fintech founders to share challenges and solutions",
    location: "Virtual",
    attendees: 250,
    speakers: 3,
    partners: 2,
    categories: ["Fintech", "Networking", "Virtual"],
    trending: false,
    daysLeft: 19,
    completeness: 95,
    views: 567,
    interested: 235,
    rsvps: 142,
    lastUpdated: "2d ago",
    verified: true,
    exclusive: true,
    avatar: "FF",
  },
  {
    id: "e3",
    type: "event",
    name: "Founder Retreat",
    date: "May 5-7, 2024",
    description: "Three-day retreat for founders to network, learn, and recharge with workshops and activities",
    location: "Stellenbosch",
    attendees: 75,
    speakers: 12,
    partners: 6,
    categories: ["Retreat", "Networking", "Workshops"],
    trending: true,
    daysLeft: 32,
    completeness: 92,
    views: 890,
    interested: 340,
    rsvps: 45,
    lastUpdated: "6h ago",
    verified: true,
    limitedSpots: true,
    avatar: "FR",
  },
  {
    id: "e4",
    type: "event",
    name: "Tech Innovation Summit",
    date: "June 10-12, 2024",
    description: "Technology showcase and talks featuring the latest innovations from across Africa",
    location: "Durban",
    attendees: 800,
    speakers: 25,
    partners: 15,
    categories: ["Innovation", "Showcase", "Conference"],
    trending: false,
    daysLeft: 68,
    completeness: 85,
    views: 765,
    interested: 420,
    rsvps: 215,
    lastUpdated: "3d ago",
    verified: true,
    earlyBird: true,
    avatar: "TI",
  },
]

// Cities for the filter
const cities = ["All Cities", "Cape Town", "Johannesburg", "Durban", "Pretoria", "Stellenbosch", "Virtual"]

// Industries for the filter
const industries = [
  "All Industries",
  "CleanTech",
  "HealthTech",
  "Fintech",
  "AgriTech",
  "EdTech",
  "E-commerce",
  "SaaS",
  "GovTech",
]

// Badges for entities with criteria
const getBadges = (entity) => {
  const badges = []

  if (entity.type === "startup") {
    if (entity.trending)
      badges.push({ label: "Trending", icon: <TrendingUp className="h-3 w-3" />, color: "bg-orange-500" })
    if (entity.topPerformer)
      badges.push({ label: "Top Performer", icon: <Trophy className="h-3 w-3" />, color: "bg-amber-500" })
    if (entity.hotOpportunity)
      badges.push({ label: "Hot Opportunity", icon: <Fire className="h-3 w-3" />, color: "bg-red-500" })
    if (entity.growthRate)
      badges.push({ label: entity.growthRate, icon: <LineChart className="h-3 w-3" />, color: "bg-emerald-500" })
    if (entity.activeFundingRound)
      badges.push({ label: "Active Funding", icon: <AlertCircle className="h-3 w-3" />, color: "bg-blue-500" })
  }

  if (entity.type === "investor") {
    if (entity.trending)
      badges.push({ label: "Active Investor", icon: <TrendingUp className="h-3 w-3" />, color: "bg-blue-500" })
    if (entity.topPerformer)
      badges.push({ label: "Top Investor", icon: <Trophy className="h-3 w-3" />, color: "bg-amber-500" })
    if (entity.newDeals)
      badges.push({ label: "New Deals", icon: <AlertCircle className="h-3 w-3" />, color: "bg-green-500" })
    if (entity.activeDeals)
      badges.push({
        label: `${entity.activeDeals} Active Deals`,
        icon: <BarChart2 className="h-3 w-3" />,
        color: "bg-violet-500",
      })
  }

  if (entity.type === "event") {
    if (entity.trending) badges.push({ label: "Hot Event", icon: <Fire className="h-3 w-3" />, color: "bg-red-500" })
    if (entity.featured) badges.push({ label: "Featured", icon: <Star className="h-3 w-3" />, color: "bg-amber-500" })
    if (entity.exclusive)
      badges.push({ label: "Exclusive", icon: <User className="h-3 w-3" />, color: "bg-indigo-500" })
    if (entity.limitedSpots)
      badges.push({ label: "Limited Spots", icon: <AlertCircle className="h-3 w-3" />, color: "bg-orange-500" })
    if (entity.earlyBird)
      badges.push({ label: "Early Bird Open", icon: <Clock className="h-3 w-3" />, color: "bg-emerald-500" })
    if (entity.daysLeft < 14)
      badges.push({
        label: `${entity.daysLeft}d left`,
        icon: <Clock className="h-3 w-3" />,
        color: entity.daysLeft < 7 ? "bg-red-500" : "bg-orange-500",
      })
  }

  if (entity.verified)
    badges.push({ label: "Verified", icon: <Badge className="h-3 w-3" />, color: "bg-blue-500", discreet: true })

  return badges
}

// Sort function for entities - boost trending and new items
const sortEntities = (a, b) => {
  // Boost trending entities
  if (a.trending && !b.trending) return -1
  if (!a.trending && b.trending) return 1

  // Boost top performers
  if ((a.topPerformer || a.featured) && !(b.topPerformer || b.featured)) return -1
  if (!(a.topPerformer || a.featured) && (b.topPerformer || b.featured)) return 1

  // Boost recently active
  if (a.lastActive?.includes("h") && b.lastActive?.includes("d")) return -1
  if (a.lastActive?.includes("d") && b.lastActive?.includes("h")) return 1

  return 0
}

export default function MapPage() {
  const [activeFilters, setActiveFilters] = useState({
    showStartups: true,
    showInvestors: true,
    showEvents: true,
    city: "All Cities",
    industry: "All Industries",
    searchQuery: "",
    sortBy: "trending",
    onlyVerified: false,
  })

  const [activeTab, setActiveTab] = useState("all")
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [feedItems, setFeedItems] = useState([])
  const [visibleBadge, setVisibleBadge] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationContent, setNotificationContent] = useState(null)
  const [showPitchDialog, setShowPitchDialog] = useState(false)
  const [selectedStartupForPitch, setSelectedStartupForPitch] = useState(null)
  const [showMakeOfferDialog, setShowMakeOfferDialog] = useState(false)

  // User interaction metrics (for gamification)
  const [userMetrics, setUserMetrics] = useState({
    profileViews: 0,
    connections: 0,
    bookmarks: [],
    recentSearches: [],
    interests: [],
  })

  // Initialize feed with random activity
  useEffect(() => {
    const generateFeed = () => {
      const activities = [
        { type: "funding", entity: ecosystemEntities.find((e) => e.id === "s1"), action: "raised", amount: "R1.2M" },
        {
          type: "connection",
          entities: [ecosystemEntities.find((e) => e.id === "i1"), ecosystemEntities.find((e) => e.id === "s2")],
        },
        { type: "event", entity: ecosystemEntities.find((e) => e.id === "e1"), action: "starting_soon" },
        { type: "milestone", entity: ecosystemEntities.find((e) => e.id === "s3"), milestone: "10,000 users" },
        {
          type: "investor",
          entity: ecosystemEntities.find((e) => e.id === "i2"),
          action: "looking_for",
          focus: "Fintech startups",
        },
      ]

      setFeedItems(activities)
    }

    generateFeed()

    // Show notification after a short delay
    const timer = setTimeout(() => {
      const randomEntity = ecosystemEntities[Math.floor(Math.random() * ecosystemEntities.length)]
      setNotificationContent({
        entity: randomEntity,
        message:
          randomEntity.type === "startup"
            ? "just updated their profile"
            : randomEntity.type === "investor"
              ? "is looking for new investments"
              : "registration is closing soon",
      })
      setShowNotification(true)
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  // Auto-dismiss notification
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showNotification])

  // Filter entities based on active filters
  const filteredEntities = ecosystemEntities
    .filter((entity) => {
      // Filter by type
      if (entity.type === "startup" && !activeFilters.showStartups) return false
      if (entity.type === "investor" && !activeFilters.showInvestors) return false
      if (entity.type === "event" && !activeFilters.showEvents) return false

      // Filter by city
      if (activeFilters.city !== "All Cities" && entity.location !== activeFilters.city) return false

      // Filter by industry (for startups)
      if (
        entity.type === "startup" &&
        activeFilters.industry !== "All Industries" &&
        entity.industry !== activeFilters.industry
      )
        return false

      // Filter by industry (for investors via their top industries)
      if (
        entity.type === "investor" &&
        activeFilters.industry !== "All Industries" &&
        !entity.topIndustries?.includes(activeFilters.industry)
      )
        return false

      // Filter by verification
      if (activeFilters.onlyVerified && !entity.verified) return false

      // Filter by search query
      if (
        activeFilters.searchQuery &&
        !entity.name.toLowerCase().includes(activeFilters.searchQuery.toLowerCase()) &&
        !entity.description.toLowerCase().includes(activeFilters.searchQuery.toLowerCase())
      )
        return false

      return true
    })
    .sort(sortEntities)

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value
    setActiveFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }))

    // Track search for personalization if it's significant
    if (query.length > 3 && e.key === "Enter") {
      setUserMetrics((prev) => ({
        ...prev,
        recentSearches: [query, ...prev.recentSearches.slice(0, 4)],
      }))
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      showStartups: true,
      showInvestors: true,
      showEvents: true,
      city: "All Cities",
      industry: "All Industries",
      searchQuery: "",
      sortBy: "trending",
      onlyVerified: false,
    })
  }

  // Track profile views (for gamification)
  const handleViewProfile = (entity) => {
    setSelectedEntity(entity)
    setUserMetrics((prev) => ({
      ...prev,
      profileViews: prev.profileViews + 1,
    }))
  }

  // Track bookmarks
  const handleBookmark = (entity, e) => {
    e.stopPropagation()
    setUserMetrics((prev) => {
      const isBookmarked = prev.bookmarks.some((b) => b.id === entity.id)
      return {
        ...prev,
        bookmarks: isBookmarked ? prev.bookmarks.filter((b) => b.id !== entity.id) : [...prev.bookmarks, entity],
      }
    })

    // Show feedback
    setNotificationContent({
      entity: entity,
      message: userMetrics.bookmarks.some((b) => b.id === entity.id)
        ? "removed from your bookmarks"
        : "added to your bookmarks",
    })
    setShowNotification(true)
  }

  // Handle view pitch
  const handleViewPitch = (startup, e) => {
    if (e) e.stopPropagation()
    setSelectedStartupForPitch(startup)
    setShowPitchDialog(true)
  }

  // Handle make offer
  const handleMakeOffer = (startup, e) => {
    if (e) e.stopPropagation()
    setSelectedStartupForPitch(startup)
    setShowMakeOfferDialog(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-6 px-4 md:px-6 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight" title="Ecosystem Map">
                Map
              </h1>
              <p className="text-muted-foreground">Discover the South African startup ecosystem</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ecosystem..."
                  aria-label="Search ecosystem"
                  className="pl-8 w-full min-w-[200px] md:w-[300px] rounded-full"
                  value={activeFilters.searchQuery}
                  onChange={handleSearch}
                  onKeyDown={handleSearch}
                />
                {activeFilters.searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={() => setActiveFilters((prev) => ({ ...prev, searchQuery: "" }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" className="rounded-full">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Your bookmarks ({userMetrics.bookmarks.length})</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" className="rounded-full relative">
                        <Bell className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 rounded-full bg-primary"></span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Notifications (3 new)</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Interactive Map Coming Soon Section */}
          <div className="rounded-lg border bg-muted p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <polygon points="12 2 2 22 12 18 22 22 12 2" />
              </svg>
              <h2 className="text-xl font-semibold">Interactive Map Coming Soon!</h2>
              <p className="text-muted-foreground">
                We're working hard to bring you an interactive map of the South African startup ecosystem.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  className="rounded-full"
                  onClick={() => {
                    // Show a notification
                    const notificationElement = document.createElement("div")
                    notificationElement.className =
                      "fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-primary/20 max-w-sm"
                    notificationElement.innerHTML = `
                      <div class="flex items-start gap-3">
                        <div class="rounded-full bg-primary/10 p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-primary">
                            <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3Z"></path>
                            <path d="M8 17v1a4 4 0 0 0 8 0v-1"></path>
                          </svg>
                        </div>
                        <div class="flex-1">
                          <h4 class="font-medium text-sm">Notification Saved!</h4>
                          <p class="text-xs text-muted-foreground">We'll notify you when the interactive map launches.</p>
                        </div>
                        <button class="h-6 w-6 rounded-full flex items-center justify-center hover:bg-muted/50" onclick="this.parentElement.remove()">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      </div>
                    `
                    document.body.appendChild(notificationElement)

                    // Remove after 5 seconds
                    setTimeout(() => {
                      notificationElement.remove()
                    }, 5000)
                  }}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Get notified when it launches
                </Button>

                <Button variant="outline" className="rounded-full">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 22V12h6v10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Escrow Wallet Coming Soon
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {ecosystemEntities
                  .filter((entity) => entity.type === "startup" && entity.activeFundingRound)
                  .slice(0, 3)
                  .map((startup) => (
                    <div
                      key={startup.id}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-medium">
                          {startup.avatar}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{startup.name}</h3>
                          <p className="text-xs text-muted-foreground">{startup.industry}</p>
                        </div>
                      </div>
                      <div className="text-xs mb-3">
                        <span className="font-medium">Seeking: </span>
                        {startup.seeking}
                        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                          {startup.fundingStage}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button size="sm" variant="outline" onClick={(e) => handleViewPitch(startup, e)}>
                          <Play className="mr-2 h-4 w-4" />
                          View Pitch
                        </Button>
                        <Button size="sm" onClick={(e) => handleMakeOffer(startup, e)}>
                          Make Offer
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* View Pitch Dialog */}
      <Dialog open={showPitchDialog} onOpenChange={setShowPitchDialog}>
        <DialogContent className="max-w-4xl">
          {selectedStartupForPitch && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center font-medium">
                    {selectedStartupForPitch.avatar}
                  </div>
                  {selectedStartupForPitch.name} Pitch Deck
                </DialogTitle>
                <DialogDescription>{selectedStartupForPitch.description}</DialogDescription>
              </DialogHeader>

              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Pitch deck preview would appear here</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Funding Details</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Funding:</span>
                        <span>{selectedStartupForPitch.funding}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seeking:</span>
                        <span className="font-medium">{selectedStartupForPitch.seeking}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Stage:</span>
                        <span>{selectedStartupForPitch.fundingStage}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Company Info</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Founded:</span>
                        <span>{selectedStartupForPitch.foundedYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Team Size:</span>
                        <span>{selectedStartupForPitch.employeeCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{selectedStartupForPitch.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPitchDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={(e) => {
                    setShowPitchDialog(false)
                    handleMakeOffer(selectedStartupForPitch, e)
                  }}
                >
                  Make an Offer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Make Offer Dialog */}
      <Dialog open={showMakeOfferDialog} onOpenChange={setShowMakeOfferDialog}>
        <DialogContent>
          {selectedStartupForPitch && (
            <>
              <DialogHeader>
                <DialogTitle>Make an Offer to {selectedStartupForPitch.name}</DialogTitle>
                <DialogDescription>Submit your investment offer directly to the startup team.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="amount" className="text-right text-sm">
                    Amount (R)
                  </label>
                  <Input id="amount" placeholder="e.g. 500000" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="equity" className="text-right text-sm">
                    Equity (%)
                  </label>
                  <Input id="equity" placeholder="e.g. 10" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="message" className="text-right text-sm">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Introduce yourself and explain your offer"
                    className="col-span-3 min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowMakeOfferDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowMakeOfferDialog(false)
                    // Show success notification
                    const notificationElement = document.createElement("div")
                    notificationElement.className =
                      "fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-primary/20 max-w-sm"
                    notificationElement.innerHTML = `
                    <div class="flex items-start gap-3">
                      <div class="rounded-full bg-green-500/10 p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-green-500">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <div class="flex-1">
                        <h4 class="font-medium text-sm">Offer Submitted!</h4>
                        <p class="text-xs text-muted-foreground">Your offer has been sent to ${selectedStartupForPitch.name}.</p>
                      </div>
                      <button class="h-6 w-6 rounded-full flex items-center justify-center hover:bg-muted/50" onclick="this.parentElement.remove()">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    </div>
                  `
                    document.body.appendChild(notificationElement)
                    setTimeout(() => {
                      notificationElement.remove()
                    }, 5000)
                  }}
                >
                  Submit Offer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

