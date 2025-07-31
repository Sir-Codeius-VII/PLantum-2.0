export interface PaymentDetails {
  amount: number;
  currency: string;
  paymentMethod: string;
  description: string;
  metadata?: Record<string, any>;
  customerId?: string;
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
    description?: string;
  }>;
}

export interface PaymentResult {
  id: string;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded' | 'disputed';
  amount: number;
  currency: string;
  paymentMethod: string;
  timestamp: Date;
  provider: string;
  providerPaymentId: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: Record<string, any>;
}

export interface RefundDetails {
  paymentId: string;
  amount?: number; // If not provided, refunds the full amount
  reason?: string;
  metadata?: Record<string, any>;
}

export interface RefundResult {
  id: string;
  paymentId: string;
  status: 'succeeded' | 'failed' | 'pending';
  amount: number;
  currency: string;
  timestamp: Date;
  provider: string;
  providerRefundId: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: Record<string, any>;
}

export interface DisputeDetails {
  id: string;
  paymentId: string;
  reason: string;
  status: 'open' | 'won' | 'lost' | 'under_review';
  amount: number;
  currency: string;
  evidence?: Array<{
    type: string;
    content: string;
    timestamp: Date;
  }>;
  metadata?: Record<string, any>;
}

export interface PaymentRetryConfig {
  maxAttempts: number;
  initialDelay: number; // in milliseconds
  maxDelay: number; // in milliseconds
  backoffFactor: number;
}

export interface PaymentWebhook {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  signature?: string;
  provider: string;
}

export interface PaymentAnalytics {
  totalProcessed: number;
  successful: number;
  failed: number;
  refunded: number;
  disputed: number;
  averageAmount: number;
  currencyBreakdown: Record<string, number>;
  paymentMethodBreakdown: Record<string, number>;
  timeRange: {
    start: Date;
    end: Date;
  };
} 