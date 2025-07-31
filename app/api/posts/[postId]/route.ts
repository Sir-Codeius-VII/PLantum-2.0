import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { data: post, error } = await supabase
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
      .eq('id', params.postId)
      .single()

    if (error) {
      console.error('Error fetching post:', error)
      return new NextResponse('Post not found', { status: 404 })
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
      likes: post.likes[0].count,
      comments: post.comments[0].count,
      isLiked: post.user_likes.some((like: any) => like.user_id === user.id),
      isAuthor: post.user_id === user.id,
    }

    return NextResponse.json(transformedPost)
  } catch (error) {
    console.error('Error in GET /api/posts/[postId]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { postId: string } }
) {
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

    // Check if user is the author
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', params.postId)
      .single()

    if (fetchError) {
      console.error('Error fetching post:', fetchError)
      return new NextResponse('Post not found', { status: 404 })
    }

    if (post.user_id !== user.id) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const { data: updatedPost, error: updateError } = await supabase
      .from('posts')
      .update({
        content,
        image_url: imageUrl,
      })
      .eq('id', params.postId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating post:', updateError)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error in PUT /api/posts/[postId]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Check if user is the author
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', params.postId)
      .single()

    if (fetchError) {
      console.error('Error fetching post:', fetchError)
      return new NextResponse('Post not found', { status: 404 })
    }

    if (post.user_id !== user.id) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', params.postId)

    if (deleteError) {
      console.error('Error deleting post:', deleteError)
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error in DELETE /api/posts/[postId]:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 