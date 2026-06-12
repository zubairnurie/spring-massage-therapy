---
name: Spring Massage Therapy
description: Recreating springmassagetherapy.ca for friend Zarah Bellamy as a gift
---

# Spring Massage Therapy

Astro + Keystatic + Tailwind site for Zarah Bellamy's solo massage therapy practice in Montréal.

## Project goals

- Recreate the existing WordPress site faithfully (calming, intimate, heritage-manor feel — NOT corporate spa)
- Provide a Keystatic admin UI so Zarah can self-edit promotions, services, and tiles
- Deploy free on Cloudflare Pages, keep current `.ca` domain
- Bilingual EN/FR (currently EN only — FR pass TBD)

## The practice

Sole practitioner Zarah Bellamy (RMT). Studio is a single room in a heritage Tudor manor (~1840) at 2229 Hawarden, Montréal, surrounded by greenery. Photos in `reference/google-reviews-photos/` show the boho/zen interior — macramé, salt lamp, Asian fan, Buddha statues, antique wooden dresser — and the lush exterior with lilac trees.

**Content voice**: first-person, warm, inclusive ("every body in every shape, size, age, and ability"), unhurried.

## Architecture

| File | Purpose |
|---|---|
| `astro.config.mjs` | React + Markdoc + Keystatic + Cloudflare adapter, SSR |
| `keystatic.config.ts` | CMS schema (singletons: home, contactInfo; collections: services, promotions, tiles) |
| `src/styles/global.css` | Design tokens — coral, moss, stone palette + Cormorant/Inter/Caveat fonts |
| `src/layouts/BaseLayout.astro` | Header + Footer wrapper |
| `src/components/SiteHeader.astro` | Top info strip + main nav with active states |
| `src/components/SiteFooter.astro` | Three-column footer (about / hours / contact) |
| `src/pages/*.astro` | Home, services, about, promotions, contact, book |
| `reference/` | Source material — gitignored. PDFs of original site + photos |

## Pages

- `/` — Hero + about teaser + featured services + promotions + CTA strip
- `/services` — Full price list table, all 10+ services
- `/about` — Zarah bio + studio story + Google Maps embed
- `/promotions` — Three current summer 2026 promos (deep tissue, hot stones, package of 5)
- `/contact` — Phone, address, hours
- `/book` — Calendly placeholder (currently shows phone CTA)
- `/keystatic` — Auto-registered admin UI (local mode while developing)

## Keystatic schema

- **Singletons**: `home` (hero text/CTAs), `contactInfo` (phone, address, hours, social)
- **Collections**:
  - `services` — name, price, order, featured flag, markdoc description
  - `promotions` — title, tag, subtitle, active flag, CTA, markdoc body
  - `tiles` — custom blocks Zarah can drop on home/about/services with image + body

Currently the page templates have hardcoded content for visual development — next step is wiring them to read from `src/content/*` collections.

## Deployment plan

1. Push to GitHub repo (not yet created)
2. Connect Cloudflare Pages — build cmd `npm run build`, output `dist/`
3. Add custom domain `springmassagetherapy.ca`
4. For Keystatic admin in production, switch storage to GitHub mode (requires GitHub OAuth app)

## Known TODO

- Wire pages to read from Keystatic collections (currently hardcoded)
- Add Zarah's real photos to `public/images/`
- Set up Calendly + paste embed
- French translation
- GitHub repo + Cloudflare Pages connection
- Switch Keystatic storage from `local` to `github` for prod admin

## Stack notes

- Node ≥22.12 (npm, not pnpm — pnpm only on PATH inside CXM monorepo)
- Astro 6, Tailwind v4 (uses `@tailwindcss/vite`, no postcss config needed)
- Keystatic 0.5 with `@keystatic/astro` (auto-registers `/keystatic` and `/api/keystatic/*` routes — do NOT manually create them)
- Cloudflare adapter requires SSR (`output: 'server'`)
