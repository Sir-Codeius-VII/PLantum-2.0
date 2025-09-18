import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { AchievementNotification } from "@/components/achievement-notification"
import { DigitalClock } from "@/components/digital-clock"
import { ThemeToggle } from "@/components/theme-toggle"
import { SearchCommand } from "@/components/search-command"
import { BackToTop } from "@/components/back-to-top"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { MobileBottomNavigation } from "@/components/mobile-navigation"
import { OrganizationStructuredData, WebsiteStructuredData } from "@/components/seo/metadata"
import { PerformanceMonitorComponent, WebVitals } from "@/components/performance/performance-monitor"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://plantum.co.za'),
  title: "PLantum - Connect African Startups with Global Investors",
  description: "The ultimate platform connecting African startups and businesses with investors worldwide. Discover investment opportunities, showcase your startup, and grow your business.",
  keywords: [
    'African startups',
    'investment platform',
    'startup funding',
    'venture capital',
    'South African startups',
    'business investment',
    'startup ecosystem',
    'investor network',
  ].join(', '),
  authors: [{ name: 'PLantum Team' }],
  creator: 'PLantum',
  publisher: 'PLantum',
  generator: 'Next.js',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://plantum.co.za',
    title: 'PLantum - Connect African Startups with Global Investors',
    description: 'The ultimate platform connecting African startups and businesses with investors worldwide. Discover investment opportunities, showcase your startup, and grow your business.',
    siteName: 'PLantum',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PLantum - Connect African Startups with Global Investors',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@plantum_sa',
    creator: '@plantum_sa',
    title: 'PLantum - Connect African Startups with Global Investors',
    description: 'The ultimate platform connecting African startups and businesses with investors worldwide.',
    images: ['/og-image.png'],
  },
  
  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification tags
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <OrganizationStructuredData />
        <WebsiteStructuredData />
      </head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.variable)}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                  <MainNav />
                  <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <DigitalClock />
                    <div className="flex items-center gap-2">
                      <SearchCommand />
                      <ThemeToggle />
                      <nav className="flex items-center space-x-1">
                        <Button variant="ghost" className="ml-auto" asChild>
                          <a href="/auth/signin">Sign In</a>
                        </Button>
                      </nav>
                    </div>
                  </div>
                </div>
              </header>
              <main className="flex-1 pb-16 md:pb-0">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </main>
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by{" "}
                    <a
                      href="https://twitter.com/shadcn"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      shadcn
                    </a>
                    . The source code is available on{" "}
                    <a
                      href="https://github.com/shadcn/ui"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium underline underline-offset-4"
                    >
                      GitHub
                    </a>
                    .
                  </p>
                </div>
              </footer>
              <AchievementNotification />
              <BackToTop />
              <MobileBottomNavigation />
              <PerformanceMonitorComponent />
              <WebVitals />
              <Toaster />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}