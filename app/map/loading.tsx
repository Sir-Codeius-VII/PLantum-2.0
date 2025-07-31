import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function MapLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 border-b flex items-center px-4 md:px-6">
        <Skeleton className="h-8 w-[180px]" />
        <div className="ml-auto flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <main className="flex-1 py-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <Skeleton className="h-10 w-[150px] mb-2" />
              <Skeleton className="h-4 w-[250px]" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-[300px]" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>

          {/* Map placeholder */}
          <Skeleton className="w-full h-[250px] mb-8 rounded-lg" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar skeleton */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-[100px]" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-full" />

                  <div className="space-y-3 pt-4">
                    <Skeleton className="h-5 w-[120px]" />
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-[80%]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-[120px]" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Skeleton className="h-8 w-[60px] mb-1" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                    <div>
                      <Skeleton className="h-8 w-[60px] mb-1" />
                      <Skeleton className="h-3 w-[80px]" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-[100px] mb-2" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-7 w-[80px] rounded-full" />
                    <Skeleton className="h-7 w-[100px] rounded-full" />
                    <Skeleton className="h-7 w-[60px] rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main content skeleton */}
            <div className="lg:col-span-9">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-9 w-[300px]" />
                <Skeleton className="h-9 w-[180px]" />
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-[120px] mb-1" />
                          <Skeleton className="h-3 w-[80px]" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <Skeleton className="h-10 w-full mb-3" />
                      <div className="flex gap-1.5 mb-4">
                        <Skeleton className="h-5 w-[80px] rounded-full" />
                        <Skeleton className="h-5 w-[100px] rounded-full" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-[80px]" />
                        <Skeleton className="h-4 w-[60px]" />
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex-col gap-2">
                      <div className="w-full h-px bg-muted mb-2" />
                      <div className="w-full flex justify-between">
                        <Skeleton className="h-3 w-[80px]" />
                        <Skeleton className="h-3 w-[60px]" />
                      </div>
                      <Skeleton className="h-1 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

