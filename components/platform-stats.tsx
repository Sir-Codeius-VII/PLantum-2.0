"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { getIconComponent } from "@/app/api/platform-metrics/utils"

interface PlatformStat {
  id: number
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode | string
  description?: string
}

export function PlatformStats() {
  const [metricsData, setMetricsData] = useState<PlatformStat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPlatformMetrics = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call to your backend
        const response = await fetch("/api/platform-metrics")

        if (!response.ok) {
          throw new Error("Failed to fetch platform metrics")
        }

        const data = await response.json()

        // Process the data to convert icon strings to components
        const processedData = data.map((metric: any) => ({
          ...metric,
          icon: typeof metric.icon === "string" ? getIconComponent(metric.icon) : metric.icon,
        }))

        setMetricsData(processedData)
      } catch (error) {
        console.error("Error fetching platform metrics:", error)
        // Fallback to mock data if the fetch fails
        setMetricsData([
          {
            id: 1,
            title: "Total Funding",
            value: "R 789M",
            change: "+30%",
            trend: "up",
            icon: getIconComponent("LineChart"),
            description: "Total funding raised by businesses on the platform.",
          },
          {
            id: 2,
            title: "Businesses",
            value: "1,234",
            change: "+20%",
            trend: "up",
            icon: getIconComponent("Building2"),
            description: "Number of businesses currently listed on the platform.",
          },
          {
            id: 3,
            title: "Investors",
            value: "567",
            change: "+15%",
            trend: "up",
            icon: getIconComponent("Users"),
            description: "Number of active investors using the platform.",
          },
          {
            id: 4,
            title: "Active Opportunities",
            value: "78",
            change: "+25%",
            trend: "up",
            icon: getIconComponent("Calendar"),
            description: "Number of investment opportunities currently available.",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlatformMetrics()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
      {isLoading ? (
        // Show skeletons while loading
        <>
          {[1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              <Card className="overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 bg-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </>
      ) : (
        // Show actual data when loaded
        metricsData.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="overflow-hidden border shadow-md hover:shadow-lg transition-all duration-300 bg-card h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                  <div className="rounded-full p-1.5 bg-primary/10">{metric.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between mb-2">
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <div
                    className={cn(
                      "flex items-center text-sm font-medium",
                      metric.trend === "up" ? "text-emerald-500" : "text-red-500",
                    )}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="mr-1 h-4 w-4" />
                    ) : (
                      <TrendingUp className="mr-1 h-4 w-4 rotate-180" />
                    )}
                    {metric.change}
                  </div>
                </div>
                {metric.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{metric.description}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))
      )}
    </div>
  )
}

