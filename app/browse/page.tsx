"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Search } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const startups = [
  {
    id: 1,
    name: "Peanut pay",
    category: "fintech",
    description: "Simplified payments for African businesses",
    raised: 360000,
    goal: 1500000,
    stage: "seed",
    logo: "/placeholder.svg?height=40&width=40",
    founder: {
      name: "Stent Bucko",
      image: "/placeholder-user.jpg",
    },
  },
  {
    id: 2,
    name: "no pothole",
    category: "industrial",
    description: "AI-powered road maintenance solutions",
    raised: 135000,
    goal: 400000,
    stage: "seed",
    logo: "/placeholder.svg?height=40&width=40",
    founder: {
      name: "Bafo Tebza",
      image: "/placeholder-user.jpg",
    },
  },
]

export default function BrowsePage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [fundingStage, setFundingStage] = useState("")

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Discover Promising Startups</h1>
          <div className="flex items-center gap-2">
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search startups..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
              <SelectItem value="healthtech">Healthtech</SelectItem>
              <SelectItem value="edtech">Edtech</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={fundingStage} onValueChange={setFundingStage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Funding Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="pre-seed">Pre-seed</SelectItem>
              <SelectItem value="seed">Seed</SelectItem>
              <SelectItem value="series-a">Series A</SelectItem>
              <SelectItem value="series-b">Series B+</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-black text-white hover:bg-black/90">Apply Filters</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {startups.map((startup) => (
            <Card key={startup.id} className="flex flex-col">
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={startup.logo} alt={startup.name} />
                  <AvatarFallback>{startup.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{startup.name}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {startup.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{startup.description}</p>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 font-medium">${startup.raised.toLocaleString()} raised</span>
                    <span className="text-muted-foreground">${startup.goal.toLocaleString()} goal</span>
                  </div>
                  <Progress value={(startup.raised / startup.goal) * 100} className="h-2" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={startup.founder.image} alt={startup.founder.name} />
                    <AvatarFallback>{startup.founder.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{startup.founder.name}</span>
                    <Badge variant="outline">{startup.stage}</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={`/startup/${startup.id}`}>
                    View Details
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

