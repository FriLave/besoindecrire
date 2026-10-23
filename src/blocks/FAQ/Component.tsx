import React from 'react'

import type { FAQBlock as Props } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { BlockHeader } from '@/components/BlockHeader'
import { JsonLd } from '@/components/JsonLd'
import RichText from '@/components/RichText'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { faqPage } from '@/utilities/jsonLd'
import { lexicalToText } from '@/utilities/lexicalToText'

export const FAQBlock: React.FC<Props & { locale: Locale }> = ({
  eyebrow,
  heading,
  intro,
  items,
  locale,
}) => {
  if (!items?.length) return null
  return (
    <div className="container max-w-3xl">
      <JsonLd
        data={faqPage(
          items.map((i) => ({ question: i.question, answer: lexicalToText(i.answer) })),
        )}
      />
      <BlockHeader eyebrow={eyebrow} heading={heading} intro={intro} />
      <Accordion className="mx-auto max-w-3xl" collapsible type="single">
        {items.map((item, i) => (
          <AccordionItem key={item.id ?? i} value={item.id ?? String(i)}>
            <AccordionTrigger className="py-5 text-lg font-semibold hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-base text-muted-foreground">
              <RichText
                data={item.answer}
                enableGutter={false}
                enableProse={false}
                locale={locale}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
