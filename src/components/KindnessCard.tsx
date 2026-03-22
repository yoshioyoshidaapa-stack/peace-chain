import { Kindness, CATEGORY_INFO } from '../types'
import { Lang, t } from '../i18n'
import { toggleLike } from '../store'
import { User } from '@supabase/supabase-js'

interface Props {
  kindness: Kindness
  onReply: (kindness: Kindness) => void
  onLike: () => void
  lang: Lang
  depth?: number
  user: User | null
  likedIds: Set<string>
}

export default function KindnessCard({ kindness, onReply, onLike, lang, depth = 0, user, likedIds }: Props) {
  const cat = CATEGORY_INFO[kindness.category]
  const timeAgo = getTimeAgo(kindness.createdAt, lang)
  const catLabel = t(lang, `cat_${kindness.category}`)
  const isLiked = likedIds.has(kindness.id)
  const description = getDescription(kindness.description, lang)

  const handleLike = async () => {
    if (!user) return
    await toggleLike(kindness.id, user.id, isLiked)
    onLike()
  }

  return (
    <div
      className="kindness-card"
      style={{
        '--depth': depth,
        '--cat-color': cat.color,
      } as React.CSSProperties}
    >
      <div className="card-header">
        <span className="card-emoji">{kindness.emoji}</span>
        <div className="card-meta">
          <strong className="card-author">{kindness.author}</strong>
          <span className="card-time">{timeAgo}</span>
        </div>
        <span
          className="card-category"
          style={{ backgroundColor: cat.color }}
        >
          {cat.emoji} {catLabel}
        </span>
      </div>
      <p className="card-description">{description}</p>
      <div className="card-actions">
        <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          {isLiked ? '❤️' : '🤍'} {kindness.likes > 0 && kindness.likes}
        </button>
        <button className="chain-btn" onClick={() => onReply(kindness)}>
          🔗 {t(lang, 'chain_btn')}
        </button>
      </div>
    </div>
  )
}

function getDescription(desc: string, lang: Lang): string {
  if (desc.startsWith('seed_')) {
    return t(lang, desc)
  }
  return desc
}

function getTimeAgo(dateStr: string, lang: Lang): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return t(lang, 'time_now')
  if (minutes < 60) return `${minutes}${t(lang, 'time_min')}`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}${t(lang, 'time_hour')}`
  const days = Math.floor(hours / 24)
  return `${days}${t(lang, 'time_day')}`
}
