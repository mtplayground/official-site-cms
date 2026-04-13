# official-site-cms

CMS-backed Next.js site for `myclawteam.ai` with:
- Public marketing pages and blog
- Admin dashboard (Auth.js credentials auth)
- Prisma + SQLite storage
- Local media uploads

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui primitives
- Prisma ORM + SQLite
- Auth.js v5 (credentials)
- Docker + Docker Compose (production-style runtime)

## Prerequisites

- Node.js 20+
- npm 10+

Optional for containerized runtime:
- Docker Engine 24+
- Docker Compose v2+

## Local Setup

1. Install dependencies:

```bash
npm ci
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Run database migrations:

```bash
npx prisma migrate deploy
```

4. Seed initial admin account:

```bash
npm run db:seed
```

5. Start development server:

```bash
npm run dev
```

App runs on `http://localhost:8080` when `PORT=8080`.

## Environment Variables

Required for normal runtime:

- `DATABASE_URL`: Prisma connection string. SQLite example: `file:./prisma/dev.db` (local) or `file:/app/data/prod.sqlite` (container)
- `AUTH_SECRET`: Auth.js signing secret (required in production)

Required for initial admin seed:

- `ADMIN_EMAIL`: email for admin account
- `ADMIN_PASSWORD`: plaintext password for admin account (minimum 12 chars)

Application runtime:

- `NODE_ENV`: `development` or `production`
- `HOSTNAME`: host binding (`0.0.0.0` in containers)
- `PORT`: app port (`8080`)

Public URL / SEO:

- `NEXT_PUBLIC_SITE_URL`: canonical site URL for metadata/sitemap/structured data
- `SITE_URL`: server-side fallback canonical URL

Auth.js host behavior:

- `AUTH_TRUST_HOST`: set to `true` behind trusted reverse proxies

## Seed Script

The seed script:
- validates `ADMIN_EMAIL` format
- enforces `ADMIN_PASSWORD` minimum length of 12
- upserts the admin user (idempotent)
- updates password hash and role on re-run

Run it with:

```bash
npm run db:seed
```

## Build and Run (Non-Docker)

```bash
npm run build
npm run start -- -H 0.0.0.0 -p 8080
```

## Docker Deployment

1. Prepare env file:

```bash
cp .env.example .env
```

2. Build and start:

```bash
docker compose up --build -d
```

3. Verify:

```bash
docker compose ps
docker compose logs -f app
```

4. Seed admin user inside container (if needed):

```bash
docker compose exec app npm run db:seed
```

5. Stop:

```bash
docker compose down
```

Persistent volumes/bind mounts:
- `./data -> /app/data` (SQLite DB)
- `./uploads -> /app/uploads` (uploaded files)

## Production Notes

- Set a strong `AUTH_SECRET` in production.
- Use a strong `ADMIN_PASSWORD` and rotate periodically.
- Set `NEXT_PUBLIC_SITE_URL` to your deployed HTTPS domain.
- Ensure reverse proxy forwards host/proto correctly when using `AUTH_TRUST_HOST=true`.
