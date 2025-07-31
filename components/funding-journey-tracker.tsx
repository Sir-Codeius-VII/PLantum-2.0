"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, HelpCircle, AlertCircle } from "lucide-react"

interface FundingStage {
  id: string
  name: string
  description: string
  status: "completed" | "current" | "upcoming" | "blocked"
  completedDate?: string
  tips?: string[]
}

interface FundingJourneyTrackerProps {
  entityType: "startup" | "investor"
  currentStage: string
  progress: number
  stages: FundingStage[]
  className?: string
}

export function FundingJourneyTracker({
  entityType,
  currentStage,
  progress,
  stages,
  className,
}: FundingJourneyTrackerProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>(currentStage)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "current":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "upcoming":
        return <HelpCircle className="h-5 w-5 text-gray-400" />
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <HelpCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case "current":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>
      case "upcoming":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Upcoming</Badge>
      case "blocked":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Action Required</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{entityType === "startup" ? "Funding Journey" : "Investment Process"}</CardTitle>
        <CardDescription>
          {entityType === "startup"
            ? "Track your progress towards securing funding"
            : "Track your investment pipeline and process"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3 mt-4">
          {stages.map((stage) => (
            <div key={stage.id} className="border rounded-lg overflow-hidden">
              <div
                className={`flex items-center justify-between p-3 cursor-pointer ${
                  stage.status === "current" ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
                onClick={() => setExpandedStage(expandedStage === stage.id ? null : stage.id)}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(stage.status)}
                  <span className="font-medium">{stage.name}</span>
                </div>
                <div className="flex items-center gap-2">{getStatusBadge(stage.status)}</div>
              </div>

              {expandedStage === stage.id && (
                <div className="p-3 border-t bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{stage.description}</p>

                  {stage.tips && stage.tips.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-1">Tips:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1">
                        {stage.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {stage.status === "current" && (
                    <Button size="sm" className="mt-3">
                      {entityType === "startup" ? "Complete This Step" : "Review Applications"}
                    </Button>
                  )}

                  {stage.status === "blocked" && (
                    <Button size="sm" variant="destructive" className="mt-3">
                      Resolve Blocker
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

