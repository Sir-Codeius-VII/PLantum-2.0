"use client"

import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TouchButtonProps extends ButtonProps {
  touchTarget?: "sm" | "md" | "lg"
  haptic?: boolean
}

const touchTargetSizes = {
  sm: "min-h-[44px] min-w-[44px]", // iOS recommended minimum
  md: "min-h-[48px] min-w-[48px]", // Android recommended minimum  
  lg: "min-h-[56px] min-w-[56px]", // Large touch target
}

export const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, touchTarget = "md", haptic = true, onClick, ...props }, ref) => {
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      // Haptic feedback for supported devices
      if (haptic && 'vibrate' in navigator) {
        navigator.vibrate(10) // Short vibration
      }
      
      onClick?.(event)
    }, [haptic, onClick])

    return (
      <Button
        className={cn(
          touchTargetSizes[touchTarget],
          "touch-manipulation", // Optimizes touch interactions
          "active:scale-95 transition-transform duration-75", // Touch feedback
          className
        )}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
TouchButton.displayName = "TouchButton"

export const TouchIconButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, touchTarget = "md", ...props }, ref) => {
    return (
      <TouchButton
        className={cn(
          "p-0", // Remove default padding for icon buttons
          "flex items-center justify-center",
          className
        )}
        touchTarget={touchTarget}
        ref={ref}
        {...props}
      />
    )
  }
)
TouchIconButton.displayName = "TouchIconButton"
