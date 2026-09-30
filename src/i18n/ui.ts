/**
 * Upstream-owned UI string dictionary.
 *
 * These are technical/chrome strings that live in components the CMS does
 * not own (error states, form scaffolding, generic UI primitives...) - as
 * opposed to editorial content, which always comes from Payload. Unlike
 * `src/client/`, this file is NOT part of the client fork's identity: it
 * stays upstream and is maintained alongside the components that use it.
 *
 * Deliberately plain TypeScript - no next-intl, no ICU message format, no
 * new dependency. Client components that need a translated string receive
 * the current `Locale` as a prop (threaded down from the nearest server
 * component that already has it) and call `getUI(locale)`.
 */
import type { Locale } from '@/utilities/getLocalizedPath'
import { defaultLocale } from '@/utilities/getLocalizedPath'

export type UIDictionary = {
  adminBar: {
    dashboard: string
    pagesPlural: string
    pagesSingular: string
    postsPlural: string
    postsSingular: string
    categoriesPlural: string
    categoriesSingular: string
  }
  breadcrumb: {
    home: string
  }
  blog: {
    author: string
    /** Range label, e.g. "Showing 1 - 12 of 30 posts". */
    range: (start: number, end: number, total: number) => string
    noImage: string
    noResults: string
    pageNumber: (page: number) => string
    published: string
    relatedPosts: string
    title: string
    untitledCategory: string
  }
  form: {
    fieldRequired: string
    internalServerError: string
    loading: string
    privacyLink: string
    requiredIndicator: string
    somethingWentWrong: string
  }
  payments: {
    taxIncluded: string
    email: string
    waiver: string
    termsLink: string
    buy: string
    buying: string
    errorEmail: string
    errorGeneric: string
    resendPrompt: string
    resendCta: string
    resendSubmit: string
    resendSent: string
    successTitle: string
    successChecking: string
    successReady: string
    successDownload: string
    successPending: string
    successMissing: string
    backHome: string
  }
  localeSwitcher: {
    /** aria-label / visible copy: "Switch to <language>". */
    switchTo: (targetLanguageLabel: string) => string
  }
  notFound: {
    cta: string
    description: string
    title: string
  }
  pagination: {
    next: string
    previous: string
  }
  search: {
    noResults: string
    placeholder: string
    submit: string
    title: string
  }
  theme: {
    auto: string
    dark: string
    light: string
    selectLabel: string
  }
}

