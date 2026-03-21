import { Kindness } from '../types'
import { Lang, t } from '../i18n'

interface Props {
  kindnesses: Kindness[]
  lang: Lang
}

export default function Stats({ kindnesses, lang }: Props) {
  const totalActs = kindnesses.length
  const totalChains = kindnesses.filter(k => k.parentId === null).length
  const longestChain = getLongestChain(kindnesses)
  const participants = new Set(kindnesses.map(k => k.author)).size

  return (
    <div className="stats">
      <div className="stat-card">
        <span className="stat-number">{totalActs}</span>
        <span className="stat-label">{t(lang, 'stat_acts')}</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{totalChains}</span>
        <span className="stat-label">{t(lang, 'stat_chains')}</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{longestChain}</span>
        <span className="stat-label">{t(lang, 'stat_longest')}</span>
      </div>
      <div className="stat-card">
        <span className="stat-number">{participants}</span>
        <span className="stat-label">{t(lang, 'stat_participants')}</span>
      </div>
    </div>
  )
}

function getLongestChain(kindnesses: Kindness[]): number {
  let max = 0
  for (const k of kindnesses) {
    if (k.parentId !== null) continue
    const depth = measureDepth(k.id, kindnesses)
    max = Math.max(max, depth)
  }
  return max
}

function measureDepth(rootId: string, all: Kindness[]): number {
  const children = all.filter(k => k.parentId === rootId)
  if (children.length === 0) return 1
  return 1 + Math.max(...children.map(c => measureDepth(c.id, all)))
}
