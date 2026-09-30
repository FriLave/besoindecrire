/**
 * Fixed legal boilerplate (LCEN art. 1-1, RGPD art. 13). Like UI chrome, these are
 * template strings, not editable prose: the client's facts come from `site-settings.legal`
 * and extra prose goes in each block's `additionalContent`. Templates are indicative and
 * must be reviewed by the client; this is not legal advice.
 */
import type { Locale } from '@/utilities/getLocalizedPath'
import { defaultLocale } from '@/utilities/getLocalizedPath'
import { RETENTION_YEARS } from '@/utilities/retention'

export type LegalDictionary = {
  notice: {
    publisher: string
    name: string
    nameEI: string
    status: string
    statusEI: string
    legalForm: string
    shareCapital: string
    address: string
    phone: string
    email: string
    siren: string
    registry: string
    vat: string
    vatExempt: string
    director: string
    host: string
    hostName: string
    profession: string
    body: string
    title: string
    country: string
    rules: string
    insurer: string
    ip: string
    ipText: string
  }
  privacy: {
    controller: string
    controllerText: (name: string, address?: string, email?: string) => string
    dpo: (name: string, email?: string) => string
    purposes: string
    purposesText: string
    mandatory: string
    legalBasis: string
    legalBasisText: string
    recipients: string
    recipientsText: (host?: string) => string
    transfers: string
    transfersText: string
    retention: string
    retentionText: string
    rights: string
    rightsIntro: string
    rightsList: string[]
    rightsHow: (email?: string) => string
    complaint: string
    complaintText: string
    cookies: string
    cookiesText: string
    cookiesList: string[]
    cookiesNoTracker: string
  }
  missing: string
}