const dictionaries: Record<Locale, UIDictionary> = {
  fr: {
    adminBar: {
      dashboard: 'Tableau de bord',
      pagesPlural: 'Pages',
      pagesSingular: 'Page',
      postsPlural: 'Articles',
      postsSingular: 'Article',
      categoriesPlural: 'Catégories',
      categoriesSingular: 'Catégorie',
    },
    breadcrumb: { home: 'Accueil' },
    blog: {
      author: 'Auteur',
      range: (start, end, total) =>
        `Affichage de ${start}${start !== end ? ` - ${end}` : ''} sur ${total} article${total > 1 ? 's' : ''}`,
      noImage: 'Pas d’image',
      noResults: 'Aucun article.',
      pageNumber: (page) => `Page ${page}`,
      published: 'Publié le',
      relatedPosts: 'Articles similaires',
      title: 'Blog',
      untitledCategory: 'Catégorie sans titre',
    },
    search: {
      noResults: 'Aucun résultat.',
      placeholder: 'Rechercher',
      submit: 'Rechercher',
      title: 'Recherche',
    },
    form: {
      fieldRequired: 'Ce champ est requis',
      internalServerError: 'Erreur interne du serveur',
      loading: 'Chargement, veuillez patienter...',
      privacyLink: 'Politique de confidentialité',
      requiredIndicator: '(requis)',
      somethingWentWrong: "Une erreur s'est produite.",
    },
    payments: {
      taxIncluded: 'TTC',
      email: 'Votre adresse email',
      waiver:
        'Je demande l’accès immédiat au contenu numérique et je renonce expressément à mon droit de rétractation.',
      termsLink: 'Conditions générales de vente',
      buy: 'Acheter',
      buying: 'Redirection vers le paiement...',
      errorEmail: 'Veuillez saisir une adresse email valide.',
      errorGeneric: 'Le paiement n’a pas pu être lancé. Veuillez réessayer.',
      resendPrompt: 'Vous avez déjà acheté ?',
      resendCta: 'Recevoir à nouveau le lien',
      resendSubmit: 'Envoyer le lien',
      resendSent:
        'Si un achat correspond à cette adresse, un email avec le lien de téléchargement vient d’être envoyé.',
      successTitle: 'Merci pour votre achat',
      successChecking: 'Confirmation du paiement en cours...',
      successReady: 'Votre paiement est confirmé. Votre contenu est prêt.',
      successDownload: 'Télécharger',
      successPending:
        'Votre lien de téléchargement arrive par email. Pensez à vérifier vos courriers indésirables.',
      successMissing: 'Aucun achat à afficher.',
      backHome: 'Retour à l’accueil',
    },
    localeSwitcher: {
      switchTo: (targetLanguageLabel) => `Passer en ${targetLanguageLabel}`,
    },
    notFound: {
      cta: "Retour à l'accueil",
      description: "Cette page n'a pas pu être trouvée.",
      title: '404',
    },
    pagination: {
      next: 'Suivant',
      previous: 'Précédent',
    },
    theme: {
      auto: 'Auto',
      dark: 'Sombre',
      light: 'Clair',
      selectLabel: 'Choisir un thème',
    },
  },
  en: {
    adminBar: {
      dashboard: 'Dashboard',
      pagesPlural: 'Pages',
      pagesSingular: 'Page',
      postsPlural: 'Posts',
      postsSingular: 'Post',
      categoriesPlural: 'Categories',
      categoriesSingular: 'Category',
    },
    breadcrumb: { home: 'Home' },
    blog: {
      author: 'Author',
      range: (start, end, total) =>
        `Showing ${start}${start !== end ? ` - ${end}` : ''} of ${total} post${total > 1 ? 's' : ''}`,
      noImage: 'No image',
      noResults: 'No posts.',
      pageNumber: (page) => `Page ${page}`,
      published: 'Published on',
      relatedPosts: 'Related posts',
      title: 'Blog',
      untitledCategory: 'Untitled category',
    },
    search: {
      noResults: 'No results found.',
      placeholder: 'Search',
      submit: 'Search',
      title: 'Search',
    },
    form: {
      fieldRequired: 'This field is required',
      internalServerError: 'Internal Server Error',
      loading: 'Loading, please wait...',
      privacyLink: 'Privacy policy',
      requiredIndicator: '(required)',
      somethingWentWrong: 'Something went wrong.',
    },
    payments: {
      taxIncluded: 'incl. VAT',
      email: 'Your email address',
      waiver:
        'I request immediate access to the digital content and I expressly waive my right of withdrawal.',
      termsLink: 'Terms of sale',
      buy: 'Buy',
      buying: 'Redirecting to payment...',
      errorEmail: 'Please enter a valid email address.',
      errorGeneric: 'Payment could not be started. Please try again.',
      resendPrompt: 'Already bought it?',
      resendCta: 'Get the link again',
      resendSubmit: 'Send the link',
      resendSent:
        'If a purchase matches this address, an email with the download link has just been sent.',
      successTitle: 'Thank you for your purchase',
      successChecking: 'Confirming your payment...',
      successReady: 'Your payment is confirmed. Your content is ready.',
      successDownload: 'Download',
      successPending:
        'Your download link is on its way by email. Remember to check your spam folder.',
      successMissing: 'No purchase to show.',
      backHome: 'Back to home',
    },
    localeSwitcher: {
      switchTo: (targetLanguageLabel) => `Switch to ${targetLanguageLabel}`,
    },
    notFound: {
      cta: 'Go home',
      description: 'This page could not be found.',
      title: '404',
    },
    pagination: {
      next: 'Next',
      previous: 'Previous',
    },
    theme: {
      auto: 'Auto',
      dark: 'Dark',
      light: 'Light',
      selectLabel: 'Select a theme',
    },
  },
}

/** Looks up the UI dictionary for a locale, falling back to the default locale. */
export function getUI(locale: Locale): UIDictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale]
}
