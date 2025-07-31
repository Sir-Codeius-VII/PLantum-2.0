'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InvestmentFormProps {
  startupId: string;
  startupName: string;
  fundingGoal: number;
  raisedAmount: number;
  fundingRounds?: Array<{
    id: string;
    round_type: string;
    target_amount: number;
    raised_amount: number;
    minimum_investment: number;
    status: string;
  }>;
}

export function InvestmentForm({
  startupId,
  startupName,
  fundingGoal,
  raisedAmount,
  fundingRounds = [],
}: InvestmentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [selectedFundingRound, setSelectedFundingRound] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const progress = (raisedAmount / fundingGoal) * 100;
  const remainingAmount = fundingGoal - raisedAmount;

  // Filter active funding rounds
  const activeFundingRounds = fundingRounds.filter(round => round.status === 'open');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const investmentAmount = parseFloat(amount);

      if (isNaN(investmentAmount) || investmentAmount <= 0) {
        throw new Error('Please enter a valid investment amount');
      }

      // Get minimum investment amount
      let minimumInvestment = fundingGoal * 0.01; // 1% of funding goal as default
      if (selectedFundingRound) {
        const round = activeFundingRounds.find(r => r.id === selectedFundingRound);
        if (round) {
          minimumInvestment = round.minimum_investment;
        }
      }

      if (investmentAmount < minimumInvestment) {
        throw new Error(`Minimum investment amount is R${minimumInvestment.toLocaleString()}`);
      }

      if (investmentAmount > remainingAmount) {
        throw new Error(`Maximum investment amount is R${remainingAmount.toLocaleString()}`);
      }

      // Create investment record
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupId,
          amount: investmentAmount,
          fundingRoundId: selectedFundingRound || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create investment');
      }

      // Initiate PayFast payment
      const paymentResponse = await fetch('/api/payments/payfast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investmentId: data.investment.id,
          amount: investmentAmount,
          investorId: data.investment.investor_id,
          startupId,
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || 'Failed to process payment');
      }

      // Redirect to PayFast
      window.location.href = paymentData.paymentUrl;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process investment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invest in {startupName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Funding Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Raised: R{raisedAmount.toLocaleString()}</span>
              <span>Goal: R{fundingGoal.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeFundingRounds.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="funding-round">Funding Round (Optional)</Label>
                <Select value={selectedFundingRound} onValueChange={setSelectedFundingRound}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a funding round" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">General Investment</SelectItem>
                    {activeFundingRounds.map((round) => (
                      <SelectItem key={round.id} value={round.id}>
                        {round.round_type} - Min: R{round.minimum_investment.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Investment Amount (R)</Label>
              <Input
                id="amount"
                type="number"
                min={fundingGoal * 0.01}
                max={remainingAmount}
                step="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter investment amount"
                required
              />
              <p className="text-sm text-muted-foreground">
                Available for investment: R{remainingAmount.toLocaleString()}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 