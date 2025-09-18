import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { createPostSchema, updatePostSchema, postQuerySchema } from '@/lib/validations/posts'
import { validateRequest, createValidationErrorResponse, createErrorResponse, createSuccessResponse } from '@/lib/utils/validation'

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
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const { searchParams } = new URL(request.url)
    const queryParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      authorId: searchParams.get('authorId'),
    }

    // Validate query parameters
    const validation = validateRequest(postQuerySchema, queryParams)
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { page, limit, authorId } = validation.data
    const offset = (page - 1) * limit

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
      return createErrorResponse('Failed to fetch posts', 500, 'DATABASE_ERROR')
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

    return createSuccessResponse(transformedPosts)
  } catch (error) {
    console.error('Error in GET /api/posts:', error)
    return createErrorResponse('Failed to fetch posts', 500, 'INTERNAL_ERROR')
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
      return createErrorResponse('Unauthorized', 401, 'UNAUTHORIZED')
    }

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(createPostSchema, body)
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { content, imageUrl } = validation.data

    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        content,
        image_url: imageUrl || null,
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
      return createErrorResponse('Failed to create post', 500, 'DATABASE_ERROR')
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

    return createSuccessResponse(transformedPost, 201)
  } catch (error) {
    console.error('Error in POST /api/posts:', error)
    return createErrorResponse('Failed to create post', 500, 'INTERNAL_ERROR')
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = validateRequest(updatePostSchema, body)
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { postId, content, imageUrl } = validation.data
    const userId = getAuthenticatedUserId(request)

    // First check if user owns the post
    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (!post) {
      return createErrorResponse('Post not found', 404, 'POST_NOT_FOUND')
    }

    if (post.user_id !== userId) {
      return createErrorResponse('Not authorized to update this post', 403, 'UNAUTHORIZED_UPDATE')
    }

    const { data, error } = await supabase
      .from('posts')
      .update({
        content,
        image_url: imageUrl || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select()
      .single()

    if (error) {
      console.error('Post update error:', error)
      return createErrorResponse('Failed to update post', 500, 'DATABASE_ERROR')
    }
    return createSuccessResponse(data)
  } catch (error) {
    console.error('Post update error:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401, 'UNAUTHORIZED')
    }
    return createErrorResponse('Failed to update post', 500, 'INTERNAL_ERROR')
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const userId = getAuthenticatedUserId(request)

    if (!postId) {
      return createErrorResponse('Post ID is required', 400, 'MISSING_POST_ID')
    }

    // Validate post ID format
    const validation = validateRequest(postQuerySchema, { postId })
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    // First check if user owns the post
    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (!post) {
      return createErrorResponse('Post not found', 404, 'POST_NOT_FOUND')
    }

    if (post.user_id !== userId) {
      return createErrorResponse('Not authorized to delete this post', 403, 'UNAUTHORIZED_DELETE')
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (error) {
      console.error('Post deletion error:', error)
      return createErrorResponse('Failed to delete post', 500, 'DATABASE_ERROR')
    }
    return createSuccessResponse({ success: true })
  } catch (error) {
    console.error('Post deletion error:', error)
    if (error instanceof Error && error.message === 'Authentication required') {
      return createErrorResponse('Authentication required', 401, 'UNAUTHORIZED')
    }
    return createErrorResponse('Failed to delete post', 500, 'INTERNAL_ERROR')
  }
} 