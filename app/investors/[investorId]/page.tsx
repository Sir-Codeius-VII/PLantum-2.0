"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrustProfile } from "@/components/trust-profile"
import { ArrowLeft, Briefcase, Building, Calendar, Globe, Mail, MapPin, User, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"

export default function InvestorPage() {
  const params = useParams()
  const investorId = params.investorId

  // Mock data - in a real app, this would come from an API
  const investor = {
    id: investorId,
    name: "Growth Capital Partners",
    logo: "/placeholder.svg?height=100&width=100",
    description:
      "Growth Capital Partners is a venture capital firm focused on early-stage investments in technology, healthcare, and sustainable energy sectors across Africa.",
    type: "Venture Capital",
    location: "Johannesburg, South Africa",
    foundedYear: 2015,
    portfolioSize: 28,
    investmentRange: "R500,000 - R10,000,000",
    website: "https://growthcapitalpartners.co.za",
    email: "investments@growthcapitalpartners.co.za",
    team: [
      {
        name: "Michael Ndlovu",
        role: "Managing Partner",
        bio: "Former investment banker with 15+ years experience in African markets",
      },
      { name: "Lisa van der Merwe", role: "Partner", bio: "Technology entrepreneur and angel investor" },
      { name: "James Okafor", role: "Investment Director", bio: "Specializes in healthcare and biotech investments" },
    ],
    portfolio: [
      { name: "MediTech Solutions", industry: "HealthTech", stage: "Series A", year: 2021, amount: 3.5 },
      { name: "SolarGrid", industry: "CleanTech", stage: "Seed", year: 2022, amount: 1.8 },
      { name: "FinanceApp", industry: "FinTech", stage: "Series B", year: 2020, amount: 5.2 },
      { name: "EduTech Africa", industry: "EdTech", stage: "Seed", year: 2023, amount: 1.2 },
      { name: "LogisticsPlus", industry: "Supply Chain", stage: "Series A", year: 2021, amount: 2.7 },
    ],
    investmentCriteria: [
      "Strong founding team with domain expertise",
      "Scalable business model with clear path to profitability",
      "Addressing large market opportunities in Africa",
      "Technology-enabled solutions with competitive advantages",
    ],
    // Trust profile data
    trustRating: {
      trustScore: 92,
      verificationLevel: "premium",
      ratings: {
        overall: 4.9,
        totalRatings: 42,
        breakdown: {
          5: 35,
          4: 5,
          3: 2,
          2: 0,
          1: 0,
        },
        categories: {
          reliability: 4.9,
          communication: 4.8,
          expertise: 5.0,
          transparency: 4.7,
        },
      },
      trustFactors: {
        verifiedDocuments: true,
        completedDeals: 15,
        yearsActive: 8,
        communityEndorsements: 38,
      },
    },
    preferredIndustries: ["HealthTech", "FinTech", "CleanTech", "EdTech", "AgriTech"],
    investmentStages: ["Seed", "Series A", "Series B"],
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href="/investors"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Investors
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-16 w-16 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <img
                  src={investor.logo || "/placeholder.svg"}
                  alt={`${investor.name} logo`}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-2xl">{investor.name}</CardTitle>
                <CardDescription className="text-sm flex items-center mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                  {investor.location}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{investor.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Building className="h-3.5 w-3.5 mr-1" />
                    Type
                  </span>
                  <span className="font-medium">{investor.type}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Founded
                  </span>
                  <span className="font-medium">{investor.foundedYear}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    Portfolio
                  </span>
                  <span className="font-medium">{investor.portfolioSize} companies</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <User className="h-3.5 w-3.5 mr-1" />
                    Team Size
                  </span>
                  <span className="font-medium">{investor.team.length}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button asChild variant="outline" className="flex-1">
                  <a href={investor.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <a href={`mailto:${investor.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </a>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/dashboard/startup/new">Pitch Your Startup</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="criteria">Investment Criteria</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>About {investor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{investor.description}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Investment Criteria</h4>
                    <ul>
                      {investor.investmentCriteria.map((criteria, index) => (
                        <li key={index} className="list-disc ml-5">
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                </CardHeader>
                <CardContent>
                  {investor.team.map((member, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-gray-500">{member.role}</p>
                      <p className="mt-1">{member.bio}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Companies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {investor.portfolio.map((company, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{company.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {company.industry} - {company.stage}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-gray-500 dark:text-gray-400">Invested in {company.year}</span>
                          <span className="text-sm text-primary font-medium">R{company.amount}M</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="criteria">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2">What We Look For</h4>
                      <ul className="space-y-2">
                        {investor.investmentCriteria.map((criteria, index) => (
                          <li key={index} className="flex items-start">
                            <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></div>
                            <span>{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Investment Range</h4>
                      <p>{investor.investmentRange}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Preferred Industries</h4>
                      <div className="flex flex-wrap gap-2">
                        {investor.preferredIndustries.map((industry, index) => (
                          <Badge key={index} variant="secondary">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Investment Stage</h4>
                      <div className="flex flex-wrap gap-2">
                        {investor.investmentStages.map((stage, index) => (
                          <Badge key={index} variant="outline">
                            {stage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Trust Profile Component */}
          <TrustProfile
            entityName={investor.name}
            entityType="investor"
            averageRating={investor.trustRating.ratings.overall}
            totalRatings={investor.trustRating.ratings.totalRatings}
            verificationLevel={investor.trustRating.verificationLevel}
            joinedDate={`${investor.foundedYear}`}
            successfulDeals={investor.trustRating.trustFactors.completedDeals}
          />

          <Card>
            <CardHeader>
              <CardTitle>Contact {investor.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{investor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Link href={investor.website} className="flex items-center hover:underline">
                  {investor.website}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
              <Button className="w-full mt-4">Connect with {investor.name}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

