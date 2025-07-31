import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { EscrowService } from '@/lib/services/escrow-service'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { action } = await request.json()

    if (!action || !['release', 'cancel'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    let result
    if (action === 'release') {
      result = await EscrowService.releaseEscrow(params.escrowId, user.id)
    } else {
      result = await EscrowService.cancelEscrow(params.escrowId, user.id)
    }

    return NextResponse.json({ escrow: result })
  } catch (error) {
    console.error('Escrow action error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process escrow action' },
      { status: 500 }
    )
  }
} 