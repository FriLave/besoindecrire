# Production image (Next standalone). Build: `docker compose -f docker-compose.prod.yml build`.
# No database needed at build time: SKIP_BUILD_DB=1 makes generateStaticParams return [] and
# pages are generated on first request (ISR), then cached.
FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@12.4.2 --activate

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# --ignore-scripts: skips the husky-style `prepare` hook; sharp binaries come from optional deps.
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1 SKIP_BUILD_DB=1
# Placeholders only for the build: real values come from .env at runtime.
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    DATABASE_URL=postgres://build:build@127.0.0.1:5432/build \
    PAYLOAD_SECRET=build-only-secret
RUN pnpm build

FROM base AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Writable volumes: media uploads and private (paid) files. `.next` holds the ISR cache.
RUN mkdir -p public/media private-files .next && chown -R node:node public/media private-files .next
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1
CMD ["node", "server.js"]
