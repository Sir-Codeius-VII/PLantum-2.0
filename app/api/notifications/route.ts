import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const notificationId = searchParams.get('notificationId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    if (notificationId) {
      // Get single notification
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:sender_id(*)
        `)
        .eq('id', notificationId)
        .single()

      if (error) throw error
      return NextResponse.json(data)
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user's notifications
    let query = supabase
      .from('notifications')
      .select(`
        *,
        sender:sender_id(*)
      `)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false })

    if (unreadOnly) {
      query = query.eq('read', false)
    }

    const { data, error } = await query

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { type, recipientId, senderId, content, referenceId } = await request.json()

    if (!type || !recipientId || !senderId) {
      return NextResponse.json(
        { error: 'Type, recipient ID, and sender ID are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        type,
        recipient_id: recipientId,
        sender_id: senderId,
        content,
        reference_id: referenceId,
        read: false
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Notification creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { notificationId, read } = await request.json()

    if (!notificationId) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('notifications')
      .update({
        read,
        updated_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('notificationId')
    const userId = searchParams.get('userId')

    if (notificationId) {
      // Delete single notification
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    if (userId) {
      // Delete all notifications for user
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('recipient_id', userId)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Notification ID or User ID is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Notification deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    )
  }
} 