import { PaymentDetails, PaymentResult, RefundDetails, RefundResult } from '../types';

export interface PaymentProvider {
  // Payment processing
  processPayment(details: PaymentDetails): Promise<PaymentResult>;
  verifyPayment(paymentId: string): Promise<PaymentResult>;
  
  // Refund handling
  processRefund(details: RefundDetails): Promise<RefundResult>;
  verifyRefund(refundId: string): Promise<RefundResult>;
  
  // Dispute handling
  handleDispute(disputeId: string): Promise<void>;
  resolveDispute(disputeId: string, resolution: string): Promise<void>;
  
  // Provider-specific methods
  getProviderName(): string;
  getSupportedCurrencies(): string[];
  getSupportedPaymentMethods(): string[];
  
  // Webhook handling
  handleWebhook(payload: any): Promise<void>;
  
  // Error handling
  handleError(error: any): Promise<void>;
  retryFailedPayment(paymentId: string): Promise<PaymentResult>;
  
  // Provider status
  isAvailable(): Promise<boolean>;
  getProviderStatus(): Promise<{
    status: 'active' | 'maintenance' | 'error';
    message?: string;
    lastChecked: Date;
  }>;
} 