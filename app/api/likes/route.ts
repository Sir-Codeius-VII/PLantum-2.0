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
    const postId = searchParams.get('postId')
    const userId = searchParams.get('userId')

    if (postId) {
      // Get likes count for a post
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)

      if (error) throw error
      return NextResponse.json({ count })
    }

    if (userId) {
      // Get all posts liked by a user
      const { data, error } = await supabase
        .from('likes')
        .select(`
          *,
          posts:post_id(*)
        `)
        .eq('user_id', userId)

      if (error) throw error
      return NextResponse.json(data)
    }

    return NextResponse.json(
      { error: 'Post ID or User ID is required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { postId, userId } = await request.json()

    if (!postId || !userId) {
      return NextResponse.json(
        { error: 'Post ID and User ID are required' },
        { status: 400 }
      )
    }

    // Check if like already exists
    const { data: existingLike } = await supabase
      .from('likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (existingLike) {
      return NextResponse.json(
        { error: 'Post already liked by user' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('likes')
      .insert({
        post_id: postId,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Like creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create like' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const userId = searchParams.get('userId')

    if (!postId || !userId) {
      return NextResponse.json(
        { error: 'Post ID and User ID are required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Like deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete like' },
      { status: 500 }
    )
  }
} 