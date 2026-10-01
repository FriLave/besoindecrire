declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Mandatory: the app does not boot without them.
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      // Optional: getServerSideURL() falls back to VERCEL_PROJECT_PRODUCTION_URL, then localhost.
      NEXT_PUBLIC_SERVER_URL?: string
      VERCEL?: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
      PREVIEW_SECRET?: string
      CRON_SECRET?: string
      SKIP_BUILD_DB?: string
      PAYLOAD_PUSH?: string
      PAYLOAD_ALL_MODULES?: string
      DB_POOL_MAX?: string
      DB_IDLE_TIMEOUT_MS?: string
      DB_CONNECTION_TIMEOUT_MS?: string
      SMTP_HOST?: string
      SMTP_PORT?: string
      SMTP_USER?: string
      SMTP_PASS?: string
      EMAIL_FROM_ADDRESS?: string
      EMAIL_FROM_NAME?: string
      STRIPE_SECRET_KEY?: string
      STRIPE_WEBHOOK_SECRET?: string
      STORAGE_DRIVER?: string
      STORAGE_DRIVER_PRIVATE?: string
      BLOB_READ_WRITE_TOKEN?: string
      S3_BUCKET?: string
      S3_PRIVATE_BUCKET?: string
      S3_ENDPOINT?: string
      S3_REGION?: string
      S3_ACCESS_KEY_ID?: string
      S3_SECRET_ACCESS_KEY?: string
      S3_FORCE_PATH_STYLE?: string
      S3_PUBLIC_URL?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
