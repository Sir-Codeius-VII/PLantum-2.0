import Stripe from 'stripe';
import { PaymentProvider } from './payment-provider';
import {
  PaymentDetails,
  PaymentResult,
  RefundDetails,
  RefundResult,
  PaymentRetryConfig
} from '../types';
import { handleError } from '../../error-handling';

export class StripeProvider implements PaymentProvider {
  private stripe: Stripe;
  private retryConfig: PaymentRetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2
  };

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
      typescript: true
    });
  }

  async processPayment(details: PaymentDetails): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(details.amount * 100), // Convert to cents
        currency: details.currency.toLowerCase(),
        payment_method_types: [details.paymentMethod],
        description: details.description,
        metadata: details.metadata,
        customer: details.customerId,
        shipping: details.billingAddress ? {
          address: {
            line1: details.billingAddress.line1,
            line2: details.billingAddress.line2,
            city: details.billingAddress.city,
            state: details.billingAddress.state,
            postal_code: details.billingAddress.postalCode,
            country: details.billingAddress.country
          }
        } : undefined
      });

      return {
        id: paymentIntent.id,
        status: this.mapStripeStatus(paymentIntent.status),
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        paymentMethod: details.paymentMethod,
        timestamp: new Date(paymentIntent.created * 1000),
        provider: 'stripe',
        providerPaymentId: paymentIntent.id,
        metadata: paymentIntent.metadata
      };
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  async verifyPayment(paymentId: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
      return {
        id: paymentIntent.id,
        status: this.mapStripeStatus(paymentIntent.status),
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        paymentMethod: paymentIntent.payment_method_types[0],
        timestamp: new Date(paymentIntent.created * 1000),
        provider: 'stripe',
        providerPaymentId: paymentIntent.id,
        metadata: paymentIntent.metadata
      };
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  async processRefund(details: RefundDetails): Promise<RefundResult> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: details.paymentId,
        amount: details.amount ? Math.round(details.amount * 100) : undefined,
        reason: details.reason as any,
        metadata: details.metadata
      });

      return {
        id: refund.id,
        paymentId: details.paymentId,
        status: this.mapStripeRefundStatus(refund.status),
        amount: refund.amount / 100,
        currency: refund.currency.toUpperCase(),
        timestamp: new Date(refund.created * 1000),
        provider: 'stripe',
        providerRefundId: refund.id,
        metadata: refund.metadata
      };
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  async verifyRefund(refundId: string): Promise<RefundResult> {
    try {
      const refund = await this.stripe.refunds.retrieve(refundId);
      return {
        id: refund.id,
        paymentId: refund.payment_intent as string,
        status: this.mapStripeRefundStatus(refund.status),
        amount: refund.amount / 100,
        currency: refund.currency.toUpperCase(),
        timestamp: new Date(refund.created * 1000),
        provider: 'stripe',
        providerRefundId: refund.id,
        metadata: refund.metadata
      };
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  async handleDispute(disputeId: string): Promise<void> {
    try {
      const dispute = await this.stripe.disputes.retrieve(disputeId);
      // Handle dispute based on status
      if (dispute.status === 'needs_response') {
        // Implement dispute response logic
      }
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  async resolveDispute(disputeId: string, resolution: string): Promise<void> {
    try {
      await this.stripe.disputes.update(disputeId, {
        evidence: {
          product_description: resolution
        }
      });
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  getProviderName(): string {
    return 'stripe';
  }

  getSupportedCurrencies(): string[] {
    return ['usd', 'eur', 'gbp', 'cad', 'aud', 'jpy'];
  }

  getSupportedPaymentMethods(): string[] {
    return ['card', 'sepa_debit', 'bacs_debit', 'bancontact', 'ideal'];
  }

  async handleWebhook(payload: any): Promise<void> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload.body,
        payload.signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        case 'charge.dispute.created':
          await this.handleDispute(event.data.object.id);
          break;
        // Add more webhook handlers as needed
      }
    } catch (error) {
      await this.handleError(error);
      throw error;
    }
  }

  async handleError(error: any): Promise<void> {
    const handledError = handleError(error, {
      provider: 'stripe',
      timestamp: new Date()
    });

    // Log error to monitoring system
    console.error('Stripe Error:', handledError);
  }

  async retryFailedPayment(paymentId: string): Promise<PaymentResult> {
    let attempts = 0;
    let delay = this.retryConfig.initialDelay;

    while (attempts < this.retryConfig.maxAttempts) {
      try {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId);
        if (paymentIntent.status === 'succeeded') {
          return this.verifyPayment(paymentId);
        }

        // Retry the payment
        await this.stripe.paymentIntents.confirm(paymentId);
        return this.verifyPayment(paymentId);
      } catch (error) {
        attempts++;
        if (attempts === this.retryConfig.maxAttempts) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * this.retryConfig.backoffFactor, this.retryConfig.maxDelay);
      }
    }

    throw new Error('Max retry attempts reached');
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.stripe.balance.retrieve();
      return true;
    } catch {
      return false;
    }
  }

  async getProviderStatus(): Promise<{
    status: 'active' | 'maintenance' | 'error';
    message?: string;
    lastChecked: Date;
  }> {
    try {
      const balance = await this.stripe.balance.retrieve();
      return {
        status: 'active',
        lastChecked: new Date()
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        lastChecked: new Date()
      };
    }
  }

  private mapStripeStatus(status: string): PaymentResult['status'] {
    const statusMap: Record<string, PaymentResult['status']> = {
      'succeeded': 'succeeded',
      'processing': 'pending',
      'requires_payment_method': 'pending',
      'requires_confirmation': 'pending',
      'requires_action': 'pending',
      'requires_capture': 'pending',
      'canceled': 'failed',
      'failed': 'failed'
    };
    return statusMap[status] || 'failed';
  }

  private mapStripeRefundStatus(status: string): RefundResult['status'] {
    const statusMap: Record<string, RefundResult['status']> = {
      'succeeded': 'succeeded',
      'pending': 'pending',
      'failed': 'failed'
    };
    return statusMap[status] || 'failed';
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Implement payment success handling
    // e.g., update order status, send confirmation email, etc.
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Implement payment failure handling
    // e.g., notify user, update order status, etc.
  }
} 