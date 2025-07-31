"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, BarChart, PieChart, TrendingUp, Users, DollarSign, Target, MessageCircle, Bell, Settings, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PostList } from "@/components/post/post-list"

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  profile: {
    company_name?: string;
    investment_preferences?: string[];
    total_invested?: number;
    portfolio_size?: number;
  };
}

// Mock data for demonstration
const mockStartupData = {
  name: "EcoSolar Solutions",
  type: "CleanTech Startup",
  stage: "Seed",
  fundingGoal: 500000,
  raised: 250000,
  investors: 12,
  updates: [
    { id: 1, title: "Product Launch", date: "2024-03-15", content: "Launched our MVP to early adopters" },
    { id: 2, title: "Partnership", date: "2024-03-10", content: "Partnered with major retail chain" },
  ],
  metrics: {
    revenue: { current: 50000, target: 200000 },
    users: { current: 1000, target: 5000 },
    growth: 25,
  },
  fundingRounds: [
    { id: 1, type: "Seed", target: 500000, raised: 250000, deadline: "2024-06-30" },
  ],
  messages: [
    { id: 1, from: "Investor A", content: "Interested in your growth metrics", date: "2024-03-14" },
  ],
}

const mockInvestorData = {
  name: "Venture Capital Partners",
  type: "Investment Firm",
  totalInvestments: 15,
  activeInvestments: 8,
  portfolioValue: 25000000,
  recentActivity: [
    { id: 1, startup: "EcoTech", type: "Update", content: "Revenue increased by 25%", date: "2024-03-15" },
    { id: 2, startup: "HealthTech", type: "Message", content: "New partnership opportunity", date: "2024-03-14" },
  ],
  performance: {
    roi: 35,
    averageReturn: 22,
    bestPerformer: "EcoTech",
  },
}

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<"startup" | "investor">("startup")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data');
        }

        if (!data.session) {
          router.push('/auth/signin');
          return;
        }

        setUser(data.session.user);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch user data',
          variant: 'destructive',
        });
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [router, toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarFallback>{userType === "startup" ? "ES" : "VC"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              {userType === "startup" ? mockStartupData.name : mockInvestorData.name}
            </h1>
            <p className="text-muted-foreground">
              {userType === "startup" ? mockStartupData.type : mockInvestorData.type}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PostList />
        </TabsContent>

        <TabsContent value="activity">
          {/* Activity content */}
        </TabsContent>

        <TabsContent value="analytics">
          {/* Analytics content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

