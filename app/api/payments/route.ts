import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PaymentService } from '@/lib/payment'
import { createPaymentSchema } from '@/lib/validations/payment'
import { validateRequest, createValidationErrorResponse, createErrorResponse, createSuccessResponse, createRateLimitResponse } from '@/lib/utils/validation'
import { paymentRateLimiter, getClientIdentifier } from '@/lib/utils/rate-limit'
import { shouldUseMockAuth } from '@/lib/mock-auth'

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = paymentRateLimiter.isRateLimited(clientId)
    
    if (rateLimit.limited) {
      return createRateLimitResponse(100, rateLimit.remaining, rateLimit.reset)
    }

    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return createErrorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(createPaymentSchema, body)
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { amount, itemName, currency, paymentProvider } = validation.data

    // Get user profile from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return createErrorResponse('Authorization header required', 401, 'UNAUTHORIZED')
    }

    // Extract user ID from token
    const token = authHeader.replace('Bearer ', '')
    
    let user
    if (shouldUseMockAuth()) {
      // Mock auth validation
      if (token === 'mock-token') {
        user = { id: 'mock-user-1', email: 'test@example.com' }
      } else {
        return createErrorResponse('Invalid token', 401, 'INVALID_TOKEN')
      }
    } else {
      // Real Supabase auth validation
      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !supabaseUser) {
        return createErrorResponse('Invalid token', 401, 'INVALID_TOKEN')
      }
      user = supabaseUser
    }

    // Get user profile
    let profile
    if (shouldUseMockAuth()) {
      // Mock profile
      profile = {
        id: 'mock-profile-1',
        user_id: user.id,
        name: 'Test User',
        full_name: 'Test User',
        company_name: 'Test Company',
        role: 'startup'
      }
    } else {
      // Real Supabase profile
      const { data: supabaseProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !supabaseProfile) {
        return createErrorResponse('User profile not found', 404, 'PROFILE_NOT_FOUND')
      }
      profile = supabaseProfile
    }

    // Create payment using PaymentService
    const paymentService = new PaymentService()
    const payment = await paymentService.createPayment({
      amount,
      itemName,
      email: user.email || '',
      name: profile.name || user.email || '',
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payments/success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payments/cancel`,
      notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payments/webhook`,
      currency,
      paymentProvider
    })

    // Store payment in database
    if (shouldUseMockAuth()) {
      // Mock payment storage - just log it
      console.log('Mock payment stored:', {
        id: payment.paymentData.m_payment_id,
        user_id: user.id,
        amount,
        currency,
        status: 'pending',
        provider: paymentProvider,
        payment_url: payment.paymentUrl,
        payment_data: payment.paymentData,
      })
    } else {
      // Real Supabase storage
      const { error: dbError } = await supabase
        .from('payments')
        .insert({
          id: payment.paymentData.m_payment_id,
          user_id: user.id,
          amount,
          currency,
          status: 'pending',
          provider: paymentProvider,
          payment_url: payment.paymentUrl,
          payment_data: payment.paymentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

      if (dbError) {
        console.error('Error storing payment:', dbError)
        return createErrorResponse('Failed to store payment', 500, 'DATABASE_ERROR')
      }
    }

    return createSuccessResponse({
      paymentUrl: payment.paymentUrl,
      paymentId: payment.paymentData.m_payment_id,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return createErrorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500,
      'INTERNAL_ERROR'
    )
  }
}

export async function GET(request: Request) {
  try {
    // Apply rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = paymentRateLimiter.isRateLimited(clientId)
    
    if (rateLimit.limited) {
      return createRateLimitResponse(100, rateLimit.remaining, rateLimit.reset)
    }

    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return createErrorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('id')

    // Get user from auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return createErrorResponse('Authorization header required', 401, 'UNAUTHORIZED')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return createErrorResponse('Invalid token', 401, 'INVALID_TOKEN')
    }

    if (paymentId) {
      // Get specific payment
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single()

      if (paymentError || !payment) {
        return createErrorResponse('Payment not found', 404, 'PAYMENT_NOT_FOUND')
      }

      // Check if user owns the payment
      if (payment.user_id !== user.id) {
        return createErrorResponse('Unauthorized', 403, 'FORBIDDEN')
      }

      return createSuccessResponse({ payment })
    } else {
      // Get all payments for user
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (paymentsError) {
        return createErrorResponse('Failed to fetch payments', 500, 'DATABASE_ERROR')
      }

      return createSuccessResponse({ payments })
    }
  } catch (error) {
    console.error('Payment fetch error:', error)
    return createErrorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500,
      'INTERNAL_ERROR'
    )
  }
}
