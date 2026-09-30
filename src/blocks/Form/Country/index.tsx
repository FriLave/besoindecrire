import type { CountryField } from '@payloadcms/plugin-form-builder/types'
import type { Control, FieldErrorsImpl } from 'react-hook-form'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React from 'react'
import { Controller } from 'react-hook-form'

import { Error } from '../Error'
import { Width } from '../Width'
import type { Locale } from '@/utilities/getLocalizedPath'
import { getUI } from '@/i18n/ui'
import { countryOptions } from './options'

export const Country: React.FC<
  CountryField & {
    locale: Locale
    control: Control
    errors: Partial<FieldErrorsImpl>
  }
> = ({ locale, name, control, errors, label, required, width }) => {
  const ui = getUI(locale)
  return (
    <Width width={width}>
      <Label className="" htmlFor={name}>
        {label}

        {required && (
          <span className="required">
            * <span className="sr-only">{ui.form.requiredIndicator}</span>
          </span>
        )}
      </Label>
      <Controller
        control={control}
        defaultValue=""
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = countryOptions.find((t) => t.value === value)

          return (
            <Select onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger className="w-full" id={name}>
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map(({ label, value }) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          )
        }}
        rules={{ required }}
      />
      {errors[name] && <Error locale={locale} name={name} />}
    </Width>
  )
}
