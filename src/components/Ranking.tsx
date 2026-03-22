import { useState, useEffect } from 'react'
import { Kindness } from '../types'
import { Lang, t } from '../i18n'
import { translateText } from '../translate'

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
        {top3.map((k, i) => (
          <RankingRow key={k.id} kindness={k} medal={medals[i]} lang={lang} />
        ))}
      </div>
    </div>
  )
}

function RankingRow({ kindness, medal, lang }: { kindness: Kindness; medal: string; lang: Lang }) {
  const [desc, setDesc] = useState(kindness.description)

  useEffect(() => {
    if (kindness.description.startsWith('seed_')) {
      setDesc(t(lang, kindness.description))
      return
    }
    if (kindness.lang === lang) {
      setDesc(kindness.description)
      return
    }
    let cancelled = false
    translateText(kindness.description, kindness.lang, lang).then(result => {
      if (!cancelled) setDesc(result)
    })
    return () => { cancelled = true }
  }, [kindness.description, kindness.lang, lang])

  return (
    <div className="ranking-item">
      <span className="ranking-medal">{medal}</span>
      <span className="ranking-emoji">{kindness.emoji}</span>
      <div className="ranking-info">
        <strong>{kindness.author}</strong>
        <p>{desc}</p>
      </div>
      <span className="ranking-likes">❤️ {kindness.likes}</span>
    </div>
  )
}
