import { Kindness } from '../types'
import { Lang, t } from '../i18n'
import KindnessCard from './KindnessCard'

interface Props {
  kindnesses: Kindness[]
  onReply: (kindness: Kindness) => void
  onLike: () => void
  lang: Lang
}

export default function ChainView({ kindnesses, onReply, onLike, lang }: Props) {
  const roots = kindnesses
    .filter(k => k.parentId === null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (kindnesses.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🕊️</span>
        <h3>{t(lang, 'empty_title')}</h3>
        <p>{t(lang, 'empty_sub')}</p>
      </div>
    )
  }

  return (
    <div className="chain-view">
      <h2 className="section-title">🔗 {t(lang, 'section_chains')}</h2>
      {roots.map(root => (
        <div key={root.id} className="chain-tree">
          <ChainNode kindness={root} allKindnesses={kindnesses} onReply={onReply} onLike={onLike} lang={lang} depth={0} />
        </div>
      ))}
    </div>
  )
}

function ChainNode({
  kindness,
  allKindnesses,
  onReply,
  onLike,
  lang,
  depth,
}: {
  kindness: Kindness
  allKindnesses: Kindness[]
  onReply: (k: Kindness) => void
  onLike: () => void
  lang: Lang
  depth: number
}) {
  const children = allKindnesses.filter(k => k.parentId === kindness.id)

  return (
    <div className="chain-node">
      {depth > 0 && (
        <div className="chain-connector">
          <div className="connector-line" />
          <span className="connector-icon">🔗</span>
        </div>
      )}
      <KindnessCard kindness={kindness} onReply={onReply} onLike={onLike} lang={lang} depth={depth} />
      {children.length > 0 && (
        <div className="chain-children">
          {children.map(child => (
            <ChainNode
              key={child.id}
              kindness={child}
              allKindnesses={allKindnesses}
              onReply={onReply}
              onLike={onLike}
              lang={lang}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
