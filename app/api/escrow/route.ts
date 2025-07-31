import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { EscrowService } from '@/lib/services/escrow-service'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      paymentId,
      amount,
      sellerId,
      buyerId,
      projectId,
      releaseConditions,
      metadata
    } = body

    // Validate required fields
    if (!paymentId || !amount || !sellerId || !buyerId || !projectId || !releaseConditions) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create escrow
    const escrow = await EscrowService.createEscrow({
      paymentId,
      amount,
      sellerId,
      buyerId,
      projectId,
      releaseConditions,
      metadata
    })

    return NextResponse.json({ escrow })
  } catch (error) {
    console.error('Escrow creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create escrow' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get specific escrow
      const escrow = await EscrowService.getEscrow(id)
      return NextResponse.json({ escrow })
    } else {
      // Get user's escrows
      const escrows = await EscrowService.getUserEscrows(user.id)
      return NextResponse.json({ escrows })
    }
  } catch (error) {
    console.error('Escrow fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch escrow' },
      { status: 500 }
    )
  }
} 