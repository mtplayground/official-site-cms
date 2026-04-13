#!/bin/sh
set -eu

mkdir -p /app/data /app/uploads

if [ -z "${DATABASE_URL:-}" ]; then
  export DATABASE_URL="file:/app/data/prod.sqlite"
fi

npx prisma migrate deploy
exec npm run start -- -H "${HOSTNAME:-0.0.0.0}" -p "${PORT:-8080}"
