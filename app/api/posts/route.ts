import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Helper to get authenticated user ID from headers
function getAuthenticatedUserId(request: Request): string {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    throw new Error('Authentication required')
  }
  return userId
}

export async function GET(request: Request) {
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
    const authorId = searchParams.get('authorId')

    let query = supabase
      .from('posts')
      .select(
        `
        id,
        content,
        image_url,
        created_at,
        user_id,
        profiles:user_id (
          id,
          name,
          avatar_url
        ),
        likes:post_likes(count),
        comments:post_comments(count),
        user_likes:post_likes!inner(user_id)
      `
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (authorId) {
      query = query.eq('user_id', authorId)
    }

    const { data: posts, error } = await query

    if (error) {
      console.error('Error fetching posts:', error)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    // Transform the data
    const transformedPosts = posts.map((post) => ({
      id: post.id,
      content: post.content,
      imageUrl: post.image_url,
      createdAt: post.created_at,
      author: {
        id: post.profiles.id,
        name: post.profiles.name,
        avatarUrl: post.profiles.avatar_url,
      },
      likes: post.likes[0].count,
      comments: post.comments[0].count,
      isLiked: post.user_likes.some((like: any) => like.user_id === user.id),
      isAuthor: post.user_id === user.id,
    }))

    return NextResponse.json(transformedPosts)
  } catch (error) {
    console.error('Error in GET /api/posts:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { content, imageUrl } = await request.json()

    if (!content) {
      return new NextResponse('Content is required', { status: 400 })
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        content,
        image_url: imageUrl,
        user_id: user.id,
      })
      .select(
        `
        id,
        content,
        image_url,
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

    if (error) {
      console.error('Error creating post:', error)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    // Transform the data
    const transformedPost = {
      id: post.id,
      content: post.content,
      imageUrl: post.image_url,
      createdAt: post.created_at,
      author: {
        id: post.profiles.id,
        name: post.profiles.name,
        avatarUrl: post.profiles.avatar_url,
      },
      likes: 0,
      comments: 0,
      isLiked: false,
      isAuthor: true,
    }

    return NextResponse.json(transformedPost, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/posts:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { postId, content, imageUrl } = await request.json()
    const userId = getAuthenticatedUserId(request)

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // First check if user owns the post
    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.user_id !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to update this post' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        content,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Post update error:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const userId = getAuthenticatedUserId(request)

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // First check if user owns the post
    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (post.user_id !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this post' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Post deletion error:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
} 