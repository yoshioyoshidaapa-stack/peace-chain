const CACHE_KEY = 'peace-chain-translations'

function getCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveCache(cache: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage full, clear old cache
    localStorage.removeItem(CACHE_KEY)
  }
}

const langMap: Record<string, string> = {
  ja: 'ja',
  en: 'en',
  zh: 'zh-CN',
  ko: 'ko',
  es: 'es',
  fr: 'fr',
  ar: 'ar',
  hi: 'hi',
}

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  if (!text || text.length === 0) return text
  if (sourceLang === targetLang) return text

  const source = langMap[sourceLang] || sourceLang
  const target = langMap[targetLang] || targetLang
  const cacheKey = `${source}:${target}:${text}`
  const cache = getCache()

  if (cache[cacheKey]) return cache[cacheKey]

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
    )
    const data = await res.json()

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText
      // MyMemory returns uppercase when it can't translate - skip those
      if (translated === text.toUpperCase()) return text
      cache[cacheKey] = translated
      saveCache(cache)
      return translated
    }
    return text
  } catch {
    return text
  }
}
