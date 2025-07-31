"use client"

import { useState } from "react"
import { ArrowUpRight, Paperclip, Search, Send } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestmentOfferMessage } from "@/components/investment-offer-message"

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState("chat1")

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col md:flex-row">
      <div className="w-full border-r md:w-80">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search messages..." className="w-full rounded-lg bg-background pl-8" />
          </div>
        </div>
        <Tabs defaultValue="all" className="px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="px-4 py-2">
          <h3 className="text-sm font-medium text-muted-foreground">Recent Conversations</h3>
        </div>
        <div className="space-y-1 p-2">
          <button
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left ${
              activeChat === "chat1" ? "bg-accent" : "hover:bg-muted"
            }`}
            onClick={() => setActiveChat("chat1")}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="Sarah Venter" />
              <AvatarFallback>SV</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sarah Venter</span>
                <span className="text-xs text-muted-foreground">2h</span>
              </div>
              <p className="truncate text-xs text-muted-foreground">I'd like to discuss your funding requirements...</p>
            </div>
          </button>
          <button
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left ${
              activeChat === "chat2" ? "bg-accent" : "hover:bg-muted"
            }`}
            onClick={() => setActiveChat("chat2")}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="TechNova Solutions" />
              <AvatarFallback>TN</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">TechNova Solutions</span>
                <span className="text-xs text-muted-foreground">1d</span>
              </div>
              <p className="truncate text-xs text-muted-foreground">Thanks for your interest in our startup...</p>
            </div>
          </button>
          <button
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left ${
              activeChat === "chat3" ? "bg-accent" : "hover:bg-muted"
            }`}
            onClick={() => setActiveChat("chat3")}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="African Fintech Fund" />
              <AvatarFallback>AF</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">African Fintech Fund</span>
                <span className="text-xs text-muted-foreground">3d</span>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                We've reviewed your pitch deck and would like to...
              </p>
            </div>
          </button>
          <button
            className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left ${
              activeChat === "chat4" ? "bg-accent" : "hover:bg-muted"
            }`}
            onClick={() => setActiveChat("chat4")}
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder-user.jpg" alt="EcoSolar Solutions" />
              <AvatarFallback>ES</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">EcoSolar Solutions</span>
                <span className="text-xs text-muted-foreground">1w</span>
              </div>
              <p className="truncate text-xs text-muted-foreground">
                Hello! We're raising our seed round and thought...
              </p>
            </div>
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="Sarah Venter" />
              <AvatarFallback>SV</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Sarah Venter</div>
              <div className="text-xs text-muted-foreground">Horizon Capital • Online</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ArrowUpRight className="h-4 w-4" />
              <span className="sr-only">View Profile</span>
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="mt-1">
                <AvatarImage src="/placeholder-user.jpg" alt="Sarah Venter" />
                <AvatarFallback>SV</AvatarFallback>
              </Avatar>
              <div>
                <div className="rounded-lg bg-muted p-3">
                  <p>
                    Hi there! I came across your startup profile and I'm impressed with what you're building. I'd like
                    to discuss your funding requirements and learn more about your growth plans.
                  </p>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start justify-end gap-3">
              <div className="text-right">
                <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                  <p>
                    Hello Sarah, thank you for reaching out! We're currently raising our seed round of R5 million for
                    15% equity. Would you like me to share our pitch deck and financial projections?
                  </p>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">1 hour ago</div>
              </div>
              <Avatar className="mt-1">
                <AvatarImage src="/placeholder-user.jpg" alt="You" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-3">
              <Avatar className="mt-1">
                <AvatarImage src="/placeholder-user.jpg" alt="Sarah Venter" />
                <AvatarFallback>SV</AvatarFallback>
              </Avatar>
              <div>
                <div className="rounded-lg bg-muted p-3">
                  <p>
                    Yes, I'd love to see those documents. Horizon Capital typically invests in the R2-10 million range,
                    so your raise fits our criteria. Could you also share some information about your current traction
                    and customer acquisition strategy?
                  </p>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">45 minutes ago</div>
              </div>
            </div>
            <div className="flex items-start justify-end gap-3">
              <div className="text-right">
                <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                  <p>
                    Great! I've just granted you access to our data room where you can find our pitch deck, financial
                    projections, and business plan. Regarding traction, we've grown 215% year-over-year and currently
                    have over 350 customers. Our CAC is R3,500 with an LTV of R28,000.
                  </p>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">30 minutes ago</div>
              </div>
              <Avatar className="mt-1">
                <AvatarImage src="/placeholder-user.jpg" alt="You" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-3">
              <Avatar className="mt-1">
                <AvatarImage src="/placeholder-user.jpg" alt="Sarah Venter" />
                <AvatarFallback>SV</AvatarFallback>
              </Avatar>
              <div>
                <div className="rounded-lg bg-muted p-3">
                  <p>
                    Those are impressive metrics! I've just checked the data room and downloaded your materials. After
                    reviewing them, would you be available for a video call next week to discuss further? I'd like to
                    introduce you to our investment committee as well.
                  </p>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">15 minutes ago</div>
              </div>
            </div>
            {activeChat === "chat1" && (
              <InvestmentOfferMessage
                startupId="startup123"
                startupName="EcoSolar Solutions"
                investorId="investor456"
                offerAmount={5000000}
                equityPercentage={15}
                status="offer"
              />
            )}
          </div>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Input placeholder="Type your message..." className="flex-1 rounded-full" />
            <Button size="icon" className="rounded-full">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

