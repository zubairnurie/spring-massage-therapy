---
name: Spring Massage Therapy
description: Recreating springmassagetherapy.ca for friend Zarah Bellamy as a gift
---

# Spring Massage Therapy

Astro + Keystatic + Tailwind site for Zarah Bellamy's solo massage therapy practice in Montréal.

## Project goals

- Recreate the existing WordPress site faithfully (calming, intimate, heritage-manor feel — NOT corporate spa)
- Provide a Keystatic admin UI so Zarah can self-edit promotions, services, tiles, reviews
- Deploy free; keep current `.ca` domain
- Bilingual EN/FR (EN-first; FR fields fall back to EN with a polite notice)

## The practice

Sole practitioner Zarah Bellamy (RMT). Studio is a single room in a heritage Tudor manor (~1840) at 2229 Hawarden, Montréal, surrounded by greenery. Photos in `reference/google-reviews-photos/` show the boho/zen interior — macramé, salt lamp, Asian fan, Buddha statues, antique wooden dresser — and the lush exterior with lilac trees.

**Content voice**: first-person, warm, inclusive ("every body in every shape, size, age, and ability"), unhurried.

## Architecture

The site is split across two free hosts. The build target is selected by the `DEPLOY_TARGET` env var.

| `DEPLOY_TARGET` | Adapter | Output | Admin? | Used by |
|---|---|---|---|---|
| `cloudflare` | none (pure static) | `dist/` | no | Cloudflare Pages — public site |
| `vercel` | `@astrojs/vercel` | server (SSR) | yes | Vercel — admin only |
| (unset) | `@astrojs/node` | static | yes | Local dev |

The Cloudflare build deliberately drops the Keystatic integration. Don't try to reintroduce `@astrojs/cloudflare` — its prerender pass runs in miniflare which lacks `node:path`/`node:fs/promises`, and Keystatic's reader needs both.

The Vercel deploy uses `vercel.json` to 307-redirect everything that isn't `/keystatic`, `/api`, `/_astro`, `/_image`, `/favicon.*`, `/robots.txt` back to `https://springmassagetherapy.ca`. **Do not narrow that negative-lookahead** — `/_astro` is required for the admin's hashed bundles.

| File | Purpose |
|---|---|
| `astro.config.mjs` | Selects adapter + integrations from `DEPLOY_TARGET` |
| `vercel.json` | Redirect rule that limits the Vercel deploy to admin paths |
| `keystatic.config.ts` | CMS schema (singletons + collections) and storage selection |
| `src/lib/reader.ts` | Keystatic content reader + Markdoc renderer |
| `src/lib/seo.ts` | Per-page SEO + LocalBusiness JSON-LD |
| `src/lib/i18n.ts` | EN/FR helpers + fallback logic |
| `src/lib/active-window.ts` | Sale/promo date-window logic |
| `src/styles/global.css` | Design tokens — coral, moss, stone palette + Cormorant/Inter/Caveat fonts |
| `src/layouts/BaseLayout.astro` | Header + Footer wrapper |
| `src/components/SiteHeader.astro` | Top info strip + main nav with active states |
| `src/components/SiteFooter.astro` | Three-column footer (about / hours / contact) |
| `src/pages/*.astro` | Home, services, about, promotions, contact, book, reviews, blog/, fr/ |
| `reference/` | Source material — gitignored |

## Auth

Admin auth is via a **GitHub App** (NOT an OAuth App). Keystatic's token validator (in `node_modules/@keystatic/core/dist/keystatic-core-api-generic.node.js` ~line 390) requires `expires_in` and `refresh_token` in the token-exchange response. OAuth Apps don't return those — only GitHub Apps do. If you ever see `401 Authorization failed` with no other context, the App was probably recreated as an OAuth App.

Required env vars on Vercel:
- `DEPLOY_TARGET=vercel`
- `PUBLIC_KEYSTATIC_STORAGE_KIND=github`
- `PUBLIC_KEYSTATIC_REPO_OWNER`
- `PUBLIC_KEYSTATIC_REPO_NAME`
- `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
- `KEYSTATIC_GITHUB_CLIENT_ID`
- `KEYSTATIC_GITHUB_CLIENT_SECRET` (exactly 40 hex chars; trailing whitespace causes silent failure)

See `SETUP.md` for the full GitHub App setup including the install + permission-acceptance steps. See `OPERATIONS.md` for secret rotation.

## Pages

- `/` — Hero + about teaser + featured services + active promotions + CTA strip
- `/services` — Full price list (grouped by `group` field), all services
- `/about` — Zarah bio + studio story + Google Maps embed
- `/promotions` — Cards for every active promotion (within their date window)
- `/contact` — Phone, address, hours
- `/book` — Cal.com embed (gracefully falls back to phone CTA when not configured); `noindex`
- `/reviews` — Curated reviews collection
- `/blog`, `/blog/[slug]` — Blog posts (currently in `src/content/blog/`; not yet exposed in Keystatic schema — see TODO)
- `/fr/*` — French mirror routes
- `/keystatic` — Auto-registered admin UI (Vercel only; absent on Cloudflare build)

## Keystatic schema

- **Singletons**: `home`, `about`, `contactInfo`, `site`
- **Collections**: `services`, `promotions`, `tiles`, `reviews`

Bilingual fields are paired `*En` / `*Fr`. Image fields are shared between languages.

The `services` and `promotions` collections support automatic sale/active windows via `saleStartsAt`/`saleEndsAt` and `startsAt`/`endsAt` — implemented in `src/lib/active-window.ts`. Don't reimplement this logic in templates; call the helper.

## Stack notes

- Node ≥22.16.0 (npm, not pnpm — pnpm only on PATH inside CXM monorepo)
- Astro 6, Tailwind v4 (uses `@tailwindcss/vite`, no postcss config needed)
- Keystatic 0.5 with `@keystatic/astro` (auto-registers `/keystatic` and `/api/keystatic/*` routes — do NOT manually create them)
- The Cloudflare build is **pure static**. Do not introduce SSR-only patterns (e.g. `export const prerender = false`) without confirming the page only ships on the Vercel build.

## Known TODO

- Add Zarah's real photos via the admin
- Cal.com event types
- French translation pass
- Wire a `blog` collection into `keystatic.config.ts` so Zarah can manage posts (currently file-only)
