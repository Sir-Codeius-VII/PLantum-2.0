"use client"

import { FlameIcon as Fire, Shield, Star, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from 'next/navigation'

export function UserProfileCard() {
  const router = useRouter()

  // Mock user data for testing
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar_url: "/placeholder.svg",
    bio: "Founder & CEO at TechStart"
  }

  const handleLogout = async () => {
    try {
      // Mock logout for testing
      console.log('Logout clicked')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        {user.bio && (
          <p className="text-sm text-muted-foreground mb-4">{user.bio}</p>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/settings')}
          >
            Edit Profile
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

