"use client"

import { ArrowUpRight, BarChart3, Heart, MessageSquare, Share2, TrendingUp, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function DemoDashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Demo Dashboard</h1>
          <p className="text-muted-foreground">
            This is a preview of what your dashboard would look like.
            <Link href="/signup" className="ml-1 text-primary underline underline-offset-4">
              Sign up
            </Link>{" "}
            to get started with your own personalized dashboard.
          </p>
        </div>

        <div className="relative rounded-lg border border-dashed p-4">
          <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-medium">DEMO MODE</div>
          <p className="text-sm text-muted-foreground">
            You're viewing a demo version with sample data. All features are fully functional in your personal account.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 unread</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">132</div>
            <p className="text-xs text-muted-foreground">+28% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment Opportunities</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 new this week</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="feed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>TS</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">TechNova Solutions</div>
                <div className="text-sm text-muted-foreground">Posted 2 hours ago</div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Excited to announce that TechNova has secured our seed funding round of R5 million! 🚀 We're now looking
                to expand our team and accelerate product development.
              </p>
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="font-semibold">Funding Update</div>
                <p className="text-sm text-muted-foreground">
                  Seed round: R5 million
                  <br />
                  Lead investor: Savannah Ventures
                  <br />
                  Next milestone: Product launch in Q3
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex items-center gap-4 border-t px-6 py-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  alert("Sign up to interact with posts!")
                }}
              >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Like</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  alert("Sign up to comment on posts!")
                }}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  alert("Sign up to share posts!")
                }}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>SV</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">Sarah Venter, Horizon Capital</div>
                <div className="text-sm text-muted-foreground">Posted 5 hours ago</div>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Looking for innovative fintech startups focused on financial inclusion in South Africa. We're
                particularly interested in solutions targeting the unbanked population. Our investment range is R2-10
                million for the right team and product. DM me if you're building in this space! #fintech #southafrica
                #investment
              </p>
            </CardContent>
            <CardFooter className="flex items-center gap-4 border-t px-6 py-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  alert("Sign up to interact with posts!")
                }}
              >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Like</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  alert("Sign up to comment on posts!")
                }}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Comment</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  alert("Sign up to share posts!")
                }}
              >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trending Topics</CardTitle>
              <CardDescription>Popular discussions in the South African startup ecosystem</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-primary">#1</span>
                  <div>
                    <p className="text-sm font-medium leading-none">#SouthAfricanTech</p>
                    <p className="text-sm text-muted-foreground">243 posts in the last 24 hours</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    alert("Sign up to view trending topics!")
                  }}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-primary">#2</span>
                  <div>
                    <p className="text-sm font-medium leading-none">#VentureCapital</p>
                    <p className="text-sm text-muted-foreground">187 posts in the last 24 hours</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    alert("Sign up to view trending topics!")
                  }}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-primary">#3</span>
                  <div>
                    <p className="text-sm font-medium leading-none">#CleanTechSA</p>
                    <p className="text-sm text-muted-foreground">156 posts in the last 24 hours</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    alert("Sign up to view trending topics!")
                  }}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recommended" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
              <CardDescription>Startups and investors that match your interests</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback>EC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">EcoSolar Solutions</p>
                    <p className="text-sm text-muted-foreground">Renewable energy startup</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    alert("Sign up to connect with startups and investors!")
                  }}
                >
                  Connect
                </Button>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback>AF</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">African Fintech Fund</p>
                    <p className="text-sm text-muted-foreground">Early-stage VC firm</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    alert("Sign up to connect with startups and investors!")
                  }}
                >
                  Connect
                </Button>
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback>HT</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium leading-none">HealthTech Africa</p>
                    <p className="text-sm text-muted-foreground">Healthcare innovation platform</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    alert("Sign up to connect with startups and investors!")
                  }}
                >
                  Connect
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  window.location.href = "/signup"
                }}
              >
                Sign Up to See More
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

