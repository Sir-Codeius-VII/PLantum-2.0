"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating?: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function StarRating({
  rating = 0,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(rating)

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const handleClick = (index: number) => {
    if (interactive) {
      setSelectedRating(index)
      onRatingChange?.(index)
    }
  }

  const displayRating = hoverRating > 0 ? hoverRating : selectedRating

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div className={cn("flex items-center", className)} role="radiogroup" aria-label="Rating">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1
        const filled = starValue <= displayRating

        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "transition-all duration-100",
              filled ? "fill-yellow-400 text-yellow-400" : "text-gray-300 dark:text-gray-600",
              interactive && "cursor-pointer",
            )}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
            role={interactive ? "radio" : "presentation"}
            aria-checked={interactive && filled ? "true" : "false"}
            aria-posinset={starValue}
            aria-setsize={maxRating}
          />
        )
      })}
    </div>
  )
}

