import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { MobileNavigation } from "@/components/mobile-navigation"
import SiteLogo from "@/components/ui/site-logo"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <>
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Desktop Navigation */}
      <nav className={cn("hidden md:flex items-center justify-between w-full max-w-screen-xl mx-auto px-4", className)} {...props}>
        <div className="flex items-center gap-8">
          <SiteLogo />
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/startups" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Startups
          </Link>
          <Link
            href="/investors"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Investors
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Leaderboard
          </Link>
          <Link href="/claim-r100k" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
            Claim R100K
          </Link>
        </div>
      </nav>
    </>
  )
}

