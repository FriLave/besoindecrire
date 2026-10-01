import React from 'react'

import { defaultTheme, themeLocalStorageKey } from '../shared'

// Tiny blocking script: sets `data-theme` before first paint (no flash, no hidden <html>).
const script = `(function(){var t='${defaultTheme}';try{var p=localStorage.getItem('${themeLocalStorageKey}');if(p==='light'||p==='dark')t=p;else if(matchMedia('(prefers-color-scheme: dark)').matches)t='dark'}catch(e){}document.documentElement.setAttribute('data-theme',t)})()`

export const InitTheme: React.FC = () => <script dangerouslySetInnerHTML={{ __html: script }} />
