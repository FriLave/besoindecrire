'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { getUI } from '@/i18n/ui'
import type { Locale } from '@/utilities/getLocalizedPath'

const INTERVAL_MS = 2000
const MAX_TRIES = 15 // ~30s: the webhook usually lands within a few seconds.

type State = { phase: 'checking' } | { phase: 'paid'; url: string } | { phase: 'pending' }

export const CheckoutStatus: React.FC<{
  sessionId?: string
  locale: Locale
  homeHref: string
}> = ({ sessionId, locale, homeHref }) => {
  const t = getUI(locale).payments
  const [state, setState] = useState<State>({ phase: sessionId ? 'checking' : 'pending' })

  useEffect(() => {
    if (!sessionId) return
    let stop = false
    let tries = 0
    let timer: ReturnType<typeof setTimeout>
    const tick = async () => {
      try {
        const res = await fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`)
        const data = (await res.json()) as { status?: string; downloadUrl?: string }
        if (stop) return
        if (data.status === 'paid' && data.downloadUrl) {
          return setState({ phase: 'paid', url: data.downloadUrl })
        }
      } catch {
        // Network hiccup: retry until the budget is spent.
      }
      if (stop) return
      if (++tries >= MAX_TRIES) return setState({ phase: 'pending' })
      timer = setTimeout(() => void tick(), INTERVAL_MS)
    }
    void tick()
    return () => {
      stop = true
      clearTimeout(timer)
    }
  }, [sessionId])

  return (
    <div aria-live="polite" className="space-y-4">
      {state.phase === 'checking' && <p>{t.successChecking}</p>}
      {state.phase === 'paid' && (
        <>
          <p>{t.successReady}</p>
          <Button asChild>
            <a href={state.url}>{t.successDownload}</a>
          </Button>
        </>
      )}
      {state.phase === 'pending' && (
        <>
          <p>{t.successPending}</p>
          <p className="text-sm opacity-80">
            {t.resendPrompt} {t.resendCta}
          </p>
        </>
      )}
      <p>
        <Link className="underline" href={homeHref}>
          {t.backHome}
        </Link>
      </p>
    </div>
  )
}
