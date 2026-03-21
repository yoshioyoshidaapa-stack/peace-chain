import { useState } from 'react'
import { Kindness, KindnessCategory, CATEGORY_INFO } from '../types'
import { addKindness } from '../store'
import { Lang, t } from '../i18n'

interface Props {
  replyTo: Kindness | null
  onPosted: () => void
  onCancel: () => void
  lang: Lang
}

export default function KindnessForm({ replyTo, onPosted, onCancel, lang }: Props) {
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<KindnessCategory>('help')
  const [emoji, setEmoji] = useState('😊')

  const EMOJI_OPTIONS = ['😊', '🤝', '💕', '🌟', '🎁', '☕', '🌸', '🌍', '💬', '🙏', '🎵', '📚']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !description.trim()) return

    addKindness(author.trim(), description.trim(), category, emoji, replyTo?.id ?? null)
    onPosted()
  }

  return (
    <div className="form-container">
      {replyTo && (
        <div className="reply-banner">
          <span>🔗</span>
          <div>
            <strong>{replyTo.author}</strong>{t(lang, 'reply_connect')}
            <p className="reply-preview">{replyTo.emoji} {replyTo.description}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="kindness-form">
        <h2>{replyTo ? t(lang, 'form_chain') : t(lang, 'form_new')}</h2>

        <div className="form-group">
          <label>{t(lang, 'form_name')}</label>
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder={t(lang, 'form_name_ph')}
            maxLength={20}
            required
          />
        </div>

        <div className="form-group">
          <label>{t(lang, 'form_desc')}</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t(lang, 'form_desc_ph')}
            rows={3}
            maxLength={200}
            required
          />
          <span className="char-count">{description.length}/200</span>
        </div>

        <div className="form-group">
          <label>{t(lang, 'form_category')}</label>
          <div className="category-grid">
            {(Object.entries(CATEGORY_INFO) as [KindnessCategory, typeof CATEGORY_INFO[KindnessCategory]][]).map(
              ([key, info]) => (
                <button
                  key={key}
                  type="button"
                  className={`category-btn ${category === key ? 'selected' : ''}`}
                  style={{ '--cat-color': info.color } as React.CSSProperties}
                  onClick={() => setCategory(key)}
                >
                  {info.emoji} {t(lang, `cat_${key}`)}
                </button>
              )
            )}
          </div>
        </div>

        <div className="form-group">
          <label>{t(lang, 'form_emoji')}</label>
          <div className="emoji-grid">
            {EMOJI_OPTIONS.map(e => (
              <button
                key={e}
                type="button"
                className={`emoji-btn ${emoji === e ? 'selected' : ''}`}
                onClick={() => setEmoji(e)}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {t(lang, 'form_cancel')}
          </button>
          <button type="submit" className="btn-primary">
            🕊️ {t(lang, 'form_submit')}
          </button>
        </div>
      </form>
    </div>
  )
}
