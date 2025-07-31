"use client"

import { useState } from "react"
import { Send, Search, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for demonstration
const mockConversations = [
  {
    id: 1,
    name: "Sarah Venter",
    role: "Investor",
    company: "Horizon Capital",
    lastMessage: "Looking forward to our meeting tomorrow!",
    time: "2m ago",
    unread: true,
  },
  {
    id: 2,
    name: "John Smith",
    role: "Founder",
    company: "TechNova Solutions",
    lastMessage: "Thanks for the feedback on our pitch deck",
    time: "1h ago",
    unread: false,
  },
  {
    id: 3,
    name: "Venture Capital Partners",
    role: "VC Firm",
    company: "Venture Capital Partners",
    lastMessage: "We'd like to schedule a follow-up call",
    time: "3h ago",
    unread: false,
  },
]

const mockMessages = [
  {
    id: 1,
    sender: "Sarah Venter",
    content: "Hi there! I came across your startup profile and I'm very interested in learning more about your product.",
    time: "10:30 AM",
  },
  {
    id: 2,
    sender: "You",
    content: "Hi Sarah! Thanks for reaching out. I'd be happy to tell you more about our product and our vision.",
    time: "10:32 AM",
  },
  {
    id: 3,
    sender: "Sarah Venter",
    content: "Great! I'm particularly interested in your growth metrics and your plans for scaling in the African market.",
    time: "10:35 AM",
  },
  {
    id: 4,
    sender: "You",
    content: "We've seen a 25% month-over-month growth in user acquisition, and we're planning to expand to three new African countries in Q2.",
    time: "10:37 AM",
  },
  {
    id: 5,
    sender: "Sarah Venter",
    content: "That's impressive growth! Would you be available for a call tomorrow to discuss potential investment opportunities?",
    time: "10:40 AM",
  },
  {
    id: 6,
    sender: "You",
    content: "Absolutely! I'm available between 2-4 PM tomorrow. Would that work for you?",
    time: "10:42 AM",
  },
  {
    id: 7,
    sender: "Sarah Venter",
    content: "Perfect! Let's schedule it for 2:30 PM. Looking forward to our conversation!",
    time: "10:45 AM",
  },
]

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      setNewMessage("")
    }
  }

  return (
    <div className="container h-[calc(100vh-4rem)] py-8">
      <div className="grid h-full grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conversations List */}
        <Card className="h-full overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {mockConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                  activeConversation === conversation.id ? "bg-muted/50" : ""
                }`}
                onClick={() => setActiveConversation(conversation.id)}
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {conversation.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {conversation.role} at {conversation.company}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="h-full md:col-span-2 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {mockConversations.find((c) => c.id === activeConversation)?.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {mockConversations.find((c) => c.id === activeConversation)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {mockConversations.find((c) => c.id === activeConversation)?.role} at{" "}
                  {mockConversations.find((c) => c.id === activeConversation)?.company}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "You"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 