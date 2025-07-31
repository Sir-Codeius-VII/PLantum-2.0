"use client"

import { useState } from "react"
import { Bell, MessageSquare, Heart, Share2, Users, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Mock data for demonstration
const mockNotifications = [
  {
    id: 1,
    type: "message",
    title: "New message from Sarah Venter",
    content: "Interested in learning more about your startup",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    type: "like",
    title: "John Smith liked your post",
    content: "Your recent update about the product launch",
    time: "15m ago",
    read: false,
  },
  {
    id: 3,
    type: "connection",
    title: "New connection request",
    content: "Venture Capital Partners wants to connect",
    time: "1h ago",
    read: true,
  },
  {
    id: 4,
    type: "event",
    title: "Upcoming event reminder",
    content: "Startup Summit 2024 starts in 3 days",
    time: "2h ago",
    read: true,
  },
  {
    id: 5,
    type: "share",
    title: "Your post was shared",
    content: "Sarah Venter shared your funding announcement",
    time: "5h ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-4 w-4" />
      case "like":
        return <Heart className="h-4 w-4" />
      case "connection":
        return <Users className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      case "share":
        return <Share2 className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="unread" onClick={() => setActiveTab("unread")}>
              Unread
            </TabsTrigger>
            <TabsTrigger value="message" onClick={() => setActiveTab("message")}>
              Messages
            </TabsTrigger>
            <TabsTrigger value="like" onClick={() => setActiveTab("like")}>
              Likes
            </TabsTrigger>
            <TabsTrigger value="connection" onClick={() => setActiveTab("connection")}>
              Connections
            </TabsTrigger>
            <TabsTrigger value="event" onClick={() => setActiveTab("event")}>
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`relative ${!notification.read ? "border-primary/20" : ""}`}
              >
                {!notification.read && (
                  <Badge className="absolute -right-2 -top-2">New</Badge>
                )}
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{notification.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.content}
                      </p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 