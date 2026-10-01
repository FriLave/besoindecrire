// Any setup scripts you might need go here

// Load .env files
import 'dotenv/config'

// Hermetic runs: point the suite at a dedicated database when TEST_DATABASE_URL is set.
if (process.env.TEST_DATABASE_URL) process.env.DATABASE_URL = process.env.TEST_DATABASE_URL
