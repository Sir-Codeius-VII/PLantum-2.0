"use client"

import { useState } from "react"
import { Star, Shield, Award, ThumbsUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface TrustRatingProps {
  entityId: string
  entityType: "startup" | "investor" | "founder"
  trustScore: number
  verificationLevel: "unverified" | "basic" | "verified" | "premium"
  ratings: {
    overall: number
    totalRatings: number
    breakdown: {
      5: number
      4: number
      3: number
      2: number
      1: number
    }
    categories: {
      reliability: number
      communication: number
      expertise: number
      transparency: number
    }
  }
  trustFactors: {
    verifiedDocuments: boolean
    completedDeals: number
    yearsActive: number
    communityEndorsements: number
  }
  className?: string
}

export function TrustRating({
  entityId,
  entityType,
  trustScore,
  verificationLevel,
  ratings,
  trustFactors,
  className,
}: TrustRatingProps) {
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false)

  // Calculate the percentage for each star rating
  const calculatePercentage = (count: number) => {
    return (count / ratings.totalRatings) * 100
  }

  // Get verification badge based on level
  const getVerificationBadge = () => {
    switch (verificationLevel) {
      case "premium":
        return (
          <Badge className="bg-purple-500 text-white">
            <Shield className="mr-1 h-3 w-3" />
            Premium Verified
          </Badge>
        )
      case "verified":
        return (
          <Badge className="bg-green-500 text-white">
            <Shield className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "basic":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            <Shield className="mr-1 h-3 w-3" />
            Basic Verification
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-500">
            Unverified
          </Badge>
        )
    }
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Trust Rating</CardTitle>
          {getVerificationBadge()}
        </div>
        <CardDescription>
          {entityType === "startup"
            ? "Ratings and trust metrics for this startup"
            : entityType === "investor"
              ? "Ratings and trust metrics for this investor"
              : "Ratings and trust metrics for this founder"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trust Score */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium mb-1">Trust Score</h3>
            <div className="flex items-center">
              <span className="text-3xl font-bold">{trustScore}</span>
              <span className="text-sm text-muted-foreground ml-1">/100</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center">
            <span className="text-xl font-bold">{Math.round(trustScore)}</span>
          </div>
        </div>

        {/* Star Ratings */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">User Ratings</h3>
            <div className="flex items-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= Math.round(ratings.overall)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-transparent text-muted-foreground",
                    )}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium">{ratings.overall.toFixed(1)}</span>
              <span className="ml-1 text-xs text-muted-foreground">({ratings.totalRatings})</span>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2">
                <div className="flex items-center w-12">
                  <span className="text-xs">{star}</span>
                  <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress
                  value={calculatePercentage(ratings.breakdown[star as keyof typeof ratings.breakdown])}
                  className="h-2 flex-1"
                />
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {ratings.breakdown[star as keyof typeof ratings.breakdown]}
                </span>
              </div>
            ))}
          </div>

          {/* Detailed Category Breakdown Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-xs w-full"
            onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
          >
            {showDetailedBreakdown ? "Hide" : "Show"} Detailed Breakdown
          </Button>

          {/* Detailed Category Breakdown */}
          {showDetailedBreakdown && (
            <div className="mt-4 space-y-3 pt-3 border-t">
              <h4 className="text-sm font-medium">Category Ratings</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Reliability</span>
                    <span className="text-xs font-medium">{ratings.categories.reliability.toFixed(1)}</span>
                  </div>
                  <Progress value={(ratings.categories.reliability / 5) * 100} className="h-1.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Communication</span>
                    <span className="text-xs font-medium">{ratings.categories.communication.toFixed(1)}</span>
                  </div>
                  <Progress value={(ratings.categories.communication / 5) * 100} className="h-1.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Expertise</span>
                    <span className="text-xs font-medium">{ratings.categories.expertise.toFixed(1)}</span>
                  </div>
                  <Progress value={(ratings.categories.expertise / 5) * 100} className="h-1.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Transparency</span>
                    <span className="text-xs font-medium">{ratings.categories.transparency.toFixed(1)}</span>
                  </div>
                  <Progress value={(ratings.categories.transparency / 5) * 100} className="h-1.5" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trust Factors */}
        <div>
          <h3 className="text-sm font-medium mb-3">Trust Factors</h3>
          <div className="grid grid-cols-2 gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">
                        {trustFactors.verifiedDocuments ? "Verified Documents" : "Unverified"}
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    {trustFactors.verifiedDocuments
                      ? "This entity has verified their legal documents"
                      : "This entity has not verified their documents yet"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Award className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{trustFactors.completedDeals} Deals</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Number of successfully completed deals on the platform</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{trustFactors.yearsActive} Years Active</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Years active in the industry</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 p-2 rounded-md border">
                    <div className="rounded-full bg-primary/10 p-1.5">
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">{trustFactors.communityEndorsements} Endorsements</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Endorsements from verified community members</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" size="sm" className="w-full">
          View Full Trust Profile
        </Button>
      </CardFooter>
    </Card>
  )
}

