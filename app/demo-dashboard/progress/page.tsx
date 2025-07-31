"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Award, BookOpen, CheckCircle, Clock, Target, TrendingUp } from "lucide-react"

export default function DemoProgressPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <p className="text-muted-foreground">
          This is a preview of how you can track your progress on pLantum.
          <Link href="/signup" className="ml-1 text-primary underline underline-offset-4">
            Sign up
          </Link>{" "}
          to start your journey.
        </p>

        <div className="relative mt-4 rounded-lg border border-dashed p-4">
          <div className="absolute -top-3 left-4 bg-background px-2 text-xs font-medium">DEMO MODE</div>
          <p className="text-sm text-muted-foreground">
            You're viewing a demo version with sample progress data. Sign up to track your actual progress.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile Completion</TabsTrigger>
          <TabsTrigger value="investments">Investment Activity</TabsTrigger>
          <TabsTrigger value="learning">Learning Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
              <CardDescription>Track your profile completion progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Basic Information</span>
                    </div>
                    <span className="text-sm">Completed</span>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Contact Details</span>
                    </div>
                    <span className="text-sm">Completed</span>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Professional Background</span>
                    </div>
                    <span className="text-sm">Completed</span>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Investment Preferences</span>
                    </div>
                    <span className="text-sm">In Progress</span>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Portfolio</span>
                    </div>
                    <span className="text-sm">In Progress</span>
                  </div>
                </div>

                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Verification</span>
                    </div>
                    <span className="text-sm">Not Started</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/signup"
                }}
              >
                Sign Up to Complete Your Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Activity</CardTitle>
              <CardDescription>Track your investment progress and goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Investment Goal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R500,000</div>
                    <p className="text-xs text-muted-foreground">Annual target</p>
                    <div className="mt-2">
                      <Progress value={40} className="h-2" />
                      <div className="mt-1 text-right text-xs text-muted-foreground">40% achieved</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Startups Evaluated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">This quarter</p>
                    <div className="mt-2 flex items-center text-xs text-green-500">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      <span>+8 from last quarter</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Due Diligence Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">This quarter</p>
                    <div className="mt-2 flex items-center text-xs text-amber-500">
                      <Target className="mr-1 h-3 w-3" />
                      <span>2 in progress</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg border">
                <div className="border-b bg-muted/40 p-4">
                  <h3 className="font-medium">Recent Investment Activity</h3>
                </div>
                <div className="divide-y">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">EcoSolar Solutions</p>
                      <p className="text-sm text-muted-foreground">Due diligence completed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R200,000</p>
                      <p className="text-sm text-muted-foreground">2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">HealthTech Africa</p>
                      <p className="text-sm text-muted-foreground">Initial meeting</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">--</p>
                      <p className="text-sm text-muted-foreground">1 month ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/signup"
                }}
              >
                Sign Up to Track Investments
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your progress through educational resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Learning Progress</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Investment Fundamentals</CardTitle>
                      <Award className="h-5 w-5 text-amber-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={80} className="h-2" />
                      <p className="text-xs text-muted-foreground">4 of 5 modules completed</p>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          alert("Sign up to access learning resources!")
                        }}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Due Diligence Masterclass</CardTitle>
                      <Award className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={20} className="h-2" />
                      <p className="text-xs text-muted-foreground">1 of 5 modules completed</p>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          alert("Sign up to access learning resources!")
                        }}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Startup Valuation</CardTitle>
                      <Award className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={0} className="h-2" />
                      <p className="text-xs text-muted-foreground">0 of 4 modules completed</p>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          alert("Sign up to access learning resources!")
                        }}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Start Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">Term Sheet Essentials</CardTitle>
                      <Award className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Progress value={0} className="h-2" />
                      <p className="text-xs text-muted-foreground">0 of 3 modules completed</p>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          alert("Sign up to access learning resources!")
                        }}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        Start Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/signup"
                }}
              >
                Sign Up to Access All Learning Resources
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

