"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TestComponent() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Test Component</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>This is a simple test component to verify that your React setup is working correctly.</p>

        <div className="flex justify-center">
          <Button onClick={() => setIsVisible(!isVisible)}>{isVisible ? "Hide Message" : "Show Message"}</Button>
        </div>

        {isVisible && (
          <div className="p-4 mt-4 bg-green-100 dark:bg-green-900/20 rounded-md text-center">
            <p className="text-green-700 dark:text-green-300 font-medium">
              Success! Your React component is working correctly.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TestComponent

