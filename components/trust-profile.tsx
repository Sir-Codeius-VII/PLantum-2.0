"use client"

import { useState } from "react"
import { StarRating } from "./star-rating"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Shield, ShieldCheck, ThumbsUp, Award, Clock } from "lucide-react"

interface TrustProfileProps {
  entityName: string
  entityType: "startup" | "investor"
  averageRating: number
  totalRatings: number
  verificationLevel: "basic" | "verified" | "premium"
  joinedDate: string
  successfulDeals?: number
  className?: string
}

export function TrustProfile({
  entityName,
  entityType,
  averageRating,
  totalRatings,
  verificationLevel,
  joinedDate,
  successfulDeals = 0,
  className,
}: TrustProfileProps) {
  const [isRatingOpen, setIsRatingOpen] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const handleRatingSubmit = () => {
    // In a real implementation, this would send the rating to an API
    console.log("Rating submitted:", userRating, feedback)
    setIsRatingOpen(false)
    // Reset form
    setUserRating(0)
    setFeedback("")
  }

  const getVerificationBadge = () => {
    switch (verificationLevel) {
      case "premium":
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-medium">Premium Verified</span>
          </div>
        )
      case "verified":
        return (
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-500">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Verified</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-1.5 text-gray-500">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Basic Verification</span>
          </div>
        )
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Trust Profile
          {getVerificationBadge()}
        </CardTitle>
        <CardDescription>Trust metrics and verification status for {entityName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Rating</p>
            <div className="flex items-center gap-2">
              <StarRating rating={averageRating} size="md" />
              <span className="text-sm font-medium">
                {averageRating.toFixed(1)} ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
              </span>
            </div>
          </div>
          <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Rate {entityType === "startup" ? "Startup" : "Investor"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate {entityName}</DialogTitle>
                <DialogDescription>
                  Share your experience with this {entityType}. Your feedback helps build trust in the community.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <p className="font-medium">Your Rating</p>
                  <StarRating rating={userRating} size="lg" interactive={true} onRatingChange={setUserRating} />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Your Feedback (Optional)</p>
                  <Textarea
                    placeholder={`Share your experience with this ${entityType}...`}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRatingOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRatingSubmit} disabled={userRating === 0}>
                  Submit Rating
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Member Since</span>
            </div>
            <p className="font-medium">{joinedDate}</p>
          </div>

          {successfulDeals > 0 && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-gray-500">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm">Successful Deals</span>
              </div>
              <p className="font-medium">{successfulDeals}</p>
            </div>
          )}
        </div>

        {verificationLevel === "premium" && (
          <div className="mt-4 rounded-md bg-emerald-50 dark:bg-emerald-950/30 p-3 border border-emerald-200 dark:border-emerald-900">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Premium verified with enhanced due diligence
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => setIsRatingOpen(true)}>
          Leave Feedback
        </Button>
      </CardFooter>
    </Card>
  )
}

