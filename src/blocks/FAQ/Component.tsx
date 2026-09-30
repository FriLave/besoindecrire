import React from 'react'

import type { FAQBlock as Props } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { BlockHeader } from '@/components/BlockHeader'
import { JsonLd } from '@/components/JsonLd'
import RichText from '@/components/RichText'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { faqPage } from '@/utilities/jsonLd'
import { lexicalToText } from '@/utilities/lexicalToText'

export const FAQBlock: React.FC<Props & { locale: Locale }> = ({ heading, intro, items, locale }) => {
  if (!items?.length) return null
  return (
    <div className="container max-w-3xl">
      <JsonLd
        data={faqPage(items.map((i) => ({ question: i.question, answer: lexicalToText(i.answer) })))}
      />
      <BlockHeader heading={heading} intro={intro} />
      <Accordion collapsible type="single">
        {items.map((item, i) => (
          <AccordionItem key={item.id ?? i} value={item.id ?? String(i)}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>
              <RichText data={item.answer} enableGutter={false} enableProse={false} locale={locale} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
