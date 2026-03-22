export interface Kindness {
  id: string
  author: string
  description: string
  category: KindnessCategory
  parentId: string | null
  createdAt: string
  emoji: string
  likes: number
  lang: string
}

export type KindnessCategory =
  | 'help'
  | 'share'
  | 'encourage'
  | 'donate'
  | 'environment'
  | 'listen'
  | 'other'

export const CATEGORY_INFO: Record<KindnessCategory, { label: string; emoji: string; color: string }> = {
  help: { label: '助ける', emoji: '🤝', color: '#FF6B6B' },
  share: { label: '分かち合う', emoji: '🎁', color: '#4ECDC4' },
  encourage: { label: '励ます', emoji: '💪', color: '#FFE66D' },
  donate: { label: '寄付する', emoji: '💝', color: '#FF8A5C' },
  environment: { label: '環境を守る', emoji: '🌱', color: '#95E1D3' },
  listen: { label: '耳を傾ける', emoji: '👂', color: '#A8D8EA' },
  other: { label: 'その他', emoji: '✨', color: '#DDA0DD' },
}
