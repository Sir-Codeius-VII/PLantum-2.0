import Link from "next/link"
import { ArrowRight, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RecentDiscussions() {
  const discussions = [
    { title: "Fundraising strategies for early-stage startups", replies: 23 },
    { title: "The impact of AI on South African businesses", replies: 15 },
    { title: "Navigating regulatory challenges in fintech", replies: 19 },
  ]

  return (
    <div className="space-y-4">
      {discussions.map((discussion, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{discussion.title}</CardTitle>
            <CardDescription>{discussion.replies} replies</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Join Discussion
            </Button>
            <Link href={`/discussion/${index + 1}`} className="text-sm text-muted-foreground hover:underline">
              Read More <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

