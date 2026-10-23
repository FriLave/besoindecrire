import { Check } from 'lucide-react'
import React from 'react'

import type { PricingTableBlock as Props } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { BlockHeader } from '@/components/BlockHeader'
import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

export const PricingTableBlock: React.FC<Props & { locale: Locale }> = ({
  eyebrow,
  heading,
  intro,
  locale,
  plans,
  style,
}) => (
  <div className="container">
    <BlockHeader eyebrow={eyebrow} heading={heading} intro={intro} />
    {style === 'contents' ? (
      <Contents locale={locale} plans={plans} />
    ) : (
      <Cards locale={locale} plans={plans} />
    )}
  </div>
)

type PlansProps = { locale: Locale; plans: Props['plans'] }

/** List layout: name, dotted leader, price; details and action below. */
const Contents: React.FC<PlansProps> = ({ locale, plans }) => (
  <ol className="mx-auto max-w-4xl border-b border-border">
    {plans?.map((plan, i) => (
      <li className="border-t border-border py-9" key={plan.id ?? i}>
        <div className="flex items-baseline gap-4">
          <h3 className="text-3xl md:text-4xl">{plan.name}</h3>
          {plan.badge && (
            <span className="hidden text-sm font-medium text-brand sm:inline">{plan.badge}</span>
          )}
          <span
            aria-hidden
            className="min-w-6 flex-1 border-b border-dotted border-foreground/30"
          />
          {(plan.price || plan.period) && (
            <p className="shrink-0 font-serif text-2xl whitespace-nowrap text-brand md:text-3xl">
              {plan.price}
              {plan.period && <span className="ml-1 text-muted-foreground">{plan.period}</span>}
            </p>
          )}
        </div>
        {plan.badge && (
          <p className="mt-1 text-sm font-medium text-brand sm:hidden">{plan.badge}</p>
        )}
        <div className="mt-5 grid gap-x-10 gap-y-5 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            {plan.description && <p>{plan.description}</p>}
            {plan.audience && (
              <p className="mt-3 font-serif text-lg text-muted-foreground italic">
                {plan.audience}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-5">
            {plan.features && plan.features.length > 0 && (
              <ul className="space-y-1.5 text-[0.9375rem] text-muted-foreground">
                {plan.features.map((f, j) => (
                  <li className="flex gap-3" key={f.id ?? j}>
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand" />
                    {f.feature}
                  </li>
                ))}
              </ul>
            )}
            {plan.link && (
              <CMSLink
                {...plan.link}
                appearance={plan.highlighted ? 'default' : 'outline'}
                className="h-auto min-h-11 self-start py-3 text-center whitespace-normal"
                locale={locale}
                size="lg"
              />
            )}
          </div>
        </div>
      </li>
    ))}
  </ol>
)

const Cards: React.FC<PlansProps> = ({ locale, plans }) => (
  <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
    {plans?.map((plan, i) => (
      <article
        className={cn(
          'relative flex min-w-0 flex-col rounded-sm border bg-card p-8 md:p-10',
          plan.highlighted ? 'border-brand' : 'border-border',
        )}
        key={plan.id ?? i}
      >
        {plan.badge && (
          <p className="absolute -top-3 left-8 rounded-sm bg-brand px-3 py-0.5 text-sm font-medium text-brand-foreground">
            {plan.badge}
          </p>
        )}
        <h3 className="text-3xl">{plan.name}</h3>
        {(plan.price || plan.period) && (
          <p className="mt-3 border-b border-border pb-6">
            {plan.price && <span className="font-serif text-4xl text-brand">{plan.price}</span>}
            {plan.period && <span className="ml-1 text-muted-foreground">{plan.period}</span>}
          </p>
        )}
        {plan.description && <p className="mt-6">{plan.description}</p>}
        {plan.features && plan.features.length > 0 && (
          <ul className="mt-6 space-y-3">
            {plan.features.map((f, j) => (
              <li className="flex gap-3" key={f.id ?? j}>
                <Check aria-hidden className="mt-1.5 size-4 shrink-0 text-brand" />
                {f.feature}
              </li>
            ))}
          </ul>
        )}
        {plan.audience && (
          <p className="mt-6 font-serif text-lg text-muted-foreground italic">{plan.audience}</p>
        )}
        {plan.link && (
          <div className="mt-auto pt-8">
            <CMSLink
              {...plan.link}
              appearance={plan.highlighted ? 'default' : 'outline'}
              className="h-auto min-h-11 w-full py-3 text-center whitespace-normal"
              locale={locale}
              size="lg"
            />
          </div>
        )}
      </article>
    ))}
  </div>
)
