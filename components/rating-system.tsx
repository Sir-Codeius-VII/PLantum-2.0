"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RatingSystemProps {
  initialRating?: number
  totalStars?: number
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
  showCount?: boolean
  ratingCount?: number
  onRatingChange?: (rating: number) => void
  className?: string
}

export function RatingSystem({
  initialRating = 0,
  totalStars = 5,
  size = "md",
  readOnly = false,
  showCount = false,
  ratingCount = 0,
  onRatingChange,
  className,
}: RatingSystemProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const starSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const containerSizes = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
  }

  const handleRatingChange = (newRating: number) => {
    if (readOnly) return

    // If clicking the same star, remove the rating
    const updatedRating = rating === newRating ? 0 : newRating
    setRating(updatedRating)
    onRatingChange?.(updatedRating)
  }

  const tooltipLabels = ["Poor", "Below Average", "Average", "Good", "Excellent"]

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("flex", containerSizes[size])}>
        {Array.from({ length: totalStars }).map((_, index) => {
          const starValue = index + 1
          const isFilled = hoverRating ? starValue <= hoverRating : starValue <= rating

          return (
            <TooltipProvider key={index} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-auto w-auto p-0.5 hover:bg-transparent",
                      readOnly ? "cursor-default" : "cursor-pointer",
                    )}
                    onClick={() => handleRatingChange(starValue)}
                    onMouseEnter={() => !readOnly && setHoverRating(starValue)}
                    onMouseLeave={() => !readOnly && setHoverRating(0)}
                  >
                    <Star
                      className={cn(
                        starSizes[size],
                        isFilled ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-muted-foreground",
                        !readOnly && "transition-all duration-100",
                      )}
                    />
                    <span className="sr-only">{`Rate ${starValue} out of ${totalStars}`}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">{tooltipLabels[index] || `${starValue} stars`}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>

      {showCount && (
        <div className="ml-2 text-sm text-muted-foreground">
          <span className="font-medium">{rating.toFixed(1)}</span>
          {ratingCount > 0 && <span className="ml-1">({ratingCount})</span>}
        </div>
      )}
    </div>
  )
}

