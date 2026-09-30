import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from '@payloadcms/translations/languages/en'
import { fr } from '@payloadcms/translations/languages/fr'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { modules } from './client/modules'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Categories } from './collections/Categories'
import { PaidDownloads } from './collections/PaidDownloads'
import { PrivateFiles } from './collections/PrivateFiles'
import { Purchases } from './collections/Purchases'
import { paymentsEndpoints } from './modules/payments/endpoints'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { FeatureFlags } from './globals/FeatureFlags/config'
import { SiteSettings } from './globals/SiteSettings/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { purgeFormSubmissions } from './jobs/purgeFormSubmissions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [
    Pages,
    Media,
    Users,
    ...(modules.blog ? [Posts, Categories] : []),
    ...(modules.payments ? [PrivateFiles, PaidDownloads, Purchases] : []),
  ],
  endpoints: modules.payments ? paymentsEndpoints : [],
  // No SMTP_HOST: Payload falls back to logging emails to the console (dev).
  ...(process.env.SMTP_HOST
    ? {
        email: nodemailerAdapter({
          defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@example.com',
          defaultFromName: process.env.EMAIL_FROM_NAME || 'Website',
          transportOptions: {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            auth: process.env.SMTP_USER
              ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
              : undefined,
          },
        }),
      }
    : {}),
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings, FeatureFlags],
  // Allows each admin user to pick their own interface language from their
  // account page. English stays the admin default (see `localization` below,
  // which is unrelated to this) — do not set `fallbackLanguage: 'fr'` here.
  i18n: {
    supportedLanguages: { en, fr },
  },
  localization: {
    locales: [
      { label: 'Français', code: 'fr' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'fr',
    fallback: true,
  },
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Logged-in users only; purge runs on Payload's built-in cron (autoRun).
        return Boolean(req.user)
      },
    },
    // Needs a long-running Node process. Same queue as the task schedule: autoRun enqueues due schedules, then runs them.
    autoRun: [{ cron: '*/15 * * * *', queue: 'maintenance', limit: 10 }],
    tasks: [purgeFormSubmissions],
  },
})
