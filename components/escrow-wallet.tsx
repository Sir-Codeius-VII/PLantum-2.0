'use client'

import { useState, useEffect } from 'react'
import { Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatDistanceToNow, formatDistanceStrict } from 'date-fns'

interface EscrowWalletProps {
  startupId: string
  investorId: string
  amount: number
  status: 'pending' | 'released' | 'reversed' | 'expired'
  createdAt: string
  expiresAt: string
  onStatusChange?: (status: 'pending' | 'released' | 'reversed' | 'expired') => void
}

export function EscrowWallet({
  startupId,
  investorId,
  amount,
  status: initialStatus,
  createdAt,
  expiresAt,
  onStatusChange
}: EscrowWalletProps) {
  const [status, setStatus] = useState(initialStatus)
  const [timeRemaining, setTimeRemaining] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const expiry = new Date(expiresAt)
      const created = new Date(createdAt)
      
      if (now >= expiry) {
        setTimeRemaining('Expired')
        setProgress(100)
        if (status === 'pending') {
          handleExpiry()
        }
        return
      }

      const total = expiry.getTime() - created.getTime()
      const elapsed = now.getTime() - created.getTime()
      const remaining = expiry.getTime() - now.getTime()
      
      setProgress((elapsed / total) * 100)
      setTimeRemaining(formatDistanceStrict(now, expiry, { addSuffix: true }))
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [createdAt, expiresAt, status])

  const handleExpiry = async () => {
    if (status !== 'pending') return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/escrow/${startupId}/reverse`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to reverse funds')
      }

      setStatus('reversed')
      onStatusChange?.('reversed')
      toast.success('Funds have been reversed due to agreement expiry')
    } catch (error) {
      console.error('Error reversing funds:', error)
      toast.error('Failed to reverse funds')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRelease = async () => {
    if (status !== 'pending') return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/escrow/${startupId}/release`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to release funds')
      }

      setStatus('released')
      onStatusChange?.('released')
      toast.success('Funds have been released to the startup')
    } catch (error) {
      console.error('Error releasing funds:', error)
      toast.error('Failed to release funds')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'released':
        return <Badge className="bg-green-500 text-white">Released</Badge>
      case 'reversed':
        return <Badge className="bg-red-500 text-white">Reversed</Badge>
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />
      case 'released':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'reversed':
      case 'expired':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Escrow Wallet</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>Secure fund holding until agreement is signed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Time Remaining</span>
            <span className="font-medium">{timeRemaining}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid gap-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Amount in Escrow</p>
              <p className="font-medium">R{amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <p className="font-medium capitalize">{status}</p>
              </div>
            </div>
          </div>

          {status === 'pending' && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                Funds will be automatically reversed if the agreement is not signed within the time limit.
              </p>
            </div>
          )}

          {status === 'released' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-md">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm">Funds have been successfully released to the startup.</p>
            </div>
          )}

          {status === 'reversed' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-md">
              <XCircle className="h-5 w-5" />
              <p className="text-sm">Funds have been reversed to the investor.</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {status === 'pending' && (
          <Button
            onClick={handleRelease}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Release Funds'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 