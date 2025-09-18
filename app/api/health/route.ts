import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHealthCheck } from '@/lib/monitoring'

export async function GET() {
  try {
    const healthCheck = createHealthCheck()
    
    // Test database connection
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )
        
        // Test a simple query
        const { error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
        
        if (error) {
          healthCheck.services.database = 'error'
          healthCheck.status = 'degraded'
        }
      } catch (error) {
        healthCheck.services.database = 'error'
        healthCheck.status = 'degraded'
      }
    } else {
      healthCheck.services.database = 'not_configured'
      healthCheck.status = 'degraded'
    }
    
    // Test email service
    if (process.env.RESEND_API_KEY) {
      healthCheck.services.email = 'configured'
    } else {
      healthCheck.services.email = 'not_configured'
      healthCheck.status = 'degraded'
    }
    
    // Test payment service
    if (process.env.PAYFAST_MERCHANT_ID && process.env.PAYFAST_MERCHANT_KEY) {
      healthCheck.services.payments = 'configured'
    } else {
      healthCheck.services.payments = 'not_configured'
      healthCheck.status = 'degraded'
    }
    
    const statusCode = healthCheck.status === 'healthy' ? 200 : 503
    
    return NextResponse.json(healthCheck, { status: statusCode })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    )
  }
}
