import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SimpleLeaderboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">1</div>
              <div>
                <p className="font-medium">Sarah Venter</p>
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground">Horizon Capital</p>
                  <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4">
                    Firm
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">R12.5M</p>
              <p className="text-sm text-green-500">+3</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">2</div>
              <div>
                <p className="font-medium">James Nkosi</p>
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground">Tech Ventures</p>
                  <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4">
                    Individual
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">R9.8M</p>
              <p className="text-sm text-green-500">+1</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">3</div>
              <div>
                <p className="font-medium">Thabo Ventures</p>
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground">Investment Group</p>
                  <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4">
                    Firm
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">R8.2M</p>
              <p className="text-sm text-green-500">+2</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">4</div>
              <div>
                <p className="font-medium">Lerato Moloi</p>
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground">Angel Investor</p>
                  <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4">
                    Individual
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">R7.5M</p>
              <p className="text-sm text-green-500">+4</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">5</div>
              <div>
                <p className="font-medium">African Growth Fund</p>
                <div className="flex items-center">
                  <p className="text-sm text-muted-foreground">VC Fund</p>
                  <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4">
                    Firm
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">R6.9M</p>
              <p className="text-sm text-green-500">+2</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

