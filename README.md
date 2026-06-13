# Spring Massage Therapy

A peaceful website for Zarah Bellamy's massage therapy practice in
Montréal. Astro + Keystatic + Tailwind, hosted free on Cloudflare Pages
(public site) and Vercel (admin).

- **Live site**: https://springmassagetherapy.ca
- **Admin**: `/keystatic` (hosted on Vercel — see SETUP.md)

## Documentation

| Doc | Audience | What's in it |
|---|---|---|
| [SETUP.md](./SETUP.md) | Developer | One-time setup: GitHub repo, Cloudflare Pages, Vercel, GitHub App, custom domain, troubleshooting |
| [OPERATIONS.md](./OPERATIONS.md) | Developer | Day-2 maintenance: rotating secrets, rolling back, Node updates, analytics, team access, backups |
| [TRAINING.md](./TRAINING.md) | Site owner (Zarah) | How to edit content via the admin, in plain English |
| [SEO.md](./SEO.md) | Both | What the code handles automatically and what Zarah needs to do off-site (Google Business Profile, citations, reviews) |
| [AGENTS.md](./AGENTS.md) | AI agents working on the codebase | Project conventions and architecture summary |

## Stack

- **Astro 6** — static-first site framework
- **Keystatic** — Git-based CMS (visit `/keystatic` to edit content)
- **Tailwind CSS v4**
- **Cloudflare Pages** — public site (pure static)
- **Vercel** — admin SSR (`@astrojs/vercel`)
- **GitHub App** — admin auth + commit storage (must be a GitHub App,
  not an OAuth App; see SETUP.md)
- **Cal.com** — booking (free tier)

## Local development

```bash
npm install
npm run dev          # site at http://127.0.0.1:4321
                     # admin at http://127.0.0.1:4321/keystatic
```

Local `DEPLOY_TARGET` is unset → Node adapter, Keystatic admin in `local`
mode (writes directly to disk in `src/content/`). No GitHub auth needed
for local edits.

## Deploy targets

The build is selected at build time by the `DEPLOY_TARGET` env var. See
`astro.config.mjs`.

| `DEPLOY_TARGET` | Output | Used by |
|---|---|---|
| `cloudflare` | Pure static `dist/`, no admin | Cloudflare Pages — public site |
| `vercel` | Astro SSR, admin enabled | Vercel — admin |
| (unset) | Node static + admin | Local dev |

## How content editing works

Zarah edits via Keystatic at `/keystatic`. Saves commit to the GitHub
repo, which triggers Cloudflare Pages and Vercel to rebuild. Public site
updates within ~90 seconds. See `TRAINING.md` for the owner-facing flow.

## Project structure

```
src/
  components/        SiteHeader, SiteFooter
  content/           Markdown/YAML content (managed by Keystatic)
    home/            Home page singleton
    about/           About page singleton
    contact-info/    Contact info singleton
    site/            Site branding singleton
    services/        Services collection
    promotions/      Promotions collection
    tiles/           Page tiles collection
    reviews/         Reviews collection
    blog/            Blog posts (currently file-only; see TODO below)
  layouts/           BaseLayout
  lib/
    reader.ts        Keystatic content reader + Markdoc renderer
    seo.ts           Per-page SEO/JSON-LD helpers
    i18n.ts          EN/FR helpers + fallback logic
    active-window.ts Sale/promo date-window logic
  pages/             Routes (index, services, about, promotions,
                     contact, book, reviews, blog/, fr/, 404)
  styles/global.css  Design tokens (palette, fonts, spacing)
public/
  images/            Static images uploaded via Keystatic land here
keystatic.config.ts  CMS schema
astro.config.mjs     Build target switch
vercel.json          307 redirects everything except admin to public site
reference/           Design references (gitignored)
```

## Design tokens

See `src/styles/global.css`:

- **Coral** (`#ED8569`) — primary CTA, accent
- **Moss green** — leaf accents, logo
- **Stone cream** (`#FAF7F2`) — page background, warm
- **Cormorant Garamond** — serif headings (heritage manor feel)
- **Inter** — body / UI
- **Caveat** — handwritten script accents

## Practice info

**Zarah Bellamy** — 2229 Hawarden, Montréal, Québec — (579) 366-4118

## Outstanding items

- [ ] Add Zarah's real photos via Keystatic admin
- [ ] Cal.com account + event types
- [ ] French translation pass (site is bilingual EN/FR)
- [ ] Blog: posts exist in `src/content/blog/` and routes exist at
      `/blog`, but the Keystatic schema in `keystatic.config.ts` does
      not currently expose a `blog` collection. Add it before Zarah is
      expected to manage posts. <!-- TODO: confirm intent -->
