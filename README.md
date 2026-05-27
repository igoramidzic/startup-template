# Startup Template

A starter monorepo with:

- **Angular** web app (`web/`) — login + authed home, Clerk auth, SpartanUI, TailwindCSS
- **Convex** backend (`convex/`) — `userProfile` table with Clerk webhook auth
- **Astro** marketing + blog site (`site/`)
- **Mintlify** docs (`docs/`)

## Setup

```bash
pnpm install
```

Configure environment variables in `.env.local` and `web/src/environments/environment.ts` (Clerk publishable key, Convex URL).

## Development

```bash
# Web app (http://localhost:4200)
pnpm start

# Convex backend (watch mode)
npx convex dev

# Astro site
cd site && pnpm dev

# Mintlify docs
cd docs && mintlify dev
```

## Build

```bash
pnpm build       # Angular web build
cd site && pnpm build
```
