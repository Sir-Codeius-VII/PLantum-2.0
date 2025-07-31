"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface DigitalClockProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DigitalClock({ className, ...props }: DigitalClockProps) {
  const [time, setTime] = useState<string>("00:00:00")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      setTime(`${hours}:${minutes}:${seconds}`)
    }

    // Update immediately
    updateTime()

    // Then update every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={cn("bg-card text-card-foreground px-3 py-1.5 rounded-md border text-sm font-mono", className)}
      {...props}
    >
      {time}
    </div>
  )
}

