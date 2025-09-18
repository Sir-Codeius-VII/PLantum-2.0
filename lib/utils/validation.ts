import { z } from 'zod'
import { NextResponse } from 'next/server'
import { sanitizeInput } from './sanitization'
import { createSecureResponse } from './security-headers'

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    // Sanitize input before validation
    const sanitizedData = sanitizeInput(data)
    const validatedData = schema.parse(sanitizedData)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: errorMessage }
    }
    return { success: false, error: 'Validation failed' }
  }
}

export function createValidationErrorResponse(error: string, status: number = 400) {
  return createSecureResponse(
    { 
      error: 'Validation failed', 
      details: error,
      code: 'VALIDATION_ERROR'
    }, 
    status
  )
}

export function createErrorResponse(message: string, status: number = 500, code?: string) {
  return createSecureResponse(
    { 
      error: message,
      code: code || 'INTERNAL_ERROR',
      timestamp: new Date().toISOString()
    }, 
    status
  )
}

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return createSecureResponse(
    { 
      success: true, 
      data,
      timestamp: new Date().toISOString()
    }, 
    status
  )
}

// Rate limiting utility
export function createRateLimitResponse(limit: number, remaining: number, reset: number) {
  const response = createSecureResponse(
    { 
      error: 'Too many requests',
      code: 'RATE_LIMIT_EXCEEDED',
      limit,
      remaining,
      reset,
      timestamp: new Date().toISOString()
    }, 
    429
  )
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())
  
  return response
}
