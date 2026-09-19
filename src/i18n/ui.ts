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
  }
  form: {
    fieldRequired: string
    internalServerError: string
    loading: string
    requiredIndicator: string
    somethingWentWrong: string
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
    },
    form: {
      fieldRequired: 'Ce champ est requis',
      internalServerError: 'Erreur interne du serveur',
      loading: 'Chargement, veuillez patienter...',
      requiredIndicator: '(requis)',
      somethingWentWrong: "Une erreur s'est produite.",
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
    },
    form: {
      fieldRequired: 'This field is required',
      internalServerError: 'Internal Server Error',
      loading: 'Loading, please wait...',
      requiredIndicator: '(required)',
      somethingWentWrong: 'Something went wrong.',
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
