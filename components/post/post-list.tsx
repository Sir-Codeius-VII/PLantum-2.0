'use client'

import { useState, useEffect } from 'react'
import { PostCard } from './post-card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface Post {
  id: string
  content: string
  image_url: string | null
  created_at: string
  author: {
    id: string
    username: string
    avatar_url: string | null
  }
  likes_count: number
  comments_count: number
  is_liked: boolean
}

interface PostListProps {
  authorId?: string
  onPostCreated?: () => void
}

export function PostList({ authorId, onPostCreated }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchPosts = async (pageNum: number) => {
    try {
      const url = new URL('/api/posts', window.location.origin)
      url.searchParams.set('page', pageNum.toString())
      if (authorId) {
        url.searchParams.set('authorId', authorId)
      }

      const response = await fetch(url.toString())
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      if (pageNum === 1) {
        setPosts(data.posts)
      } else {
        setPosts((prev) => [...prev, ...data.posts])
      }
      setHasMore(data.posts.length === 10)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts(1)
  }, [authorId])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage)
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          onClick={() => {
            setError(null)
            setIsLoading(true)
            fetchPosts(1)
          }}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No posts found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onPostUpdated={() => fetchPosts(1)}
        />
      ))}
      {hasMore && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Load More
          </Button>
        </div>
      )}
    </div>
  )
} 