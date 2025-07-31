import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', params.postId)
      .single()

    if (postError) {
      console.error('Error fetching post:', postError)
      return new NextResponse('Post not found', { status: 404 })
    }

    // Check if already liked
    const { data: existingLike, error: likeError } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', params.postId)
      .eq('user_id', user.id)
      .single()

    if (existingLike) {
      return new NextResponse('Post already liked', { status: 400 })
    }

    // Add like
    const { error: insertError } = await supabase.from('post_likes').insert({
      post_id: params.postId,
      user_id: user.id,
    })

    if (insertError) {
      console.error('Error adding like:', insertError)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    return new NextResponse(null, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/posts/[postId]/like:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if post exists
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', params.postId)
      .single()

    if (postError) {
      console.error('Error fetching post:', postError)
      return new NextResponse('Post not found', { status: 404 })
    }

    // Remove like
    const { error: deleteError } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', params.postId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error removing like:', deleteError)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error in DELETE /api/posts/[postId]/like:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 