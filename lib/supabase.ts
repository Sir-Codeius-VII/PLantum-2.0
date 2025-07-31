import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Helper function to get user profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Helper function to get user posts
export const getUserPosts = async (userId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Helper function to get post with comments and likes
export const getPostDetails = async (postId: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id(*),
      comments(*, profiles:user_id(*)),
      likes(*)
    `)
    .eq('id', postId)
    .single()

  if (error) throw error
  return data
}

// Helper function to get user's followers
export const getUserFollowers = async (userId: string) => {
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id, profiles:follower_id(*)')
    .eq('following_id', userId)

  if (error) throw error
  return data
}

// Helper function to get user's following
export const getUserFollowing = async (userId: string) => {
  const { data, error } = await supabase
    .from('follows')
    .select('following_id, profiles:following_id(*)')
    .eq('follower_id', userId)

  if (error) throw error
  return data
}

// Post interaction functions
export const createPost = async (userId: string, title: string, content: string, imageUrl?: string) => {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      title,
      content,
      image_url: imageUrl,
      published: true
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const updatePost = async (postId: string, updates: Partial<Database['public']['Tables']['posts']['Update']>) => {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deletePost = async (postId: string) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) throw error
}

// Comment functions
export const addComment = async (userId: string, postId: string, content: string) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      user_id: userId,
      post_id: postId,
      content
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteComment = async (commentId: string) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
}

// Like functions
export const toggleLike = async (userId: string, postId: string) => {
  // Check if like exists
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('post_id', postId)
    .single()

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('id', existingLike.id)
    if (error) throw error
    return false
  } else {
    // Like
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        post_id: postId
      })
    if (error) throw error
    return true
  }
}

// Follow functions
export const toggleFollow = async (followerId: string, followingId: string) => {
  // Check if follow exists
  const { data: existingFollow } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .single()

  if (existingFollow) {
    // Unfollow
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('id', existingFollow.id)
    if (error) throw error
    return false
  } else {
    // Follow
    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId
      })
    if (error) throw error
    return true
  }
}

// Feed functions
export const getFeedPosts = async (userId: string, page = 1, limit = 10) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id(*),
      comments(count),
      likes(count)
    `)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (error) throw error
  return data
}

// Search functions
export const searchUsers = async (query: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`name.ilike.%${query}%,bio.ilike.%${query}%`)

  if (error) throw error
  return data
}

export const searchPosts = async (query: string) => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id(*)
    `)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)

  if (error) throw error
  return data
} 