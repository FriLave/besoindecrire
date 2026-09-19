import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { Width } from '../Width'
import type { Locale } from '@/utilities/getLocalizedPath'
import { getUI } from '@/i18n/ui'

export const Text: React.FC<
  TextField & {
    locale: Locale
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ locale,
  name, defaultValue, errors, label, register, required, width }) => {
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
      <Input defaultValue={defaultValue} id={name} type="text" {...register(name, { required })} />
      {errors[name] && <Error locale={locale} name={name} />}
    </Width>
  )
}
