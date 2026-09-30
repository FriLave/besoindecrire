import RichText from '@/components/RichText'
import React from 'react'

import { Width } from '../Width'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { Locale } from '@/utilities/getLocalizedPath'

export const Message: React.FC<{ locale: Locale; message: DefaultTypedEditorState }> = ({
  locale,
  message,
}) => {
  return (
    <Width className="my-12" width="100">
      {message && <RichText data={message} locale={locale} />}
    </Width>
  )
}
