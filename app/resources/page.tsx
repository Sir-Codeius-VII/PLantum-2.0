import { Header } from "@/components/Header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BookOpen, FileText, Video, Bell } from "lucide-react"

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4 py-8">
            <h1 className="text-4xl font-bold">Founder Resources</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tools, templates, and guides to help you build and grow your startup
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Startup Funding Guide</CardTitle>
                <CardDescription>A comprehensive guide to raising capital in South Africa</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn about different funding options, from bootstrapping to venture capital, and how to approach each
                  stage of fundraising.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/resources/funding-guide">
                    Read Guide <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Pitch Deck Templates</CardTitle>
                <CardDescription>Customizable templates to create compelling investor pitches</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access professionally designed pitch deck templates tailored for South African startups across
                  different industries.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/resources/pitch-templates">
                    Get Templates <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Video className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Founder Masterclass</CardTitle>
                <CardDescription>Video series featuring successful South African entrepreneurs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Watch in-depth interviews and lessons from founders who have built successful businesses in South
                  Africa.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/resources/masterclass">
                    Watch Series <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Legal Document Templates</CardTitle>
                <CardDescription>Essential legal templates for South African startups</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access templates for company registration, shareholder agreements, employment contracts, and more.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/resources/legal-templates">
                    Access Templates <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Financial Modeling Templates</CardTitle>
                <CardDescription>Spreadsheet templates for financial projections and planning</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Download customizable financial models to create projections, track metrics, and plan your runway.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/resources/financial-templates">
                    Download Templates <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Founder's Handbook</CardTitle>
                <CardDescription>
                  A comprehensive guide to starting and scaling a business in South Africa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Everything from company registration to hiring, marketing, and scaling operations in the South African
                  context.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/resources/founders-handbook">
                    Read Handbook <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Mentorship section moved from founders page */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Founder Mentorship Program</h2>
            <Card className="border-dashed border-2">
              <CardHeader>
                <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-2">
                  Coming Soon
                </div>
                <CardTitle>Get guidance from experienced entrepreneurs and industry experts</CardTitle>
                <CardDescription>
                  We're starting lean and will be launching our mentorship program in the near future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our mentorship program will connect early-stage founders with experienced entrepreneurs and industry
                  experts who can provide guidance, feedback, and connections.
                </p>
                <div className="mt-6">
                  <Button variant="outline" disabled className="w-full">
                    <span className="mr-2">🚀</span> Launching Soon
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Want to be notified when this feature launches?{" "}
                  <Link
                    href="#"
                    className="text-primary inline-flex items-center hover:text-primary/80 transition-colors"
                    aria-label="Join the waitlist"
                  >
                    <Bell className="h-4 w-4" />
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