const dictionaries: Record<Locale, LegalDictionary> = {
  fr: {
    notice: {
      publisher: 'Éditeur du site',
      name: 'Dénomination sociale',
      nameEI: 'Nom et prénom',
      status: 'Forme juridique',
      statusEI: 'Statut',
      legalForm: 'Forme juridique',
      shareCapital: 'Capital social',
      address: 'Siège social',
      phone: 'Téléphone',
      email: 'Email',
      siren: 'SIREN',
      registry: 'Immatriculation',
      vat: 'N° de TVA intracommunautaire',
      vatExempt: 'TVA non applicable, art. 293 B du CGI',
      director: 'Directeur de la publication',
      host: 'Hébergeur',
      hostName: 'Nom / raison sociale',
      profession: 'Profession réglementée',
      body: 'Ordre / organisme',
      title: 'Titre professionnel',
      country: "État d'octroi du titre",
      rules: 'Règles professionnelles applicables',
      insurer: 'Assurance responsabilité civile professionnelle',
      ip: 'Propriété intellectuelle',
      ipText:
        "L'ensemble des contenus de ce site (textes, images, logos, graphismes) est protégé par le droit d'auteur. Toute reproduction ou représentation, totale ou partielle, sans autorisation préalable de l'éditeur est interdite.",
    },
    privacy: {
      controller: 'Responsable du traitement',
      controllerText: (name, address, email) =>
        `Le responsable du traitement des données personnelles collectées sur ce site est ${name}${address ? `, ${address.replace(/\s*\n\s*/g, ', ')}` : ''}${email ? `. Contact : ${email}` : ''}.`,
      dpo: (name, email) => `Délégué à la protection des données (DPO) : ${name}${email ? ` (${email})` : ''}.`,
      purposes: 'Finalités du traitement',
      purposesText:
        'Les données saisies dans le formulaire de contact (par exemple nom, adresse email, téléphone, message) sont utilisées uniquement pour répondre à votre demande.',
      mandatory:
        "Les champs signalés comme obligatoires sont nécessaires au traitement de votre demande ; sans eux, nous ne pourrons pas y répondre.",
      legalBasis: 'Base légale',
      legalBasisText:
        "Le traitement repose sur les mesures précontractuelles prises à votre demande et sur notre intérêt légitime à répondre aux sollicitations reçues (art. 6.1.b et 6.1.f du RGPD).",
      recipients: 'Destinataires des données',
      recipientsText: (host) =>
        `Vos données sont destinées à notre équipe interne. Elles peuvent être traitées par nos sous-traitants techniques, notamment notre hébergeur${host ? ` (${host})` : ''}, dans la limite nécessaire à leur mission. Elles ne sont ni vendues ni cédées.`,
      transfers: "Transferts hors de l'Union européenne",
      transfersText: "Vos données ne sont pas transférées en dehors de l'Union européenne.",
      retention: 'Durée de conservation',
      retentionText: `Les données de contact sont conservées ${RETENTION_YEARS} ans à compter du dernier échange, puis supprimées.`,
      rights: 'Vos droits',
      rightsIntro: "Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :",
      rightsList: [
        "droit d'accès",
        'droit de rectification',
        "droit à l'effacement",
        'droit à la limitation du traitement',
        'droit à la portabilité',
        "droit d'opposition",
      ],
      rightsHow: (email) =>
        `Pour exercer ces droits, écrivez-nous${email ? ` à ${email}` : ' aux coordonnées indiquées ci-dessus'}. Nous vous répondrons dans un délai d'un mois.`,
      complaint: 'Réclamation',
      complaintText:
        "Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).",
      cookies: 'Cookies et traceurs',
      cookiesText:
        "Ce site n'utilise que des traceurs strictement nécessaires à son fonctionnement, exemptés de consentement :",
      cookiesList: [
        "cookie de session d'authentification, déposé uniquement pour les utilisateurs connectés à l'espace d'administration ;",
        "préférence d'affichage (thème clair/sombre), conservée dans le navigateur (stockage local) et jamais transmise à nos serveurs.",
      ],
      cookiesNoTracker:
        "Aucun traceur de mesure d'audience ni de publicité n'est utilisé ; c'est pourquoi ce site n'affiche pas de bannière de consentement.",
    },
    missing: 'Informations à compléter dans Réglages du site > Légal :',
  },
  en: {
    notice: {
      publisher: 'Site publisher',
      name: 'Company name',
      nameEI: 'Full name',
      status: 'Legal form',
      statusEI: 'Status',
      legalForm: 'Legal form',
      shareCapital: 'Share capital',
      address: 'Registered office',
      phone: 'Phone',
      email: 'Email',
      siren: 'SIREN',
      registry: 'Registration',
      vat: 'Intra-EU VAT number',
      vatExempt: 'VAT not applicable, art. 293 B of the French Tax Code (CGI)',
      director: 'Publication director',
      host: 'Hosting provider',
      hostName: 'Name / company name',
      profession: 'Regulated profession',
      body: 'Professional body',
      title: 'Professional title',
      country: 'Country that granted the title',
      rules: 'Applicable professional rules',
      insurer: 'Professional liability insurance',
      ip: 'Intellectual property',
      ipText:
        "All content of this site (texts, images, logos, graphics) is protected by copyright. Any reproduction or representation, in whole or in part, without the publisher's prior authorisation is prohibited.",
    },
    privacy: {
      controller: 'Data controller',
      controllerText: (name, address, email) =>
        `The controller of the personal data collected on this site is ${name}${address ? `, ${address.replace(/\s*\n\s*/g, ', ')}` : ''}${email ? `. Contact: ${email}` : ''}.`,
      dpo: (name, email) => `Data protection officer (DPO): ${name}${email ? ` (${email})` : ''}.`,
      purposes: 'Purposes of the processing',
      purposesText:
        'The data entered in the contact form (for example name, email address, phone, message) is used only to answer your request.',
      mandatory:
        'Fields marked as required are needed to process your request; without them we cannot answer it.',
      legalBasis: 'Legal basis',
      legalBasisText:
        'The processing is based on pre-contractual measures taken at your request and on our legitimate interest in answering the enquiries we receive (GDPR art. 6.1.b and 6.1.f).',
      recipients: 'Recipients',
      recipientsText: (host) =>
        `Your data is intended for our internal team. It may be processed by our technical processors, notably our hosting provider${host ? ` (${host})` : ''}, to the extent necessary for their assignment. It is neither sold nor transferred.`,
      transfers: 'Transfers outside the European Union',
      transfersText: 'Your data is not transferred outside the European Union.',
      retention: 'Retention period',
      retentionText: `Contact data is kept for ${RETENTION_YEARS} years from the last exchange, then deleted.`,
      rights: 'Your rights',
      rightsIntro: 'Under the GDPR and the French Data Protection Act, you have the following rights:',
      rightsList: [
        'right of access',
        'right to rectification',
        'right to erasure',
        'right to restriction of processing',
        'right to data portability',
        'right to object',
      ],
      rightsHow: (email) =>
        `To exercise these rights, write to us${email ? ` at ${email}` : ' at the contact details above'}. We will answer within one month.`,
      complaint: 'Complaint',
      complaintText:
        'If, after contacting us, you believe your rights are not respected, you may lodge a complaint with the CNIL (www.cnil.fr), the French data protection authority.',
      cookies: 'Cookies and trackers',
      cookiesText:
        'This site only uses trackers that are strictly necessary for its operation and exempt from consent:',
      cookiesList: [
        'an authentication session cookie, set only for users logged in to the administration area;',
        'a display preference (light/dark theme), kept in your browser (local storage) and never sent to our servers.',
      ],
      cookiesNoTracker:
        'No audience-measurement or advertising tracker is used, which is why this site shows no consent banner.',
    },
    missing: 'Information to complete in Site settings > Legal:',
  },
}

export function getLegal(locale: Locale): LegalDictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}

/** Default contact-form notice (editable per form in the admin; see `privacyNotice`). */
export const privacyNoticeDefaults: Record<Locale, string> = {
  fr: `Les informations recueillies sont utilisées uniquement pour répondre à votre demande et conservées ${RETENTION_YEARS} ans. Pour en savoir plus et exercer vos droits :`,
  en: `The information collected is used only to answer your request and kept for ${RETENTION_YEARS} years. To learn more and exercise your rights:`,
}
