import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentService } from '@/lib/payment/payment-service';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { AddPaymentMethodModal } from './add-payment-method-modal';
import { PaymentMethodIcon } from '@/components/ui/payment-method-icon';
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
  BarChart,
  Bar
} from 'recharts';
import { WithdrawModal } from './withdraw-modal';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  created_at: string;
  metadata?: Record<string, any>;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface Wallet {
  balance: number;
  currency: string;
  pendingBalance: number;
  lastWithdrawal: {
    amount: number;
    date: string;
    status: string;
  } | null;
}

interface BusinessAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  projectedRevenue: number;
  revenueGrowth: number;
  averageTransactionValue: number;
  transactionVolume: number;
  monthlyTransactions: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  revenueByProduct: Array<{
    product: string;
    revenue: number;
    percentage: number;
  }>;
  customerRetention: number;
  churnRate: number;
}

interface FundingRound {
  id: string;
  startupId: string;
  startupName: string;
  amount: number;
  equity: number;
  status: 'open' | 'closed' | 'pending';
  investors: number;
  createdAt: string;
  endDate: string;
  raisedAmount: number;
  minimumInvestment: number;
  documents: {
    pitchDeck: string;
    financials: string;
    businessPlan: string;
  };
  team: Array<{
    name: string;
    role: string;
    bio: string;
    avatar: string;
  }>;
}

interface Startup {
  id: string;
  name: string;
  description: string;
  industry: string;
  stage: string;
  valuation: number;
  fundingGoal: number;
  raisedAmount: number;
  investors: number;
  followers: number;
  status: 'active' | 'funded' | 'closed';
  team: Array<{
    name: string;
    role: string;
    bio: string;
    avatar: string;
  }>;
  documents: {
    pitchDeck: string;
    financials: string;
    businessPlan: string;
  };
  metrics: {
    revenue: number;
    growth: number;
    burnRate: number;
    runway: number;
  };
}

interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  type: 'update' | 'milestone' | 'funding' | 'general';
  likes: number;
  comments: Array<{
    id: string;
    userId: string;
    userName: string;
    userAvatar: string;
    content: string;
    createdAt: string;
  }>;
  shares: number;
  createdAt: string;
  attachments: Array<{
    type: 'image' | 'document' | 'link';
    url: string;
    title: string;
  }>;
  mentions: Array<{
    id: string;
    name: string;
    type: 'user' | 'startup' | 'investor';
  }>;
}

