"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/Header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import NextLink from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bookmark,
  Building2,
  Check,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  Globe,
  Info,
  LineChart,
  MapPin,
  MessageCircle,
  PieChart,
  Plus,
  Search,
  Share2,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  Users,
  X,
  Trophy,
  MailIcon,
  PhoneIcon,
} from "lucide-react"
import { Zap } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

// Enhanced mock data for startups with rich metadata
const startups = [
  {
    id: "s1",
    name: "EcoSolar Solutions",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Renewable energy solutions for South Africa",
    description:
      "EcoSolar Solutions is a renewable energy startup based in Cape Town, South Africa. We design, manufacture, and install affordable solar energy solutions for residential and commercial properties across Southern Africa. Our mission is to accelerate South Africa's transition to clean energy by making solar power accessible to everyone.",
    industry: "CleanTech",
    location: "Cape Town",
    foundedYear: 2021,
    stage: "Seed",
    employeeCount: "11-50",
    funding: {
      total: "R5.2M",
      lastRound: "R3.5M Seed",
      lastRoundDate: "Jan 2023",
      seeking: "R10M Series A",
      valuation: "R28.3M",
      investors: ["Green Ventures", "SA Innovation Fund", "Cape Angels"],
    },
    traction: {
      revenue: "R4.2M (2023)",
      growth: "+215% YoY",
      customers: "350+",
      installations: "420 kW",
    },
    team: [
      { name: "Thabo Nkosi", role: "Co-founder & CEO", image: "/placeholder-user.jpg" },
      { name: "Lerato Molefe", role: "Co-founder & CTO", image: "/placeholder-user.jpg" },
      { name: "Sarah van der Merwe", role: "CFO", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 1240,
      followers: 432,
      connections: 156,
      likes: 89,
      shares: 42,
    },
    engagement: {
      completeness: 92,
      lastActive: "3h ago",
      trending: true,
      verified: true,
      featured: true,
      topPerformer: true,
      growthRate: "+215%",
      badges: ["Top Performer", "Eco Impact", "Rapid Growth"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      video: "https://example.com/video",
    },
    contact: {
      email: "info@ecosolar.example.com",
      phone: "+27 21 555 0123",
      website: "https://ecosolar.example.com",
      social: {
        linkedin: "https://linkedin.com/company/ecosolar",
        twitter: "https://twitter.com/ecosolar",
        facebook: "https://facebook.com/ecosolar",
      },
    },
  },
  {
    id: "s2",
    name: "HealthTech Africa",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "AI-powered healthcare diagnostics",
    description:
      "HealthTech Africa is revolutionizing healthcare access through mobile technology. Our AI-powered diagnostic platform connects patients with healthcare providers across South Africa, making quality healthcare accessible to underserved communities. We're building the future of healthcare delivery in Africa.",
    industry: "HealthTech",
    location: "Johannesburg",
    foundedYear: 2019,
    stage: "Series A",
    employeeCount: "51-100",
    funding: {
      total: "R12M",
      lastRound: "R8M Series A",
      lastRoundDate: "Nov 2022",
      seeking: "R25M Series B",
      valuation: "R146M",
      investors: ["Health Innovations", "Tech Growth Capital", "African Venture Partners"],
    },
    traction: {
      revenue: "R8.7M (2023)",
      growth: "+180% YoY",
      customers: "12,000+",
      partnerships: "25 hospitals",
    },
    team: [
      { name: "Dr. Nomsa Khumalo", role: "Founder & CEO", image: "/placeholder-user.jpg" },
      { name: "James Okafor", role: "CTO", image: "/placeholder-user.jpg" },
      { name: "Priya Patel", role: "COO", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 980,
      followers: 587,
      connections: 203,
      likes: 124,
      shares: 76,
    },
    engagement: {
      completeness: 85,
      lastActive: "1h ago",
      trending: true,
      verified: true,
      featured: false,
      topPerformer: false,
      growthRate: "+180%",
      badges: ["AI Innovation", "Healthcare Impact", "Fast Growth"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      video: "https://example.com/video",
    },
    contact: {
      email: "info@healthtech.example.com",
      phone: "+27 11 555 0123",
      website: "https://healthtech.example.com",
      social: {
        linkedin: "https://linkedin.com/company/healthtech",
        twitter: "https://twitter.com/healthtech",
        facebook: "https://facebook.com/healthtech",
      },
    },
  },
  {
    id: "s3",
    name: "PayQuick",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Mobile payment solutions for small businesses",
    description:
      "PayQuick is a fintech startup providing mobile payment solutions for small businesses and informal traders in South Africa. Our platform enables merchants to accept digital payments without expensive hardware, helping them grow their businesses and participate in the digital economy.",
    industry: "Fintech",
    location: "Durban",
    foundedYear: 2022,
    stage: "Pre-seed",
    employeeCount: "1-10",
    funding: {
      total: "R800K",
      lastRound: "R800K Pre-seed",
      lastRoundDate: "Aug 2023",
      seeking: "R3M Seed",
      valuation: "R9.1M",
      investors: ["Fintech Ventures", "Angel Investors"],
    },
    traction: {
      revenue: "R450K (2023)",
      growth: "+120% QoQ",
      merchants: "850+",
      transactions: "R2.5M monthly",
    },
    team: [
      { name: "Sipho Dlamini", role: "Founder & CEO", image: "/placeholder-user.jpg" },
      { name: "Fatima Ahmed", role: "CTO", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 750,
      followers: 245,
      connections: 89,
      likes: 56,
      shares: 23,
    },
    engagement: {
      completeness: 68,
      lastActive: "6h ago",
      trending: false,
      verified: false,
      featured: false,
      topPerformer: false,
      growthRate: "+120%",
      badges: ["Rising Star", "Financial Inclusion"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    },
    contact: {
      email: "info@payquick.example.com",
      phone: "+27 31 555 0123",
      website: "https://payquick.example.com",
      social: {
        linkedin: "https://linkedin.com/company/payquick",
        twitter: "https://twitter.com/payquick",
      },
    },
  },
  {
    id: "s4",
    name: "FarmTech",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Smart farming solutions for improved crop yields",
    description:
      "FarmTech develops smart farming solutions using IoT and data analytics to help South African farmers improve crop yields and reduce resource usage. Our technology monitors soil conditions, weather patterns, and crop health in real-time, providing actionable insights to optimize farming operations.",
    industry: "AgriTech",
    location: "Stellenbosch",
    foundedYear: 2020,
    stage: "Seed",
    employeeCount: "11-50",
    funding: {
      total: "R3.5M",
      lastRound: "R2.2M Seed",
      lastRoundDate: "Mar 2023",
      seeking: "R8M Series A",
      valuation: "R18.5M",
      investors: ["AgriVentures", "Innovation Fund", "Stellenbosch Angels"],
    },
    traction: {
      revenue: "R2.8M (2023)",
      growth: "+85% YoY",
      customers: "120+ farms",
      hectares: "15,000+ monitored",
    },
    team: [
      { name: "Nomsa Khumalo", role: "Founder & CEO", image: "/placeholder-user.jpg" },
      { name: "Willem van der Merwe", role: "CTO", image: "/placeholder-user.jpg" },
      { name: "John Moyo", role: "Head of Data Science", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 625,
      followers: 328,
      connections: 112,
      likes: 78,
      shares: 34,
    },
    engagement: {
      completeness: 78,
      lastActive: "2d ago",
      trending: false,
      verified: true,
      featured: false,
      topPerformer: false,
      growthRate: "+85%",
      badges: ["Rural Impact", "Sustainability", "Tech Adoption"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
    },
    contact: {
      email: "info@farmtech.example.com",
      phone: "+27 21 555 0456",
      website: "https://farmtech.example.com",
      social: {
        linkedin: "https://linkedin.com/company/farmtech",
        twitter: "https://twitter.com/farmtech",
        facebook: "https://facebook.com/farmtech",
      },
    },
  },
  {
    id: "s5",
    name: "EduLearn",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Accessible education for all South Africans",
    description:
      "EduLearn is an EdTech startup making quality education accessible to all South Africans through an innovative mobile learning platform. We offer curriculum-aligned content, interactive lessons, and personalized learning paths that work even in low-bandwidth environments.",
    industry: "EdTech",
    location: "Cape Town",
    foundedYear: 2021,
    stage: "Seed",
    employeeCount: "11-50",
    funding: {
      total: "R1.8M",
      lastRound: "R1.8M Seed",
      lastRoundDate: "May 2023",
      seeking: "R5M Series A",
      valuation: "R12M",
      investors: ["Education First Fund", "Impact Ventures", "Angel Investors"],
    },
    traction: {
      revenue: "R950K (2023)",
      growth: "+150% YoY",
      users: "25,000+",
      schools: "45 partner schools",
    },
    team: [
      { name: "Kwame Osei", role: "Founder & CEO", image: "/placeholder-user.jpg" },
      { name: "Thandi Nkosi", role: "Chief Education Officer", image: "/placeholder-user.jpg" },
      { name: "David Chen", role: "CTO", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 580,
      followers: 312,
      connections: 98,
      likes: 67,
      shares: 29,
    },
    engagement: {
      completeness: 75,
      lastActive: "1d ago",
      trending: false,
      verified: true,
      featured: false,
      topPerformer: false,
      growthRate: "+150%",
      badges: ["Education Impact", "Digital Inclusion"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    },
    contact: {
      email: "info@edulearn.example.com",
      phone: "+27 21 555 0789",
      website: "https://edulearn.example.com",
      social: {
        linkedin: "https://linkedin.com/company/edulearn",
        twitter: "https://twitter.com/edulearn",
        facebook: "https://facebook.com/edulearn",
      },
    },
  },
  {
    id: "s6",
    name: "LogiTech",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Optimizing logistics for African businesses",
    description:
      "LogiTech is revolutionizing logistics across Africa with our AI-powered platform that optimizes routes, reduces costs, and improves delivery times. We connect businesses with reliable transportation partners and provide real-time tracking and analytics to streamline supply chains.",
    industry: "LogisticsTech",
    location: "Johannesburg",
    foundedYear: 2020,
    stage: "Series A",
    employeeCount: "51-100",
    funding: {
      total: "R15M",
      lastRound: "R10M Series A",
      lastRoundDate: "Feb 2023",
      seeking: "R30M Series B",
      valuation: "R120M",
      investors: ["Mobility Ventures", "African Logistics Fund", "Tech Growth Capital"],
    },
    traction: {
      revenue: "R12.5M (2023)",
      growth: "+200% YoY",
      businesses: "450+ clients",
      deliveries: "25,000+ monthly",
    },
    team: [
      { name: "Emmanuel Okonkwo", role: "Co-founder & CEO", image: "/placeholder-user.jpg" },
      { name: "Zandile Dube", role: "Co-founder & COO", image: "/placeholder-user.jpg" },
      { name: "Raj Patel", role: "CTO", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 890,
      followers: 475,
      connections: 187,
      likes: 112,
      shares: 58,
    },
    engagement: {
      completeness: 88,
      lastActive: "5h ago",
      trending: true,
      verified: true,
      featured: true,
      topPerformer: true,
      growthRate: "+200%",
      badges: ["Logistics Innovation", "Cross-Border Trade", "AI-Powered"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
      video: "https://example.com/video",
    },
    contact: {
      email: "info@logitech.example.com",
      phone: "+27 11 555 0789",
      website: "https://logitech.example.com",
      social: {
        linkedin: "https://linkedin.com/company/logitech",
        twitter: "https://twitter.com/logitech",
        facebook: "https://facebook.com/logitech",
      },
    },
  },
  {
    id: "s7",
    name: "SecureID",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Digital identity solutions for Africa",
    description:
      "SecureID is building the digital identity infrastructure for Africa. Our blockchain-based platform provides secure, verifiable digital identities that enable access to financial services, healthcare, and government benefits for millions of previously excluded individuals.",
    industry: "IdentityTech",
    location: "Pretoria",
    foundedYear: 2019,
    stage: "Series A",
    employeeCount: "51-100",
    funding: {
      total: "R18M",
      lastRound: "R12M Series A",
      lastRoundDate: "Sep 2022",
      seeking: "R35M Series B",
      valuation: "R150M",
      investors: ["Digital Identity Fund", "Blockchain Ventures", "African Development Bank"],
    },
    traction: {
      revenue: "R9.8M (2023)",
      growth: "+165% YoY",
      users: "1.2M+",
      partners: "35+ institutions",
    },
    team: [
      { name: "Mandla Zulu", role: "Founder & CEO", image: "/placeholder-user.jpg" },
      { name: "Amina Ibrahim", role: "CTO", image: "/placeholder-user.jpg" },
      { name: "Thomas Kruger", role: "Chief Security Officer", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 720,
      followers: 390,
      connections: 145,
      likes: 87,
      shares: 42,
    },
    engagement: {
      completeness: 90,
      lastActive: "12h ago",
      trending: true,
      verified: true,
      featured: false,
      topPerformer: false,
      growthRate: "+165%",
      badges: ["Digital Inclusion", "Financial Access", "Blockchain Innovation"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: [
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
        "/placeholder.svg?height=200&width=300",
      ],
    },
    contact: {
      email: "info@secureid.example.com",
      phone: "+27 12 555 0123",
      website: "https://secureid.example.com",
      social: {
        linkedin: "https://linkedin.com/company/secureid",
        twitter: "https://twitter.com/secureid",
        facebook: "https://facebook.com/secureid",
      },
    },
  },
  {
    id: "s8",
    name: "FreshFarm",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Farm-to-table marketplace for fresh produce",
    description:
      "FreshFarm connects small-scale farmers directly with consumers through our digital marketplace. We're eliminating middlemen, reducing food waste, and ensuring farmers receive fair prices while consumers get fresher, more affordable produce.",
    industry: "AgriTech",
    location: "Cape Town",
    foundedYear: 2021,
    stage: "Seed",
    employeeCount: "11-50",
    funding: {
      total: "R2.5M",
      lastRound: "R2.5M Seed",
      lastRoundDate: "Apr 2023",
      seeking: "R7M Series A",
      valuation: "R15M",
      investors: ["Food Innovation Fund", "AgriVentures", "Impact Angels"],
    },
    traction: {
      revenue: "R1.8M (2023)",
      growth: "+135% YoY",
      farmers: "250+ registered",
      customers: "5,000+ monthly active users",
    },
    team: [
      { name: "Grace Mokoena", role: "Founder & CEO", image: "/placeholder-user.jpg" },
      { name: "Peter van Wyk", role: "COO", image: "/placeholder-user.jpg" },
      { name: "Lindiwe Ndlovu", role: "Head of Farmer Relations", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 540,
      followers: 285,
      connections: 95,
      likes: 72,
      shares: 38,
    },
    engagement: {
      completeness: 82,
      lastActive: "1d ago",
      trending: false,
      verified: true,
      featured: false,
      topPerformer: false,
      growthRate: "+135%",
      badges: ["Food Security", "Farmer Support", "Sustainable"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    },
    contact: {
      email: "info@freshfarm.example.com",
      phone: "+27 21 555 0456",
      website: "https://freshfarm.example.com",
      social: {
        linkedin: "https://linkedin.com/company/freshfarm",
        twitter: "https://twitter.com/freshfarm",
        facebook: "https://facebook.com/freshfarm",
      },
    },
  },
]

// Industries for filtering
const industries = [
  "All Industries",
  "CleanTech",
  "HealthTech",
  "Fintech",
  "AgriTech",
  "EdTech",
  "LogisticsTech",
  "IdentityTech",
]

// Locations for filtering
const locations = ["All Locations", "Cape Town", "Johannesburg", "Durban", "Pretoria", "Stellenbosch"]

// Funding stages for filtering
const fundingStages = ["All Stages", "Pre-seed", "Seed", "Series A", "Series B", "Series C+"]

// Sort options
const sortOptions = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-funded", label: "Most Funded" },
  { value: "fastest-growing", label: "Fastest Growing" },
  { value: "alphabetical", label: "A-Z" },
]

// View options
const viewOptions = [
  { value: "grid", label: "Grid View", icon: <Grid className="h-4 w-4" /> },
  { value: "list", label: "List View", icon: <List className="h-4 w-4" /> },
  { value: "compact", label: "Compact View", icon: <AlignLeft className="h-4 w-4" /> },
]

// Helper components for the view options
function Grid(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}

function List(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}

function AlignLeft(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" x2="21" y1="6" y2="6" />
      <line x1="3" x2="18" y1="12" y2="12" />
      <line x1="3" x2="21" y1="18" y2="18" />
    </svg>
  )
}

// Get badges for startups based on their engagement metrics
const getBadges = (startup) => {
  const badges = []

  if (startup.engagement.trending) {
    badges.push({ label: "Trending", icon: <TrendingUp className="h-3 w-3" />, color: "bg-orange-500" })
  }

  if (startup.engagement.topPerformer) {
    badges.push({ label: "Top Performer", icon: <Trophy className="h-3 w-3" />, color: "bg-blue-500" })
  }

  if (startup.engagement.featured) {
    badges.push({ label: "Featured", icon: <Star className="h-3 w-3" />, color: "bg-blue-500" })
  }

  if (startup.engagement.growthRate) {
    badges.push({
      label: startup.engagement.growthRate,
      icon: <LineChart className="h-3 w-3" />,
      color: "bg-emerald-500",
    })
  }

  if (startup.engagement.verified) {
    badges.push({ label: "Verified", icon: <Check className="h-3 w-3" />, color: "bg-blue-500", discreet: true })
  }

  return badges
}

// Sort function for startups
const sortStartups = (startups, sortBy) => {
  switch (sortBy) {
    case "trending":
      return [...startups].sort((a, b) => {
        if (a.engagement.trending && !b.engagement.trending) return -1
        if (!a.engagement.trending && b.engagement.trending) return 1
        return 0
      })
    case "newest":
      return [...startups].sort((a, b) => b.foundedYear - a.foundedYear)
    case "oldest":
      return [...startups].sort((a, b) => a.foundedYear - b.foundedYear)
    case "most-funded":
      return [...startups].sort((a, b) => {
        const aFunding = Number.parseFloat(a.funding.total.replace(/[^\d.]/g, ""))
        const bFunding = Number.parseFloat(b.funding.total.replace(/[^\d.]/g, ""))
        return bFunding - aFunding
      })
    case "fastest-growing":
      return [...startups].sort((a, b) => {
        const aGrowth = Number.parseFloat(a.engagement.growthRate.replace(/[^\d.]/g, ""))
        const bGrowth = Number.parseFloat(b.engagement.growthRate.replace(/[^\d.]/g, ""))
        return bGrowth - aGrowth
      })
    case "alphabetical":
      return [...startups].sort((a, b) => a.name.localeCompare(b.name))
    default:
      return startups
  }
}

export default function StartupsPage() {
  // State for filters and view options
  const [filters, setFilters] = useState({
    industry: "All Industries",
    location: "All Locations",
    stage: "All Stages",
    fundingMin: 0,
    fundingMax: 20,
    foundedAfter: 2018,
    onlyVerified: false,
    onlyTrending: false,
    searchQuery: "",
  })
  const [sortBy, setSortBy] = useState("trending")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedStartup, setSelectedStartup] = useState(null)
  const [bookmarkedStartups, setBookmarkedStartups] = useState([])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationContent, setNotificationContent] = useState(null)
  const [appUserMetrics, setAppUserMetrics] = useState({
    profileViews: 0,
    startupViews: [],
    recentSearches: [],
    interests: [],
  })

  // Ref for scroll position
  const scrollRef = useRef(null)

  // Filter startups based on active filters
  const filteredStartups = startups.filter((startup) => {
    // Filter by industry
    if (filters.industry !== "All Industries" && startup.industry !== filters.industry) return false

    // Filter by location
    if (filters.location !== "All Locations" && startup.location !== filters.location) return false

    // Filter by funding stage
    if (filters.stage !== "All Stages" && startup.stage !== filters.stage) return false

    // Filter by funding amount
    const fundingAmount = Number.parseFloat(startup.funding.total.replace(/[^\d.]/g, ""))
    if (fundingAmount < filters.fundingMin || fundingAmount > filters.fundingMax) return false

    // Filter by founding year
    if (startup.foundedYear < filters.foundedAfter) return false

    // Filter by verification status
    if (filters.onlyVerified && !startup.engagement.verified) return false

    // Filter by trending status
    if (filters.onlyTrending && !startup.engagement.trending) return false

    // Filter by search query
    if (
      filters.searchQuery &&
      !startup.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !startup.tagline.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !startup.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
    )
      return false

    return true
  })

  // Sort filtered startups
  const sortedStartups = sortStartups(filteredStartups, sortBy)

  // Show notification after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      const randomStartup = startups[Math.floor(Math.random() * startups.length)]
      setNotificationContent({
        startup: randomStartup,
        message: "just updated their profile with new funding information",
      })
      setShowNotification(true)
    }, 5000)

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

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }))

    // Track search for personalization if it's significant
    if (query.length > 3 && e.key === "Enter") {
      setAppUserMetrics((prev) => ({
        ...prev,
        recentSearches: [query, ...prev.recentSearches.slice(0, 4)],
      }))
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      industry: "All Industries",
      location: "All Locations",
      stage: "All Stages",
      fundingMin: 0,
      fundingMax: 20,
      foundedAfter: 2018,
      onlyVerified: false,
      onlyTrending: false,
      searchQuery: "",
    })

    // Reset any UI elements that need to be reset
    const industrySelect = document.querySelector('[name="industry"]') as HTMLSelectElement
    const locationSelect = document.querySelector('[name="location"]') as HTMLSelectElement
    const stageSelect = document.querySelector('[name="stage"]') as HTMLSelectElement

    if (industrySelect) industrySelect.value = "All Industries"
    if (locationSelect) locationSelect.value = "All Locations"
    if (stageSelect) stageSelect.value = "All Stages"

    // Reset any checkboxes
    const verifiedCheckbox = document.getElementById("verified-only") as HTMLInputElement
    const trendingCheckbox = document.getElementById("trending-only") as HTMLInputElement

    if (verifiedCheckbox) verifiedCheckbox.checked = false
    if (trendingCheckbox) trendingCheckbox.checked = false
  }

  // Track startup views
  const handleViewStartup = (startup) => {
    setSelectedStartup(startup)
    setAppUserMetrics((prev) => ({
      ...prev,
      startupViews: [...prev.startupViews.filter((s) => s.id !== startup.id), startup],
    }))
  }

  // Toggle bookmark
  const handleBookmark = (startup, e) => {
    if (e) e.stopPropagation()

    setBookmarkedStartups((prev) => {
      const isBookmarked = prev.some((s) => s.id === startup.id)

      // Show feedback notification
      setNotificationContent({
        startup: startup,
        message: isBookmarked ? "removed from your bookmarks" : "added to your bookmarks",
      })
      setShowNotification(true)

      return isBookmarked ? prev.filter((s) => s.id !== startup.id) : [...prev, startup]
    })
  }

  // Render startup card based on view mode
  const renderStartupCard = (startup) => {
    const isBookmarked = bookmarkedStartups.some((s) => s.id === startup.id)

    if (viewMode === "grid") {
      return (
        <Card
          key={startup.id}
          className={cn(
            "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer border",
            "hover:border-primary/50",
          )}
          onClick={() => handleViewStartup(startup)}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary/10 text-primary">
                <AvatarImage src={startup.logo} alt={startup.name} />
                <AvatarFallback>{startup.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <CardTitle className="text-base truncate">{startup.name}</CardTitle>
                  {startup.engagement.verified && (
                    <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-blue-500 rounded-full">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {startup.location}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={(e) => handleBookmark(startup, e)}
              >
                <Bookmark className={cn("h-4 w-4", isBookmarked ? "fill-current text-primary" : "")} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2">
            <p className="text-sm line-clamp-2 h-10">{startup.tagline}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {getBadges(startup)
                .filter((b) => !b.discreet)
                .slice(0, 3)
                .map((badge, i) => (
                  <Badge key={i} className={cn("text-xs", badge.color)}>
                    {badge.icon}
                    <span className="ml-1">{badge.label}</span>
                  </Badge>
                ))}

              {getBadges(startup).filter((b) => !b.discreet).length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{getBadges(startup).filter((b) => !b.discreet).length - 3} more
                </Badge>
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span>Funding: {startup.funding.total}</span>
                <span>Stage: {startup.stage}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex flex-col gap-2">
            <Separator />
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{startup.socialProof.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{startup.socialProof.followers}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{startup.engagement.lastActive}</span>
              </div>
            </div>

            <div className="w-full">
              <Progress value={startup.engagement.completeness} className="h-1" />
            </div>
          </CardFooter>
        </Card>
      )
    } else if (viewMode === "list") {
      return (
        <Card
          key={startup.id}
          className={cn(
            "overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer border",
            "hover:border-primary/50",
          )}
          onClick={() => handleViewStartup(startup)}
        >
          <div className="flex flex-col md:flex-row p-4">
            <div className="flex items-start gap-4 md:w-1/3">
              <Avatar className="h-12 w-12 bg-primary/10 text-primary">
                <AvatarImage src={startup.logo} alt={startup.name} />
                <AvatarFallback>{startup.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold">{startup.name}</h3>
                  {startup.engagement.verified && (
                    <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-blue-500 rounded-full">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{startup.location}</span>
                  <span>•</span>
                  <span>{startup.industry}</span>
                  <span>•</span>
                  <span>Founded {startup.foundedYear}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {getBadges(startup)
                    .filter((b) => !b.discreet)
                    .slice(0, 2)
                    .map((badge, i) => (
                      <Badge key={i} className={cn("text-xs", badge.color)}>
                        {badge.icon}
                        <span className="ml-1">{badge.label}</span>
                      </Badge>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:w-2/5 md:px-4">
              <p className="text-sm line-clamp-2">{startup.tagline}</p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <div>
                  <span className="font-medium">Funding:</span> {startup.funding.total}
                </div>
                <div>
                  <span className="font-medium">Stage:</span> {startup.stage}
                </div>
                <div>
                  <span className="font-medium">Team:</span> {startup.employeeCount}
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:w-1/4 flex flex-col md:items-end justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full self-end"
                onClick={(e) => handleBookmark(startup, e)}
              >
                <Bookmark className={cn("h-4 w-4", isBookmarked ? "fill-current text-primary" : "")} />
              </Button>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{startup.socialProof.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{startup.engagement.lastActive}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )
    } else {
      // Compact view
      return (
        <div
          key={startup.id}
          className={cn("flex items-center gap-3 p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors")}
          onClick={() => handleViewStartup(startup)}
        >
          <Avatar className="h-8 w-8 bg-primary/10 text-primary">
            <AvatarImage src={startup.logo} alt={startup.name} />
            <AvatarFallback>{startup.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-medium truncate">{startup.name}</p>
              {startup.engagement.verified && (
                <Badge className="h-3 w-3 p-0 flex items-center justify-center bg-blue-500 rounded-full">
                  <Check className="h-2 w-2 text-white" />
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{startup.tagline}</p>
          </div>
          <div className="text-right text-xs">
            <div>{startup.funding.total}</div>
            <div className="text-muted-foreground">{startup.stage}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={(e) => handleBookmark(startup, e)}
          >
            <Bookmark className={cn("h-3.5 w-3.5", isBookmarked ? "fill-current text-primary" : "")} />
          </Button>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-6 px-4 md:px-6 bg-white dark:bg-gray-950" ref={scrollRef}>
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Startups</h1>
              <p className="text-muted-foreground">Discover innovative South African startups</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search startups..."
                  className="pl-8 w-full min-w-[200px] md:w-[300px] rounded-full"
                  value={filters.searchQuery}
                  onChange={handleSearch}
                  onKeyDown={handleSearch}
                />
                {filters.searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9"
                    onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline" className="rounded-full">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Your bookmarks ({bookmarkedStartups.length})</TooltipContent>
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

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Startup
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Add New Startup</DialogTitle>
                    <DialogDescription>Fill in the details to add a new startup to the platform.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input id="name" placeholder="Startup name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tagline" className="text-right">
                        Tagline
                      </Label>
                      <Input id="tagline" placeholder="Brief description" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="industry" className="text-right">
                        Industry
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries
                            .filter((i) => i !== "All Industries")
                            .map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Startup</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Featured startups carousel */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Featured Startups
              </h2>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {startups
                .filter((startup) => startup.engagement.featured)
                .slice(0, 3)
                .map((startup) => (
                  <Card
                    key={startup.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleViewStartup(startup)}
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={startup.media.coverImage || "/placeholder.svg"}
                        alt={startup.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <div className="flex items-center gap-1">
                          <h3 className="font-bold">{startup.name}</h3>
                          {startup.engagement.verified && (
                            <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-blue-500 rounded-full">
                              <Check className="h-2.5 w-2.5 text-white" />
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/80">{startup.tagline}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">{startup.funding.total} raised</div>
                          <div className="text-xs text-muted-foreground">
                            {startup.stage} • {startup.industry}
                          </div>
                        </div>
                        <Badge className="bg-blue-500">
                          <Star className="mr-1 h-3 w-3" />
                          Featured
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters sidebar */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                      Reset
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Industry filter */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Industry</h3>
                    <Select
                      value={filters.industry}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location filter */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Location</h3>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Funding stage filter */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Funding Stage</h3>
                    <Select
                      value={filters.stage}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, stage: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingStages.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Funding amount range */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Funding Amount (R Million)</h3>
                      <span className="text-xs text-muted-foreground">
                        R{filters.fundingMin}M - R{filters.fundingMax}M+
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={20}
                      step={1}
                      value={[filters.fundingMin, filters.fundingMax]}
                      onValueChange={([min, max]) =>
                        setFilters((prev) => ({ ...prev, fundingMin: min, fundingMax: max }))
                      }
                      className="py-2"
                    />
                  </div>

                  {/* Founded year filter */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Founded After</h3>
                      <span className="text-xs text-muted-foreground">{filters.foundedAfter}</span>
                    </div>
                    <Slider
                      min={2018}
                      max={2023}
                      step={1}
                      value={[filters.foundedAfter]}
                      onValueChange={([value]) => setFilters((prev) => ({ ...prev, foundedAfter: value }))}
                      className="py-2"
                    />
                  </div>

                  {/* Toggle filters */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="verified-only"
                        checked={filters.onlyVerified}
                        onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, onlyVerified: checked }))}
                      />
                      <Label htmlFor="verified-only">Verified startups only</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="trending-only"
                        checked={filters.onlyTrending}
                        onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, onlyTrending: checked }))}
                      />
                      <Label htmlFor="trending-only">Trending startups only</Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Stats */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        Showing {sortedStartups.length} of {startups.length} startups
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recently viewed */}
              {appUserMetrics.startupViews.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recently Viewed</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {appUserMetrics.startupViews.slice(0, 3).map((startup) => (
                      <div
                        key={startup.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                        onClick={() => handleViewStartup(startup)}
                      >
                        <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                          <AvatarImage src={startup.logo} alt={startup.name} />
                          <AvatarFallback>{startup.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{startup.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {startup.industry} • {startup.stage}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Trending industries */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Trending Industries
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500">1</Badge>
                        <span className="font-medium">Fintech</span>
                      </div>
                      <Badge variant="outline">32 startups</Badge>
                    </div>
                    <Progress value={85} className="h-1.5" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500">2</Badge>
                        <span className="font-medium">CleanTech</span>
                      </div>
                      <Badge variant="outline">28 startups</Badge>
                    </div>
                    <Progress value={75} className="h-1.5" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500">3</Badge>
                        <span className="font-medium">HealthTech</span>
                      </div>
                      <Badge variant="outline">24 startups</Badge>
                    </div>
                    <Progress value={65} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-9">
              {/* View options and sorting */}
              <Tabs defaultValue="startups" className="w-full mb-6">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="startups" className="flex-1">
                    Startups
                  </TabsTrigger>
                  <TabsTrigger value="active-rounds" className="flex-1">
                    Active Funding Rounds
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="startups">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">View:</span>
                      <div className="flex items-center border rounded-md overflow-hidden">
                        {viewOptions.map((option) => (
                          <Button
                            key={option.value}
                            variant={viewMode === option.value ? "default" : "ghost"}
                            size="sm"
                            className="rounded-none h-8 px-3"
                            onClick={() => setViewMode(option.value)}
                          >
                            {option.icon}
                            <span className="ml-1 hidden sm:inline-block">{option.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sort by:</span>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Startups list */}
                  {viewMode === "grid" ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {sortedStartups.map((startup) => renderStartupCard(startup))}
                    </div>
                  ) : viewMode === "list" ? (
                    <div className="space-y-4">{sortedStartups.map((startup) => renderStartupCard(startup))}</div>
                  ) : (
                    <Card>
                      <ScrollArea className="h-[600px]">
                        <div className="divide-y">{sortedStartups.map((startup) => renderStartupCard(startup))}</div>
                      </ScrollArea>
                    </Card>
                  )}

                  {/* Empty state */}
                  {sortedStartups.length === 0 && (
                    <div className="text-center py-12">
                      <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <h3 className="text-lg font-medium">No startups found</h3>
                      <p className="text-muted-foreground">Try adjusting your filters or search query</p>
                      <Button variant="outline" className="mt-4" onClick={clearFilters}>
                        Reset filters
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="active-rounds">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Active Funding Rounds</h3>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Rounds</SelectItem>
                          <SelectItem value="seed">Seed</SelectItem>
                          <SelectItem value="series-a">Series A</SelectItem>
                          <SelectItem value="series-b">Series B</SelectItem>
                          <SelectItem value="series-c">Series C+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {startups
                        .filter((s) => s.funding.seeking)
                        .map((startup) => (
                          <Card key={startup.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage src={startup.logo} alt={startup.name} />
                                    <AvatarFallback>{startup.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <CardTitle className="text-base flex items-center gap-1">
                                      {startup.name}
                                      {startup.engagement.verified && (
                                        <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-blue-500 rounded-full">
                                          <Check className="h-2.5 w-2.5 text-white" />
                                        </Badge>
                                      )}
                                    </CardTitle>
                                    <CardDescription>
                                      {startup.location} • {startup.industry}
                                    </CardDescription>
                                  </div>
                                </div>
                                <Badge>{startup.stage}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-1">Seeking</h4>
                                  <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-lg">{startup.funding.seeking}</span>
                                    <span className="text-muted-foreground">
                                      Valuation: {startup.funding.valuation}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span>Progress: {Math.floor(Math.random() * 70) + 10}%</span>
                                    <span>Closing in {Math.floor(Math.random() * 60) + 5} days</span>
                                  </div>
                                  <Progress value={Math.floor(Math.random() * 70) + 10} className="h-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Min investment:</span>
                                    <p>R{(Math.floor(Math.random() * 5) + 1) * 100}K</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Equity offered:</span>
                                    <p>{Math.floor(Math.random() * 15) + 5}%</p>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewStartup(startup)}>
                                View Details
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm">Make Offer</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Make an Offer to {startup.name}</DialogTitle>
                                    <DialogDescription>
                                      Submit your investment offer directly to the startup team.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="amount" className="text-right">
                                        Amount (R)
                                      </Label>
                                      <Input id="amount" placeholder="e.g. 500000" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="equity" className="text-right">
                                        Equity (%)
                                      </Label>
                                      <Input id="equity" placeholder="e.g. 10" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor="message" className="text-right">
                                        Message
                                      </Label>
                                      <Textarea
                                        id="message"
                                        placeholder="Introduce yourself and explain your offer"
                                        className="col-span-3"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button type="submit">Submit Offer</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Startup detail dialog */}
          <Dialog open={!!selectedStartup} onOpenChange={(open) => !open && setSelectedStartup(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              {selectedStartup && (
                <>
                  <DialogHeader>
                    <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                      <Image
                        src={selectedStartup.media.coverImage || "/placeholder.svg"}
                        alt={selectedStartup.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <div className="flex items-center gap-1">
                          <DialogTitle className="text-2xl font-bold">{selectedStartup.name}</DialogTitle>
                          {selectedStartup.engagement.verified && (
                            <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-blue-500 rounded-full">
                              <Check className="h-3 w-3 text-white" />
                            </Badge>
                          )}
                        </div>
                        <DialogDescription className="text-white/80">{selectedStartup.tagline}</DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="mt-4 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <Avatar className="h-16 w-16 bg-primary/10 text-primary">
                        <AvatarImage src={selectedStartup.logo} alt={selectedStartup.name} />
                        <AvatarFallback>{selectedStartup.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          {getBadges(selectedStartup).map((badge, i) => (
                            <Badge key={i} className={cn("text-xs", badge.color)}>
                              {badge.icon}
                              <span className="ml-1">{badge.label}</span>
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedStartup.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>Founded {selectedStartup.foundedYear}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedStartup.employeeCount} employees</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            <span>{selectedStartup.industry}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={bookmarkedStartups.some((s) => s.id === selectedStartup.id) ? "default" : "outline"}
                          onClick={() => handleBookmark(selectedStartup)}
                        >
                          <Bookmark className="mr-2 h-4 w-4" />
                          {bookmarkedStartups.some((s) => s.id === selectedStartup.id) ? "Bookmarked" : "Bookmark"}
                        </Button>
                        <Button>
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                      </div>
                    </div>

                    <Tabs defaultValue="overview">
                      <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                        <TabsTrigger
                          value="overview"
                          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                        >
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="team"
                          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                        >
                          Team
                        </TabsTrigger>
                        <TabsTrigger
                          value="funding"
                          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                        >
                          Funding
                        </TabsTrigger>
                        <TabsTrigger
                          value="traction"
                          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                        >
                          Traction
                        </TabsTrigger>
                        <TabsTrigger
                          value="media"
                          className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
                        >
                          Media
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="pt-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">About {selectedStartup.name}</h3>
                          <p>{selectedStartup.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <Card>
                              <CardContent className="p-4 text-center">
                                <h4 className="text-sm text-muted-foreground">Funding</h4>
                                <div className="text-xl font-bold">{selectedStartup.funding.total}</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <h4 className="text-sm text-muted-foreground">Stage</h4>
                                <div className="text-xl font-bold">{selectedStartup.stage}</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <h4 className="text-sm text-muted-foreground">Founded</h4>
                                <div className="text-xl font-bold">{selectedStartup.foundedYear}</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <h4 className="text-sm text-muted-foreground">Team Size</h4>
                                <div className="text-xl font-bold">{selectedStartup.employeeCount}</div>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="mt-6">
                            <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <MailIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{selectedStartup.contact.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                <span>{selectedStartup.contact.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <NextLink
                                  href={selectedStartup.contact.website}
                                  className="flex items-center hover:underline"
                                  target="_blank"
                                >
                                  {selectedStartup.contact.website.replace("https://", "")}
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </NextLink>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{selectedStartup.location}, South Africa</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="team" className="pt-4">
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium">Leadership Team</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {selectedStartup.team.map((member, index) => (
                              <Card key={index}>
                                <CardContent className="p-6 text-center">
                                  <Avatar className="h-20 w-20 mx-auto mb-4">
                                    <AvatarImage src={member.image} alt={member.name} />
                                    <AvatarFallback>
                                      {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <h4 className="font-semibold">{member.name}</h4>
                                  <p className="text-sm text-muted-foreground">{member.role}</p>
                                  <div className="flex justify-center gap-2 mt-4">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                                      <MailIcon className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                                      <NextLink className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="funding" className="pt-4">
                        <div className="space-y-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-medium">Funding History</h3>
                              <p className="text-muted-foreground">Total raised: {selectedStartup.funding.total}</p>
                            </div>
                            <Badge className="bg-primary text-lg h-8">{selectedStartup.stage}</Badge>
                          </div>

                          <Card>
                            <CardHeader>
                              <CardTitle>Current Funding Round</CardTitle>
                              <CardDescription>
                                {selectedStartup.funding.seeking} at {selectedStartup.funding.valuation} valuation
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{selectedStartup.funding.lastRound}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {selectedStartup.funding.lastRoundDate}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h4 className="font-medium">Investors</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedStartup.funding.investors.map((investor, index) => (
                                    <Badge key={index} variant="secondary">
                                      {investor}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="traction" className="pt-4">
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium">Traction & Metrics</h3>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(selectedStartup.traction).map(([key, value]) => (
                              <Card key={key}>
                                <CardContent className="p-4 text-center">
                                  <h4 className="text-sm text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </h4>
                                  <div className="text-xl font-bold">{value}</div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          <Card>
                            <CardHeader>
                              <CardTitle>Growth Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                                <PieChart className="h-8 w-8 text-muted-foreground" />
                                <span className="ml-2 text-muted-foreground">Growth chart visualization</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="media" className="pt-4">
                        <div className="space-y-6">
                          <h3 className="text-lg font-medium">Media Gallery</h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {selectedStartup.media.gallery.map((image, index) => (
                              <div key={index} className="relative h-48 rounded-md overflow-hidden">
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`${selectedStartup.name} gallery image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>

                          {selectedStartup.media.video && (
                            <div className="mt-6">
                              <h3 className="text-lg font-medium mb-4">Company Video</h3>
                              <div className="relative h-[300px] rounded-md overflow-hidden bg-muted/20 flex items-center justify-center">
                                <Play className="h-12 w-12 text-muted-foreground" />
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                          <Zap className="mr-2 h-4 w-4" />
                          Make Offer
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Make an Offer to {selectedStartup?.name}</DialogTitle>
                          <DialogDescription>
                            Submit your investment offer directly to the startup team.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">
                              Amount (R)
                            </Label>
                            <Input id="amount" placeholder="e.g. 500000" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="equity" className="text-right">
                              Equity (%)
                            </Label>
                            <Input id="equity" placeholder="e.g. 10" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="valuation" className="text-right">
                              Valuation (R)
                            </Label>
                            <Input id="valuation" placeholder="e.g. 50000000" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="terms" className="text-right">
                              Terms
                            </Label>
                            <Select defaultValue="standard">
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select terms" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard Terms</SelectItem>
                                <SelectItem value="preferred">Preferred Shares</SelectItem>
                                <SelectItem value="convertible">Convertible Note</SelectItem>
                                <SelectItem value="safe">SAFE</SelectItem>
                                <SelectItem value="custom">Custom Terms</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="message" className="text-right">
                              Message
                            </Label>
                            <Textarea
                              id="message"
                              placeholder="Introduce yourself and explain your offer"
                              className="col-span-3"
                              rows={4}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Submit Offer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Notification toast */}
          {showNotification && notificationContent && (
            <div className="fixed bottom-4 right-4 z-50 transition-all duration-300">
              <Card className="border-2 border-primary/20 shadow-lg w-80">
                <CardHeader className="flex flex-row items-start gap-4 p-4 pb-0">
                  <Avatar className="h-10 w-10 bg-primary/10 text-primary">
                    <AvatarImage src={notificationContent.startup.logo} alt={notificationContent.startup.name} />
                    <AvatarFallback>{notificationContent.startup.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{notificationContent.startup.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setShowNotification(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{notificationContent.message}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      handleViewStartup(notificationContent.startup)
                      setShowNotification(false)
                    }}
                  >
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Helper component for the Play icon in the media tab
function Play(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  )
}

// Helper component for the Mail icon
function Mail(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

// Helper component for the Phone icon
function Phone(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

// Helper component for the Link icon
function Link(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

