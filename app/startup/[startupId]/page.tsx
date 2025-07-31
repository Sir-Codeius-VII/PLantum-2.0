"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Calendar, Mail, MapPin, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShareAgreement } from "@/components/share-agreement"
import { TrustProfile } from "@/components/trust-profile"

// Mock data for the startup
const startupData = {
  id: "ecosolar-solutions",
  name: "EcoSolar Solutions",
  logo: "/placeholder.svg?height=80&width=80",
  coverImage: "/placeholder.svg?height=240&width=800",
  tagline: "Renewable energy solutions for South Africa",
  description:
    "EcoSolar Solutions is a leading provider of renewable energy solutions in South Africa. We specialize in solar panel installations for residential and commercial properties, helping customers reduce their carbon footprint and save on energy costs.",
  industry: "CleanTech",
  location: "Cape Town, South Africa",
  founded: 2018,
  stage: "Seed",
  employees: "11-50",
  website: "https://ecosolar.example.com",
  socialLinks: {
    twitter: "https://twitter.com/ecosolar",
    linkedin: "https://linkedin.com/company/ecosolar",
    facebook: "https://facebook.com/ecosolar",
  },
  funding: {
    raised: "R3.5M",
    target: "R5M",
    progress: 70,
    investors: 12,
    round: "Seed",
    closingDate: "June 30, 2023",
  },
  team: [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/placeholder-user.jpg",
      bio: "Former renewable energy consultant with 10+ years of experience in the industry.",
    },
    {
      name: "David Nkosi",
      role: "CTO",
      image: "/placeholder-user.jpg",
      bio: "Electrical engineer with expertise in solar panel technology and installation.",
    },
    {
      name: "Thabo Molefe",
      role: "COO",
      image: "/placeholder-user.jpg",
      bio: "Operations specialist with experience scaling startups across Southern Africa.",
    },
  ],
  metrics: {
    customers: 150,
    installations: 200,
    revenueGrowth: "+45%",
    carbonOffset: "500 tons",
  },
  documents: [
    { name: "Pitch Deck", type: "pdf", size: "2.4 MB", date: "May 15, 2023" },
    { name: "Financial Projections", type: "xlsx", size: "1.8 MB", date: "May 10, 2023" },
    { name: "Business Plan", type: "pdf", size: "3.5 MB", date: "April 28, 2023" },
  ],
  updates: [
    {
      date: "May 20, 2023",
      title: "Secured Partnership with Cape Town Municipality",
      content:
        "We're excited to announce our new partnership with the Cape Town Municipality to install solar panels on government buildings.",
    },
    {
      date: "April 15, 2023",
      title: "Reached 200 Installations Milestone",
      content:
        "We've successfully completed our 200th installation, helping our customers save over R2 million in energy costs collectively.",
    },
    {
      date: "March 5, 2023",
      title: "Expanded Team with 5 New Hires",
      content:
        "We've grown our team with 5 new technical specialists to help us meet the increasing demand for our services.",
    },
  ],
  trustRating: {
    trustScore: 87,
    verificationLevel: "verified",
    ratings: {
      overall: 4.7,
      totalRatings: 42,
      breakdown: {
        5: 30,
        4: 8,
        3: 3,
        2: 1,
        1: 0,
      },
      categories: {
        reliability: 4.8,
        communication: 4.6,
        expertise: 4.9,
        transparency: 4.5,
      },
    },
    trustFactors: {
      verifiedDocuments: true,
      completedDeals: 8,
      yearsActive: 5,
      communityEndorsements: 24,
    },
  },
}

export default function StartupDetailPage() {
  const params = useParams()
  const startupId = params.startupId
  const [activeTab, setActiveTab] = useState("overview")
  const [showShareAgreement, setShowShareAgreement] = useState(false)

  // In a real app, you would fetch the startup data based on the ID
  // const { data: startup, isLoading, error } = useStartupData(startupId)

  const startup = startupData // Using mock data for now

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 w-full bg-gray-200">
        <img
          src={startup.coverImage || "/placeholder.svg"}
          alt={`${startup.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Startup Header */}
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-20 relative z-10">
              <Avatar className="h-24 w-24 rounded-xl border-4 border-background shadow-md">
                <AvatarImage src={startup.logo} alt={startup.name} />
                <AvatarFallback className="rounded-xl">{startup.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{startup.name}</h1>
                  <Badge className="bg-green-500 text-white">Verified</Badge>
                  <Badge variant="outline" className="text-xs">
                    {startup.industry}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{startup.tagline}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {startup.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    Founded {startup.founded}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    {startup.employees} employees
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <Button onClick={() => setShowShareAgreement(true)}>
                  Contact
                  <Mail className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>About {startup.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{startup.description}</p>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Funding Goal</h4>
                      <p>{startup.fundingGoal}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="team">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {startup.team.map((member, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-gray-500">{member.role}</p>
                        <p className="mt-1">{member.bio}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="financials">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Add financial data here */}
                    <p>Financial data will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Add document list here */}
                    <p>List of important documents will be displayed here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            {/* Trust Profile Component */}
            <TrustProfile
              entityName={startup.name}
              entityType="startup"
              averageRating={startup.trustRating.ratings.overall}
              totalRatings={startup.trustRating.ratings.totalRatings}
              verificationLevel={startup.trustRating.verificationLevel}
              joinedDate={`${startup.founded}`}
              successfulDeals={startup.trustRating.trustFactors.completedDeals}
            />

            <Card>
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Funding Goal</h4>
                    <p className="text-xl font-bold">{startup.fundingGoal}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Minimum Investment</h4>
                    <p className="text-xl font-bold">R10,000</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Equity Offered</h4>
                    <p className="text-xl font-bold">8%</p>
                  </div>
                  <Button className="w-full mt-4" onClick={() => setShowShareAgreement(true)}>
                    Invest Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {showShareAgreement && <ShareAgreement startupName={startup.name} onClose={() => setShowShareAgreement(false)} />}
    </div>
  )
}

