'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Bank, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { ErrorDisplay } from '@/components/payment/error-display'
import { PaymentError, handlePaymentError, ErrorMessages } from '@/lib/error-handling'

interface PaymentButtonProps {
  amount: number
  itemName: string
  currency?: string
  className?: string
  onSuccess?: () => void
  onError?: (error: PaymentError) => void
}

type PaymentProvider = 'payfast' | 'stripe' | 'bank'

export function PaymentButton({
  amount,
  itemName,
  currency = 'ZAR',
  className,
  onSuccess,
  onError,
}: PaymentButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<PaymentError | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('payfast')

  const handlePayment = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          itemName,
          currency,
          paymentProvider: selectedProvider,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new PaymentError(
          data.error || 'Payment failed',
          'PAYMENT_ERROR',
          true
        )
      }

      if (selectedProvider === 'bank') {
        setShowDialog(true)
      } else {
        router.push(data.url)
      }

      onSuccess?.()
    } catch (err) {
      const paymentError = handlePaymentError(err)
      setError(paymentError)
      onError?.(paymentError)
    } finally {
      setLoading(false)
    }
  }

  const getProviderIcon = (provider: PaymentProvider) => {
    switch (provider) {
      case 'payfast':
        return <Wallet className="h-4 w-4" />
      case 'stripe':
        return <CreditCard className="h-4 w-4" />
      case 'bank':
        return <Bank className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogTrigger asChild>
          <Button
            className={className}
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose your preferred payment method
            </DialogDescription>
          </DialogHeader>
          <RadioGroup
            value={selectedProvider}
            onValueChange={(value) => setSelectedProvider(value as PaymentProvider)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="payfast" id="payfast" />
              <Label htmlFor="payfast" className="flex items-center space-x-2">
                {getProviderIcon('payfast')}
                <span>PayFast</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex items-center space-x-2">
                {getProviderIcon('stripe')}
                <span>Stripe</span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex items-center space-x-2">
                {getProviderIcon('bank')}
                <span>Bank Transfer</span>
              </Label>
            </div>
          </RadioGroup>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowDialog(false)
                handlePayment()
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {error && (
        <ErrorDisplay
          error={error}
          onRetry={handlePayment}
          onClose={() => setError(null)}
        />
      )}
    </div>
  )
} 