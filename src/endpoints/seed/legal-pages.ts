import type { RequiredDataFromCollectionSlug } from 'payload'

import type { Locale } from '@/utilities/getLocalizedPath'

import { heading, paragraph, richText, text } from './lexical-helpers'

export type LegalKind = 'legalNotice' | 'privacyPolicy' | 'terms'

export const legalSlugs: Record<LegalKind, Record<Locale, string>> = {
  legalNotice: { fr: 'mentions-legales', en: 'legal-notice' },
  privacyPolicy: { fr: 'politique-de-confidentialite', en: 'privacy-policy' },
  terms: { fr: 'cgu', en: 'terms' },
}

const copy: Record<LegalKind, Record<Locale, { description: string; title: string }>> = {
  legalNotice: {
    fr: { title: 'Mentions légales', description: "Mentions légales : éditeur du site, hébergeur et propriété intellectuelle." },
    en: { title: 'Legal notice', description: 'Legal notice: site publisher, hosting provider and intellectual property.' },
  },
  privacyPolicy: {
    fr: { title: 'Politique de confidentialité', description: 'Comment vos données personnelles sont collectées, utilisées et protégées, et comment exercer vos droits.' },
    en: { title: 'Privacy policy', description: 'How your personal data is collected, used and protected, and how to exercise your rights.' },
  },
  terms: {
    fr: { title: "Conditions générales d'utilisation", description: "Conditions générales d'utilisation du site : accès, propriété intellectuelle, responsabilité et droit applicable." },
    en: { title: 'Terms of use', description: 'Terms of use of the site: access, intellectual property, liability and governing law.' },
  },
}

const terms: Record<Locale, [string, string][]> = {
  fr: [
    ['Objet', "Les présentes conditions générales d'utilisation (CGU) encadrent l'accès et l'utilisation de ce site. En naviguant sur le site, vous acceptez ces conditions."],
    ['Accès au site', "Le site est accessible gratuitement à tout utilisateur disposant d'un accès à internet. L'éditeur s'efforce d'assurer sa disponibilité mais peut l'interrompre à tout moment, notamment pour maintenance, sans que sa responsabilité puisse être engagée."],
    ['Propriété intellectuelle', "Les contenus du site (textes, images, logos, graphismes) sont protégés par le droit d'auteur. Toute reproduction ou représentation, totale ou partielle, sans autorisation préalable est interdite."],
    ['Responsabilité', "Les informations publiées sont fournies à titre indicatif et peuvent être modifiées à tout moment. L'éditeur ne saurait être tenu responsable d'un usage inapproprié de ces informations ni des dommages liés à l'accès au site."],
    ['Liens externes', "Le site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle sur leur contenu et décline toute responsabilité à leur égard."],
    ['Droit applicable', "Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents."],
  ],
  en: [
    ['Purpose', 'These terms of use govern access to and use of this site. By browsing the site, you accept these terms.'],
    ['Access to the site', 'The site is freely accessible to any user with internet access. The publisher endeavours to keep it available but may interrupt it at any time, notably for maintenance, without incurring liability.'],
    ['Intellectual property', 'The content of the site (texts, images, logos, graphics) is protected by copyright. Any reproduction or representation, in whole or in part, without prior authorisation is prohibited.'],
    ['Liability', 'The information published is provided for guidance and may be changed at any time. The publisher cannot be held liable for any inappropriate use of this information or for damage related to access to the site.'],
    ['External links', 'The site may contain links to third-party sites. The publisher has no control over their content and accepts no liability for them.'],
    ['Governing law', 'These terms are governed by French law. In the event of a dispute, and failing an amicable settlement, the French courts shall have sole jurisdiction.'],
  ],
}

export const legalPage = (
  kind: LegalKind,
  locale: Locale,
): RequiredDataFromCollectionSlug<'pages'> => {
  const { description, title } = copy[kind][locale]

  const layout: RequiredDataFromCollectionSlug<'pages'>['layout'] =
    kind === 'terms'
      ? [
          {
            blockType: 'content',
            columns: [
              {
                size: 'full',
                richText: richText(
                  terms[locale].flatMap(([h, p]) => [heading('h2', h), paragraph([text(p)])]),
                ),
              },
            ],
          },
        ]
      : [{ blockType: kind }]

  return {
    slug: legalSlugs[kind][locale],
    _status: 'published',
    hero: { type: 'lowImpact', richText: richText([heading('h1', title)]) },
    layout,
    meta: { description, title },
    title,
  }
}

/** Obviously fake demo facts: replace with the client's real ones. */
export const legalSettings = {
  legal: {
    publisherType: 'company' as const,
    companyName: 'Exemple SAS',
    legalForm: 'SAS',
    shareCapital: '1 000 €',
    address: '1 rue de l’Exemple\n75000 Paris',
    phone: '01 00 00 00 00',
    email: 'contact@example.com',
    siren: '000 000 000',
    registry: 'RCS Paris',
    vatExempt: false,
    vatNumber: 'FR00000000000',
    publicationDirector: 'Jean Exemple',
  },
  host: {
    name: 'Exemple Hébergeur',
    address: '2 avenue de l’Hébergement\n69000 Lyon',
    phone: '04 00 00 00 00',
  },
}
