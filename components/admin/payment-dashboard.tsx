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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { PaymentService } from '@/lib/payment/payment-service';
import { PaymentAnalytics } from '@/lib/payment/types';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function PaymentDashboard() {
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    end: new Date()
  });
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [providers, setProviders] = useState<Array<{
    name: string;
    status: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange, selectedProvider]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const paymentService = PaymentService.getInstance();
      const analytics = await paymentService.getPaymentAnalytics(
        dateRange.start,
        dateRange.end
      );
      setAnalytics(analytics);

      const availableProviders = await paymentService.getAvailableProviders();
      setProviders(
        availableProviders.map(p => ({
          name: p.name,
          status: p.status
        }))
      );
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryPayment = async (paymentId: string) => {
    try {
      const paymentService = PaymentService.getInstance();
      await paymentService.retryFailedPayment(paymentId);
      loadData(); // Reload data after retry
    } catch (error) {
      console.error('Error retrying payment:', error);
    }
  };

  const handleProcessRefund = async (paymentId: string) => {
    try {
      const paymentService = PaymentService.getInstance();
      await paymentService.processRefund(
        {
          paymentId,
          reason: 'Customer request'
        },
        'stripe' // TODO: Get provider from payment details
      );
      loadData(); // Reload data after refund
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Payment Dashboard</h2>
        <div className="flex items-center space-x-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Select
            value={selectedProvider}
            onValueChange={setSelectedProvider}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map(provider => (
                <SelectItem
                  key={provider.name}
                  value={provider.name}
                >
                  {provider.name} ({provider.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.totalProcessed}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics
                ? `${Math.round(
                    (analytics.successful / analytics.totalProcessed) * 100
                  )}%`
                : '0%'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics?.averageAmount || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Disputed Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.disputed}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analytics?.timeRange ? [] : []} // TODO: Add time series data
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* TODO: Add payment rows */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Currency Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics &&
                Object.entries(analytics.currencyBreakdown).map(
                  ([currency, count]) => (
                    <div
                      key={currency}
                      className="flex items-center justify-between"
                    >
                      <span>{currency.toUpperCase()}</span>
                      <span>{count} payments</span>
                    </div>
                  )
                )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics &&
                Object.entries(analytics.paymentMethodBreakdown).map(
                  ([method, count]) => (
                    <div
                      key={method}
                      className="flex items-center justify-between"
                    >
                      <span>{method}</span>
                      <span>{count} payments</span>
                    </div>
                  )
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 