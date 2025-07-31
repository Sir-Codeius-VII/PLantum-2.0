import { createClient } from '@supabase/supabase-js';
import { PaymentProvider } from './providers/payment-provider';
import { StripeProvider } from './providers/stripe-provider';
import {
  PaymentDetails,
  PaymentResult,
  RefundDetails,
  RefundResult,
  PaymentAnalytics
} from './types';
import { handleError } from '../error-handling';

export class PaymentService {
  private static instance: PaymentService;
  private providers: Map<string, PaymentProvider>;
  private supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  private constructor() {
    this.providers = new Map();
    this.initializeProviders();
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  private initializeProviders(): void {
    // Initialize Stripe provider
    if (process.env.STRIPE_SECRET_KEY) {
      this.providers.set('stripe', new StripeProvider(process.env.STRIPE_SECRET_KEY));
    }
    // Add more providers here
  }

  public async processPayment(
    details: PaymentDetails,
    preferredProvider?: string
  ): Promise<PaymentResult> {
    try {
      const provider = this.selectProvider(details, preferredProvider);
      const result = await provider.processPayment(details);

      // Log payment attempt
      await this.logPaymentAttempt(details, result);

      return result;
    } catch (error) {
      const handledError = handleError(error, {
        paymentDetails: details,
        preferredProvider
      });
      throw handledError;
    }
  }

  public async verifyPayment(
    paymentId: string,
    provider: string
  ): Promise<PaymentResult> {
    try {
      const paymentProvider = this.getProvider(provider);
      const result = await paymentProvider.verifyPayment(paymentId);

      // Update payment status in database
      await this.updatePaymentStatus(paymentId, result);

      return result;
    } catch (error) {
      const handledError = handleError(error, {
        paymentId,
        provider
      });
      throw handledError;
    }
  }

  public async processRefund(
    details: RefundDetails,
    provider: string
  ): Promise<RefundResult> {
    try {
      const paymentProvider = this.getProvider(provider);
      const result = await paymentProvider.processRefund(details);

      // Log refund
      await this.logRefund(details, result);

      return result;
    } catch (error) {
      const handledError = handleError(error, {
        refundDetails: details,
        provider
      });
      throw handledError;
    }
  }

  public async verifyRefund(
    refundId: string,
    provider: string
  ): Promise<RefundResult> {
    try {
      const paymentProvider = this.getProvider(provider);
      return await paymentProvider.verifyRefund(refundId);
    } catch (error) {
      const handledError = handleError(error, {
        refundId,
        provider
      });
      throw handledError;
    }
  }

  public async handleDispute(
    disputeId: string,
    provider: string
  ): Promise<void> {
    try {
      const paymentProvider = this.getProvider(provider);
      await paymentProvider.handleDispute(disputeId);
    } catch (error) {
      const handledError = handleError(error, {
        disputeId,
        provider
      });
      throw handledError;
    }
  }

  public async getPaymentAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<PaymentAnalytics> {
    try {
      const { data: payments, error } = await this.supabase
        .from('payments')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;

      const analytics: PaymentAnalytics = {
        totalProcessed: payments.length,
        successful: payments.filter(p => p.status === 'succeeded').length,
        failed: payments.filter(p => p.status === 'failed').length,
        refunded: payments.filter(p => p.status === 'refunded').length,
        disputed: payments.filter(p => p.status === 'disputed').length,
        averageAmount: this.calculateAverageAmount(payments),
        currencyBreakdown: this.calculateCurrencyBreakdown(payments),
        paymentMethodBreakdown: this.calculatePaymentMethodBreakdown(payments),
        timeRange: {
          start: startDate,
          end: endDate
        }
      };

      return analytics;
    } catch (error) {
      const handledError = handleError(error, {
        startDate,
        endDate
      });
      throw handledError;
    }
  }

  public async getAvailableProviders(): Promise<Array<{
    name: string;
    currencies: string[];
    paymentMethods: string[];
    status: 'active' | 'maintenance' | 'error';
  }>> {
    const providers = [];
    for (const [name, provider] of this.providers.entries()) {
      const status = await provider.getProviderStatus();
      providers.push({
        name,
        currencies: provider.getSupportedCurrencies(),
        paymentMethods: provider.getSupportedPaymentMethods(),
        status: status.status
      });
    }
    return providers;
  }

  private selectProvider(
    details: PaymentDetails,
    preferredProvider?: string
  ): PaymentProvider {
    if (preferredProvider) {
      const provider = this.getProvider(preferredProvider);
      if (this.isProviderSuitable(provider, details)) {
        return provider;
      }
    }

    // Find the first suitable provider
    for (const provider of this.providers.values()) {
      if (this.isProviderSuitable(provider, details)) {
        return provider;
      }
    }

    throw new Error('No suitable payment provider found');
  }

  private isProviderSuitable(
    provider: PaymentProvider,
    details: PaymentDetails
  ): boolean {
    return (
      provider.getSupportedCurrencies().includes(details.currency.toLowerCase()) &&
      provider.getSupportedPaymentMethods().includes(details.paymentMethod)
    );
  }

  private getProvider(name: string): PaymentProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`Payment provider '${name}' not found`);
    }
    return provider;
  }

  private async logPaymentAttempt(
    details: PaymentDetails,
    result: PaymentResult
  ): Promise<void> {
    await this.supabase.from('payments').insert({
      id: result.id,
      amount: details.amount,
      currency: details.currency,
      status: result.status,
      provider: result.provider,
      payment_method: details.paymentMethod,
      metadata: details.metadata,
      error: result.error,
      created_at: new Date().toISOString()
    });
  }

  private async updatePaymentStatus(
    paymentId: string,
    result: PaymentResult
  ): Promise<void> {
    await this.supabase
      .from('payments')
      .update({
        status: result.status,
        error: result.error,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId);
  }

  private async logRefund(
    details: RefundDetails,
    result: RefundResult
  ): Promise<void> {
    await this.supabase.from('refunds').insert({
      id: result.id,
      payment_id: details.paymentId,
      amount: result.amount,
      currency: result.currency,
      status: result.status,
      provider: result.provider,
      reason: details.reason,
      metadata: details.metadata,
      error: result.error,
      created_at: new Date().toISOString()
    });
  }

  private calculateAverageAmount(payments: any[]): number {
    if (payments.length === 0) return 0;
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    return total / payments.length;
  }

  private calculateCurrencyBreakdown(payments: any[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    payments.forEach(payment => {
      breakdown[payment.currency] = (breakdown[payment.currency] || 0) + 1;
    });
    return breakdown;
  }

  private calculatePaymentMethodBreakdown(
    payments: any[]
  ): Record<string, number> {
    const breakdown: Record<string, number> = {};
    payments.forEach(payment => {
      breakdown[payment.payment_method] =
        (breakdown[payment.payment_method] || 0) + 1;
    });
    return breakdown;
  }
} 