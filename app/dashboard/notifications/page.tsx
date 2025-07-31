import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Heart, DollarSign, Users, Calendar } from "lucide-react"

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "message",
      title: "New message from Sarah Johnson",
      description: "Hi there! I'd like to discuss your startup...",
      time: "10 minutes ago",
      read: false,
      icon: <MessageSquare className="h-4 w-4" />,
      avatar: "/placeholder.svg?height=32&width=32",
      avatarFallback: "SJ",
    },
    {
      id: 2,
      type: "like",
      title: "Your startup received 5 new likes",
      description: "Your startup is gaining traction!",
      time: "2 hours ago",
      read: false,
      icon: <Heart className="h-4 w-4" />,
      avatar: null,
      avatarFallback: null,
    },
    {
      id: 3,
      type: "investment",
      title: "New investment opportunity",
      description: "TechFund is looking for startups like yours",
      time: "Yesterday",
      read: true,
      icon: <DollarSign className="h-4 w-4" />,
      avatar: "/placeholder.svg?height=32&width=32",
      avatarFallback: "TF",
    },
    {
      id: 4,
      type: "connection",
      title: "New connection request",
      description: "Michael Brown wants to connect with you",
      time: "2 days ago",
      read: true,
      icon: <Users className="h-4 w-4" />,
      avatar: "/placeholder.svg?height=32&width=32",
      avatarFallback: "MB",
    },
    {
      id: 5,
      type: "event",
      title: "Upcoming event: Startup Pitch Day",
      description: "Don't miss the opportunity to showcase your startup",
      time: "1 week ago",
      read: true,
      icon: <Calendar className="h-4 w-4" />,
      avatar: null,
      avatarFallback: null,
    },
  ]

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm">
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Stay updated with your account activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 rounded-lg border p-4 ${notification.read ? "" : "bg-muted/50"}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {notification.avatar ? (
                    <Avatar>
                      <AvatarImage src={notification.avatar} alt="" />
                      <AvatarFallback>{notification.avatarFallback}</AvatarFallback>
                    </Avatar>
                  ) : (
                    notification.icon
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.description}</p>
                </div>
                {!notification.read && <div className="h-2 w-2 rounded-full bg-primary"></div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

