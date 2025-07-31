import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function FeaturedStartups() {
  const startups = [
    { name: "EcoSolar", description: "Renewable energy solutions", avatar: "ES" },
    { name: "HealthTech", description: "AI-powered diagnostics", avatar: "HT" },
    { name: "FinLeap", description: "Innovative fintech platform", avatar: "FL" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {startups.map((startup) => (
        <Card key={startup.name} className="border border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={`/placeholder.svg?text=${startup.avatar}`} alt={startup.name} />
              <AvatarFallback>{startup.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{startup.name}</CardTitle>
              <CardDescription>{startup.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/startup/${startup.name.toLowerCase()}`}>
                View Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

