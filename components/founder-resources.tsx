import Link from "next/link"
import { ArrowRight, BookOpen, FileText, Users, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function FounderResources() {
  const resources = [
    {
      title: "Startup Funding Guide",
      description: "A comprehensive guide to raising capital in South Africa",
      icon: <FileText className="h-8 w-8 text-primary" />,
      link: "/resources/funding-guide",
    },
    {
      title: "Founder Community",
      description: "Connect with other founders for support and collaboration",
      icon: <Users className="h-8 w-8 text-primary" />,
      link: "/community/founders",
    },
    {
      title: "Pitch Deck Templates",
      description: "Customizable templates to create compelling investor pitches",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      link: "/resources/pitch-templates",
    },
    {
      title: "Founder Masterclass",
      description: "Video series featuring successful South African entrepreneurs",
      icon: <Video className="h-8 w-8 text-primary" />,
      link: "/resources/masterclass",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {resources.map((resource, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <div className="mb-2">{resource.icon}</div>
            <CardTitle>{resource.title}</CardTitle>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1"></CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href={resource.link}>
                Access Resource <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

