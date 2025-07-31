import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function StartupsLoading() {
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
              <Skeleton className="h-10 w-[100px]" />
            </div>
          </div>

          {/* Featured startups skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-[200px] mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-40 w-full" />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <Skeleton className="h-5 w-[100px] mb-1" />
                        <Skeleton className="h-3 w-[80px]" />
                      </div>
                      <Skeleton className="h-6 w-[80px] rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters sidebar skeleton */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-[100px]" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-10 w-full" />

                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-10 w-full" />

                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-10 w-full" />

                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-4 w-full" />

                  <Skeleton className="h-5 w-[100px]" />
                  <Skeleton className="h-4 w-full" />

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-[150px]" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-[100px]" />
                      </div>
                      <Skeleton className="h-5 w-[60px]" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-5 w-[100px]" />
                      </div>
                      <Skeleton className="h-5 w-[60px]" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main content skeleton */}
            <div className="lg:col-span-9">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-8 w-[180px]" />
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

