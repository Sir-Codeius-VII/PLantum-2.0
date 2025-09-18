import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'
import { profileUpdateSchema } from '@/lib/validations/auth'
import { validateRequest, createValidationErrorResponse, createErrorResponse, createSuccessResponse } from '@/lib/utils/validation'
import { z } from 'zod'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return createErrorResponse('User ID is required', 400, 'MISSING_USER_ID')
    }

    // Validate user ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return createErrorResponse('Invalid user ID format', 400, 'INVALID_USER_ID')
    }

    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        users:user_id(*)
      `)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return createErrorResponse('Failed to fetch profile', 500, 'DATABASE_ERROR')
    }
    return createSuccessResponse(data)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return createErrorResponse('Failed to fetch profile', 500, 'INTERNAL_ERROR')
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = validateRequest(profileUpdateSchema.extend({
      userId: z.string().uuid('Invalid user ID format')
    }), body)
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { userId, name, bio, location, website, avatar_url } = validation.data

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        name,
        bio,
        location,
        website,
        avatar_url
      })
      .select()
      .single()

    if (error) {
      console.error('Profile creation error:', error)
      return createErrorResponse('Failed to create profile', 500, 'DATABASE_ERROR')
    }
    return createSuccessResponse(data, 201)
  } catch (error) {
    console.error('Profile creation error:', error)
    return createErrorResponse('Failed to create profile', 500, 'INTERNAL_ERROR')
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = validateRequest(profileUpdateSchema.extend({
      userId: z.string().uuid('Invalid user ID format')
    }), body)
    if (!validation.success) {
      return createValidationErrorResponse(validation.error)
    }

    const { userId, name, bio, location, website, avatar_url } = validation.data

    const { data, error } = await supabase
      .from('profiles')
      .update({
        name,
        bio,
        location,
        website,
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      return createErrorResponse('Failed to update profile', 500, 'DATABASE_ERROR')
    }
    return createSuccessResponse(data)
  } catch (error) {
    console.error('Profile update error:', error)
    return createErrorResponse('Failed to update profile', 500, 'INTERNAL_ERROR')
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return createErrorResponse('User ID is required', 400, 'MISSING_USER_ID')
    }

    // Validate user ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return createErrorResponse('Invalid user ID format', 400, 'INVALID_USER_ID')
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('user_id', userId)

    if (error) {
      console.error('Profile deletion error:', error)
      return createErrorResponse('Failed to delete profile', 500, 'DATABASE_ERROR')
    }
    return createSuccessResponse({ success: true })
  } catch (error) {
    console.error('Profile deletion error:', error)
    return createErrorResponse('Failed to delete profile', 500, 'INTERNAL_ERROR')
  }
} 