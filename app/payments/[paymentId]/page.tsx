'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  item_name: string
  created_at: string
  payment_url: string
  payment_provider: string
}

export default function PaymentStatusPage() {
  const params = useParams()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPayment()

    // Subscribe to payment updates
    const channel = supabase
      .channel('payment_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'payments',
          filter: `id=eq.${params.paymentId}`,
        },
        (payload) => {
          setPayment(payload.new as Payment)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [params.paymentId])

  const fetchPayment = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', params.paymentId)
        .single()

      if (error) throw error
      setPayment(data)
    } catch (error) {
      setError('Failed to fetch payment details')
      console.error('Payment fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (payment?.status) {
      case 'completed':
        return <CheckCircle2 className="h-8 w-8 text-green-500" />
      case 'failed':
        return <XCircle className="h-8 w-8 text-red-500" />
      case 'cancelled':
        return <XCircle className="h-8 w-8 text-red-500" />
      default:
        return <Clock className="h-8 w-8 text-yellow-500" />
    }
  }

  const getStatusColor = () => {
    switch (payment?.status) {
      case 'completed':
        return 'bg-green-500'
      case 'failed':
        return 'bg-red-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !payment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <XCircle className="h-8 w-8 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-muted-foreground">{error || 'Payment not found'}</p>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>
                {payment.item_name}
              </CardDescription>
            </div>
            {getStatusIcon()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">
                {formatCurrency(payment.amount, payment.currency)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge className={getStatusColor()}>
                {payment.status}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Payment Provider</span>
              <span className="font-medium capitalize">
                {payment.payment_provider}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">
                {new Date(payment.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
          {payment.status === 'pending' && (
            <Button
              onClick={() => window.location.href = payment.payment_url}
            >
              Continue Payment
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
} 