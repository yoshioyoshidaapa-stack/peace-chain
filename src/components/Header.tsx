import { Lang, t } from '../i18n'

interface Props {
  lang: Lang
}

export default function Header({ lang }: Props) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          <span className="header-icon">🕊️</span>
          Peace Chain
        </h1>
        <p className="header-subtitle">{t(lang, 'subtitle')}</p>
      </div>
    </header>
  )
}
