import { draftMode } from 'next/headers'
import React from 'react'

import type { PrivacyPolicyBlock as Props } from '@/payload-types'
import type { Locale } from '@/utilities/getLocalizedPath'

import { LegalSection, LegalWrapper, MissingWarning } from '@/components/LegalSection'
import RichText from '@/components/RichText'
import { getLegal } from '@/i18n/legal'
import { getCachedSiteSettings } from '@/utilities/getGlobals'

export const PrivacyPolicyBlock: React.FC<Props & { locale: Locale }> = async ({
  additionalContent,
  locale,
}) => {
  const settings = await getCachedSiteSettings(locale)()
  const { isEnabled: draft } = await draftMode()
  const legal = getLegal(locale)
  const t = legal.privacy
  const l = settings?.legal
  const dpo = settings?.dpo
  const missing = [
    !l?.companyName && legal.notice.name,
    !l?.address && legal.notice.address,
    !l?.email && legal.notice.email,
  ].filter(Boolean) as string[]

  return (
    <LegalWrapper>
      {draft && <MissingWarning label={legal.missing} missing={missing} />}
      <LegalSection title={t.controller}>
        {l?.companyName && <p>{t.controllerText(l.companyName, l.address ?? undefined, l.email ?? undefined)}</p>}
        {dpo?.name && <p>{t.dpo(dpo.name, dpo.email ?? undefined)}</p>}
      </LegalSection>
      <LegalSection title={t.purposes}>
        <p>{t.purposesText}</p>
        <p>{t.mandatory}</p>
      </LegalSection>
      <LegalSection title={t.legalBasis}>
        <p>{t.legalBasisText}</p>
      </LegalSection>
      <LegalSection title={t.recipients}>
        <p>{t.recipientsText(settings?.host?.name ?? undefined)}</p>
      </LegalSection>
      <LegalSection title={t.transfers}>
        <p>{t.transfersText}</p>
      </LegalSection>
      <LegalSection title={t.retention}>
        <p>{t.retentionText}</p>
      </LegalSection>
      <LegalSection title={t.rights}>
        <p>{t.rightsIntro}</p>
        <ul className="list-disc pl-6">
          {t.rightsList.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p>{t.rightsHow(l?.email ?? undefined)}</p>
      </LegalSection>
      <LegalSection title={t.complaint}>
        <p>{t.complaintText}</p>
      </LegalSection>
      <LegalSection title={t.cookies}>
        <p>{t.cookiesText}</p>
        <ul className="list-disc pl-6">
          {t.cookiesList.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p>{t.cookiesNoTracker}</p>
      </LegalSection>
      {additionalContent && (
        <RichText data={additionalContent} enableGutter={false} locale={locale} />
      )}
    </LegalWrapper>
  )
}
