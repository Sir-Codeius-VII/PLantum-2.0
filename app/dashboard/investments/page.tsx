"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, ArrowUpDown } from "lucide-react"

interface Investment {
  id: string;
  startup_id: string;
  startup_name: string;
  amount: number;
  equity_percentage: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  investment_type: string;
  investment_round: string;
  due_diligence_status: string;
}

export default function InvestmentsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("opportunities")

  useEffect(() => {
    async function fetchInvestments() {
      try {
        const response = await fetch('/api/investments');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch investments');
        }

        setInvestments(data.investments);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch investments',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchInvestments();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Investments</h1>
            <p className="text-muted-foreground">
              Track and manage your startup investments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search investments..."
            className="pl-9"
          />
        </div>

        <Tabs value={view} onValueChange={setView} className="space-y-4">
          <TabsList>
            <TabsTrigger value="opportunities">Investment Opportunities</TabsTrigger>
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            <TabsTrigger value="history">Investment History</TabsTrigger>
          </TabsList>

          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <CardTitle>Available Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No investment opportunities available at the moment.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>My Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your investment portfolio will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Investment History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your investment history will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

