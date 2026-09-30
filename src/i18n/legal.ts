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
  /** Only rendered when the payments module is enabled. */
  purchases: {
    title: string
    text: string
    processor: string
    retention: string
  }
  terms: {
    identity: string
    mediator: string
    privacyLink: string
    /** Sections after the seller identity; `mediator` is the pre-formatted text or undefined. */
    sections: (ctx: { mediator?: string }) => { title: string; body: string[] }[]
  }
  missing: string
}

/** Code de commerce L123-22: accounting documents are kept 10 years. */
const ACCOUNTING_RETENTION_YEARS = 10

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
      dpo: (name, email) =>
        `Délégué à la protection des données (DPO) : ${name}${email ? ` (${email})` : ''}.`,
      purposes: 'Finalités du traitement',
      purposesText:
        'Les données saisies dans le formulaire de contact (par exemple nom, adresse email, téléphone, message) sont utilisées uniquement pour répondre à votre demande.',
      mandatory:
        'Les champs signalés comme obligatoires sont nécessaires au traitement de votre demande ; sans eux, nous ne pourrons pas y répondre.',
      legalBasis: 'Base légale',
      legalBasisText:
        'Le traitement repose sur les mesures précontractuelles prises à votre demande et sur notre intérêt légitime à répondre aux sollicitations reçues (art. 6.1.b et 6.1.f du RGPD).',
      recipients: 'Destinataires des données',
      recipientsText: (host) =>
        `Vos données sont destinées à notre équipe interne. Elles peuvent être traitées par nos sous-traitants techniques, notamment notre hébergeur${host ? ` (${host})` : ''}, dans la limite nécessaire à leur mission. Elles ne sont ni vendues ni cédées.`,
      transfers: "Transferts hors de l'Union européenne",
      transfersText: "Vos données ne sont pas transférées en dehors de l'Union européenne.",
      retention: 'Durée de conservation',
      retentionText: `Les données de contact sont conservées ${RETENTION_YEARS} ans à compter du dernier échange, puis supprimées.`,
      rights: 'Vos droits',
      rightsIntro:
        'Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :',
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
        'Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (www.cnil.fr).',
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
    purchases: {
      title: 'Achats de contenus numériques',
      text: "Lors d'un achat, nous collectons votre adresse email, le contenu acheté, le montant et la date de la commande, ainsi que la preuve de votre consentement exprès à l'accès immédiat et de votre renonciation au droit de rétractation. Ces données servent à exécuter la vente, vous envoyer le lien de téléchargement et respecter nos obligations comptables (art. 6.1.b et 6.1.c du RGPD).",
      processor:
        "Le paiement est traité par Stripe, notre sous-traitant (Stripe Payments Europe Ltd, Irlande). Nous ne conservons aucune donnée de carte bancaire. Stripe peut transférer certaines données hors de l'Union européenne, dans le cadre de garanties appropriées (clauses contractuelles types).",
      retention: `Les données de vente sont conservées ${ACCOUNTING_RETENTION_YEARS} ans, conformément à l'obligation de conservation des pièces comptables (art. L123-22 du Code de commerce).`,
    },
    terms: {
      identity: 'Vendeur',
      mediator: 'Médiateur de la consommation',
      privacyLink: 'Politique de confidentialité',
      sections: ({ mediator }) => [
        {
          title: 'Objet et champ d’application',
          body: [
            "Les présentes conditions générales de vente régissent la vente à distance, par le vendeur, de contenus numériques téléchargeables (guides, documents, fichiers) proposés sur ce site. Toute commande implique l'acceptation sans réserve des présentes conditions.",
          ],
        },
        {
          title: 'Produits',
          body: [
            'Les produits sont des contenus numériques fournis sans support matériel, sous forme de fichiers téléchargeables. Leurs caractéristiques essentielles sont décrites sur la page de chaque produit.',
          ],
        },
        {
          title: 'Prix',
          body: [
            'Les prix sont indiqués en euros, toutes taxes comprises (TTC). Le prix applicable est celui affiché au moment de la commande. Le vendeur peut modifier ses prix à tout moment, sans effet sur les commandes déjà passées.',
          ],
        },
        {
          title: 'Commande et paiement',
          body: [
            "Le paiement est exigible immédiatement à la commande, par carte bancaire, via la plateforme sécurisée Stripe. Le vendeur n'a pas accès aux données de votre carte. La vente est conclue à la confirmation du paiement.",
          ],
        },
        {
          title: 'Livraison',
          body: [
            "Après confirmation du paiement, le contenu est mis à disposition par un lien de téléchargement personnel envoyé à l'adresse email indiquée lors de la commande et affiché sur la page de confirmation. Ce lien est valable 72 heures et peut être renouvelé à tout moment, à la demande, depuis la page du produit.",
            "Il appartient à l'acheteur de saisir une adresse email exacte et de vérifier ses courriers indésirables.",
          ],
        },
        {
          title: 'Absence de droit de rétractation',
          body: [
            "Conformément à l'article L221-28, 13° du Code de la consommation, le droit de rétractation ne peut être exercé pour les contenus numériques non fournis sur un support matériel dont l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.",
            "Avant de payer, l'acheteur demande expressément l'accès immédiat au contenu et renonce expressément à son droit de rétractation en cochant la case prévue à cet effet. Cette acceptation est conservée par le vendeur.",
          ],
        },
        {
          title: 'Garantie légale de conformité',
          body: [
            "Le vendeur est tenu de livrer un contenu numérique conforme au contrat et répond des défauts de conformité existant lors de la fourniture, conformément aux articles L224-25-12 et suivants du Code de la consommation. En cas de défaut de conformité, l'acheteur peut demander la mise en conformité du contenu ou, à défaut, la réduction du prix ou la résolution du contrat. Pour cela, il contacte le vendeur aux coordonnées indiquées ci-dessus.",
          ],
        },
        {
          title: 'Propriété intellectuelle',
          body: [
            "Le contenu acheté est protégé par le droit d'auteur. L'achat confère un droit d'usage personnel et non exclusif : toute revente, diffusion ou reproduction sans autorisation du vendeur est interdite.",
          ],
        },
        {
          title: 'Médiation de la consommation',
          body: [
            "En cas de litige, l'acheteur consommateur peut, après une réclamation écrite auprès du vendeur restée sans réponse satisfaisante, recourir gratuitement à un médiateur de la consommation (art. L612-1 du Code de la consommation)." +
              (mediator ? ` Médiateur : ${mediator}.` : ''),
          ],
        },
        {
          title: 'Données personnelles',
          body: [
            "Les données collectées lors de la commande sont traitées pour l'exécution de la vente, dans les conditions décrites dans notre politique de confidentialité.",
          ],
        },
        {
          title: 'Droit applicable',
          body: [
            'Les présentes conditions sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français sont compétents, sans préjudice des règles impératives protégeant le consommateur.',
          ],
        },
      ],
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
      rightsIntro:
        'Under the GDPR and the French Data Protection Act, you have the following rights:',
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
    purchases: {
      title: 'Digital content purchases',
      text: 'When you buy, we collect your email address, the content bought, the amount and date of the order, and the record of your express consent to immediate access and of your waiver of the right of withdrawal. This data is used to perform the sale, send you the download link and meet our accounting obligations (GDPR art. 6.1.b and 6.1.c).',
      processor:
        'Payment is handled by Stripe, our processor (Stripe Payments Europe Ltd, Ireland). We do not store any card data. Stripe may transfer some data outside the European Union under appropriate safeguards (standard contractual clauses).',
      retention: `Sales data is kept for ${ACCOUNTING_RETENTION_YEARS} years, in line with the obligation to retain accounting records (art. L123-22 of the French Commercial Code).`,
    },
    terms: {
      identity: 'Seller',
      mediator: 'Consumer mediator',
      privacyLink: 'Privacy policy',
      sections: ({ mediator }) => [
        {
          title: 'Purpose and scope',
          body: [
            'These terms of sale govern the distance sale, by the seller, of downloadable digital content (guides, documents, files) offered on this site. Placing an order implies full acceptance of these terms.',
          ],
        },
        {
          title: 'Products',
          body: [
            'Products are digital content supplied without a physical medium, as downloadable files. Their main characteristics are described on each product page.',
          ],
        },
        {
          title: 'Prices',
          body: [
            'Prices are shown in euros, including all taxes (VAT). The applicable price is the one displayed when the order is placed. The seller may change its prices at any time, without effect on orders already placed.',
          ],
        },
        {
          title: 'Order and payment',
          body: [
            'Payment is due immediately when ordering, by bank card, through the secure Stripe platform. The seller has no access to your card data. The sale is concluded once payment is confirmed.',
          ],
        },
        {
          title: 'Delivery',
          body: [
            'Once payment is confirmed, the content is made available through a personal download link sent to the email address given when ordering and shown on the confirmation page. The link is valid for 72 hours and can be renewed at any time, on request, from the product page.',
            'The buyer must enter a correct email address and check their spam folder.',
          ],
        },
        {
          title: 'No right of withdrawal',
          body: [
            'Under article L221-28, 13° of the French Consumer Code, the right of withdrawal cannot be exercised for digital content not supplied on a tangible medium whose performance has begun after the consumer’s prior express consent and express waiver of the right of withdrawal.',
            'Before paying, the buyer expressly requests immediate access to the content and expressly waives the right of withdrawal by ticking the box provided. The seller keeps a record of this acceptance.',
          ],
        },
        {
          title: 'Legal guarantee of conformity',
          body: [
            'The seller must deliver digital content that conforms to the contract and is liable for any lack of conformity existing at the time of supply, in accordance with articles L224-25-12 et seq. of the French Consumer Code. In case of a lack of conformity, the buyer may ask for the content to be brought into conformity or, failing that, for a price reduction or termination of the contract. To do so, the buyer contacts the seller at the details given above.',
          ],
        },
        {
          title: 'Intellectual property',
          body: [
            'The content bought is protected by copyright. The purchase grants a personal, non-exclusive right of use: any resale, distribution or reproduction without the seller’s authorisation is prohibited.',
          ],
        },
        {
          title: 'Consumer mediation',
          body: [
            'In case of a dispute, a consumer buyer may, after a written complaint to the seller that has not been satisfactorily answered, use a consumer mediator free of charge (art. L612-1 of the French Consumer Code).' +
              (mediator ? ` Mediator: ${mediator}.` : ''),
          ],
        },
        {
          title: 'Personal data',
          body: [
            'The data collected when ordering is processed to perform the sale, as described in our privacy policy.',
          ],
        },
        {
          title: 'Governing law',
          body: [
            'These terms are governed by French law. In the event of a dispute, and failing an amicable settlement, the French courts have jurisdiction, without prejudice to mandatory rules protecting consumers.',
          ],
        },
      ],
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
