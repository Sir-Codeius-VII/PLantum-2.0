'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2 } from 'lucide-react'
import { toast } from 'sonner'

interface PostActionsProps {
  postId: string
  likesCount: number
  commentsCount: number
  isLiked: boolean
  onUpdate: () => void
}

export function PostActions({
  postId,
  likesCount: initialLikesCount,
  commentsCount,
  isLiked: initialIsLiked,
  onUpdate,
}: PostActionsProps) {
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleLike = async () => {
    if (isUpdating) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to update like status')
      }

      setIsLiked(!isLiked)
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
      onUpdate()
    } catch (error) {
      console.error('Error updating like:', error)
      toast.error('Failed to update like status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post',
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      toast.error('Failed to share post')
    }
  }

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
          onClick={handleLike}
          disabled={isUpdating}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          {likesCount}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          {commentsCount}
        </Button>
      </div>
      <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  )
} 