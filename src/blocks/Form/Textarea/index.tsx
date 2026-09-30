import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import type { Locale } from '@/utilities/getLocalizedPath'
import { getUI } from '@/i18n/ui'

export const Textarea: React.FC<
  TextField & {
    locale: Locale
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    rows?: number
  }
> = ({ locale, name, defaultValue, errors, label, register, required, rows = 3, width }) => {
  const ui = getUI(locale)
  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">{ui.form.requiredIndicator}</span>
          </span>
        )}
      </Label>

      <TextAreaComponent
        defaultValue={defaultValue}
        id={name}
        rows={rows}
        {...register(name, { required: required })}
      />

      {errors[name] && <Error locale={locale} name={name} />}
    </Width>
  )
}
