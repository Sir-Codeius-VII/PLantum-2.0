import { CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function ActiveFundingRounds() {
  const fundingRounds = [
    {
      id: 1,
      title: "Seed Round",
      company: "EcoSolar Solutions",
      description: "Renewable energy solutions for South Africa",
      raised: 3500000,
      goal: 5000000,
      equity: "15%",
    },
    {
      id: 2,
      title: "Series A",
      company: "HealthTech Africa",
      description: "Healthcare platform connecting patients with providers",
      raised: 12000000,
      goal: 20000000,
      equity: "12%",
    },
  ]

  return (
    <div className="space-y-4">
      {fundingRounds.map((round) => (
        <Card key={round.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{round.company}</CardTitle>
            <CardDescription>{round.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-medium">R{round.raised.toLocaleString()} raised</span>
                <span className="text-muted-foreground">R{round.goal.toLocaleString()} goal</span>
              </div>
              <Progress value={(round.raised / round.goal) * 100} className="h-2" />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Equity Offered</p>
                <p className="font-medium">{round.equity}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/funding-rounds/${round.id}`}>
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

