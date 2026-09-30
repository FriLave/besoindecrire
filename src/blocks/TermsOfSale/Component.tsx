import { draftMode } from 'next/headers'
import Link from 'next/link'
import React from 'react'

import type { TermsOfSaleBlock as Props } from '@/payload-types'
import { getLocalizedPath, type Locale } from '@/utilities/getLocalizedPath'

import { Facts, LegalSection, LegalWrapper, MissingWarning } from '@/components/LegalSection'
import RichText from '@/components/RichText'
import { getLegal } from '@/i18n/legal'
import { getCachedSiteSettings } from '@/utilities/getGlobals'

export const TermsOfSaleBlock: React.FC<Props & { locale: Locale }> = async ({
  additionalContent,
  locale,
}) => {
  const settings = await getCachedSiteSettings(locale)()
  const { isEnabled: draft } = await draftMode()
  const legal = getLegal(locale)
  const t = legal.terms
  const n = legal.notice
  const l = settings?.legal
  const m = settings?.mediator
  const privacy = settings?.legalPages?.privacyPolicy
  const ei = l?.publisherType === 'ei'

  const seller: [string, string | null | undefined][] = [
    [ei ? n.nameEI : n.name, l?.companyName],
    ...(ei
      ? []
      : ([
          [n.legalForm, l?.legalForm],
          [n.shareCapital, l?.shareCapital],
        ] as [string, string | null | undefined][])),
    [n.address, l?.address],
    [n.phone, l?.phone],
    [n.email, l?.email],
    [n.siren, l?.siren],
    [n.registry, l?.registry],
    [n.vat, l?.vatExempt ? n.vatExempt : l?.vatNumber],
  ]
  const mediator = [m?.name, m?.website, m?.address?.replace(/\s*\n\s*/g, ', ')]
    .filter(Boolean)
    .join(', ')
  const missing = [
    !l?.companyName && n.name,
    !l?.address && n.address,
    !l?.email && n.email,
    !m?.name && t.mediator,
  ].filter(Boolean) as string[]

  return (
    <LegalWrapper>
      {draft && <MissingWarning label={legal.missing} missing={missing} />}
      <LegalSection title={t.identity}>
        <Facts items={seller} />
      </LegalSection>
      {t.sections({ mediator: mediator || undefined }).map((s) => (
        <LegalSection key={s.title} title={s.title}>
          {s.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </LegalSection>
      ))}
      {privacy && typeof privacy === 'object' && (
        <p>
          <Link className="underline" href={getLocalizedPath(locale, privacy.slug)}>
            {t.privacyLink}
          </Link>
        </p>
      )}
      {additionalContent && (
        <RichText data={additionalContent} enableGutter={false} locale={locale} />
      )}
    </LegalWrapper>
  )
}
