import { cn } from "@/lib/utils"
import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileRating } from "@/components/profile-rating"

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Manage your profile information and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">John Doe</CardTitle>
              <CardDescription>Angel Investor</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-sm">john.doe@example.com</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p className="text-sm">Cape Town, South Africa</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Member Since</h3>
                <p className="text-sm">January 2023</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Trust Rating</h3>
                <ProfileRating rating={4.5} reviews={12} />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Edit Profile</Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="investments">Investments</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                  <CardDescription>Your professional background and interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Bio</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Angel investor with 10+ years of experience in tech startups. Previously founded two successful
                        SaaS companies. Passionate about supporting early-stage founders in the fintech and healthtech
                        spaces.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Expertise</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge>Fintech</Badge>
                        <Badge>Healthtech</Badge>
                        <Badge>SaaS</Badge>
                        <Badge>B2B</Badge>
                        <Badge>Product Strategy</Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Experience</h3>
                      <div className="mt-2 space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="font-medium">CEO, TechVentures</p>
                            <span className="text-xs text-muted-foreground">2018 - Present</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Leading investment strategy and portfolio management
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Founder, SaaSify</p>
                            <span className="text-xs text-muted-foreground">2012 - 2018</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Built and scaled a B2B SaaS platform to 50k+ users
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Edit About</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="investments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Investments</CardTitle>
                  <CardDescription>Track your investment portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                          <div>
                            <h3 className="font-medium">GreenTech Solutions</h3>
                            <p className="text-xs text-muted-foreground">Renewable Energy</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R250,000</p>
                          <p className="text-xs text-green-600">+15% ROI</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                          <div>
                            <h3 className="font-medium">HealthAI</h3>
                            <p className="text-xs text-muted-foreground">Healthcare</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R150,000</p>
                          <p className="text-xs text-green-600">+8% ROI</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                          <div>
                            <h3 className="font-medium">FinConnect</h3>
                            <p className="text-xs text-muted-foreground">Fintech</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R100,000</p>
                          <p className="text-xs text-red-600">-2% ROI</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View All</Button>
                  <Button>Add Investment</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="preferences" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Preferences</CardTitle>
                  <CardDescription>Customize your investment criteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Investment Sectors</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">
                          Fintech
                        </Badge>
                        <Badge variant="outline" className="border-blue-500 bg-blue-50 text-blue-700">
                          Healthtech
                        </Badge>
                        <Badge variant="outline" className="border-purple-500 bg-purple-50 text-purple-700">
                          Edtech
                        </Badge>
                        <Badge variant="outline">Cleantech</Badge>
                        <Badge variant="outline">AI & ML</Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Investment Stage</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">
                          Pre-seed
                        </Badge>
                        <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">
                          Seed
                        </Badge>
                        <Badge variant="outline">Series A</Badge>
                        <Badge variant="outline">Series B</Badge>
                        <Badge variant="outline">Growth</Badge>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Investment Range</h3>
                      <p className="mt-1 text-sm text-muted-foreground">R50,000 - R500,000</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Geographic Focus</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">
                          South Africa
                        </Badge>
                        <Badge variant="outline" className="border-green-500 bg-green-50 text-green-700">
                          Kenya
                        </Badge>
                        <Badge variant="outline">Nigeria</Badge>
                        <Badge variant="outline">Ghana</Badge>
                        <Badge variant="outline">Rwanda</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function Badge({
  children,
  variant,
  className,
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "outline" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "outline" ? "border border-muted bg-transparent" : "bg-primary text-primary-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

