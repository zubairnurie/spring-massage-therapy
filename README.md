# Spring Massage Therapy

A peaceful website for Zarah Bellamy's massage therapy practice in Montréal.
Built with Astro + Keystatic + Tailwind, deployed to Cloudflare Pages.

## Stack

- **Astro 6** — static-first site framework
- **Keystatic** — Git-based CMS (visit `/keystatic` to edit content)
- **Tailwind CSS v4** — styling
- **Cloudflare Pages** — hosting (free tier, planned)
- **Cal.com** — booking (free tier, plug-and-play once configured)

## Local development

```bash
npm install
npm run dev          # site at http://127.0.0.1:4321
                     # admin at http://127.0.0.1:4321/keystatic
```

## How content editing works

Zarah edits content via the Keystatic admin UI at `/keystatic`. Changes commit
to the Git repo, which triggers a Cloudflare Pages rebuild — the live site
updates within ~1 minute (in production). Locally, edits show up instantly.

### Editable content

| Where | What |
|---|---|
| **Singletons → Home Page** | Hero text, story section, CTAs, hero & story images |
| **Singletons → About Page** | Zarah's bio, studio description, portrait + studio photos, map address |
| **Singletons → Contact Info** | Phone, address, hours, social URLs, **Cal.com username** |
| **Singletons → Site Branding** | Logo, favicon |
| **Collections → Services** | Per-service: name, price, photo, description, **Cal.com event slug** |
| **Collections → Promotions** | Per-promo: title, tag, body, photo, CTA, active flag |
| **Collections → Page Tiles** | Custom blocks droppable on Home / About / Services |

## Booking setup (Cal.com)

The booking system is fully wired in code but waits on a Cal.com account.

**One-time setup (~10 minutes):**

1. Sign up free at [cal.com](https://cal.com)
2. Choose a username — e.g. `zarah-bellamy` or `springmassage`
3. Create one **event type** per service. For each, set:
   - Title (e.g. "60 min Full Body Massage — $80")
   - Duration (matching the service)
   - URL slug (e.g. `60min-full-body`)
4. In **Keystatic → Contact Info**, paste the username into "Cal.com username"
5. In **Keystatic → Services**, for each service paste the matching slug into "Cal.com event slug"
6. Save. The `/book` page now shows the embedded calendar; `/services` shows per-service "Book →" buttons

**Until configured:** the site shows graceful fallbacks ("Online booking is being set up — please call") so it remains usable.

## Project structure

```
src/
  components/        SiteHeader, SiteFooter
  content/           Markdown/YAML content (managed by Keystatic)
    home/            Home page singleton
    about/           About page singleton
    contact-info/    Contact info singleton
    site/            Site branding (logo/favicon) singleton
    services/        Services collection (one .mdoc per service)
    promotions/      Promotions collection
    tiles/           Page tiles collection
  layouts/           BaseLayout
  lib/reader.ts      Keystatic content reader + Markdoc renderer
  pages/             Route files (index, services, about, promotions, contact, book)
  styles/global.css  Design tokens (palette, fonts, spacing)
public/
  images/            Static images uploaded via Keystatic land here
keystatic.config.ts  CMS schema
reference/           Design references — gitignored
```

## Design tokens

See `src/styles/global.css`:

- **Coral** (`#ED8569`) — primary CTA, accent
- **Moss green** — leaf accents, logo
- **Stone cream** (`#FAF7F2`) — page background, warm
- **Cormorant Garamond** — serif headings (heritage manor feel)
- **Inter** — body / UI
- **Caveat** — handwritten script accents

## Deployment plan

1. Push to GitHub
2. Connect Cloudflare Pages — build cmd `npm run build`, output `dist/client/`
3. Add custom domain `springmassagetherapy.ca` in Cloudflare dashboard
4. Update DNS to point at Cloudflare (or transfer registrar to Cloudflare for at-cost pricing)
5. Switch Keystatic storage from `local` → `github` (requires GitHub OAuth app) so admin works in production

## Outstanding items

- [ ] Add Zarah's real photos via Keystatic admin
- [ ] Cal.com account + event types
- [ ] French translation pass (site is bilingual EN/FR)
- [ ] GitHub repo + Cloudflare Pages connection
- [ ] Switch Keystatic storage to GitHub mode for production admin

## Practice info

**Zarah Bellamy** — 2229 Hawarden, Montréal, Québec — (579) 366-4118
