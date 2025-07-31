"use client"

import { useState } from "react"
import { Search, Filter, Building2, Users, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for demonstration
const mockStartups = [
  {
    id: 1,
    name: "EcoTech Solutions",
    industry: "CleanTech",
    stage: "Seed",
    description: "Sustainable energy solutions for African households",
    location: "Cape Town",
  },
  {
    id: 2,
    name: "HealthTech Africa",
    industry: "Healthcare",
    stage: "Series A",
    description: "Digital healthcare platform connecting patients with providers",
    location: "Johannesburg",
  },
]

const mockInvestors = [
  {
    id: 1,
    name: "Venture Capital Partners",
    type: "VC Firm",
    focus: "Early-stage tech",
    description: "Investing in innovative African startups",
    location: "Cape Town",
  },
  {
    id: 2,
    name: "Growth Fund Africa",
    type: "Growth Fund",
    focus: "Series A+",
    description: "Supporting scaling African businesses",
    location: "Johannesburg",
  },
]

const mockEvents = [
  {
    id: 1,
    title: "Startup Summit 2024",
    type: "Conference",
    date: "April 15-18, 2024",
    location: "Cape Town",
    description: "The largest gathering of African startups and investors",
  },
  {
    id: 2,
    title: "Pitch Night",
    type: "Pitch Event",
    date: "March 28, 2024",
    location: "Johannesburg",
    description: "Monthly pitch event for early-stage startups",
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("startups")

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Search</h1>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search startups, investors, or events..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="startups" className="space-y-4">
          <TabsList>
            <TabsTrigger value="startups" onClick={() => setActiveTab("startups")}>
              <Building2 className="mr-2 h-4 w-4" />
              Startups
            </TabsTrigger>
            <TabsTrigger value="investors" onClick={() => setActiveTab("investors")}>
              <Users className="mr-2 h-4 w-4" />
              Investors
            </TabsTrigger>
            <TabsTrigger value="events" onClick={() => setActiveTab("events")}>
              <Calendar className="mr-2 h-4 w-4" />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="startups" className="space-y-4">
            {mockStartups.map((startup) => (
              <Card key={startup.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{startup.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{startup.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {startup.industry} • {startup.stage} • {startup.location}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{startup.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="investors" className="space-y-4">
            {mockInvestors.map((investor) => (
              <Card key={investor.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{investor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{investor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {investor.type} • {investor.focus} • {investor.location}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{investor.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            {mockEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{event.title[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {event.type} • {event.date} • {event.location}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 