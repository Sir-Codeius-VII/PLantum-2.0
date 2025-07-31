'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { formatCurrency } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowUpRight, ArrowDownRight, DollarSign, CreditCard, Wallet } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface PaymentStats {
  totalAmount: number
  totalCount: number
  successRate: number
  averageAmount: number
  byProvider: {
    provider: string
    count: number
    amount: number
  }[]
  byStatus: {
    status: string
    count: number
  }[]
  dailyStats: {
    date: string
    amount: number
    count: number
  }[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const paymentMethods = [
  {
    id: 1,
    name: "Credit Card",
    icon: CreditCard,
    amount: 125000,
    percentage: 45,
  },
  {
    id: 2,
    name: "Bank Transfer",
    icon: Wallet,
    amount: 85000,
    percentage: 30,
  },
  {
    id: 3,
    name: "Cash",
    icon: DollarSign,
    amount: 70000,
    percentage: 25,
  },
]

export default function PaymentAnalyticsPage() {
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('7d')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAnalytics()

    // Subscribe to payment updates
    const channel = supabase
      .channel('payment_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
        },
        () => {
          fetchAnalytics()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const { data: payments, error } = await supabase
        .from('payments')
        .select('*')
        .gte('created_at', getDateFromRange(timeRange))
        .order('created_at', { ascending: true })

      if (error) throw error

      const stats = calculateStats(payments || [])
      setStats(stats)
    } catch (error) {
      setError('Failed to fetch analytics')
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (payments: any[]): PaymentStats => {
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const totalCount = payments.length
    const successCount = payments.filter(p => p.status === 'completed').length
    const successRate = totalCount > 0 ? (successCount / totalCount) * 100 : 0
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0

    // Group by provider
    const byProvider = Object.entries(
      payments.reduce((acc, p) => {
        acc[p.payment_provider] = acc[p.payment_provider] || { count: 0, amount: 0 }
        acc[p.payment_provider].count++
        acc[p.payment_provider].amount += p.amount
        return acc
      }, {} as Record<string, { count: number; amount: number }>)
    ).map(([provider, data]) => ({
      provider,
      count: data.count,
      amount: data.amount,
    }))

    // Group by status
    const byStatus = Object.entries(
      payments.reduce((acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    ).map(([status, count]) => ({
      status,
      count,
    }))

    // Group by day
    const dailyStats = Object.entries(
      payments.reduce((acc, p) => {
        const date = new Date(p.created_at).toISOString().split('T')[0]
        acc[date] = acc[date] || { amount: 0, count: 0 }
        acc[date].amount += p.amount
        acc[date].count++
        return acc
      }, {} as Record<string, { amount: number; count: number }>)
    ).map(([date, data]) => ({
      date,
      amount: data.amount,
      count: data.count,
    }))

    return {
      totalAmount,
      totalCount,
      successRate,
      averageAmount,
      byProvider,
      byStatus,
      dailyStats,
    }
  }

  const getDateFromRange = (range: string): string => {
    const date = new Date()
    switch (range) {
      case '7d':
        date.setDate(date.getDate() - 7)
        break
      case '30d':
        date.setDate(date.getDate() - 30)
        break
      case '90d':
        date.setDate(date.getDate() - 90)
        break
      default:
        date.setDate(date.getDate() - 7)
    }
    return date.toISOString()
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'payfast':
        return <Wallet className="h-4 w-4" />
      case 'stripe':
        return <CreditCard className="h-4 w-4" />
      case 'bank':
        return <CreditCard className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="text-center py-8 text-red-500">
        {error || 'Failed to load analytics'}
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Payment Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalAmount, 'ZAR')}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCount} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalCount} total transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.averageAmount, 'ZAR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.byProvider.length}</div>
            <p className="text-xs text-muted-foreground">
              Different payment methods
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Payment Methods</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value, 'ZAR')}
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      name="Revenue"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.byProvider}
                      dataKey="amount"
                      nameKey="provider"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stats.byProvider.map((entry, index) => (
                        <Cell key={entry.provider} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value, 'ZAR')}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {stats.byProvider.map((provider, index) => (
                  <div
                    key={provider.provider}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex items-center space-x-2">
                      {getProviderIcon(provider.provider)}
                      <span className="capitalize">{provider.provider}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(provider.amount, 'ZAR')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {provider.count} transactions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.byStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stats.byStatus.map((entry, index) => (
                        <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {stats.byStatus.map((status, index) => (
                  <div
                    key={status.status}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="capitalize">{status.status}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{status.count}</div>
                      <div className="text-sm text-muted-foreground">
                        {((status.count / stats.totalCount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 