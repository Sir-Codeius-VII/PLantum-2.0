"use client"

import * as React from "react"
import { Input, InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface MobileInputProps extends InputProps {
  touchTarget?: "sm" | "md" | "lg"
}

const touchTargetSizes = {
  sm: "min-h-[44px] text-base", // iOS recommended minimum
  md: "min-h-[48px] text-base", // Android recommended minimum
  lg: "min-h-[56px] text-lg",   // Large touch target
}

export const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, touchTarget = "md", type, ...props }, ref) => {
    // Auto-adjust input type for mobile
    const mobileType = React.useMemo(() => {
      if (type === "email") return "email"
      if (type === "password") return "password"
      if (type === "tel") return "tel"
      if (type === "url") return "url"
      if (type === "number") return "number"
      return "text"
    }, [type])

    return (
      <Input
        type={mobileType}
        className={cn(
          touchTargetSizes[touchTarget],
          "touch-manipulation", // Optimizes touch interactions
          "text-base", // Prevent zoom on iOS
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
MobileInput.displayName = "MobileInput"

export const MobileTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    touchTarget?: "sm" | "md" | "lg"
  }
>(({ className, touchTarget = "md", ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        touchTargetSizes[touchTarget],
        "touch-manipulation",
        "text-base",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
MobileTextarea.displayName = "MobileTextarea"
