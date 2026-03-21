import { Kindness } from './types'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'peace-chain-kindnesses'
const LIKED_KEY = 'peace-chain-liked'
const VERSION_KEY = 'peace-chain-version'
const CURRENT_VERSION = '2'

function loadKindnesses(): Kindness[] {
  const version = localStorage.getItem(VERSION_KEY)
  if (version !== CURRENT_VERSION) {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LIKED_KEY)
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
    return getInitialData()
  }
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    const parsed: Kindness[] = JSON.parse(data)
    return parsed.map(k => ({ ...k, likes: k.likes ?? 0 }))
  }
  return getInitialData()
}

function saveKindnesses(kindnesses: Kindness[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kindnesses))
}

export function getKindnesses(): Kindness[] {
  return loadKindnesses()
}

export function addKindness(
  author: string,
  description: string,
  category: Kindness['category'],
  emoji: string,
  parentId: string | null = null
): Kindness {
  const kindnesses = loadKindnesses()
  const newKindness: Kindness = {
    id: uuidv4(),
    author,
    description,
    category,
    parentId,
    createdAt: new Date().toISOString(),
    emoji,
    likes: 0,
  }
  kindnesses.push(newKindness)
  saveKindnesses(kindnesses)
  return newKindness
}

export function toggleLike(kindnessId: string): boolean {
  const liked = getLikedIds()
  const kindnesses = loadKindnesses()
  const k = kindnesses.find(k => k.id === kindnessId)
  if (!k) return false

  if (liked.has(kindnessId)) {
    liked.delete(kindnessId)
    k.likes = Math.max(0, k.likes - 1)
  } else {
    liked.add(kindnessId)
    k.likes += 1
  }

  saveKindnesses(kindnesses)
  saveLikedIds(liked)
  return liked.has(kindnessId)
}

export function getLikedIds(): Set<string> {
  const data = localStorage.getItem(LIKED_KEY)
  if (data) return new Set(JSON.parse(data))
  return new Set()
}

function saveLikedIds(ids: Set<string>): void {
  localStorage.setItem(LIKED_KEY, JSON.stringify([...ids]))
}

export function getTopKindnesses(count: number): Kindness[] {
  return loadKindnesses()
    .filter(k => k.likes > 0)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, count)
}

function getInitialData(): Kindness[] {
  const now = new Date()
  const data: Kindness[] = [
    {
      id: 'seed-1',
      author: 'Yuki',
      description: 'seed_1',
      category: 'help',
      parentId: null,
      createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(),
      emoji: '🚃',
      likes: 12,
    },
    {
      id: 'seed-2',
      author: 'Takeshi',
      description: 'seed_2',
      category: 'share',
      parentId: 'seed-1',
      createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
      emoji: '☕',
      likes: 8,
    },
    {
      id: 'seed-3',
      author: 'Mika',
      description: 'seed_3',
      category: 'listen',
      parentId: 'seed-2',
      createdAt: new Date(now.getTime() - 86400000).toISOString(),
      emoji: '💬',
      likes: 5,
    },
    {
      id: 'seed-4',
      author: 'Sora',
      description: 'seed_4',
      category: 'environment',
      parentId: null,
      createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(),
      emoji: '🌿',
      likes: 15,
    },
    {
      id: 'seed-5',
      author: 'Hana',
      description: 'seed_5',
      category: 'environment',
      parentId: 'seed-4',
      createdAt: new Date(now.getTime() - 86400000).toISOString(),
      emoji: '🌸',
      likes: 10,
    },
  ]
  // Pre-set some likes
  const likedSet = new Set(['seed-1', 'seed-4', 'seed-5'])
  saveLikedIds(likedSet)
  saveKindnesses(data)
  return data
}
