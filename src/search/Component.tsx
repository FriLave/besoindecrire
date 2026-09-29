'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'
import { getUI } from '@/i18n/ui'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'

export const Search: React.FC<{ locale: Locale }> = ({ locale }) => {
  const ui = getUI(locale)
  const [value, setValue] = useState('')
  const router = useRouter()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    router.push(
      `${getLocalizedPath(locale, 'search')}${debouncedValue ? `?q=${encodeURIComponent(debouncedValue)}` : ''}`,
    )
  }, [debouncedValue, locale, router])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          {ui.search.title}
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder={ui.search.placeholder}
        />
        <button type="submit" className="sr-only">
          {ui.search.submit}
        </button>
      </form>
    </div>
  )
}
