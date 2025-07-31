import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PaymentService } from '@/lib/payment'
import { EmailService } from '@/lib/email-service'
import { handlePaymentError } from '@/lib/error-handling'
import { rateLimit } from '@/lib/rate-limit'
import { fraudDetectionService } from '@/lib/fraud-detection'

const paymentService = new PaymentService()
const emailService = EmailService.getInstance()

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    // Validate required fields
    if (!body.amount || !body.itemName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Perform fraud check
    const fraudCheck = await fraudDetectionService.checkPayment({
      userId: profile.id,
      amount: body.amount,
      currency: body.currency || 'ZAR',
      provider: body.provider || 'payfast',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    })

    // Log fraud check result
    await supabase.from('security_logs').insert({
      user_id: profile.id,
      event_type: 'fraud_check',
      details: {
        risk_score: fraudCheck.riskScore,
        risk_level: fraudCheck.riskLevel,
        failed_checks: fraudCheck.failedChecks,
      },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    })

    // Block high-risk payments
    if (fraudCheck.riskLevel === 'high') {
      return NextResponse.json(
        { error: 'Payment rejected due to security concerns' },
        { status: 403 }
      )
    }

    // Create payment
    const payment = await paymentService.createPayment({
      amount: body.amount,
      itemName: body.itemName,
      userId: profile.id,
      currency: body.currency,
      provider: body.provider,
    })

    // Store payment in database
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        id: payment.id,
        user_id: profile.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        provider: payment.provider,
        payment_url: payment.paymentUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('Error storing payment:', dbError)
      return NextResponse.json(
        { error: 'Failed to store payment' },
        { status: 500 }
      )
    }

    // Send payment confirmation email
    await emailService.sendPaymentConfirmation(profile.id, {
      ...payment,
      user_name: profile.full_name || profile.email,
    })

    // Log payment creation
    await supabase.from('security_logs').insert({
      user_id: profile.id,
      event_type: 'payment_created',
      details: {
        payment_id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        provider: payment.provider,
      },
      ip_address: request.headers.get('x-forwarded-for') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
    })

    return NextResponse.json({
      success: true,
      paymentUrl: payment.paymentUrl,
      paymentId: payment.id,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    const paymentError = handlePaymentError(error)
    return NextResponse.json(
      { error: paymentError.message },
      { status: paymentError.code }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('id')

    // Get user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (paymentId) {
      // Get specific payment
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single()

      if (paymentError || !payment) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        )
      }

      // Check if user owns the payment
      if (payment.user_id !== session.user.id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }

      return NextResponse.json({ payment })
    } else {
      // Get all payments for user
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (paymentsError) {
        return NextResponse.json(
          { error: 'Failed to fetch payments' },
          { status: 500 }
        )
      }

      return NextResponse.json({ payments })
    }
  } catch (error) {
    console.error('Payment fetch error:', error)
    const paymentError = handlePaymentError(error)
    return NextResponse.json(
      { error: paymentError.message },
      { status: paymentError.code }
    )
  }
} 