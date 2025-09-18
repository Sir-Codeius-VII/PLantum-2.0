import { z } from 'zod'

// Post creation validation
export const createPostSchema = z.object({
  content: z.string()
    .min(1, 'Post content is required')
    .max(2000, 'Post must be less than 2000 characters')
    .trim(),
  imageUrl: z.string()
    .url('Invalid image URL format')
    .optional()
    .or(z.literal('')),
})

// Post update validation
export const updatePostSchema = z.object({
  postId: z.string()
    .uuid('Invalid post ID format'),
  content: z.string()
    .min(1, 'Post content is required')
    .max(2000, 'Post must be less than 2000 characters')
    .trim(),
  imageUrl: z.string()
    .url('Invalid image URL format')
    .optional()
    .or(z.literal('')),
})

// Post query validation
export const postQuerySchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .refine(n => n > 0, 'Page must be greater than 0')
    .optional(),
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .refine(n => n > 0 && n <= 50, 'Limit must be between 1 and 50')
    .optional(),
  authorId: z.string()
    .uuid('Invalid author ID format')
    .optional(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type PostQueryInput = z.infer<typeof postQuerySchema>

