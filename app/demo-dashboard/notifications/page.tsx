"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MessageSquare, Star, TrendingUp, Users } from "lucide-react"

export default function DemoNotificationsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">
          This is a preview of notifications you would receive.
          <Link href="/signup" className="ml-1 text-primary underline underline-offset-4">
            Sign up
          </Link>{" "}
          to start receiving real-time updates.
        </p>

        <div className="relative mt-4 rounded-lg border border-dashed p-4">
          <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-medium">DEMO MODE</div>
          <p className="text-sm text-muted-foreground">
            You're viewing a demo version with sample notifications. Sign up to receive personalized updates.
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Today</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex items-start gap-4 p-4 hover:bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New message from Sarah Venter</p>
                    <p className="text-sm text-muted-foreground">
                      "Hi there! I saw your profile and I'm interested in learning more about your startup..."
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      alert("Sign up to respond to messages!")
                    }}
                  >
                    View
                  </Button>
                </div>

                <div className="flex items-start gap-4 p-4 hover:bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Connection request</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" alt="David Nkosi" />
                        <AvatarFallback>DN</AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-muted-foreground">
                        David Nkosi from TechNova Solutions wants to connect
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert("Sign up to respond to connection requests!")
                      }}
                    >
                      Ignore
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        alert("Sign up to respond to connection requests!")
                      }}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Yesterday</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex items-start gap-4 p-4 hover:bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New investment opportunity</p>
                    <p className="text-sm text-muted-foreground">
                      EcoSolar Solutions is raising a seed round of R5 million
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Yesterday at 2:45 PM</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      alert("Sign up to view investment opportunities!")
                    }}
                  >
                    View
                  </Button>
                </div>

                <div className="flex items-start gap-4 p-4 hover:bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Upcoming event reminder</p>
                    <p className="text-sm text-muted-foreground">Startup Pitch Day is tomorrow at 10:00 AM</p>
                    <p className="mt-1 text-xs text-muted-foreground">Yesterday at 10:00 AM</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      alert("Sign up to RSVP to events!")
                    }}
                  >
                    RSVP
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex items-start gap-4 p-4 hover:bg-muted/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                    <Star className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Profile featured</p>
                    <p className="text-sm text-muted-foreground">
                      Your profile was featured in "Investors to Watch" section
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">2 days ago</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      alert("Sign up to view your profile features!")
                    }}
                  >
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Your recent message notifications</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex items-start gap-4 p-4 hover:bg-muted/50">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Venter" />
                    <AvatarFallback>SV</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sarah Venter</p>
                    <p className="text-sm text-muted-foreground">
                      "Hi there! I saw your profile and I'm interested in learning more about your startup..."
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      alert("Sign up to respond to messages!")
                    }}
                  >
                    Reply
                  </Button>
                </div>
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
                Sign Up to Message
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Requests</CardTitle>
              <CardDescription>People who want to connect with you</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex items-center gap-4 p-4 hover:bg-muted/50">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="David Nkosi" />
                    <AvatarFallback>DN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">David Nkosi</p>
                    <p className="text-sm text-muted-foreground">TechNova Solutions • CEO</p>
                    <p className="mt-1 text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        alert("Sign up to respond to connection requests!")
                      }}
                    >
                      Ignore
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        alert("Sign up to respond to connection requests!")
                      }}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
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
                Sign Up to Connect
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events you might be interested in</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="flex items-start gap-4 p-4 hover:bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-center">
                    <div>
                      <div className="text-xs font-medium">JUN</div>
                      <div className="text-lg font-bold leading-none">15</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Startup Pitch Day</p>
                    <p className="text-sm text-muted-foreground">10:00 AM • Workshop 17, Cape Town</p>
                    <p className="mt-1 text-xs text-muted-foreground">10 startups will be pitching their ideas</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      alert("Sign up to RSVP to events!")
                    }}
                  >
                    RSVP
                  </Button>
                </div>

                <div className="flex items-start gap-4 p-4 hover:bg-muted/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-center">
                    <div>
                      <div className="text-xs font-medium">JUN</div>
                      <div className="text-lg font-bold leading-none">22</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Investor Networking Breakfast</p>
                    <p className="text-sm text-muted-foreground">8:30 AM • The Capital, Sandton</p>
                    <p className="mt-1 text-xs text-muted-foreground">Connect with other investors and VCs</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      alert("Sign up to RSVP to events!")
                    }}
                  >
                    RSVP
                  </Button>
                </div>
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
                Sign Up to View All Events
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

