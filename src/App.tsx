import { useState, useCallback } from 'react'
import { Kindness } from './types'
import { getKindnesses } from './store'
import { Lang, getSavedLang, saveLang, t } from './i18n'
import Header from './components/Header'
import Stats from './components/Stats'
import Ranking from './components/Ranking'
import KindnessForm from './components/KindnessForm'
import ChainView from './components/ChainView'
import LangSwitcher from './components/LangSwitcher'

type View = 'chains' | 'post'

export default function App() {
  const [kindnesses, setKindnesses] = useState<Kindness[]>(getKindnesses)
  const [view, setView] = useState<View>('chains')
  const [replyTo, setReplyTo] = useState<Kindness | null>(null)
  const [lang, setLang] = useState<Lang>(getSavedLang)

  const refresh = useCallback(() => {
    setKindnesses(getKindnesses())
  }, [])

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang)
    saveLang(newLang)
  }

  const handlePost = () => {
    setReplyTo(null)
    setView('post')
  }

  const handleReply = (kindness: Kindness) => {
    setReplyTo(kindness)
    setView('post')
  }

  const handlePosted = () => {
    refresh()
    setView('chains')
    setReplyTo(null)
  }

  return (
    <div className="app" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header lang={lang} />
      <LangSwitcher lang={lang} onChange={handleLangChange} />
      <Stats kindnesses={kindnesses} lang={lang} />
      <Ranking kindnesses={kindnesses} lang={lang} />

      <div className="nav-bar">
        <button
          className={`nav-btn ${view === 'chains' ? 'active' : ''}`}
          onClick={() => setView('chains')}
        >
          🔗 {t(lang, 'nav_view')}
        </button>
        <button className="nav-btn post-btn" onClick={handlePost}>
          ✏️ {t(lang, 'nav_post')}
        </button>
      </div>

      <main className="main-content">
        {view === 'chains' && (
          <ChainView kindnesses={kindnesses} onReply={handleReply} onLike={refresh} lang={lang} />
        )}
        {view === 'post' && (
          <KindnessForm replyTo={replyTo} onPosted={handlePosted} onCancel={() => setView('chains')} lang={lang} />
        )}
      </main>

      <footer className="footer">
        <p>🕊️ Peace Chain — {t(lang, 'footer')}</p>
      </footer>
    </div>
  )
}
