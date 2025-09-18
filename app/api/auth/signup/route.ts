import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { signupSchema } from '@/lib/validations/auth';
import { validateRequest, createValidationErrorResponse, createErrorResponse, createSuccessResponse, createRateLimitResponse } from '@/lib/utils/validation';
import { authRateLimiter, getClientIdentifier } from '@/lib/utils/rate-limit';
import { mockAuth, shouldUseMockAuth } from '@/lib/mock-auth';

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimit = authRateLimiter.isRateLimited(clientId)
    
    if (rateLimit.limited) {
      return createRateLimitResponse(5, rateLimit.remaining, rateLimit.reset)
    }

    const body = await request.json();

    // Validate request body
    const validation = validateRequest(signupSchema, body);
    if (!validation.success) {
      return createValidationErrorResponse(validation.error);
    }

    const { email, password, fullName, role } = validation.data;

    // Use mock auth if Supabase is not configured
    if (shouldUseMockAuth()) {
      console.log('Using mock authentication for development');
      const { user, error } = await mockAuth.signUp(email, password, fullName);
      
      if (error) {
        return createErrorResponse(error, 400, 'SIGNUP_ERROR');
      }

      return createSuccessResponse({
        message: 'User created successfully (Mock Mode)',
        user: {
          id: user!.id,
          email: user!.email,
          full_name: fullName,
          role: role,
        },
      });
    }

    // Check if environment variables are set for real Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables');
      return createErrorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) {
      console.error('Supabase signup error:', error);
      return createErrorResponse(error.message, 400, 'SIGNUP_ERROR');
    }

    if (!data.user) {
      return createErrorResponse('Failed to create user', 500, 'USER_CREATION_FAILED');
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: data.user.id,
          full_name: fullName,
          role: role,
          email: email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      // If profile creation fails, we should delete the user
      console.error('Profile creation failed:', profileError);
      await supabase.auth.admin.deleteUser(data.user.id);
      return createErrorResponse('Failed to create user profile', 500, 'PROFILE_CREATION_FAILED');
    }

    return createSuccessResponse({
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        role: role,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500,
      'INTERNAL_ERROR'
    );
  }
} 