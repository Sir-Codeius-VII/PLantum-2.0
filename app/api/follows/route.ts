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
    const type = searchParams.get('type') // 'followers' or 'following'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (type === 'followers') {
      // Get user's followers
      const { data, error } = await supabase
        .from('follows')
        .select(`
          *,
          follower:following_user_id(*)
        `)
        .eq('followed_user_id', userId)
    } else if (type === 'following') {
      // Get users that the user follows
      const { data, error } = await supabase
        .from('follows')
        .select(`
          *,
          followed:followed_user_id(*)
        `)
        .eq('following_user_id', userId)
    } else {
      return NextResponse.json(
        { error: 'Type must be either "followers" or "following"' },
        { status: 400 }
      )
    }

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching follows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch follows' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { followerId, followedId } = await request.json()

    if (!followerId || !followedId) {
      return NextResponse.json(
        { error: 'Follower ID and Followed ID are required' },
        { status: 400 }
      )
    }

    if (followerId === followedId) {
      return NextResponse.json(
        { error: 'User cannot follow themselves' },
        { status: 400 }
      )
    }

    // Check if follow already exists
    const { data: existingFollow } = await supabase
      .from('follows')
      .select()
      .eq('following_user_id', followerId)
      .eq('followed_user_id', followedId)
      .single()

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Follow relationship already exists' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('follows')
      .insert({
        following_user_id: followerId,
        followed_user_id: followedId
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Follow creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create follow relationship' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const followerId = searchParams.get('followerId')
    const followedId = searchParams.get('followedId')

    if (!followerId || !followedId) {
      return NextResponse.json(
        { error: 'Follower ID and Followed ID are required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('following_user_id', followerId)
      .eq('followed_user_id', followedId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Follow deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete follow relationship' },
      { status: 500 }
    )
  }
} 