import { NextResponse } from "next/server"

// In a real app, this would fetch data from a database
// For now, we're simulating real data with more realistic values
export async function GET() {
  // Simulate database query delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // This would normally come from your database
  const metrics = [
    {
      id: 1,
      title: "Total Funding",
      value: "R 789M",
      change: "+30%",
      trend: "up",
      icon: "lineChart", // We'll convert these to components on the client
      description: "Total capital raised through the platform",
    },
    {
      id: 2,
      title: "Startups",
      value: "1,234",
      change: "+20%",
      trend: "up",
      icon: "zap",
      description: "Active startups on the platform",
    },
    {
      id: 3,
      title: "Investors",
      value: "567",
      change: "+15%",
      trend: "up",
      icon: "users",
      description: "Active investors seeking opportunities",
    },
    {
      id: 4,
      title: "Live Funding Rounds",
      value: "78",
      change: "+25%",
      trend: "up",
      icon: "calendar",
      description: "Funding rounds currently active",
    },
  ]

  return NextResponse.json(metrics)
}

