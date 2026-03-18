"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MobileNav, MobileMenuButton } from "@/components/ui/mobile-nav"
import { 
  Home, 
  Search, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Bell,
  User,
  Settings,
  LogIn
} from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Browse", href: "/browse", icon: Search },
  { name: "Investors", href: "/investors", icon: Users },
  { name: "Leaderboard", href: "/leaderboard", icon: TrendingUp },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Notifications", href: "/notifications", icon: Bell },
]

const userNavigation = [
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <div className="md:hidden">
      <MobileNav>
        <div className="space-y-1">
          <div className="px-3 py-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Main
            </h3>
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <MobileMenuButton
                key={item.name}
                asChild
                className={cn(
                  "flex items-center gap-3",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </MobileMenuButton>
            )
          })}
        </div>
        
        <div className="space-y-1 border-t pt-4">
          <div className="px-3 py-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Account
            </h3>
          </div>
          {userNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <MobileMenuButton
                key={item.name}
                asChild
                className={cn(
                  "flex items-center gap-3",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </MobileMenuButton>
            )
          })}
          <MobileMenuButton
            asChild
            className="flex items-center gap-3 text-primary hover:text-primary/90"
          >
            <Link href="/auth/signin">
              <LogIn className="h-5 w-5" />
              Sign In
            </Link>
          </MobileMenuButton>
        </div>
      </MobileNav>
    </div>
  )
}

export function MobileBottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="grid grid-cols-4 gap-1 p-1">
          {navigation.slice(0, 4).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-md transition-colors",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
