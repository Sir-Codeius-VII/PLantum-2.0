'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface EscrowCardProps {
  escrow: {
    id: string
    amount: number
    status: string
    created_at: string
    released_at?: string
    cancelled_at?: string
    release_conditions: {
      type: 'milestone' | 'delivery' | 'time'
      description: string
      requirements: string[]
      deadline?: string
    }
    seller: {
      id: string
      full_name: string
    }
    buyer: {
      id: string
      full_name: string
    }
    project: {
      id: string
      title: string
    }
  }
  currentUserId: string
  onUpdate?: () => void
}

export function EscrowCard({ escrow, currentUserId, onUpdate }: EscrowCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RELEASED':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RELEASED':
        return <Badge variant="success">Released</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleAction = async (action: 'release' | 'cancel') => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/escrow/${escrow.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process action')
      }

      toast({
        title: 'Success',
        description: `Escrow ${action}ed successfully`,
      })

      onUpdate?.()
    } catch (error) {
      console.error('Escrow action error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process action',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const isBuyer = currentUserId === escrow.buyer.id
  const isSeller = currentUserId === escrow.seller.id
  const canRelease = isBuyer && escrow.status === 'PENDING'
  const canCancel = (isBuyer || isSeller) && escrow.status === 'PENDING'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(escrow.status)}
            <CardTitle>Escrow #{escrow.id.slice(0, 8)}</CardTitle>
          </div>
          {getStatusBadge(escrow.status)}
        </div>
        <CardDescription>
          Project: {escrow.project.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-lg font-semibold">R {escrow.amount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p className="text-sm">
                {format(new Date(escrow.created_at), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Release Conditions</p>
            <p className="text-sm">{escrow.release_conditions.description}</p>
            {escrow.release_conditions.deadline && (
              <p className="text-sm text-muted-foreground">
                Deadline: {format(new Date(escrow.release_conditions.deadline), 'MMM d, yyyy')}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Seller</p>
              <p className="text-sm">{escrow.seller.full_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Buyer</p>
              <p className="text-sm">{escrow.buyer.full_name}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {canRelease && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                disabled={isLoading}
              >
                Release Funds
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Release Escrow Funds</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to release the funds? This action cannot be undone.
                  Please ensure all conditions have been met before proceeding.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleAction('release')}
                >
                  Release
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Escrow</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel this escrow? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, keep it</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleAction('cancel')}
                >
                  Yes, cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  )
} 