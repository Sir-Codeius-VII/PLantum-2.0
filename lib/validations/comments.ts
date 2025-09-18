import { z } from 'zod'

// Comment creation validation
export const createCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment content is required')
    .max(1000, 'Comment must be less than 1000 characters')
    .trim(),
  postId: z.string()
    .uuid('Invalid post ID format'),
  userId: z.string()
    .uuid('Invalid user ID format'),
})

// Comment update validation
export const updateCommentSchema = z.object({
  commentId: z.string()
    .uuid('Invalid comment ID format'),
  content: z.string()
    .min(1, 'Comment content is required')
    .max(1000, 'Comment must be less than 1000 characters')
    .trim(),
})

// Comment query validation
export const commentQuerySchema = z.object({
  postId: z.string()
    .uuid('Invalid post ID format')
    .optional(),
  commentId: z.string()
    .uuid('Invalid comment ID format')
    .optional(),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
export type CommentQueryInput = z.infer<typeof commentQuerySchema>

