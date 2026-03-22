import { Kindness } from './types'
import { supabase } from './supabase'

// ===== Kindnesses =====

export async function fetchKindnesses(): Promise<Kindness[]> {
  const { data, error } = await supabase
    .from('kindnesses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching kindnesses:', error)
    return []
  }

  return (data || []).map(row => ({
    id: row.id,
    author: row.author,
    description: row.description,
    category: row.category,
    parentId: row.parent_id,
    createdAt: row.created_at,
    emoji: row.emoji,
    likes: row.likes,
    lang: row.lang || 'ja',
  }))
}

export async function addKindness(
  author: string,
  description: string,
  category: Kindness['category'],
  emoji: string,
  parentId: string | null = null,
  userId: string,
  lang: string = 'ja'
): Promise<Kindness | null> {
  const { data, error } = await supabase
    .from('kindnesses')
    .insert({
      author,
      description,
      category,
      emoji,
      parent_id: parentId,
      user_id: userId,
      lang,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding kindness:', error)
    return null
  }

  return {
    id: data.id,
    author: data.author,
    description: data.description,
    category: data.category,
    parentId: data.parent_id,
    createdAt: data.created_at,
    emoji: data.emoji,
    likes: data.likes,
    lang: data.lang || 'ja',
  }
}

// ===== Likes =====

export async function fetchUserLikes(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('likes')
    .select('kindness_id')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching likes:', error)
    return new Set()
  }

  return new Set((data || []).map(row => row.kindness_id))
}

export async function toggleLike(kindnessId: string, userId: string, isLiked: boolean): Promise<boolean> {
  if (isLiked) {
    // Remove like
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('kindness_id', kindnessId)

    if (error) {
      console.error('Error removing like:', error)
      return true // still liked
    }
    return false
  } else {
    // Add like
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: userId, kindness_id: kindnessId })

    if (error) {
      console.error('Error adding like:', error)
      return false // still not liked
    }
    return true
  }
}
