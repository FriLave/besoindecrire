import { Check } from 'lucide-react'
import React from 'react'

import type { PricingTableBlock as Props } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { BlockHeader } from '@/components/BlockHeader'
import { CMSLink } from '@/components/Link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

export const PricingTableBlock: React.FC<Props & { locale: Locale }> = ({
  heading,
  intro,
  locale,
  plans,
}) => (
  <div className="container">
    <BlockHeader heading={heading} intro={intro} />
    <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans?.map((plan, i) => (
        <Card
          className={cn('flex flex-col', plan.highlighted && 'ring-2 ring-brand')}
          key={plan.id ?? i}
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            {plan.description && <CardDescription>{plan.description}</CardDescription>}
            <p className="mt-2">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.period && <span className="ml-1 text-muted-foreground">{plan.period}</span>}
            </p>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-2">
              {plan.features?.map((f, j) => (
                <li className="flex gap-2" key={f.id ?? j}>
                  <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand" />
                  {f.feature}
                </li>
              ))}
            </ul>
          </CardContent>
          {plan.link && (
            <CardFooter>
              <CMSLink {...plan.link} appearance={plan.highlighted ? 'default' : 'outline'} locale={locale} />
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  </div>
)
