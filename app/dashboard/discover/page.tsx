"use client"

import { useState } from "react"
import { ArrowUpRight, Heart, MessageSquare, Share2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function DiscoverPage() {
  const [postContent, setPostContent] = useState("")

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your thoughts with the South African startup community..."
                  className="resize-none border-none focus-visible:ring-0 p-0"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardFooter className="flex justify-between border-t px-6 py-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 15h18" />
                    <path d="M9 9h.01" />
                    <path d="M15 9h.01" />
                  </svg>
                  Add Media
                </Button>
                <Button variant="outline" size="sm">
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Add Document
                </Button>
              </div>
              <Button disabled={!postContent.trim()}>Post</Button>
            </CardFooter>
          </Card>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="startups">Startups</TabsTrigger>
              <TabsTrigger value="investors">Investors</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>AF</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold">African Fintech Fund</div>
                    <div className="text-sm text-muted-foreground">Posted 3 hours ago</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    We're excited to announce our new R100 million fund focused on fintech startups across South Africa!
                    We're particularly interested in solutions addressing financial inclusion, payments, and blockchain
                    technology.
                  </p>
                  <p className="mb-4">
                    Our investment range is R2-10 million for early-stage startups with a working product and initial
                    traction.
                  </p>
                  <p>
                    If you're building in this space, we'd love to hear from you! Tag us or DM for more information.
                    #fintech #southafrica #venturecapital #investment
                  </p>
                </CardContent>
                <CardFooter className="flex items-center gap-4 border-t px-6 py-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Like</span>
                  </Button>
                  <span className="text-xs text-muted-foreground">42 likes</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Comment</span>
                  </Button>
                  <span className="text-xs text-muted-foreground">12 comments</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>HT</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold">HealthTech Africa</div>
                    <div className="text-sm text-muted-foreground">Posted 5 hours ago</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    We're looking for a senior full-stack developer to join our growing team in Johannesburg. Our
                    platform connects patients with healthcare providers across South Africa, and we're expanding to
                    three new provinces this year.
                  </p>
                  <p>
                    Tech stack: React, Node.js, PostgreSQL, AWS
                    <br />
                    Competitive salary + equity options
                    <br />
                    Remote-friendly with quarterly in-person meetings
                  </p>
                  <p className="mt-4">
                    DM us if you're interested or know someone who might be! #hiring #healthtech #developer #southafrica
                  </p>
                </CardContent>
                <CardFooter className="flex items-center gap-4 border-t px-6 py-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Like</span>
                  </Button>
                  <span className="text-xs text-muted-foreground">28 likes</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Comment</span>
                  </Button>
                  <span className="text-xs text-muted-foreground">7 comments</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>JM</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold">John Moyo, Startup Advisor</div>
                    <div className="text-sm text-muted-foreground">Posted 8 hours ago</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Just published my analysis of the South African startup ecosystem in 2024. Key findings:
                  </p>
                  <ul className="list-disc pl-5 mb-4">
                    <li>Total funding increased by 32% compared to 2023</li>
                    <li>Fintech remains the top sector, followed by healthtech and cleantech</li>
                    <li>More international VCs entering the market</li>
                    <li>Average seed round size increased to R8.5 million</li>
                  </ul>
                  <p>
                    Full report available on my website (link in bio). #startups #venturecapital #southafrica #funding
                  </p>
                </CardContent>
                <CardFooter className="flex items-center gap-4 border-t px-6 py-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Like</span>
                  </Button>
                  <span className="text-xs text-muted-foreground">76 likes</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Comment</span>
                  </Button>
                  <span className="text-xs text-muted-foreground">23 comments</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="startups" className="space-y-4 mt-4">
              {/* Similar content structure for startups tab */}
              <Card>
                <CardHeader className="flex flex-row items-start gap-4 pb-2">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>ES</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold">EcoSolar Solutions</div>
                    <div className="text-sm text-muted-foreground">Posted 4 hours ago</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Excited to announce our new partnership with the Cape Town Municipality to install solar panels on
                    government buildings. This project will generate 250kW of clean energy and save the city
                    approximately R1.2M in annual electricity costs.
                  </p>
                  <p>#cleantech #solarenergy #sustainability #capetown</p>
                </CardContent>
                <CardFooter className="flex items-center gap-4 border-t px-6 py-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Like</span>
                  </Button>
                  <span className="text-xs text-muted-foreground">54 likes</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Comment</span>
                  </Button>
                  <span className="text-xs text-muted-foreground">15 comments</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="investors" className="space-y-4 mt-4">
              {/* Content for investors tab */}
            </TabsContent>
            <TabsContent value="following" className="space-y-4 mt-4">
              {/* Content for following tab */}
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Trending Topics</h3>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">#SouthAfricanTech</p>
                  <p className="text-xs text-muted-foreground">243 posts</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">#VentureCapital</p>
                  <p className="text-xs text-muted-foreground">187 posts</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">#CleanTechSA</p>
                  <p className="text-xs text-muted-foreground">156 posts</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">#FintechFunding</p>
                  <p className="text-xs text-muted-foreground">132 posts</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-primary">#StartupJobs</p>
                  <p className="text-xs text-muted-foreground">98 posts</p>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Cape Town Startup Week</h4>
                  <Badge>In-person</Badge>
                </div>
                <p className="text-xs text-muted-foreground">April 15-18, 2024 • Cape Town</p>
                <p className="text-sm">
                  The largest startup event in South Africa, featuring pitches, workshops, and networking.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Fintech Founders Meetup</h4>
                  <Badge>Virtual</Badge>
                </div>
                <p className="text-xs text-muted-foreground">April 22, 2024 • Online</p>
                <p className="text-sm">
                  Monthly virtual meetup for fintech founders to share challenges and solutions.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Who to Follow</h3>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>SV</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Savannah Ventures</p>
                    <p className="text-xs text-muted-foreground">VC Firm</p>
                  </div>
                </div>
                <Button size="sm">Follow</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>JN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">James Nkosi</p>
                    <p className="text-xs text-muted-foreground">Angel Investor</p>
                  </div>
                </div>
                <Button size="sm">Follow</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>DT</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Digital Traders</p>
                    <p className="text-xs text-muted-foreground">E-commerce Startup</p>
                  </div>
                </div>
                <Button size="sm">Follow</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

