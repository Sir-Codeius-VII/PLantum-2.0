import crypto from 'crypto'

interface PaymentDetails {
  amount: number
  itemName: string
  itemDescription?: string
  email: string
  name: string
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
  customData?: Record<string, string>
  currency?: string
  paymentProvider?: 'payfast' | 'stripe' | 'bank'
}

interface PaymentProvider {
  createPayment(details: PaymentDetails): Promise<{ paymentData: any; paymentUrl: string }>
  verifyPayment(data: Record<string, string>): boolean
  getPaymentStatus(paymentId: string): Promise<string>
}

class PayFastProvider implements PaymentProvider {
  private readonly merchantId: string
  private readonly merchantKey: string
  private readonly passPhrase: string
  private readonly isTestMode: boolean

  constructor() {
    this.merchantId = process.env.PAYFAST_MERCHANT_ID!
    this.merchantKey = process.env.PAYFAST_MERCHANT_KEY!
    this.passPhrase = process.env.PAYFAST_PASSPHRASE!
    this.isTestMode = process.env.NODE_ENV !== 'production'
  }

  private generateSignature(data: Record<string, string>): string {
    const sortedData = Object.keys(data)
      .sort()
      .reduce((acc: Record<string, string>, key) => {
        acc[key] = data[key]
        return acc
      }, {})

    const signatureString = Object.entries(sortedData)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    return crypto
      .createHash('md5')
      .update(signatureString + this.passPhrase)
      .digest('hex')
  }

  async createPayment(details: PaymentDetails) {
    const paymentData = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: details.returnUrl,
      cancel_url: details.cancelUrl,
      notify_url: details.notifyUrl,
      name_first: details.name.split(' ')[0],
      name_last: details.name.split(' ').slice(1).join(' '),
      email_address: details.email,
      m_payment_id: crypto.randomUUID(),
      amount: details.amount.toFixed(2),
      item_name: details.itemName,
      item_description: details.itemDescription || '',
      custom_str1: JSON.stringify(details.customData || {}),
      email_address: details.email,
      subscription_type: '0',
    }

    const signature = this.generateSignature(paymentData)
    paymentData.signature = signature

    return {
      paymentData,
      paymentUrl: this.isTestMode
        ? 'https://sandbox.payfast.co.za/eng/process'
        : 'https://www.payfast.co.za/eng/process',
    }
  }

  verifyPayment(data: Record<string, string>): boolean {
    const receivedSignature = data.signature
    delete data.signature

    const calculatedSignature = this.generateSignature(data)
    return receivedSignature === calculatedSignature
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    // Implement PayFast status check
    return 'pending'
  }
}

class StripeProvider implements PaymentProvider {
  private readonly secretKey: string
  private readonly isTestMode: boolean

  constructor() {
    this.secretKey = process.env.STRIPE_SECRET_KEY!
    this.isTestMode = process.env.NODE_ENV !== 'production'
  }

  async createPayment(details: PaymentDetails) {
    // Implement Stripe payment creation
    throw new Error('Stripe integration not implemented yet')
  }

  verifyPayment(data: Record<string, string>): boolean {
    // Implement Stripe webhook verification
    throw new Error('Stripe integration not implemented yet')
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    // Implement Stripe status check
    throw new Error('Stripe integration not implemented yet')
  }
}

class BankTransferProvider implements PaymentProvider {
  async createPayment(details: PaymentDetails) {
    // Generate bank transfer details
    const paymentData = {
      bank_name: process.env.BANK_NAME,
      account_name: process.env.BANK_ACCOUNT_NAME,
      account_number: process.env.BANK_ACCOUNT_NUMBER,
      branch_code: process.env.BANK_BRANCH_CODE,
      reference: `PAY-${crypto.randomUUID().slice(0, 8)}`,
      amount: details.amount,
      currency: details.currency || 'ZAR',
    }

    return {
      paymentData,
      paymentUrl: `${details.returnUrl}?reference=${paymentData.reference}`,
    }
  }

  verifyPayment(data: Record<string, string>): boolean {
    // Implement bank transfer verification
    return true
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    // Implement bank transfer status check
    return 'pending'
  }
}

export class PaymentService {
  private providers: Record<string, PaymentProvider>

  constructor() {
    this.providers = {
      payfast: new PayFastProvider(),
      stripe: new StripeProvider(),
      bank: new BankTransferProvider(),
    }
  }

  async createPayment(details: PaymentDetails) {
    try {
      const provider = this.providers[details.paymentProvider || 'payfast']
      if (!provider) {
        throw new Error(`Unsupported payment provider: ${details.paymentProvider}`)
      }

      // Validate amount
      if (details.amount <= 0) {
        throw new Error('Invalid payment amount')
      }

      // Validate currency
      if (details.currency && !['ZAR', 'USD', 'EUR'].includes(details.currency)) {
        throw new Error('Unsupported currency')
      }

      return await provider.createPayment(details)
    } catch (error) {
      console.error('Payment creation error:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to create payment')
    }
  }

  verifyPayment(provider: string, data: Record<string, string>): boolean {
    const paymentProvider = this.providers[provider]
    if (!paymentProvider) {
      throw new Error(`Unsupported payment provider: ${provider}`)
    }

    return paymentProvider.verifyPayment(data)
  }

  async getPaymentStatus(provider: string, paymentId: string): Promise<string> {
    const paymentProvider = this.providers[provider]
    if (!paymentProvider) {
      throw new Error(`Unsupported payment provider: ${provider}`)
    }

    return await paymentProvider.getPaymentStatus(paymentId)
  }
} 