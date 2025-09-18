import { z } from 'zod'

// Payment creation validation
export const createPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  itemName: z.string().min(1, 'Item name is required'),
  currency: z.enum(['ZAR', 'USD', 'EUR']).default('ZAR'),
  paymentProvider: z.enum(['payfast', 'bank']).default('payfast'),
  description: z.string().optional(),
})

// Payment webhook validation
export const paymentWebhookSchema = z.object({
  m_payment_id: z.string().min(1, 'Payment ID is required'),
  payment_status: z.string().min(1, 'Payment status is required'),
  pf_payment_id: z.string().optional(),
  signature: z.string().min(1, 'Signature is required'),
  payment_date: z.string().optional(),
  custom_str1: z.string().optional(),
  custom_str2: z.string().optional(),
})

// Payment query validation
export const paymentQuerySchema = z.object({
  id: z.string().uuid().optional(),
})

// Payment update validation
export const updatePaymentSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
  metadata: z.record(z.any()).optional(),
})

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>
export type PaymentWebhookInput = z.infer<typeof paymentWebhookSchema>
export type PaymentQueryInput = z.infer<typeof paymentQuerySchema>
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>
