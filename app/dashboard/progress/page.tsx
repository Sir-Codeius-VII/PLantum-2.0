import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function ProgressPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Your Progress</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to increase visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">75% Complete</span>
                <span className="text-sm text-muted-foreground">3/4 Sections</span>
              </div>
              <Progress value={75} className="h-2" />
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-600">
                  <CheckIcon className="mr-2 h-4 w-4" /> Basic Information
                </li>
                <li className="flex items-center text-green-600">
                  <CheckIcon className="mr-2 h-4 w-4" /> Contact Details
                </li>
                <li className="flex items-center text-green-600">
                  <CheckIcon className="mr-2 h-4 w-4" /> Investment Preferences
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CircleIcon className="mr-2 h-4 w-4" /> Verification Documents
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment Activity</CardTitle>
            <CardDescription>Track your investment milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">40% Complete</span>
                <span className="text-sm text-muted-foreground">2/5 Milestones</span>
              </div>
              <Progress value={40} className="h-2" />
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-green-600">
                  <CheckIcon className="mr-2 h-4 w-4" /> First Login
                </li>
                <li className="flex items-center text-green-600">
                  <CheckIcon className="mr-2 h-4 w-4" /> Browse 10+ Startups
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CircleIcon className="mr-2 h-4 w-4" /> Contact a Founder
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CircleIcon className="mr-2 h-4 w-4" /> Make First Investment
                </li>
                <li className="flex items-center text-muted-foreground">
                  <CircleIcon className="mr-2 h-4 w-4" /> Complete Due Diligence
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Track your progress through educational resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Investment Basics</span>
                  <span className="text-sm text-muted-foreground">3/5 Completed</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Due Diligence</span>
                  <span className="text-sm text-muted-foreground">1/4 Completed</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Legal Frameworks</span>
                  <span className="text-sm text-muted-foreground">0/3 Completed</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

