import { useState } from 'react'
import { supabase } from '../supabase'
import { Lang, t } from '../i18n'

interface Props {
  lang: Lang
  onClose: () => void
}

export default function Auth({ lang, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: name },
          },
        })
        if (error) throw error
        setSuccess(t(lang, 'auth_check_email'))
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onClose()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose}>✕</button>
        <h2 className="auth-title">
          🕊️ {mode === 'login' ? t(lang, 'auth_login') : t(lang, 'auth_signup')}
        </h2>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label>{t(lang, 'auth_name')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t(lang, 'auth_name_ph')}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>{t(lang, 'auth_email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>{t(lang, 'auth_password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? '...' : mode === 'login' ? t(lang, 'auth_login') : t(lang, 'auth_signup')}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? t(lang, 'auth_no_account') : t(lang, 'auth_has_account')}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}>
            {mode === 'login' ? t(lang, 'auth_signup') : t(lang, 'auth_login')}
          </button>
        </p>
      </div>
    </div>
  )
}
