import crypto from 'crypto';

export interface PayFastConfig {
  merchantId: string;
  merchantKey: string;
  passPhrase: string;
  sandbox: boolean;
}

export interface PayFastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: number;
  item_name: string;
  custom_str1?: string;
  custom_str2?: string;
  custom_str3?: string;
  custom_str4?: string;
  custom_str5?: string;
  custom_int1?: number;
  custom_int2?: number;
  custom_int3?: number;
  custom_int4?: number;
  custom_int5?: number;
}

export class PayFastService {
  private config: PayFastConfig;
  private baseUrl: string;

  constructor(config: PayFastConfig) {
    this.config = config;
    this.baseUrl = config.sandbox
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';
  }

  generatePaymentUrl(paymentData: PayFastPaymentData): string {
    // Add required fields
    const data = {
      ...paymentData,
      merchant_id: this.config.merchantId,
      merchant_key: this.config.merchantKey,
    };

    // Generate signature
    const signature = this.generateSignature(data);

    // Build query string
    const queryString = Object.entries(data)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    return `${this.baseUrl}?${queryString}&signature=${signature}`;
  }

  private generateSignature(data: Record<string, any>): string {
    // Create parameter string
    const paramString = Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    // Add passphrase if configured
    const stringToHash = this.config.passPhrase
      ? `${paramString}&passphrase=${this.config.passPhrase}`
      : paramString;

    // Generate MD5 hash
    return crypto.createHash('md5').update(stringToHash).digest('hex');
  }

  verifyCallback(data: Record<string, any>, signature: string): boolean {
    const calculatedSignature = this.generateSignature(data);
    return calculatedSignature === signature;
  }
}

// Helper function to create a PayFast instance
export function createPayFast(config: PayFastConfig): PayFastService {
  return new PayFastService(config);
} 