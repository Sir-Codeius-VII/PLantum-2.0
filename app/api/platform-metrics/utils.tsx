import { LineChart, Zap, Users, Calendar } from "lucide-react"

// Helper function to convert icon strings to React components
export function getIconComponent(iconName: string) {
  switch (iconName) {
    case "LineChart":
      return <LineChart className="h-5 w-5 text-primary" />
    case "Zap":
      return <Zap className="h-5 w-5 text-indigo-500" />
    case "Users":
      return <Users className="h-5 w-5 text-emerald-500" />
    case "Calendar":
      return <Calendar className="h-5 w-5 text-amber-500" />
    // Add more cases for other icons
    default:
      return <LineChart className="h-5 w-5 text-primary" /> // Default fallback
  }
}

