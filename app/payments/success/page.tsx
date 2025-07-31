'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    const paymentId = searchParams.get('m_payment_id')
    if (paymentId) {
      // Fetch payment details
      fetch(`/api/payments?payment_id=${paymentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.payment) {
            setPaymentDetails(data.payment)
          }
        })
        .catch(console.error)
    }
  }, [searchParams])

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <CardTitle>Payment Successful</CardTitle>
          </div>
          <CardDescription>
            Thank you for your payment. Your transaction has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold">R {paymentDetails.amount}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment ID</p>
                  <p className="text-sm">{paymentDetails.payment_id}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{paymentDetails.payment_data.item_name}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Go to Dashboard
          </Button>
          <Button
            onClick={() => router.push('/payments/history')}
          >
            View Payment History
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 