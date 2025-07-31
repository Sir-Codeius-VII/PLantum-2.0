import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PaymentService } from '@/lib/payment'
import { EmailService } from '@/lib/email-service'
import { handlePaymentError } from '@/lib/error-handling'

const paymentService = new PaymentService()
const emailService = EmailService.getInstance()

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    const signature = request.headers.get('x-payfast-signature')

    // Verify webhook signature
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Process the webhook
    const payment = await paymentService.verifyPayment(body, signature)
    if (!payment) {
      return NextResponse.json(
        { error: 'Invalid payment' },
        { status: 400 }
      )
    }

    // Update payment status in database
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        status: payment.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id)

    if (updateError) {
      console.error('Error updating payment:', updateError)
      return NextResponse.json(
        { error: 'Failed to update payment' },
        { status: 500 }
      )
    }

    // Send email notification based on payment status
    switch (payment.status) {
      case 'completed':
        await emailService.sendPaymentConfirmation(payment.user_id, payment)
        break
      case 'failed':
        await emailService.sendPaymentFailed(payment.user_id, payment, payment.error || 'Payment failed')
        break
      case 'refunded':
        await emailService.sendPaymentRefund(payment.user_id, payment, payment.refund_reason || 'Payment refunded')
        break
    }

    // Log the webhook event
    await supabase.from('security_logs').insert({
      user_id: payment.user_id,
      event_type: 'payment_webhook',
      details: {
        payment_id: payment.id,
        status: payment.status,
        provider: payment.provider,
      },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    const paymentError = handlePaymentError(error)
    return NextResponse.json(
      { error: paymentError.message },
      { status: paymentError.code }
    )
  }
} 