import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
    // Specs share one DB: parallel files race on schema push and on the feature-flags global
    // (Payload rewrites the whole global on a partial update, so concurrent toggles get lost).
    fileParallelism: false,
  },
})
