import type { RequiredDataFromCollectionSlug } from 'payload'

import { SITE_NAME } from '@/client/site'
import type { Locale } from '@/utilities/getLocalizedPath'

import { privacyNoticeDefaults } from '@/i18n/legal'
import { heading, paragraph, richText, text } from './lexical-helpers'

type ContactFormCopy = {
  confirmationHeading: string
  emailBody: string
  emailSubject: string
  fieldLabels: {
    email: string
    fullName: string
    message: string
    phone: string
  }
  submitButtonLabel: string
  title: string
}

const copy: Record<Locale, ContactFormCopy> = {
  fr: {
    confirmationHeading: 'Votre message a bien été envoyé.',
    emailBody: 'Nous avons bien reçu votre message.',
    emailSubject: 'Vous avez reçu un nouveau message.',
    fieldLabels: {
      email: 'Email',
      fullName: 'Nom complet',
      message: 'Message',
      phone: 'Téléphone',
    },
    submitButtonLabel: 'Envoyer',
    title: 'Formulaire de contact',
  },
  en: {
    confirmationHeading: 'The contact form has been submitted successfully.',
    emailBody: 'Your contact form submission was successfully received.',
    emailSubject: "You've received a new message.",
    fieldLabels: {
      email: 'Email',
      fullName: 'Full Name',
      message: 'Message',
      phone: 'Phone',
    },
    submitButtonLabel: 'Submit',
    title: 'Contact Form',
  },
}

type FormFields = NonNullable<RequiredDataFromCollectionSlug<'forms'>['fields']>

const buildFields = (labels: ContactFormCopy['fieldLabels']): FormFields => [
  {
    name: 'full-name',
    blockName: 'full-name',
    blockType: 'text',
    label: labels.fullName,
    required: true,
    width: 100,
  },
  {
    name: 'email',
    blockName: 'email',
    blockType: 'email',
    label: labels.email,
    required: true,
    width: 100,
  },
  {
    name: 'phone',
    blockName: 'phone',
    blockType: 'number',
    label: labels.phone,
    required: false,
    width: 100,
  },
  {
    name: 'message',
    blockName: 'message',
    blockType: 'textarea',
    label: labels.message,
    required: true,
    width: 100,
  },
]

/**
 * Full form document, for the initial create in the default locale (`fr`).
 * `emails` (the internal admin notification) is intentionally not part of
 * `localizeFormFieldLabels`/the plugin overrides (see `src/plugins/index.ts`)
 * - it's a technical, non-user-facing field, so it is set once here and left
 * untouched by the `en` translation below rather than re-sent (re-sending it
 * from the `en` copy would silently flip the shared, non-localized value to
 * English for every locale).
 */
export const contactForm = (locale: Locale): RequiredDataFromCollectionSlug<'forms'> => {
  const c = copy[locale]

  return {
    confirmationMessage: richText([heading('h2', c.confirmationHeading)]),
    confirmationType: 'message',
    createdAt: '2023-01-12T21:47:41.374Z',
    emails: [
      {
        emailFrom: `"${SITE_NAME}" <no-reply@example.com>`,
        emailTo: '{{email}}',
        message: richText([paragraph([text(c.emailBody)])]),
        subject: c.emailSubject,
      },
    ],
    fields: buildFields(c.fieldLabels),
    privacyNotice: privacyNoticeDefaults[locale],
    redirect: undefined,
    submitButtonLabel: c.submitButtonLabel,
    title: c.title,
    updatedAt: '2023-01-12T21:47:41.374Z',
  }
}

/**
 * Localized-only subset, for the `en` `update` pass - only the fields
 * marked `localized: true` in `src/plugins/index.ts` (`title`,
 * `submitButtonLabel`, `confirmationMessage`, each form field's `label`).
 */
export const contactFormTranslation = (
  locale: Locale,
): Pick<
  RequiredDataFromCollectionSlug<'forms'>,
  'confirmationMessage' | 'fields' | 'privacyNotice' | 'submitButtonLabel' | 'title'
> => {
  const c = copy[locale]

  return {
    confirmationMessage: richText([heading('h2', c.confirmationHeading)]),
    fields: buildFields(c.fieldLabels),
    privacyNotice: privacyNoticeDefaults[locale],
    submitButtonLabel: c.submitButtonLabel,
    title: c.title,
  }
}
