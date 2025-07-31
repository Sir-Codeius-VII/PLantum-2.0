import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function ActiveInvestors() {
  const investors = [
    { name: "Savannah Ventures", description: "Early-stage VC firm", avatar: "SV" },
    { name: "TechGrowth Capital", description: "Series A specialist", avatar: "TG" },
    { name: "Innovation Fund", description: "Government-backed fund", avatar: "IF" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {investors.map((investor) => (
        <Card key={investor.name} className="border border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={`/placeholder.svg?text=${investor.avatar}`} alt={investor.name} />
              <AvatarFallback>{investor.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{investor.name}</CardTitle>
              <CardDescription>{investor.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href={`/investor/${investor.name.toLowerCase().replace(/\s+/g, "-")}`}>
                View Profile <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

