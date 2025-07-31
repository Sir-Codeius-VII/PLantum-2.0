"use client"

import { useState } from "react"
import { RatingSystem } from "@/components/rating-system"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp } from "lucide-react"

interface ProfileRatingProps {
  profileId: string
  profileType: "investor" | "startup" | "founder"
  averageRating: number
  ratingCount: number
  userHasRated?: boolean
  initialUserRating?: number
}

export function ProfileRating({
  profileId,
  profileType,
  averageRating,
  ratingCount,
  userHasRated = false,
  initialUserRating = 0,
}: ProfileRatingProps) {
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [userRating, setUserRating] = useState(initialUserRating)
  const [hasSubmitted, setHasSubmitted] = useState(userHasRated)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingChange = (rating: number) => {
    setUserRating(rating)
  }

  const handleSubmitRating = async () => {
    if (userRating === 0) return

    setIsSubmitting(true)

    // Simulate API call to save rating
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real implementation, you would send the rating to your backend
    // await fetch('/api/ratings', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     profileId,
    //     profileType,
    //     rating: userRating
    //   })
    // })

    setHasSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ratings & Reviews</CardTitle>
        <CardDescription>How others have rated this {profileType}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RatingSystem initialRating={averageRating} readOnly size="lg" showCount ratingCount={ratingCount} />
          </div>

          {!hasSubmitted ? (
            <Button variant="outline" onClick={() => setShowRatingForm(true)} className="text-sm">
              Rate this {profileType}
            </Button>
          ) : (
            <div className="flex items-center text-sm text-green-600">
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>You rated this {profileType}</span>
            </div>
          )}
        </div>

        {showRatingForm && !hasSubmitted && (
          <>
            <Separator />
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-medium">Your rating</h4>
              <RatingSystem initialRating={userRating} size="md" onRatingChange={handleRatingChange} />
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSubmitRating} disabled={userRating === 0 || isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Rating"}
                </Button>
                <Button variant="outline" onClick={() => setShowRatingForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

