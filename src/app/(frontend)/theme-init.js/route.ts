import { defaultTheme, themeLocalStorageKey } from '@/providers/Theme/shared'

// Theme bootstrap loaded async from <head>; html stays hidden (globals.css) until it sets `data-theme`.
const body = `(function () {
  var theme = '${defaultTheme}'
  try {
    var pref = window.localStorage.getItem('${themeLocalStorageKey}')
    if (pref === 'light' || pref === 'dark') theme = pref
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark'
  } catch (e) {}
  document.documentElement.setAttribute('data-theme', theme)
})()`

export function GET() {
  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      // No hash in the URL: keep the cache short so theme changes propagate.
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
