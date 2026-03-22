import { useState, useEffect, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { Kindness } from './types'
import { fetchKindnesses, fetchUserLikes } from './store'
import { Lang, getSavedLang, saveLang, t } from './i18n'
import Header from './components/Header'
import Stats from './components/Stats'
import Ranking from './components/Ranking'
import KindnessForm from './components/KindnessForm'
import ChainView from './components/ChainView'
import LangSwitcher from './components/LangSwitcher'
import Auth from './components/Auth'

type View = 'chains' | 'post'

export default function App() {
  const [kindnesses, setKindnesses] = useState<Kindness[]>([])
  const [view, setView] = useState<View>('chains')
  const [replyTo, setReplyTo] = useState<Kindness | null>(null)
  const [lang, setLang] = useState<Lang>(getSavedLang)
  const [user, setUser] = useState<User | null>(null)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [showAuth, setShowAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load kindnesses
  const refresh = useCallback(async () => {
    const data = await fetchKindnesses()
    setKindnesses(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Load user's likes
  useEffect(() => {
    if (user) {
      fetchUserLikes(user.id).then(setLikedIds)
    } else {
      setLikedIds(new Set())
    }
  }, [user])

  const handleLangChange = (newLang: Lang) => {
    setLang(newLang)
    saveLang(newLang)
  }

  const handlePost = () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setReplyTo(null)
    setView('post')
  }

  const handleReply = (kindness: Kindness) => {
    if (!user) {
      setShowAuth(true)
      return
    }
    setReplyTo(kindness)
    setView('post')
  }

  const handleLike = async () => {
    if (user) {
      const newLiked = await fetchUserLikes(user.id)
      setLikedIds(newLiked)
    }
    await refresh()
  }

  const handlePosted = async () => {
    await refresh()
    setView('chains')
    setReplyTo(null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || ''

  return (
    <div className="app" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Header lang={lang} />

      <div className="user-bar">
        <LangSwitcher lang={lang} onChange={handleLangChange} />
        {user ? (
          <div className="user-info">
            <span className="user-avatar">🧑‍🤝‍🧑</span>
            <span className="user-name">{displayName}</span>
            <button className="logout-btn" onClick={handleLogout}>
              {t(lang, 'auth_logout')}
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => setShowAuth(true)}>
            🔑 {t(lang, 'auth_login')}
          </button>
        )}
      </div>

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
        {loading ? (
          <div className="empty-state">
            <span className="empty-icon">🕊️</span>
            <p>Loading...</p>
          </div>
        ) : view === 'chains' ? (
          <ChainView
            kindnesses={kindnesses}
            onReply={handleReply}
            onLike={handleLike}
            lang={lang}
            user={user}
            likedIds={likedIds}
          />
        ) : (
          <KindnessForm
            replyTo={replyTo}
            onPosted={handlePosted}
            onCancel={() => setView('chains')}
            lang={lang}
            user={user!}
          />
        )}
      </main>

      <footer className="footer">
        <p>🕊️ Peace Chain — {t(lang, 'footer')}</p>
      </footer>

      {showAuth && <Auth lang={lang} onClose={() => setShowAuth(false)} />}
    </div>
  )
}
