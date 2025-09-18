import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { createCommentSchema, updateCommentSchema, commentQuerySchema } from '@/lib/validations/comments'
import { validateRequest, createValidationErrorResponse, createErrorResponse, createSuccessResponse } from '@/lib/utils/validation'
import { shouldUseMockAuth } from '@/lib/mock-auth'

export async function GET(request: Request) {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return createErrorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { searchParams } = new URL(request.url)
    const queryParams = {
      postId: searchParams.get('postId'),
      commentId: searchParams.get('commentId'),
    }

    // Validate query parameters
    const validation = validateRequest(commentQuerySchema, queryParams)
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { postId, commentId } = validation.data

    if (commentId) {
      // Get single comment
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id(*)
        `)
        .eq('id', commentId)
        .single()

      if (error) {
        console.error('Error fetching comment:', error)
        return createErrorResponse('Failed to fetch comment', 500, 'DATABASE_ERROR')
      }
      return createSuccessResponse(data)
    }

    if (!postId) {
      return createErrorResponse('Post ID is required for fetching comments', 400, 'MISSING_POST_ID')
    }

    // Get all comments for a post
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id(*)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching comments:', error)
      return createErrorResponse('Failed to fetch comments', 500, 'DATABASE_ERROR')
    }
    return createSuccessResponse(data)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return createErrorResponse('Failed to fetch comments', 500, 'INTERNAL_ERROR')
  }
}

export async function POST(request: Request) {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return createErrorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(createCommentSchema, body)
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { content, postId, userId } = validation.data

    if (shouldUseMockAuth()) {
      // Mock comment creation
      const mockComment = {
        id: `mock-comment-${Date.now()}`,
        content,
        post_id: postId,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      console.log('Mock comment created:', mockComment)
      return createSuccessResponse(mockComment)
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        content,
        post_id: postId,
        user_id: userId
      })
      .select()
      .single()

    if (error) {
      console.error('Comment creation error:', error)
      return createErrorResponse('Failed to create comment', 500, 'DATABASE_ERROR')
    }
    return createSuccessResponse(data, 201)
  } catch (error) {
    console.error('Comment creation error:', error)
    return createErrorResponse('Failed to create comment', 500, 'INTERNAL_ERROR')
  }
}

export async function PUT(request: Request) {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return createErrorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const body = await request.json()

    // Validate request body
    const validation = validateRequest(updateCommentSchema, body)
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { commentId, content } = validation.data

    const { data, error } = await supabase
      .from('comments')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select()
      .single()

    if (error) {
      console.error('Comment update error:', error)
      return createErrorResponse('Failed to update comment', 500, 'DATABASE_ERROR')
    }
    return createSuccessResponse(data)
  } catch (error) {
    console.error('Comment update error:', error)
    return createErrorResponse('Failed to update comment', 500, 'INTERNAL_ERROR')
  }
}

export async function DELETE(request: Request) {
  try {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return createErrorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')

    if (!commentId) {
      return createErrorResponse('Comment ID is required', 400, 'MISSING_COMMENT_ID')
    }

    // Validate comment ID format
    const validation = validateRequest(commentQuerySchema, { commentId })
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      console.error('Comment deletion error:', error)
      return createErrorResponse('Failed to delete comment', 500, 'DATABASE_ERROR')
    }
    return createSuccessResponse({ success: true })
  } catch (error) {
    console.error('Comment deletion error:', error)
    return createErrorResponse('Failed to delete comment', 500, 'INTERNAL_ERROR')
  }
} 