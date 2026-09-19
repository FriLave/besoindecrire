'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'

import { getUI } from '@/i18n/ui'
import type { Locale } from '@/utilities/getLocalizedPath'

export const Error = ({ locale, name }: { locale: Locale; name: string }) => {
  const {
    formState: { errors },
  } = useFormContext()
  return (
    <div className="mt-2 text-destructive text-sm">
      {(errors[name]?.message as string) || getUI(locale).form.fieldRequired}
    </div>
  )
}
