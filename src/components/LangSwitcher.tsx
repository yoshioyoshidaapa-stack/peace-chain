import { Lang, LANG_LABELS } from '../i18n'

interface Props {
  lang: Lang
  onChange: (lang: Lang) => void
}

export default function LangSwitcher({ lang, onChange }: Props) {
  return (
    <div className="lang-switcher">
      <span className="lang-icon">🌍</span>
      <select
        value={lang}
        onChange={e => onChange(e.target.value as Lang)}
        className="lang-select"
      >
        {(Object.entries(LANG_LABELS) as [Lang, string][]).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
