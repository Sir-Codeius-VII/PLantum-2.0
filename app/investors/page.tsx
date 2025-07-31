"use client"

import type React from "react"

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
import Image from "next/image"
import {
  ArrowRight,
  Bell,
  Bookmark,
  Check,
  Clock,
  Eye,
  Filter,
  Info,
  LineChart,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  Trophy,
} from "lucide-react"

// Mock data for investors
const investorData = [
  {
    id: "savannah-ventures",
    name: "Savannah Ventures",
    type: "Venture Capital",
    avatar: "SV",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Early-stage VC firm focused on African tech startups",
    location: "Nairobi, Kenya",
    focus: ["Fintech", "Agritech", "Healthtech"],
    stage: ["Seed", "Series A"],
    investments: 24,
    portfolioCompanies: ["PayGo Energy", "Twiga Foods", "M-KOPA"],
    averageInvestment: "$250K - $2M",
    totalFundSize: "$45M",
    activelyInvesting: true,
    bio: "Early-stage VC firm focused on African tech startups with innovative solutions to local challenges.",
    description:
      "Savannah Ventures is an early-stage venture capital firm that invests in innovative African tech startups solving local challenges. We focus on fintech, agritech, and healthtech sectors across East Africa, providing both capital and strategic support to help founders scale their businesses.",
    foundedYear: 2015,
    engagementScore: 92,
    responseRate: 87,
    successfulExits: 3,
    verified: true,
    team: [
      { name: "James Mwangi", role: "Managing Partner", image: "/placeholder-user.jpg" },
      { name: "Sarah Kimani", role: "Investment Director", image: "/placeholder-user.jpg" },
      { name: "David Ochieng", role: "Portfolio Manager", image: "/placeholder-user.jpg" },
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
      growthRate: "+45%",
      badges: ["Top Performer", "Active Investor", "Fast Response"],
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
      email: "info@savannahventures.example.com",
      phone: "+254 20 555 0123",
      website: "https://savannahventures.example.com",
      social: {
        linkedin: "https://linkedin.com/company/savannahventures",
        twitter: "https://twitter.com/savannahventures",
      },
    },
  },
  {
    id: "innovation-capital",
    name: "Innovation Capital",
    type: "Venture Capital",
    avatar: "IC",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Supporting disruptive technologies across Africa",
    location: "Lagos, Nigeria",
    focus: ["E-commerce", "Logistics", "Fintech"],
    stage: ["Series A", "Series B"],
    investments: 31,
    portfolioCompanies: ["Flutterwave", "Kobo360", "Paystack"],
    averageInvestment: "$1M - $5M",
    totalFundSize: "$120M",
    activelyInvesting: true,
    bio: "Supporting disruptive technologies across various sectors with a focus on scalable business models.",
    description:
      "Innovation Capital is a leading venture capital firm based in Lagos, Nigeria, investing in disruptive technologies across Africa. We focus on Series A and B rounds for startups in e-commerce, logistics, and fintech sectors. Our portfolio includes some of Africa's most successful tech companies.",
    foundedYear: 2012,
    engagementScore: 88,
    responseRate: 92,
    successfulExits: 5,
    verified: true,
    team: [
      { name: "Oluwaseun Adeyemi", role: "Founder & Managing Partner", image: "/placeholder-user.jpg" },
      { name: "Chioma Eze", role: "Partner", image: "/placeholder-user.jpg" },
      { name: "Tunde Johnson", role: "Investment Director", image: "/placeholder-user.jpg" },
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
      topPerformer: true,
      growthRate: "+38%",
      badges: ["Top Performer", "Active Investor"],
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
      email: "info@innovationcapital.example.com",
      phone: "+234 1 555 0123",
      website: "https://innovationcapital.example.com",
      social: {
        linkedin: "https://linkedin.com/company/innovationcapital",
        twitter: "https://twitter.com/innovationcapital",
      },
    },
  },
  {
    id: "tech-angels",
    name: "Tech Angels Network",
    type: "Angel Network",
    avatar: "TA",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "A network of angel investors supporting early-stage tech startups",
    location: "Cape Town, South Africa",
    focus: ["SaaS", "AI", "Mobile"],
    stage: ["Pre-seed", "Seed"],
    investments: 42,
    portfolioCompanies: ["SweepSouth", "LifeQ", "Yoco"],
    averageInvestment: "$50K - $250K",
    totalFundSize: "$15M",
    activelyInvesting: true,
    bio: "A network of angel investors supporting early-stage tech startups across Africa.",
    description:
      "Tech Angels Network is a collective of successful entrepreneurs and business leaders who invest in and mentor early-stage tech startups across Africa. Based in Cape Town, we focus on pre-seed and seed investments in SaaS, AI, and mobile applications, providing not just capital but also strategic guidance and industry connections.",
    foundedYear: 2016,
    engagementScore: 95,
    responseRate: 96,
    successfulExits: 2,
    verified: true,
    team: [
      { name: "Michael van der Berg", role: "Network Lead", image: "/placeholder-user.jpg" },
      { name: "Thandi Nkosi", role: "Operations Director", image: "/placeholder-user.jpg" },
      { name: "Richard Chen", role: "Investment Coordinator", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 625,
      followers: 312,
      connections: 98,
      likes: 67,
      shares: 29,
    },
    engagement: {
      completeness: 95,
      lastActive: "6h ago",
      trending: false,
      verified: true,
      featured: true,
      topPerformer: false,
      growthRate: "+25%",
      badges: ["Fast Response", "Mentor Network"],
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
      email: "info@techagels.example.com",
      phone: "+27 21 555 0456",
      website: "https://techagels.example.com",
      social: {
        linkedin: "https://linkedin.com/company/techagels",
        twitter: "https://twitter.com/techagels",
      },
    },
  },
  {
    id: "growth-partners",
    name: "Growth Partners Africa",
    type: "Private Equity",
    avatar: "GP",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Investing in growth-stage companies in Africa's infrastructure and energy sectors",
    location: "Accra, Ghana",
    focus: ["Renewable Energy", "Infrastructure", "Manufacturing"],
    stage: ["Series B", "Series C"],
    investments: 18,
    portfolioCompanies: ["SolarNow", "Greenlight Planet", "PEG Africa"],
    averageInvestment: "$5M - $20M",
    totalFundSize: "$200M",
    activelyInvesting: true,
    bio: "Private equity firm focused on growth-stage companies in Africa's infrastructure and energy sectors.",
    description:
      "Growth Partners Africa is a private equity firm that invests in growth-stage companies across Africa's infrastructure and energy sectors. Based in Accra, we provide significant capital investments to help established businesses scale their operations, improve efficiency, and expand into new markets across the continent.",
    foundedYear: 2010,
    engagementScore: 84,
    responseRate: 78,
    successfulExits: 7,
    verified: true,
    team: [
      { name: "Kwame Osei", role: "Managing Partner", image: "/placeholder-user.jpg" },
      { name: "Abena Mensah", role: "Investment Director", image: "/placeholder-user.jpg" },
      { name: "Emmanuel Darko", role: "Operations Director", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 580,
      followers: 312,
      connections: 98,
      likes: 67,
      shares: 29,
    },
    engagement: {
      completeness: 84,
      lastActive: "1d ago",
      trending: false,
      verified: true,
      featured: false,
      topPerformer: false,
      growthRate: "+15%",
      badges: ["Infrastructure Focus", "Large Investments"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    },
    contact: {
      email: "info@growthpartners.example.com",
      phone: "+233 302 555 0123",
      website: "https://growthpartners.example.com",
      social: {
        linkedin: "https://linkedin.com/company/growthpartners",
        twitter: "https://twitter.com/growthpartners",
      },
    },
  },
  {
    id: "future-fund",
    name: "Future Fund",
    type: "Corporate VC",
    avatar: "FF",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Corporate venture capital arm investing in technologies that address Africa's challenges",
    location: "Kigali, Rwanda",
    focus: ["Edtech", "Cleantech", "Digital Health"],
    stage: ["Seed", "Series A"],
    investments: 29,
    portfolioCompanies: ["Andela", "Zipline", "M-TIBA"],
    averageInvestment: "$500K - $3M",
    totalFundSize: "$75M",
    activelyInvesting: false,
    bio: "Corporate venture capital arm investing in technologies that address Africa's most pressing challenges.",
    description:
      "Future Fund is the corporate venture capital arm of a major African telecommunications company, investing in technologies that address the continent's most pressing challenges. Based in Kigali, we focus on edtech, cleantech, and digital health startups at seed and Series A stages, providing both capital and access to our extensive corporate resources and customer base.",
    foundedYear: 2014,
    engagementScore: 90,
    responseRate: 85,
    successfulExits: 4,
    verified: true,
    team: [
      { name: "Jean-Paul Mugisha", role: "Head of Investments", image: "/placeholder-user.jpg" },
      { name: "Alice Uwase", role: "Investment Manager", image: "/placeholder-user.jpg" },
      { name: "Robert Kigali", role: "Technical Advisor", image: "/placeholder-user.jpg" },
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
      growthRate: "+30%",
      badges: ["Corporate Resources", "Strategic Investor"],
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
      email: "info@futurefund.example.com",
      phone: "+250 252 555 0123",
      website: "https://futurefund.example.com",
      social: {
        linkedin: "https://linkedin.com/company/futurefund",
        twitter: "https://twitter.com/futurefund",
      },
    },
  },
  {
    id: "impact-ventures",
    name: "Impact Ventures",
    type: "Impact Investor",
    avatar: "IV",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Impact-focused investment firm backing entrepreneurs solving social challenges",
    location: "Johannesburg, South Africa",
    focus: ["Social Enterprise", "Sustainable Agriculture", "Clean Energy"],
    stage: ["Seed", "Series A"],
    investments: 36,
    portfolioCompanies: ["Sanergy", "Farmcrowdy", "SunCulture"],
    averageInvestment: "$250K - $2M",
    totalFundSize: "$60M",
    activelyInvesting: true,
    bio: "Impact-focused investment firm backing entrepreneurs solving social and environmental challenges.",
    description:
      "Impact Ventures is an investment firm dedicated to backing entrepreneurs who are solving social and environmental challenges across Africa. Based in Johannesburg, we invest in seed and Series A rounds for startups in social enterprise, sustainable agriculture, and clean energy sectors, measuring success by both financial returns and positive impact metrics.",
    foundedYear: 2013,
    engagementScore: 93,
    responseRate: 91,
    successfulExits: 2,
    verified: true,
    team: [
      { name: "Lerato Molefe", role: "Founding Partner", image: "/placeholder-user.jpg" },
      { name: "Jacob Zuma", role: "Impact Investment Director", image: "/placeholder-user.jpg" },
      { name: "Priya Naidoo", role: "Sustainability Analyst", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 890,
      followers: 475,
      connections: 187,
      likes: 112,
      shares: 58,
    },
    engagement: {
      completeness: 93,
      lastActive: "5h ago",
      trending: true,
      verified: true,
      featured: true,
      topPerformer: true,
      growthRate: "+40%",
      badges: ["Impact Focus", "SDG Aligned", "Fast Response"],
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
      email: "info@impactventures.example.com",
      phone: "+27 11 555 0789",
      website: "https://impactventures.example.com",
      social: {
        linkedin: "https://linkedin.com/company/impactventures",
        twitter: "https://twitter.com/impactventures",
      },
    },
  },
  {
    id: "horizon-capital",
    name: "Horizon Capital",
    type: "Venture Capital",
    avatar: "HC",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Backing visionary founders building the future of African commerce",
    location: "Cairo, Egypt",
    focus: ["E-commerce", "Fintech", "Logistics", "Consumer Tech"],
    stage: ["Seed", "Series A", "Series B"],
    investments: 27,
    portfolioCompanies: ["MaxAB", "Trella", "Paymob"],
    averageInvestment: "$750K - $4M",
    totalFundSize: "$85M",
    activelyInvesting: true,
    bio: "Backing visionary founders building the future of African commerce and financial services.",
    description:
      "Horizon Capital is a venture capital firm focused on backing exceptional founders building innovative solutions in e-commerce, fintech, and logistics across North Africa and the Middle East. We provide capital, strategic guidance, and access to our extensive network to help our portfolio companies scale across the region.",
    foundedYear: 2014,
    engagementScore: 91,
    responseRate: 89,
    successfulExits: 4,
    verified: true,
    team: [
      { name: "Ahmed Hassan", role: "Managing Partner", image: "/placeholder-user.jpg" },
      { name: "Laila Mahmoud", role: "Partner", image: "/placeholder-user.jpg" },
      { name: "Omar Farouk", role: "Investment Director", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 845,
      followers: 412,
      connections: 178,
      likes: 95,
      shares: 53,
    },
    engagement: {
      completeness: 91,
      lastActive: "2h ago",
      trending: true,
      verified: true,
      featured: true,
      topPerformer: true,
      growthRate: "+42%",
      badges: ["Top Performer", "Fast Response", "Regional Leader"],
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
      email: "info@horizoncapital.example.com",
      phone: "+20 2 555 0123",
      website: "https://horizoncapital.example.com",
      social: {
        linkedin: "https://linkedin.com/company/horizoncapital",
        twitter: "https://twitter.com/horizoncapital",
      },
    },
  },
  {
    id: "sahara-ventures",
    name: "Sahara Ventures",
    type: "Impact Investor",
    avatar: "SV",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Investing in sustainable solutions for Africa's most pressing challenges",
    location: "Dar es Salaam, Tanzania",
    focus: ["Clean Energy", "Water Tech", "Sustainable Agriculture", "Healthcare"],
    stage: ["Pre-seed", "Seed"],
    investments: 19,
    portfolioCompanies: ["SolarFlow", "AquaPure", "FarmTech"],
    averageInvestment: "$100K - $500K",
    totalFundSize: "$25M",
    activelyInvesting: true,
    bio: "Impact investor focused on sustainable solutions for Africa's most pressing environmental and social challenges.",
    description:
      "Sahara Ventures is an impact investment firm dedicated to supporting early-stage startups developing innovative solutions to Africa's environmental and social challenges. We focus on clean energy, water technology, sustainable agriculture, and healthcare, providing seed capital and hands-on support to entrepreneurs building scalable and sustainable businesses.",
    foundedYear: 2017,
    engagementScore: 87,
    responseRate: 92,
    successfulExits: 1,
    verified: true,
    team: [
      { name: "Grace Mwangi", role: "Founding Partner", image: "/placeholder-user.jpg" },
      { name: "Daniel Osei", role: "Impact Investment Manager", image: "/placeholder-user.jpg" },
      { name: "Fatima Diallo", role: "Sustainability Analyst", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 620,
      followers: 285,
      connections: 112,
      likes: 78,
      shares: 41,
    },
    engagement: {
      completeness: 87,
      lastActive: "8h ago",
      trending: false,
      verified: true,
      featured: false,
      topPerformer: false,
      growthRate: "+28%",
      badges: ["Impact Focus", "SDG Aligned"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    },
    contact: {
      email: "info@saharaventures.example.com",
      phone: "+255 22 555 0123",
      website: "https://saharaventures.example.com",
      social: {
        linkedin: "https://linkedin.com/company/saharaventures",
        twitter: "https://twitter.com/saharaventures",
      },
    },
  },
  {
    id: "digital-horizons",
    name: "Digital Horizons",
    type: "Corporate VC",
    avatar: "DH",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Corporate venture arm investing in digital transformation across Africa",
    location: "Abidjan, Côte d'Ivoire",
    focus: ["Digital Infrastructure", "Enterprise SaaS", "Cybersecurity", "Cloud Services"],
    stage: ["Series A", "Series B"],
    investments: 15,
    portfolioCompanies: ["CloudAfrica", "SecureNet", "DataFlow"],
    averageInvestment: "$2M - $8M",
    totalFundSize: "$150M",
    activelyInvesting: true,
    bio: "Corporate venture arm investing in digital transformation technologies across Africa.",
    description:
      "Digital Horizons is the corporate venture capital arm of a major African telecommunications company, investing in technologies driving digital transformation across the continent. We focus on digital infrastructure, enterprise SaaS, cybersecurity, and cloud services, providing both capital and strategic partnerships to help our portfolio companies scale across multiple African markets.",
    foundedYear: 2016,
    engagementScore: 83,
    responseRate: 76,
    successfulExits: 2,
    verified: true,
    team: [
      { name: "Jean-Claude Kouassi", role: "Managing Director", image: "/placeholder-user.jpg" },
      { name: "Aminata Touré", role: "Investment Director", image: "/placeholder-user.jpg" },
      { name: "Paul Mensah", role: "Technical Advisor", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 710,
      followers: 365,
      connections: 142,
      likes: 82,
      shares: 37,
    },
    engagement: {
      completeness: 83,
      lastActive: "1d ago",
      trending: false,
      verified: true,
      featured: false,
      topPerformer: false,
      growthRate: "+22%",
      badges: ["Corporate Resources", "Strategic Investor"],
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
      email: "info@digitalhorizons.example.com",
      phone: "+225 27 555 0123",
      website: "https://digitalhorizons.example.com",
      social: {
        linkedin: "https://linkedin.com/company/digitalhorizons",
        twitter: "https://twitter.com/digitalhorizons",
      },
    },
  },
  {
    id: "frontier-partners",
    name: "Frontier Partners",
    type: "Private Equity",
    avatar: "FP",
    logo: "/placeholder.svg?height=80&width=80",
    tagline: "Growth equity for Africa's market leaders",
    location: "Casablanca, Morocco",
    focus: ["Consumer Goods", "Retail", "Healthcare", "Education"],
    stage: ["Series B", "Series C", "Growth"],
    investments: 12,
    portfolioCompanies: ["MediPlus", "EduTech Africa", "RetailPro"],
    averageInvestment: "$10M - $30M",
    totalFundSize: "$250M",
    activelyInvesting: true,
    bio: "Growth equity firm investing in market-leading companies across North and West Africa.",
    description:
      "Frontier Partners is a growth equity firm that invests in established market leaders across North and West Africa. We focus on consumer goods, retail, healthcare, and education sectors, providing significant capital investments to help companies accelerate growth, improve operations, and expand regionally. Our team brings decades of operational experience to help our portfolio companies navigate complex markets.",
    foundedYear: 2011,
    engagementScore: 86,
    responseRate: 81,
    successfulExits: 5,
    verified: true,
    team: [
      { name: "Youssef El Mansouri", role: "Senior Partner", image: "/placeholder-user.jpg" },
      { name: "Nadia Bensouda", role: "Partner", image: "/placeholder-user.jpg" },
      { name: "Ibrahim Toure", role: "Operating Partner", image: "/placeholder-user.jpg" },
    ],
    socialProof: {
      views: 680,
      followers: 320,
      connections: 165,
      likes: 74,
      shares: 31,
    },
    engagement: {
      completeness: 86,
      lastActive: "4h ago",
      trending: false,
      verified: true,
      featured: true,
      topPerformer: true,
      growthRate: "+18%",
      badges: ["Regional Leader", "Operational Expertise"],
    },
    media: {
      coverImage: "/placeholder.svg?height=240&width=800",
      gallery: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
    },
    contact: {
      email: "info@frontierpartners.example.com",
      phone: "+212 522 555 0123",
      website: "https://frontierpartners.example.com",
      social: {
        linkedin: "https://linkedin.com/company/frontierpartners",
        twitter: "https://twitter.com/frontierpartners",
      },
    },
  },
]

// Mock data for investment opportunities
const investmentOpportunities = [
  {
    id: "opp-1",
    title: "Fintech Fund I",
    investor: "Savannah Ventures",
    type: "Syndicate",
    minInvestment: "$25,000",
    targetRaise: "$5M",
    raised: "$3.2M",
    deadline: "Mar 30, 2023",
    focus: "Fintech startups in East Africa",
    progress: 64,
  },
  {
    id: "opp-2",
    title: "Women Founders Initiative",
    investor: "Tech Angels Network",
    type: "Angel Fund",
    minInvestment: "$10,000",
    targetRaise: "$2M",
    raised: "$1.5M",
    deadline: "Apr 15, 2023",
    focus: "Female-led tech startups across Africa",
    progress: 75,
  },
  {
    id: "opp-3",
    title: "Agritech Innovation Fund",
    investor: "Impact Ventures",
    type: "Sector Fund",
    minInvestment: "$50,000",
    targetRaise: "$10M",
    raised: "$4.2M",
    deadline: "May 5, 2023",
    focus: "Agricultural technology solutions",
    progress: 42,
  },
  {
    id: "opp-4",
    title: "Clean Energy Fund",
    investor: "Growth Partners Africa",
    type: "Sector Fund",
    minInvestment: "$100,000",
    targetRaise: "$15M",
    raised: "$8.7M",
    deadline: "Jun 20, 2023",
    focus: "Renewable energy projects across Africa",
    progress: 58,
  },
  {
    id: "opp-5",
    title: "Digital Health Accelerator",
    investor: "Future Fund",
    type: "Corporate Fund",
    minInvestment: "$30,000",
    targetRaise: "$3M",
    raised: "$1.8M",
    deadline: "Jul 10, 2023",
    focus: "Digital health solutions for underserved communities",
    progress: 60,
  },
  {
    id: "opp-6",
    title: "Logistics Innovation Fund",
    investor: "Innovation Capital",
    type: "Sector Fund",
    minInvestment: "$75,000",
    targetRaise: "$8M",
    raised: "$5.3M",
    deadline: "Aug 5, 2023",
    focus: "Supply chain and logistics technology",
    progress: 66,
  },
  {
    id: "opp-7",
    title: "EdTech Innovation Fund",
    investor: "Digital Horizons",
    type: "Corporate Fund",
    minInvestment: "$50,000",
    targetRaise: "$7M",
    raised: "$3.9M",
    deadline: "Sep 15, 2023",
    focus: "Educational technology solutions for African markets",
    progress: 56,
  },
  {
    id: "opp-8",
    title: "Healthcare Ventures Fund",
    investor: "Frontier Partners",
    type: "Sector Fund",
    minInvestment: "$150,000",
    targetRaise: "$20M",
    raised: "$12.8M",
    deadline: "Oct 10, 2023",
    focus: "Healthcare innovation and medical technology",
    progress: 64,
  },
  {
    id: "opp-9",
    title: "Sustainable Agriculture Fund",
    investor: "Sahara Ventures",
    type: "Impact Fund",
    minInvestment: "$25,000",
    targetRaise: "$4M",
    raised: "$2.7M",
    deadline: "Nov 5, 2023",
    focus: "Climate-smart agriculture and food security solutions",
    progress: 68,
  },
  {
    id: "opp-10",
    title: "E-commerce Growth Fund",
    investor: "Horizon Capital",
    type: "Sector Fund",
    minInvestment: "$75,000",
    targetRaise: "$12M",
    raised: "$7.8M",
    deadline: "Dec 1, 2023",
    focus: "Digital commerce and retail technology",
    progress: 65,
  },
]

// Mock data for upcoming events
const upcomingEvents = [
  {
    id: "event-1",
    title: "Investor Pitch Day",
    host: "Innovation Capital",
    date: "March 25, 2023",
    time: "10:00 AM - 2:00 PM",
    location: "Virtual",
    description: "Pitch your startup to our investment committee and partner investors.",
    spots: "10 startup spots available",
  },
  {
    id: "event-2",
    title: "Fundraising Masterclass",
    host: "Growth Partners Africa",
    date: "April 8, 2023",
    time: "2:00 PM - 4:00 PM",
    location: "Accra, Ghana",
    description: "Learn effective fundraising strategies from successful founders and investors.",
    spots: "50 attendee spots available",
  },
  {
    id: "event-3",
    title: "VC Office Hours",
    host: "Future Fund",
    date: "April 12, 2023",
    time: "9:00 AM - 12:00 PM",
    location: "Hybrid (Kigali & Virtual)",
    description: "One-on-one sessions with our investment team to discuss your startup.",
    spots: "15 startup spots available",
  },
  {
    id: "event-4",
    title: "African Fintech Summit",
    host: "Horizon Capital",
    date: "April 20, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "Cairo, Egypt & Virtual",
    description: "Annual summit bringing together fintech innovators, investors, and regulators from across Africa.",
    spots: "200 attendee spots available",
  },
  {
    id: "event-5",
    title: "Sustainable Ventures Showcase",
    host: "Sahara Ventures",
    date: "May 5, 2023",
    time: "1:00 PM - 4:00 PM",
    location: "Dar es Salaam, Tanzania",
    description: "Showcase of startups developing sustainable solutions for environmental challenges.",
    spots: "30 startup spots available",
  },
  {
    id: "event-6",
    title: "Digital Transformation Conference",
    host: "Digital Horizons",
    date: "May 18, 2023",
    time: "10:00 AM - 6:00 PM",
    location: "Abidjan, Côte d'Ivoire",
    description: "Conference focused on digital transformation strategies for African businesses.",
    spots: "150 attendee spots available",
  },
  {
    id: "event-7",
    title: "Growth Equity Masterclass",
    host: "Frontier Partners",
    date: "June 2, 2023",
    time: "2:00 PM - 5:00 PM",
    location: "Casablanca, Morocco",
    description: "Learn about scaling businesses and preparing for growth equity investment.",
    spots: "75 attendee spots available",
  },
]

// Investor types for filtering
const investorTypes = [
  "All Types",
  "Venture Capital",
  "Angel Network",
  "Private Equity",
  "Corporate VC",
  "Impact Investor",
]

// Locations for filtering
const locations = ["All Locations", "Nairobi", "Lagos", "Cape Town", "Accra", "Kigali", "Johannesburg"]

// Investment stages for filtering
const investmentStages = ["All Stages", "Pre-seed", "Seed", "Series A", "Series B", "Series C+"]

// Focus areas for filtering
const focusAreas = [
  "All Focus Areas",
  "Fintech",
  "Agritech",
  "Healthtech",
  "E-commerce",
  "Logistics",
  "SaaS",
  "AI",
  "Mobile",
  "Renewable Energy",
  "Infrastructure",
  "Manufacturing",
  "Edtech",
  "Cleantech",
  "Digital Health",
  "Social Enterprise",
  "Sustainable Agriculture",
  "Clean Energy",
]

// Sort options
const sortOptions = [
  { value: "trending", label: "Trending" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "most-investments", label: "Most Investments" },
  { value: "largest-fund", label: "Largest Fund Size" },
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

// Get badges for investors based on their engagement metrics
const getBadges = (investor) => {
  const badges = []

  if (investor.engagement.trending) {
    badges.push({ label: "Trending", icon: <TrendingUp className="h-3 w-3" />, color: "bg-orange-500" })
  }

  if (investor.engagement.topPerformer) {
    badges.push({ label: "Top Performer", icon: <Trophy className="h-3 w-3" />, color: "bg-amber-500" })
  }

  if (investor.engagement.featured) {
    badges.push({ label: "Featured", icon: <Star className="h-3 w-3" />, color: "bg-blue-500" })
  }

  if (investor.engagement.growthRate) {
    badges.push({
      label: investor.engagement.growthRate,
      icon: <LineChart className="h-3 w-3" />,
      color: "bg-emerald-500",
    })
  }

  if (investor.engagement.verified) {
    badges.push({ label: "Verified", icon: <Check className="h-3 w-3" />, color: "bg-blue-500", discreet: true })
  }

  return badges
}

// Sort function for investors
const sortInvestors = (investors, sortBy) => {
  switch (sortBy) {
    case "trending":
      return [...investors].sort((a, b) => {
        if (a.engagement.trending && !b.engagement.trending) return -1
        if (!a.engagement.trending && b.engagement.trending) return 1
        return 0
      })
    case "newest":
      return [...investors].sort((a, b) => b.foundedYear - a.foundedYear)
    case "oldest":
      return [...investors].sort((a, b) => a.foundedYear - b.foundedYear)
    case "most-investments":
      return [...investors].sort((a, b) => b.investments - a.investments)
    case "largest-fund":
      return [...investors].sort((a, b) => {
        const aFund = Number.parseFloat(a.totalFundSize.replace(/[^\d.]/g, ""))
        const bFund = Number.parseFloat(b.totalFundSize.replace(/[^\d.]/g, ""))
        return bFund - aFund
      })
    case "alphabetical":
      return [...investors].sort((a, b) => a.name.localeCompare(b.name))
    default:
      return investors
  }
}

// Type definition for Investor
type Investor = (typeof investorData)[0]

export default function InvestorsPage() {
  // State for filters and view options
  const [filters, setFilters] = useState({
    type: "All Types",
    location: "All Locations",
    stage: "All Stages",
    focus: "All Focus Areas",
    minInvestment: 0,
    maxInvestment: 20,
    foundedAfter: 2010,
    onlyVerified: false,
    onlyActive: false,
    searchQuery: "",
  })
  const [sortBy, setSortBy] = useState("trending")
  const [viewMode, setViewMode] = useState("grid")
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [bookmarkedInvestors, setBookmarkedInvestors] = useState<Investor[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationContent, setNotificationContent] = useState<{ investor: Investor; message: string } | null>(null)
  const [appUserMetrics, setAppUserMetrics] = useState({
    profileViews: 0,
    investorViews: [],
    recentSearches: [],
    interests: [],
  })

  // Ref for scroll position
  const scrollRef = useRef<HTMLDivElement>(null)

  // Filter investors based on active filters
  const filteredInvestors = investorData.filter((investor) => {
    // Filter by type
    if (filters.type !== "All Types" && investor.type !== filters.type) return false

    // Filter by location
    if (filters.location !== "All Locations" && investor.location.split(", ")[0] !== filters.location) return false

    // Filter by investment stage
    if (filters.stage !== "All Stages" && !investor.stage.includes(filters.stage)) return false

    // Filter by focus area
    if (filters.focus !== "All Focus Areas" && !investor.focus.includes(filters.focus)) return false

    // Filter by investment amount
    const minInvestment = Number.parseFloat(investor.averageInvestment.split(" - ")[0].replace(/[^\d.]/g, ""))
    const maxInvestment = Number.parseFloat(investor.averageInvestment.split(" - ")[1].replace(/[^\d.]/g, ""))
    if (minInvestment > filters.maxInvestment || maxInvestment < filters.minInvestment) return false

    // Filter by founding year
    if (investor.foundedYear < filters.foundedAfter) return false

    // Filter by verification status
    if (filters.onlyVerified && !investor.verified) return false

    // Filter by active investing status
    if (filters.onlyActive && !investor.activelyInvesting) return false

    // Filter by search query
    if (
      filters.searchQuery &&
      !investor.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !investor.bio.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
      !investor.focus.some((f) => f.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    )
      return false

    return true
  })

  // Sort filtered investors
  const sortedInvestors = sortInvestors(filteredInvestors, sortBy)

  // Show notification after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      const randomInvestor = investorData[Math.floor(Math.random() * investorData.length)]
      setNotificationContent({
        investor: randomInvestor,
        message: "just updated their profile with new investment criteria",
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
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const query = "value" in e.target ? e.target.value : ""
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }))

    // Track search for personalization if it's significant
    if (query.length > 3 && "key" in e && e.key === "Enter") {
      setAppUserMetrics((prev) => ({
        ...prev,
        recentSearches: [query, ...prev.recentSearches.slice(0, 4)],
      }))
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      type: "All Types",
      location: "All Locations",
      stage: "All Stages",
      focus: "All Focus Areas",
      minInvestment: 0,
      maxInvestment: 20,
      foundedAfter: 2010,
      onlyVerified: false,
      onlyActive: false,
      searchQuery: "",
    })

    // Reset any UI elements that need to be reset
    const typeSelect = document.querySelector('[name="type"]') as HTMLSelectElement
    const locationSelect = document.querySelector('[name="location"]') as HTMLSelectElement
    const stageSelect = document.querySelector('[name="stage"]') as HTMLSelectElement
    const focusSelect = document.querySelector('[name="focus"]') as HTMLSelectElement

    if (typeSelect) typeSelect.value = "All Types"
    if (locationSelect) locationSelect.value = "All Locations"
    if (stageSelect) stageSelect.value = "All Stages"
    if (focusSelect) focusSelect.value = "All Focus Areas"

    // Reset any checkboxes
    const verifiedCheckbox = document.getElementById("verified-only") as HTMLInputElement
    const activeCheckbox = document.getElementById("active-only") as HTMLInputElement

    if (verifiedCheckbox) verifiedCheckbox.checked = false
    if (activeCheckbox) activeCheckbox.checked = false
  }

  // Track investor views
  const handleViewInvestor = (investor: Investor) => {
    setSelectedInvestor(investor)
    setAppUserMetrics((prev) => ({
      ...prev,
      investorViews: [...prev.investorViews.filter((i) => i.id !== investor.id), investor],
    }))
  }

  // Toggle bookmark
  const handleBookmark = (investor: Investor, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()

    setBookmarkedInvestors((prev) => {
      const isBookmarked = prev.some((i) => i.id === investor.id)

      // Show feedback notification
      setNotificationContent({
        investor: investor,
        message: isBookmarked ? "removed from your bookmarks" : "added to your bookmarks",
      })
      setShowNotification(true)

      return isBookmarked ? prev.filter((i) => i.id !== investor.id) : [...prev, investor]
    })
  }

  // Render investor card based on view mode
  const renderInvestorCard = (investor: Investor) => {
    const isBookmarked = bookmarkedInvestors.some((i) => i.id === investor.id)

    if (viewMode === "grid") {
      return (
        <Card
          key={investor.id}
          className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer border hover:border-primary/50"
          onClick={() => handleViewInvestor(investor)}
        >
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-primary/10 text-primary">
                <AvatarImage src={investor.logo} alt={investor.name} />
                <AvatarFallback>{investor.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <CardTitle className="text-base truncate">{investor.name}</CardTitle>
                  {investor.verified && (
                    <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-blue-500 rounded-full">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </Badge>
                  )}
                  {investor.engagement.trending && (
                    <Badge variant="outline" className="ml-1 text-xs bg-orange-50 text-orange-700 border-orange-200">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {investor.location}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={(e) => handleBookmark(investor, e)}
              >
                <Bookmark className={cn("h-4 w-4", isBookmarked ? "fill-current text-primary" : "")} />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2">
            <p className="text-sm line-clamp-2 h-10">{investor.tagline}</p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {getBadges(investor)
                .filter((b) => !b.discreet)
                .slice(0, 3)
                .map((badge, i) => (
                  <Badge key={i} className={cn("text-xs", badge.color)}>
                    {badge.icon}
                    <span className="ml-1">{badge.label}</span>
                  </Badge>
                ))}

              {getBadges(investor).filter((b) => !b.discreet).length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{getBadges(investor).filter((b) => !b.discreet).length - 3} more
                </Badge>
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span>Fund: {investor.totalFundSize}</span>
                <span>Investments: {investor.investments}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex flex-col gap-2">
            <Separator />
            <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{investor.socialProof.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{investor.socialProof.followers}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{investor.engagement.lastActive}</span>
              </div>
            </div>

            <div className="w-full">
              <Progress value={investor.engagement.completeness} className="h-1" />
            </div>
          </CardFooter>
        </Card>
      )
    } else if (viewMode === "list") {
      return (
        <Card
          key={investor.id}
          className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer border hover:border-primary/50"
          onClick={() => handleViewInvestor(investor)}
        >
          <div className="flex flex-col md:flex-row p-4">
            <div className="flex items-start gap-4 md:w-1/3">
              <Avatar className="h-12 w-12 bg-primary/10 text-primary">
                <AvatarImage src={investor.logo} alt={investor.name} />
                <AvatarFallback>{investor.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <h3 className="font-semibold">{investor.name}</h3>
                  {investor.verified && (
                    <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-blue-500 rounded-full">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{investor.location}</span>
                  <span>•</span>
                  <span>{investor.type}</span>
                  <span>•</span>
                  <span>Founded {investor.foundedYear}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {getBadges(investor)
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
              <p className="text-sm line-clamp-2">{investor.tagline}</p>
              <div className="mt-2 flex items-center gap-4 text-sm">
                <div>
                  <span className="font-medium">Fund Size:</span> {investor.totalFundSize}
                </div>
                <div>
                  <span className="font-medium">Investments:</span> {investor.investments}
                </div>
                <div>
                  <span className="font-medium">Avg Deal:</span> {investor.averageInvestment}
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0 md:w-1/4 flex flex-col md:items-end justify-between">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full self-end"
                onClick={(e) => handleBookmark(investor, e)}
              >
                <Bookmark className={cn("h-4 w-4", isBookmarked ? "fill-current text-primary" : "")} />
              </Button>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{investor.socialProof.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{investor.engagement.lastActive}</span>
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
          key={investor.id}
          className="flex items-center gap-3 p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors"
          onClick={() => handleViewInvestor(investor)}
        >
          <Avatar className="h-8 w-8 bg-primary/10 text-primary">
            <AvatarImage src={investor.logo} alt={investor.name} />
            <AvatarFallback>{investor.avatar}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="font-medium truncate">{investor.name}</p>
              {investor.verified && (
                <Badge className="h-3 w-3 p-0 flex items-center justify-center bg-blue-500 rounded-full">
                  <Check className="h-2 w-2 text-white" />
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate">{investor.tagline}</p>
          </div>
          <div className="text-right text-xs">
            <div>{investor.totalFundSize}</div>
            <div className="text-muted-foreground">{investor.type}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={(e) => handleBookmark(investor, e)}
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
              <h1 className="text-3xl font-extrabold tracking-tight">Investors</h1>
              <p className="text-muted-foreground">Connect with top investors across Africa</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investors..."
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
                  <TooltipContent>Your bookmarks ({bookmarkedInvestors.length})</TooltipContent>
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
                    Add Your Fund
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Add Your Investment Fund</DialogTitle>
                    <DialogDescription>Fill in the details to add your fund to the platform.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Fund Name
                      </Label>
                      <Input id="name" placeholder="Fund name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tagline" className="text-right">
                        Tagline
                      </Label>
                      <Input id="tagline" placeholder="Brief description" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Investor Type
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {investorTypes
                            .filter((i) => i !== "All Types")
                            .map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Fund</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Featured investors carousel */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Featured Investors
              </h2>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {investorData
                .filter((investor) => investor.engagement.featured)
                .slice(0, 3)
                .map((investor) => (
                  <Card
                    key={investor.id}
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-all group"
                    onClick={() => handleViewInvestor(investor)}
                  >
                    <div className="relative h-40 w-full">
                      <Image
                        src={investor.media.coverImage || "/placeholder.svg"}
                        alt={investor.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <div className="flex items-center gap-1">
                          <h3 className="font-bold">{investor.name}</h3>
                          {investor.verified && (
                            <Badge className="h-4 w-4 p-0 flex items-center justify-center bg-blue-500 rounded-full">
                              <Check className="h-2.5 w-2.5 text-white" />
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-white/80">{investor.tagline}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">{investor.totalFundSize} fund size</div>
                          <div className="text-xs text-muted-foreground">
                            {investor.type} • {investor.investments} investments
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
                  {/* Investor type filter */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Investor Type</h3>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {investorTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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

                  {/* Investment stage filter */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Investment Stage</h3>
                    <Select
                      value={filters.stage}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, stage: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {investmentStages.map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Focus area filter */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Focus Area</h3>
                    <Select
                      value={filters.focus}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, focus: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select focus" />
                      </SelectTrigger>
                      <SelectContent>
                        {focusAreas.map((focus) => (
                          <SelectItem key={focus} value={focus}>
                            {focus}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Investment amount range */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Investment Size ($ Million)</h3>
                      <span className="text-xs text-muted-foreground">
                        ${filters.minInvestment}M - ${filters.maxInvestment}M+
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={20}
                      step={1}
                      value={[filters.minInvestment, filters.maxInvestment]}
                      onValueChange={([min, max]) =>
                        setFilters((prev) => ({ ...prev, minInvestment: min, maxInvestment: max }))
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
                      min={2000}
                      max={2020}
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
                      <Label htmlFor="verified-only">Verified investors only</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active-only"
                        checked={filters.onlyActive}
                        onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, onlyActive: checked }))}
                      />
                      <Label htmlFor="active-only">Actively investing only</Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Stats */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        Showing {sortedInvestors.length} of {investorData.length} investors
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recently viewed */}
              {appUserMetrics.investorViews.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Recently Viewed</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {appUserMetrics.investorViews.slice(0, 3).map((investor) => (
                      <div
                        key={investor.id}
                        className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                        onClick={() => handleViewInvestor(investor)}
                      >
                        <Avatar className="h-8 w-8 bg-primary/10 text-primary">
                          <AvatarImage src={investor.logo} alt={investor.name} />
                          <AvatarFallback>{investor.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{investor.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {investor.type} • {investor.investments} investments
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Trending sectors */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Trending Sectors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500">1</Badge>
                        <span className="font-medium">Fintech</span>
                      </div>
                      <Badge variant="outline">18 investors</Badge>
                    </div>
                    <Progress value={85} className="h-1.5" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500">2</Badge>
                        <span className="font-medium">CleanTech</span>
                      </div>
                      <Badge variant="outline">15 investors</Badge>
                    </div>
                    <Progress value={75} className="h-1.5" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500">3</Badge>
                        <span className="font-medium">HealthTech</span>
                      </div>
                      <Badge variant="outline">12 investors</Badge>
                    </div>
                    <Progress value={65} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main content area */}
            <div className="lg:col-span-9">
              {/* View options and sorting */}
              <Tabs defaultValue="investors" className="w-full mb-6">
                <TabsList className="w-full justify-start mb-6">
                  <TabsTrigger value="investors" className="flex-1">
                    Investors
                  </TabsTrigger>
                  <TabsTrigger value="opportunities" className="flex-1">
                    Co-Investment Opportunities
                  </TabsTrigger>
                  <TabsTrigger value="events" className="flex-1">
                    Events
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="investors">
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

                  {/* Investors list */}
                  {viewMode === "grid" ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {sortedInvestors.map((investor) => renderInvestorCard(investor))}
                    </div>
                  ) : viewMode === "list" ? (
                    <div className="space-y-4">{sortedInvestors.map((investor) => renderInvestorCard(investor))}</div>
                  ) : (
                    <Card>
                      <ScrollArea className="h-[600px]">
                        <div className="divide-y">
                          {sortedInvestors.map((investor) => renderInvestorCard(investor))}
                        </div>
                      </ScrollArea>
                    </Card>
                  )}

                  {/* Empty state */}
                  {sortedInvestors.length === 0 && (
                    <div className="text-center py-12">
                      <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <h3 className="text-lg font-medium">No investors found</h3>
                      <p className="text-muted-foreground">Adjust your filters to find relevant investors.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="opportunities">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold">Co-Investment Opportunities</h2>
                      <p className="text-muted-foreground">Explore curated co-investment opportunities</p>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Opportunity
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {investmentOpportunities.map((opportunity) => (
                      <Card key={opportunity.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">{opportunity.title}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {opportunity.investor} • {opportunity.type}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Min. Investment: {opportunity.minInvestment}</span>
                            <span>Deadline: {opportunity.deadline}</span>
                          </div>
                          <div className="mt-2">
                            <Progress value={opportunity.progress} className="h-2" />
                            <div className="flex items-center justify-between text-xs mt-1">
                              <span>Raised: {opportunity.raised}</span>
                              <span>Target: {opportunity.targetRaise}</span>
                            </div>
                          </div>
                          <p className="mt-3 text-sm line-clamp-2">{opportunity.focus}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button className="w-full">View Opportunity</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  {investmentOpportunities.length === 0 && (
                    <div className="text-center py-12">
                      <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <h3 className="text-lg font-medium">No investment opportunities found</h3>
                      <p className="text-muted-foreground">Check back later for new opportunities.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="events">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold">Upcoming Events</h2>
                      <p className="text-muted-foreground">Connect with investors and founders at these events</p>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {upcomingEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base">{event.title}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {event.host} • {event.date}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{event.time}</span>
                            <span>{event.location}</span>
                          </div>
                          <p className="mt-3 text-sm line-clamp-2">{event.description}</p>
                          <div className="mt-3 text-xs text-muted-foreground">{event.spots}</div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button className="w-full">Register Now</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>

                  {upcomingEvents.length === 0 && (
                    <div className="text-center py-12">
                      <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <h3 className="text-lg font-medium">No upcoming events found</h3>
                      <p className="text-muted-foreground">Check back later for new events.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 md:px-6 border-t bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          &copy; 2023 Your Company. All rights reserved.
        </div>
      </footer>

      {/* Notification toast */}
      <Dialog open={showNotification} onOpenChange={setShowNotification}>
        <DialogContent className="sm:max-w-[425px] bg-white border">
          <DialogHeader>
            <DialogTitle>
              <Bell className="mr-2 h-5 w-5 inline-block align-middle" />
              {notificationContent?.investor.name}
            </DialogTitle>
            <DialogDescription>
              {notificationContent?.investor.name} {notificationContent?.message}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

