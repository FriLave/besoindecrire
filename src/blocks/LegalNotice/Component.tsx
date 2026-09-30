import { draftMode } from 'next/headers'
import React from 'react'

import type { LegalNoticeBlock as Props } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { Facts, LegalSection, LegalWrapper, MissingWarning } from '@/components/LegalSection'
import RichText from '@/components/RichText'
import { getLegal } from '@/i18n/legal'
import { getCachedSiteSettings } from '@/utilities/getGlobals'

export const LegalNoticeBlock: React.FC<Props & { locale: Locale }> = async ({
  additionalContent,
  locale,
}) => {
  const settings = await getCachedSiteSettings(locale)()
  const { isEnabled: draft } = await draftMode()
  const t = getLegal(locale).notice
  const l = settings?.legal
  const host = settings?.host
  const rp = settings?.regulatedProfession
  const ei = l?.publisherType === 'ei'

  const vat = l?.vatExempt ? t.vatExempt : l?.vatNumber
  const publisher: [string, string | null | undefined][] = [
    [ei ? t.nameEI : t.name, l?.companyName],
    ...(ei
      ? ([[t.statusEI, 'Entrepreneur individuel (EI)']] as [string, string][])
      : ([
          [t.legalForm, l?.legalForm],
          [t.shareCapital, l?.shareCapital],
        ] as [string, string | null | undefined][])),
    [t.address, l?.address],
    [t.phone, l?.phone],
    [t.email, l?.email],
    [t.siren, l?.siren],
    [t.registry, l?.registry],
    [t.vat, vat],
    [t.director, l?.publicationDirector],
  ]
  const missing = [
    !l?.companyName && t.name,
    !l?.address && t.address,
    !l?.phone && t.phone,
    !l?.email && t.email,
    !l?.siren && t.siren,
    !l?.publicationDirector && t.director,
    !host?.name && t.hostName,
  ].filter(Boolean) as string[]

  return (
    <LegalWrapper>
      {draft && <MissingWarning label={getLegal(locale).missing} missing={missing} />}
      <LegalSection title={t.publisher}>
        <Facts items={publisher} />
      </LegalSection>
      {host?.name && (
        <LegalSection title={t.host}>
          <Facts
            items={[
              [t.hostName, host.name],
              [t.address, host.address],
              [t.phone, host.phone],
            ]}
          />
        </LegalSection>
      )}
      {rp?.enabled && (
        <LegalSection title={t.profession}>
          <Facts
            items={[
              [t.body, rp.body],
              [t.title, rp.title],
              [t.country, rp.country],
              [t.rules, rp.rulesUrl],
              [t.insurer, rp.insurer],
            ]}
          />
        </LegalSection>
      )}
      <LegalSection title={t.ip}>
        <p>{t.ipText}</p>
      </LegalSection>
      {additionalContent && (
        <RichText data={additionalContent} enableGutter={false} locale={locale} />
      )}
    </LegalWrapper>
  )
}
