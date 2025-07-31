import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex items-center justify-center w-full max-w-screen-xl mx-auto px-4", className)} {...props}>
      <div className="flex items-center justify-center w-full gap-8">
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
        <Link href="/map" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Map
        </Link>
        <Link
          href="/leaderboard"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Leaderboard
        </Link>
        <Link
          href="/resources"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Resources
        </Link>
        <Link
          href="/claim-r100k"
          className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
        >
          Claim R100K
        </Link>
      </div>
    </nav>
  )
}

