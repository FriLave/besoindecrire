'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getUI } from '@/i18n/ui'
import type { Locale } from '@/utilities/getLocalizedPath'

type Props = {
  paidDownloadId: number | string
  locale: Locale
  /** Localized path of the terms of sale page, resolved server-side. */
  termsHref?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const post = (path: string, body: unknown) =>
  fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

export const BuyForm: React.FC<Props> = ({ paidDownloadId, locale, termsHref }) => {
  const t = getUI(locale).payments
  const [email, setEmail] = useState('')
  const [waiver, setWaiver] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()

  const [resendOpen, setResendOpen] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [resendMsg, setResendMsg] = useState<string>()

  const buy = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(undefined)
    if (!EMAIL_RE.test(email)) return setError(t.errorEmail)
    setBusy(true)
    try {
      const res = await post('/api/checkout', {
        paidDownloadId,
        email,
        locale,
        waiverAccepted: waiver,
      })
      const data = (await res.json()) as { url?: string }
      if (!res.ok || !data.url) throw new Error('checkout failed')
      window.location.assign(data.url)
    } catch {
      setError(t.errorGeneric)
      setBusy(false)
    }
  }

  const resend = async (e: React.FormEvent) => {
    e.preventDefault()
    setResendMsg(undefined)
    if (!EMAIL_RE.test(resendEmail)) return setResendMsg(t.errorEmail)
    try {
      const res = await post('/api/downloads/resend', {
        email: resendEmail,
        paidDownloadId,
        locale,
      })
      setResendMsg(res.ok ? t.resendSent : t.errorGeneric)
    } catch {
      setResendMsg(t.errorGeneric)
    }
  }

  const id = `pd-${paidDownloadId}`

  return (
    <div className="space-y-6">
      <form className="space-y-4" onSubmit={buy}>
        <div className="space-y-2">
          <Label htmlFor={`${id}-email`}>{t.email}</Label>
          <Input
            autoComplete="email"
            id={`${id}-email`}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            value={email}
          />
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            checked={waiver}
            id={`${id}-waiver`}
            onCheckedChange={(v) => setWaiver(v === true)}
            required
          />
          <Label className="font-normal leading-snug" htmlFor={`${id}-waiver`}>
            {t.waiver}
          </Label>
        </div>
        {termsHref && (
          <p className="text-sm">
            <Link className="underline" href={termsHref}>
              {t.termsLink}
            </Link>
          </p>
        )}
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button disabled={!waiver || busy} type="submit">
          {busy ? t.buying : t.buy}
        </Button>
      </form>

      <div className="border-t pt-4 text-sm">
        <p>
          {t.resendPrompt}{' '}
          <button className="underline" onClick={() => setResendOpen((o) => !o)} type="button">
            {t.resendCta}
          </button>
        </p>
        {resendOpen && (
          <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={resend}>
            <Input
              aria-label={t.email}
              autoComplete="email"
              onChange={(e) => setResendEmail(e.target.value)}
              required
              type="email"
              value={resendEmail}
            />
            <Button type="submit" variant="outline">
              {t.resendSubmit}
            </Button>
          </form>
        )}
        {resendMsg && (
          <p className="mt-2" role="status">
            {resendMsg}
          </p>
        )}
      </div>
    </div>
  )
}
