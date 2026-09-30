import type { Payload } from 'payload'

import { signDownloadToken } from './token'

const copy = {
  fr: {
    subject: (t: string) => `Votre téléchargement : ${t}`,
    body: (t: string, url: string) =>
      `Merci pour votre achat de « ${t} ».\n\nTéléchargez votre fichier (lien valable 72 h) : ${url}\n\nLien expiré ? Demandez-en un nouveau depuis la page du produit.`,
  },
  en: {
    subject: (t: string) => `Your download: ${t}`,
    body: (t: string, url: string) =>
      `Thank you for purchasing "${t}".\n\nDownload your file (link valid for 72 hours): ${url}\n\nLink expired? Request a new one from the product page.`,
  },
} as const

export const siteUrlFor = async (payload: Payload): Promise<string> => {
  const s = await payload.findGlobal({ slug: 'site-settings', depth: 0, overrideAccess: true })
  return (
    (s as { siteUrl?: string | null }).siteUrl ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://localhost:3000'
  ).replace(/\/$/, '')
}

export const downloadUrl = (siteUrl: string, purchaseId: string | number) =>
  `${siteUrl}/api/downloads/${signDownloadToken(purchaseId, process.env.PAYLOAD_SECRET)}`

export const sendDownloadEmail = async (
  payload: Payload,
  purchase: { id: string | number; email: string; locale?: string | null },
  title: string,
) => {
  const c = copy[purchase.locale === 'en' ? 'en' : 'fr']
  const url = downloadUrl(await siteUrlFor(payload), purchase.id)
  await payload.sendEmail({
    to: purchase.email,
    subject: c.subject(title),
    text: c.body(title, url),
  })
}
