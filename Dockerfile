# Self-check: `cargo build --release` is not applicable (no Cargo project); this is a Next.js/Node app.
FROM node:20-bookworm-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:./prisma/build.db
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma migrate deploy
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim AS runner
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates libssl3 sqlite3 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=8080
ENV DATABASE_URL=file:/app/data/prod.sqlite

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY .env ./.env
COPY start.sh ./start.sh
RUN chmod +x /app/start.sh

EXPOSE 8080
CMD ["/app/start.sh"]
