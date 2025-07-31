'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { PaymentError, getErrorRecoverySteps } from '@/lib/error-handling'

interface ErrorDisplayProps {
  error: PaymentError
  onRetry?: () => void
  onClose?: () => void
}

export function ErrorDisplay({ error, onRetry, onClose }: ErrorDisplayProps) {
  const recoverySteps = getErrorRecoverySteps(error)

  return (
    <Alert variant={error.recoverable ? 'default' : 'destructive'}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        <span>Payment Error</span>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Dismiss
          </Button>
        )}
      </AlertTitle>
      <AlertDescription className="space-y-4">
        <p>{error.message}</p>
        {recoverySteps.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">To resolve this issue:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              {recoverySteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        )}
        {error.recoverable && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
} 