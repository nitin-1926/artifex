# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Artifex is a real-time collaborative whiteboard/drawing app built with Next.js 15 (T3 Stack), Prisma, NextAuth.js v5, and Liveblocks. Single-app repo (not a monorepo).

### Services

| Service | How to run | Notes |
|---------|-----------|-------|
| PostgreSQL | `sudo dockerd &` then `sudo docker start artifex-postgres` (or create via `start-database.sh`) | Must be running on port 5432 before the dev server |
| Next.js dev server | `npm run dev` | Runs on port 3000 with Turbopack |
| Liveblocks | External SaaS — no local service | Requires `LIVEBLOCKS_PUBLIC_KEY` and `LIVEBLOCKS_SECRET_KEY` env vars |

### Environment variables

All secrets (`DATABASE_URL`, `AUTH_SECRET`, `LIVEBLOCKS_PUBLIC_KEY`, `LIVEBLOCKS_SECRET_KEY`) are injected as environment variables. The `.env` file at the repo root is used by Prisma and Next.js; it must exist for `prisma db push` and `npm run dev` to work.

### Common commands

See `package.json` scripts. Key ones:

- `npm run dev` — start dev server (Turbopack)
- `npm run lint` — ESLint (warnings exist, no errors)
- `npm run typecheck` — TypeScript check (`tsc --noEmit`)
- `npm run check` — lint + typecheck combined
- `npx prisma db push` — sync schema to database
- `npx prisma studio` — GUI for browsing DB (optional)

### Gotchas

- The env validation in `src/env.js` will **fail at startup** if Liveblocks keys are missing. Set `SKIP_ENV_VALIDATION=1` to bypass if keys are unavailable.
- After `npm install`, Prisma Client is auto-generated via the `postinstall` script.
- The Docker daemon must be started manually (`sudo dockerd &`) before any Docker commands. Use `sudo docker ...` for container management since the socket is root-owned.
- The root `/` route permanently redirects to `/dashboard` (see `next.config.js`).