interface Investor {
  id: string;
  name: string;
  avatar: string;
  type: 'individual' | 'institution';
  verified: boolean;
  portfolio: Array<{
    startupId: string;
    startupName: string;
    investmentAmount: number;
    equity: number;
    date: string;
  }>;
  interests: string[];
  investmentRange: {
    min: number;
    max: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function UserPaymentDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { ref: loadMoreRef, inView } = useInView();

  // Fetch wallet data with caching
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const response = await fetch('/api/payments/wallet');
      if (!response.ok) throw new Error('Failed to fetch wallet');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch payment methods with caching
  const { data: paymentMethods, isLoading: methodsLoading } = useQuery({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      const response = await fetch('/api/payments/methods');
      if (!response.ok) throw new Error('Failed to fetch payment methods');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch transaction history with pagination
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', currentPage],
    queryFn: async () => {
      const response = await fetch(`/api/payments/history?page=${currentPage}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      return response.json();
    },
    keepPreviousData: true,
  });

  // Fetch analytics with caching
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/payments/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch active funding rounds with infinite scroll
  const { data: fundingRounds, isLoading: roundsLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['fundingRounds'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/funding/rounds?page=${pageParam}&limit=5`);
      if (!response.ok) throw new Error('Failed to fetch funding rounds');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch trending startups with caching
  const { data: trendingStartups, isLoading: startupsLoading } = useQuery({
    queryKey: ['trendingStartups'],
    queryFn: async () => {
      const response = await fetch('/api/startups/trending');
      if (!response.ok) throw new Error('Failed to fetch trending startups');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch social feed with infinite scroll
  const { data: socialFeed, isLoading: feedLoading, fetchNextPage: fetchMoreFeed } = useInfiniteQuery({
    queryKey: ['socialFeed'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(`/api/social/feed?page=${pageParam}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch social feed');
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  // Fetch user's investment portfolio
  const { data: portfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const response = await fetch('/api/investments/portfolio');
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Load more funding rounds when scrolling
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Optimistic updates for transactions
  const handleTransaction = async (data: any) => {
    // Optimistically update the UI
    queryClient.setQueryData(['transactions', currentPage], (old: any) => ({
      ...old,
      transactions: [data, ...(old?.transactions || [])],
    }));

    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to process payment');

      // Refetch data to ensure consistency
      queryClient.invalidateQueries(['transactions', currentPage]);
      queryClient.invalidateQueries(['wallet']);
      queryClient.invalidateQueries(['analytics']);

      toast({
        title: 'Success',
        description: 'Payment processed successfully',
      });
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries(['transactions', currentPage]);
      toast({
        title: 'Error',
        description: 'Failed to process payment',
        variant: 'destructive',
      });
    }
  };

  const handleAddPaymentMethod = () => {
    // Implementation of handleAddPaymentMethod
  };

  const handleRemovePaymentMethod = async (methodId: string) => {
    // Implementation of handleRemovePaymentMethod
  };

  const handleSetDefaultPaymentMethod = async (methodId: string) => {
    // Implementation of handleSetDefaultPaymentMethod
  };

  const handleWithdraw = async (amount: number) => {
    // Implementation of handleWithdraw
  };

  // Optimistic updates for social interactions
  const handleSocialAction = async (postId: string, action: 'like' | 'comment' | 'share') => {
    queryClient.setQueryData(['socialFeed'], (old: any) => ({
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        posts: page.posts.map((post: any) =>
          post.id === postId
            ? {
                ...post,
                likes: action === 'like' ? post.likes + 1 : post.likes,
                comments: action === 'comment' ? post.comments + 1 : post.comments,
                shares: action === 'share' ? post.shares + 1 : post.shares,
              }
            : post
        ),
      })),
    }));

    try {
      await fetch('/api/social/actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, action }),
      });
    } catch (error) {
      queryClient.invalidateQueries(['socialFeed']);
      toast({
        title: 'Error',
        description: 'Failed to process social action',
        variant: 'destructive',
      });
    }
  };

  // Add new functions for social interactions
  const handleComment = async (postId: string, content: string) => {
    queryClient.setQueryData(['socialFeed'], (old: any) => ({
      ...old,
      pages: old.pages.map((page: any) => ({
        ...page,
        posts: page.posts.map((post: any) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: Date.now().toString(),
                    userId: 'current-user',
                    userName: 'You',
                    userAvatar: '/avatars/default.png',
                    content,
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : post
        ),
      })),
    }));

    try {
      await fetch('/api/social/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content }),
      });
    } catch (error) {
      queryClient.invalidateQueries(['socialFeed']);
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    }
  };

  const handleFollow = async (startupId: string) => {
    try {
      await fetch('/api/startups/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId }),
      });
      queryClient.invalidateQueries(['trendingStartups']);
      toast({
        title: 'Success',
        description: 'Successfully followed startup',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to follow startup',
        variant: 'destructive',
      });
    }
  };

  const handleInvest = async (roundId: string, amount: number) => {
    try {
      await fetch('/api/funding/invest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roundId, amount }),
      });
      queryClient.invalidateQueries(['fundingRounds']);
      queryClient.invalidateQueries(['portfolio']);
      toast({
        title: 'Success',
        description: 'Investment successful',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process investment',
        variant: 'destructive',
      });
    }
  };

  if (walletLoading || methodsLoading || transactionsLoading || analyticsLoading || roundsLoading || startupsLoading || feedLoading || portfolioLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Business Dashboard</h2>
        <div className="flex space-x-4">
          <Button onClick={handleAddPaymentMethod}>
            Add Payment Method
          </Button>
          {wallet && wallet.balance > 0 && (
            <Button onClick={() => setIsWithdrawModalOpen(true)}>
              Withdraw Funds
            </Button>
          )}
        </div>
      </div>

      {walletLoading ? (
        <Card className="p-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Available Balance
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(wallet.balance, wallet.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Balance
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(wallet.pendingBalance, wallet.currency)}
                </p>
              </div>
              {wallet.lastWithdrawal && (
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Withdrawal
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      wallet.lastWithdrawal.amount,
                      wallet.currency
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(wallet.lastWithdrawal.date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Business Analytics</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          {analyticsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array(4).fill(0).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(analytics?.totalRevenue || 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(analytics?.monthlyRevenue || 0)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {analytics?.revenueGrowth > 0 ? '+' : ''}
                    {analytics?.revenueGrowth.toFixed(1)}% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Projected Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(analytics?.projectedRevenue || 0)}
                  </div>
                  <p className="text-xs text-gray-500">Next month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Customer Retention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {analytics?.customerRetention.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500">
                    Churn Rate: {analytics?.churnRate.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.monthlyTransactions}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={value =>
                          new Date(value).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                          })
                        }
                      />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === 'revenue'
                            ? formatCurrency(value, 'USD')
                            : value,
                          name === 'revenue' ? 'Revenue' : 'Transactions'
                        ]}
                        labelFormatter={value =>
                          new Date(value).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric'
                          })
                        }
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="revenue"
                        fill="#8884d8"
                        name="revenue"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="transactions"
                        fill="#82ca9d"
                        name="transactions"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Product</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.revenueByProduct}
                        dataKey="revenue"
                        nameKey="product"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({
                          product,
                          percent
                        }: {
                          product: string;
                          percent: number;
                        }) =>
                          `${product} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {analytics?.revenueByProduct.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) =>
                          formatCurrency(value, 'USD')
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {transactionsLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Customer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions?.transactions.map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(payment.amount, payment.currency)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payment.status === 'succeeded'
                                  ? 'bg-green-100 text-green-800'
                                  : payment.status === 'failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {payment.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {payment.metadata?.product || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {payment.metadata?.customerEmail || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span>Page {currentPage}</span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => p + 1)}
                      disabled={!transactions?.hasMore}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods?.paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <PaymentMethodIcon brand={method.brand} />
                      <div>
                        <p className="font-medium">
                          {method.brand} ending in {method.last4}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!method.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefaultPaymentMethod(method.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddPaymentMethodModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          queryClient.invalidateQueries(['paymentMethods']);
        }}
      />

      {wallet && (
        <WithdrawModal
          isOpen={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          onSuccess={() => {
            setIsWithdrawModalOpen(false);
            queryClient.invalidateQueries(['wallet']);
          }}
          balance={wallet.balance}
          currency={wallet.currency}
        />
      )}

      {/* Active Funding Rounds */}
      <Card>
        <CardHeader>
          <CardTitle>Active Funding Rounds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fundingRounds?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.rounds.map((round: FundingRound) => (
                  <div key={round.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{round.startupName}</h3>
                        <p className="text-sm text-gray-500">
                          {formatCurrency(round.amount)} • {round.equity}% equity
                        </p>
                        <p className="text-sm text-gray-500">
                          Min. Investment: {formatCurrency(round.minimumInvestment)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {round.investors} investors
                        </p>
                        <p className="text-xs text-gray-500">
                          Ends {new Date(round.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(round.raisedAmount / round.amount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center space-x-4">
                      <Button onClick={() => handleInvest(round.id, round.minimumInvestment)}>
                        Invest Now
                      </Button>
                      <Button variant="outline" onClick={() => window.open(round.documents.pitchDeck)}>
                        View Pitch Deck
                      </Button>
                      <Button variant="outline" onClick={() => handleFollow(round.startupId)}>
                        Follow Startup
                      </Button>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Team</h4>
                      <div className="flex space-x-4">
                        {round.team.map((member) => (
                          <div key={member.name} className="text-center">
                            <Avatar>
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium mt-1">{member.name}</p>
                            <p className="text-xs text-gray-500">{member.role}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
            <div ref={loadMoreRef} className="h-4" />
          </div>
        </CardContent>
      </Card>

      {/* Trending Startups */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Startups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {trendingStartups?.startups.map((startup: Startup) => (
              <div key={startup.id} className="p-4 border rounded-lg">
                <h3 className="font-medium">{startup.name}</h3>
                <p className="text-sm text-gray-500">{startup.industry}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm">
                    Stage: <span className="font-medium">{startup.stage}</span>
                  </p>
                  <p className="text-sm">
                    Valuation:{' '}
                    <span className="font-medium">
                      {formatCurrency(startup.valuation)}
                    </span>
                  </p>
                  <p className="text-sm">
                    Raised:{' '}
                    <span className="font-medium">
                      {formatCurrency(startup.raisedAmount)} /{' '}
                      {formatCurrency(startup.fundingGoal)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Community Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialFeed?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.posts.map((post: SocialPost) => (
                  <div key={post.id} className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src={post.userAvatar} />
                        <AvatarFallback>{post.userName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{post.userName}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                          <Badge variant="outline">{post.type}</Badge>
                        </div>
                        <p className="mt-1">{post.content}</p>
                        {post.attachments.length > 0 && (
                          <div className="mt-2 flex space-x-2">
                            {post.attachments.map((attachment) => (
                              <div key={attachment.url} className="relative">
                                {attachment.type === 'image' ? (
                                  <img
                                    src={attachment.url}
                                    alt={attachment.title}
                                    className="h-20 w-20 object-cover rounded"
                                  />
                                ) : (
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:underline"
                                  >
                                    {attachment.title}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {post.mentions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {post.mentions.map((mention) => (
                              <Badge key={mention.id} variant="secondary">
                                @{mention.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 flex items-center space-x-4">
                          <button
                            onClick={() => handleSocialAction(post.id, 'like')}
                            className="text-sm text-gray-500 hover:text-blue-600"
                          >
                            {post.likes} Likes
                          </button>
                          <button
                            onClick={() => handleComment(post.id, '')}
                            className="text-sm text-gray-500 hover:text-blue-600"
                          >
                            {post.comments.length} Comments
                          </button>
                          <button
                            onClick={() => handleSocialAction(post.id, 'share')}
                            className="text-sm text-gray-500 hover:text-blue-600"
                          >
                            {post.shares} Shares
                          </button>
                        </div>
                        {post.comments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="flex items-start space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={comment.userAvatar} />
                                  <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">
                                      {comment.userName}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
            <div ref={loadMoreRef} className="h-4" />
          </div>
        </CardContent>
      </Card>

      {/* Investment Portfolio */}
      <Card>
        <CardHeader>
          <CardTitle>Your Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolio?.investments.map((investment: any) => (
              <div key={investment.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{investment.startupName}</h3>
                    <p className="text-sm text-gray-500">
                      {investment.equity}% equity
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(investment.amount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(investment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 