"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send } from "lucide-react"

export default function DemoMessagesPage() {
  const [messageText, setMessageText] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Sign up to send messages!")
    setMessageText("")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground">
          This is a preview of the messaging system.
          <Link href="/signup" className="ml-1 text-primary underline underline-offset-4">
            Sign up
          </Link>{" "}
          to start connecting with startups and investors.
        </p>

        <div className="relative mt-4 rounded-lg border border-dashed p-4">
          <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-medium">DEMO MODE</div>
          <p className="text-sm text-muted-foreground">
            You're viewing a demo version with sample conversations. Sign up to start real conversations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <CardDescription>Your recent message threads</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-6 hover:bg-accent">
                <div className="flex w-full items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Venter" />
                    <AvatarFallback>SV</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 text-left">
                    <p className="text-sm font-medium leading-none">Sarah Venter</p>
                    <p className="text-xs text-muted-foreground">Horizon Capital</p>
                  </div>
                  <div className="flex h-2 w-2 rounded-full bg-primary"></div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-6 hover:bg-accent">
                <div className="flex w-full items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="David Nkosi" />
                    <AvatarFallback>DN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 text-left">
                    <p className="text-sm font-medium leading-none">David Nkosi</p>
                    <p className="text-xs text-muted-foreground">TechNova Solutions</p>
                  </div>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start rounded-none px-4 py-6 hover:bg-accent">
                <div className="flex w-full items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Priya Sharma" />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 text-left">
                    <p className="text-sm font-medium leading-none">Priya Sharma</p>
                    <p className="text-xs text-muted-foreground">HealthTech Africa</p>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
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

        <Card className="md:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Venter" />
                <AvatarFallback>SV</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Sarah Venter</CardTitle>
                <CardDescription>Horizon Capital • Online</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="chat">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="info">Info</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="p-0">
                <div className="h-[400px] overflow-y-auto p-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="mt-1">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Venter" />
                        <AvatarFallback>SV</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm">
                          Hi there! I saw your profile and I'm interested in learning more about your startup. Could you
                          tell me more about your business model and current traction?
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">10:32 AM</p>
                      </div>
                    </div>
                    <div className="flex items-start justify-end gap-3">
                      <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                        <p className="text-sm">
                          Hello Sarah! Thanks for reaching out. We're a B2B SaaS platform helping small businesses
                          manage their finances. We currently have 50+ paying customers and growing 15%
                          month-over-month.
                        </p>
                        <p className="mt-1 text-xs text-primary-foreground/80">10:45 AM</p>
                      </div>
                      <Avatar className="mt-1">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="You" />
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex items-start gap-3">
                      <Avatar className="mt-1">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah Venter" />
                        <AvatarFallback>SV</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm">
                          That sounds promising! What are your current funding needs and how do you plan to use the
                          investment?
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">11:02 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!messageText.trim()}>
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </form>
                </div>
              </TabsContent>
              <TabsContent value="info" className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">About</h3>
                    <p className="text-sm text-muted-foreground">
                      Sarah Venter is an Investment Manager at Horizon Capital, focusing on early-stage tech startups in
                      South Africa.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Investment Focus</h3>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• Fintech</li>
                      <li>• SaaS</li>
                      <li>• Health Tech</li>
                      <li>• Clean Energy</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Investment Range</h3>
                    <p className="text-sm text-muted-foreground">R2 million - R10 million</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

