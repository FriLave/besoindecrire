import type { File } from 'payload'

import type { Locale } from '@/utilities/getLocalizedPath'

// Tiny but valid PDF (one empty page, real xref) so downloads open in any viewer.
const PDF = [
  '%PDF-1.4',
  '1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj',
  '2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj',
  '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj',
  'xref',
  '0 1',
  'trailer<</Root 1 0 R/Size 4>>',
  '%%EOF',
  '',
].join('\n')

export const demoPdf = (): File => {
  const data = Buffer.from(PDF)
  return { name: 'guide-pratique.pdf', data, mimetype: 'application/pdf', size: data.byteLength }
}

export const paidDownload = (locale: Locale) => ({
  slug: locale === 'fr' ? 'guide-pratique' : 'practical-guide',
  title: locale === 'fr' ? 'Guide pratique' : 'Practical guide',
  description:
    locale === 'fr'
      ? 'Un guide pratique au format PDF, à télécharger immédiatement après paiement.'
      : 'A practical guide as a PDF, available to download right after payment.',
  price: 990,
  currency: 'eur' as const,
})
