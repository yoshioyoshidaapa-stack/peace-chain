import { Kindness } from '../types'
import { Lang, t } from '../i18n'

interface Props {
  kindnesses: Kindness[]
  lang: Lang
}

export default function Ranking({ kindnesses, lang }: Props) {
  const top3 = kindnesses
    .filter(k => k.likes > 0)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3)

  if (top3.length === 0) return null

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="ranking">
      <h2 className="ranking-title">🏆 {t(lang, 'ranking_title')}</h2>
      <div className="ranking-list">
        {top3.map((k, i) => {
          const desc = k.description.startsWith('seed_') ? t(lang, k.description) : k.description
          return (
            <div key={k.id} className="ranking-item">
              <span className="ranking-medal">{medals[i]}</span>
              <span className="ranking-emoji">{k.emoji}</span>
              <div className="ranking-info">
                <strong>{k.author}</strong>
                <p>{desc}</p>
              </div>
              <span className="ranking-likes">❤️ {k.likes}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
