import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const { data: comments, error } = await supabase
      .from('post_comments')
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `
      )
      .eq('post_id', params.postId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching comments:', error)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    // Transform the data
    const transformedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      author: {
        id: comment.profiles.id,
        name: comment.profiles.name,
        avatarUrl: comment.profiles.avatar_url,
      },
    }))

    return NextResponse.json(transformedComments)
  } catch (error) {
    console.error('Error in GET /api/posts/[postId]/comments:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

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

    const { content } = await request.json()

    if (!content) {
      return new NextResponse('Content is required', { status: 400 })
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

    // Add comment
    const { data: comment, error: insertError } = await supabase
      .from('post_comments')
      .insert({
        post_id: params.postId,
        user_id: user.id,
        content,
      })
      .select(
        `
        id,
        content,
        created_at,
        user_id,
        profiles:user_id (
          id,
          name,
          avatar_url
        )
      `
      )
      .single()

    if (insertError) {
      console.error('Error adding comment:', insertError)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    // Transform the data
    const transformedComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.created_at,
      author: {
        id: comment.profiles.id,
        name: comment.profiles.name,
        avatarUrl: comment.profiles.avatar_url,
      },
    }

    return NextResponse.json(transformedComment, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/posts/[postId]/comments:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 