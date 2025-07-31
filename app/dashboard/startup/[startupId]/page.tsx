import Image from "next/image"
import Link from "next/link"
import {
  ArrowUpRight,
  Building2,
  Calendar,
  Download,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  Users,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function StartupProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative h-48 w-full overflow-hidden rounded-t-xl md:h-60">
            <Image src="/placeholder.svg?height=240&width=800" alt="Cover Image" fill className="object-cover" />
          </div>
          <div className="relative -mt-12 flex flex-col items-start px-4 md:flex-row md:items-end md:px-6">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="EcoSolar Solutions" />
              <AvatarFallback>ES</AvatarFallback>
            </Avatar>
            <div className="mt-4 flex-1 md:ml-4 md:mt-0">
              <h1 className="text-2xl font-bold">EcoSolar Solutions</h1>
              <p className="text-muted-foreground">Renewable energy solutions for South Africa</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>CleanTech</Badge>
                <Badge>Renewable Energy</Badge>
                <Badge>Seed Stage</Badge>
              </div>
            </div>
            <div className="mt-4 flex gap-2 md:mt-0">
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="updates"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
              >
                Updates
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
              >
                Team
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary"
              >
                Documents
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>About EcoSolar Solutions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    EcoSolar Solutions is a renewable energy startup based in Cape Town, South Africa. We design,
                    manufacture, and install affordable solar energy solutions for residential and commercial properties
                    across Southern Africa.
                  </p>
                  <p>
                    Our mission is to accelerate South Africa's transition to clean energy by making solar power
                    accessible to everyone. We've developed proprietary technology that reduces installation costs by
                    40% while increasing energy efficiency by 25% compared to traditional systems.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>Founded in 2021</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Cape Town, South Africa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>12 employees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Link href="https://ecosolar.example.com" className="flex items-center hover:underline">
                        ecosolar.example.com
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Current Funding Round</CardTitle>
                  <CardDescription>Seed Round - Closing in 45 days</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">R3.5M / R5M</span>
                      <span className="text-sm text-muted-foreground">70% funded</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Equity Offered</div>
                      <div className="font-medium">15%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Minimum Investment</div>
                      <div className="font-medium">R250,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pre-money Valuation</div>
                      <div className="font-medium">R28.3M</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">Use of Funds</h4>
                    <ul className="list-disc pl-5 text-sm">
                      <li>Expand manufacturing capacity</li>
                      <li>Hire additional technical staff</li>
                      <li>Marketing and sales expansion to Namibia and Botswana</li>
                      <li>R&D for next-generation solar panels</li>
                    </ul>
                  </div>
                  <Button className="w-full">Request Investment Details</Button>
                </CardContent>
              </Card>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Traction & Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Revenue (2023)</div>
                      <div className="font-medium">R4.2M</div>
                      <div className="text-xs text-green-500">+215% YoY</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Customers</div>
                      <div className="font-medium">350+</div>
                      <div className="text-xs text-green-500">+180% YoY</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Installations</div>
                      <div className="font-medium">420 kW</div>
                      <div className="text-xs text-green-500">+250% YoY</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="updates" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">March 15, 2024</span>
                    </div>
                    <h3 className="font-semibold">New Partnership with Cape Town Municipality</h3>
                    <p>
                      We're excited to announce our new partnership with the Cape Town Municipality to install solar
                      panels on government buildings. This project will generate 250kW of clean energy and save the city
                      approximately R1.2M in annual electricity costs.
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">February 28, 2024</span>
                    </div>
                    <h3 className="font-semibold">Product Launch: EcoSolar Home Battery</h3>
                    <p>
                      Today we launched our new home battery storage solution, designed specifically for the South
                      African market. The EcoSolar Home Battery provides up to 10kWh of storage capacity, allowing
                      homeowners to store excess solar energy for use during load shedding or at night.
                    </p>
                    <div className="mt-2">
                      <Image
                        src="/placeholder.svg?height=200&width=400"
                        alt="EcoSolar Home Battery"
                        width={400}
                        height={200}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">January 10, 2024</span>
                    </div>
                    <h3 className="font-semibold">Q4 2023 Results</h3>
                    <p>
                      We're pleased to report that Q4 2023 was our strongest quarter yet, with revenue of R1.5M,
                      representing a 45% increase over Q3. We completed 85 new installations and expanded our team with
                      4 new hires.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="team" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Leadership Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" alt="Thabo Nkosi" />
                      <AvatarFallback>TN</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Thabo Nkosi</h3>
                      <p className="text-sm text-muted-foreground">Co-founder & CEO</p>
                      <p className="mt-2 text-sm">
                        Former renewable energy consultant with 10+ years of experience in the South African energy
                        sector. MSc in Electrical Engineering from University of Cape Town.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                          <Link className="h-4 w-4" />
                          <span className="sr-only">LinkedIn</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" alt="Lerato Molefe" />
                      <AvatarFallback>LM</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Lerato Molefe</h3>
                      <p className="text-sm text-muted-foreground">Co-founder & CTO</p>
                      <p className="mt-2 text-sm">
                        Solar technology expert with previous experience at Eskom's renewable energy division. PhD in
                        Materials Science from Stellenbosch University.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                          <Link className="h-4 w-4" />
                          <span className="sr-only">LinkedIn</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" alt="Sarah van der Merwe" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Sarah van der Merwe</h3>
                      <p className="text-sm text-muted-foreground">CFO</p>
                      <p className="mt-2 text-sm">
                        Financial expert with background in clean energy project financing. Previously worked at
                        Standard Bank's renewable energy investment division.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                          <Link className="h-4 w-4" />
                          <span className="sr-only">LinkedIn</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="documents" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Secure access to company documents (requires investor verification)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-8 w-8 text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div>
                          <p className="font-medium">EcoSolar Pitch Deck</p>
                          <p className="text-xs text-muted-foreground">PDF • 8.5 MB • Updated 2 weeks ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Request Access
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-8 w-8 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div>
                          <p className="font-medium">Financial Projections 2024-2026</p>
                          <p className="text-xs text-muted-foreground">XLSX • 2.3 MB • Updated 1 month ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Request Access
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-8 w-8 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div>
                          <p className="font-medium">Business Plan</p>
                          <p className="text-xs text-muted-foreground">DOCX • 4.1 MB • Updated 3 weeks ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Request Access
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-8 w-8 text-yellow-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <div>
                          <p className="font-medium">Technical Product Specifications</p>
                          <p className="text-xs text-muted-foreground">PDF • 12.7 MB • Updated 1 week ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Request Access
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>info@ecosolar.example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>+27 21 555 0123</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>123 Green Street, Cape Town, 8001, South Africa</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Link href="https://ecosolar.example.com" className="flex items-center hover:underline">
                  ecosolar.example.com
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Current Investors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="Green Ventures" />
                  <AvatarFallback>GV</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Green Ventures</p>
                  <p className="text-sm text-muted-foreground">Lead Investor</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="SA Innovation Fund" />
                  <AvatarFallback>SF</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">SA Innovation Fund</p>
                  <p className="text-sm text-muted-foreground">Seed Investor</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="Cape Angels" />
                  <AvatarFallback>CA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Cape Angels</p>
                  <p className="text-sm text-muted-foreground">Angel Investor Group</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Similar Startups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="SunPower Africa" />
                    <AvatarFallback>SP</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">SunPower Africa</p>
                    <p className="text-sm text-muted-foreground">Solar Energy</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="WindTech SA" />
                    <AvatarFallback>WT</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">WindTech SA</p>
                    <p className="text-sm text-muted-foreground">Wind Energy</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="GreenBattery" />
                    <AvatarFallback>GB</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">GreenBattery</p>
                    <p className="text-sm text-muted-foreground">Energy Storage</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

