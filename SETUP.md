# Production Setup — Spring Massage Therapy

This is the one-time setup to take the site from local-only to live on
`springmassagetherapy.ca`. The code is already wired; this doc covers the
account-level + DNS work.

Estimated time end-to-end: **~90 minutes**, mostly waiting on DNS propagation.

---

## Architecture

We use two free hosts, one for the public site and one for the CMS admin:

```
┌────────────────────────────────────────────────────────────┐
│  springmassagetherapy.ca   →  Cloudflare Pages             │
│                                pure static HTML in dist/   │
│                                no server runtime           │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  admin.springmassagetherapy.ca   →  Vercel                 │
│  (or spring-massage-therapy.vercel.app)                    │
│                                Astro SSR                   │
│                                Keystatic admin route       │
│                                /api/keystatic GitHub OAuth │
└────────────────────────────────────────────────────────────┘
                  │ commit on save
                  ▼
              GitHub repo  ──► push triggers Pages rebuild ──► public site updates
```

**Why two hosts?** Keystatic's admin needs server-side rendering (SSR) to handle
the GitHub OAuth callback and form submission. Cloudflare Pages is best for the
static public site. Vercel handles Astro+Keystatic SSR cleanly on its free tier.
The split keeps both free and avoids fighting either platform's runtime.

The build target is selected by the `DEPLOY_TARGET` env var
(see `astro.config.mjs`):

| `DEPLOY_TARGET` | Output | Use case |
|---|---|---|
| `cloudflare` | Pure static `dist/` | Cloudflare Pages — public site |
| `vercel` | Astro SSR | Vercel — admin |
| (unset) | Node SSR + admin | Local dev (`npm run dev`) |

---

## Prerequisites

- A GitHub account (Zarah's, ideally — she's the long-term owner)
- A Cloudflare account (free)
- A Vercel account (free, sign in with GitHub)
- Access to her domain registrar to update DNS for `springmassagetherapy.ca`

---

## Phase 1 — GitHub repository (10 min)

1. Sign in to https://github.com → click **+ → New repository**
2. **Name**: `spring-massage-therapy`
3. **Visibility**: Private is fine
4. Skip README/license — repo is initialized from local
5. From the project root, push:

   ```bash
   cd ~/Documents/spring-massage
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin git@github.com:<your-username>/spring-massage-therapy.git
   git push -u origin main
   ```

6. Verify the push at `https://github.com/<your-username>/spring-massage-therapy`

---

## Phase 2 — Cloudflare Pages (public site, 15 min)

1. Sign in to https://dash.cloudflare.com → **Workers & Pages**
2. Click **Create application** → **Pages** tab (NOT Workers) → **Connect to Git**
3. Authorize Cloudflare to read your GitHub repo
4. Select `spring-massage-therapy` → **Begin setup**
5. Configure build:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`  *(not `dist/client` — pure static)*
   - **Root directory**: `/` (default)
   - **Environment variables** (click "Add variable"):
     - `DEPLOY_TARGET` = `cloudflare`
     - `NODE_VERSION` = `22.16.0`
6. Click **Save and Deploy**
7. Wait ~90 seconds for the first build. You'll get a URL like
   `spring-massage-therapy.pages.dev`. Visit it — site should be live.

> **Why Pages, not Workers?** We tried Workers first and hit two issues:
> Cloudflare's Workers deploy flow runs `wrangler deploy`, which auto-injects
> `astro add cloudflare` mid-deploy and breaks `astro.config.mjs`. And the
> Cloudflare adapter's prerender pass runs inside miniflare, which doesn't
> expose `node:path`/`node:fs/promises` — Keystatic's reader needs them.
> Pages with pure-static output side-steps both issues.

---

## Phase 3 — Vercel (admin, 20 min)

This is where Zarah's `/keystatic` admin lives.

### 3a. Create the Vercel project

1. Sign in to https://vercel.com with GitHub
2. **Add New** → **Project** → import the `spring-massage-therapy` repo
3. **Framework Preset**: Astro (auto-detected)
4. Expand **Environment Variables** and add (Production):

   | Name | Value |
   |---|---|
   | `DEPLOY_TARGET` | `vercel` |
   | `PUBLIC_KEYSTATIC_STORAGE_KIND` | `github` |
   | `PUBLIC_KEYSTATIC_REPO_OWNER` | `<your-github-username>` |
   | `PUBLIC_KEYSTATIC_REPO_NAME` | `spring-massage-therapy` |

5. Click **Deploy**. Wait ~90 seconds. You'll get a URL like
   `spring-massage-therapy.vercel.app`.

> **Note**: Visiting the Vercel URL's root will redirect to the public
> Cloudflare site — that's intentional (`vercel.json` 307-redirects everything
> except `/keystatic` and `/api/keystatic` and `/_astro` so the Vercel deploy
> is admin-only).

### 3b. Create a GitHub OAuth App

1. Go to https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name**: `Spring Massage Therapy CMS`
   - **Homepage URL**: the Vercel URL (`https://spring-massage-therapy.vercel.app`)
   - **Authorization callback URL**: same URL + `/api/keystatic/github/oauth/callback`
     (e.g. `https://spring-massage-therapy.vercel.app/api/keystatic/github/oauth/callback`)
3. **Register application**
4. On the resulting page:
   - Copy the **Client ID** (visible)
   - Click **Generate a new client secret** → copy it (you can't see it again)

### 3c. Add OAuth secrets to Vercel

1. Vercel project → **Settings** → **Environment Variables**
2. Add (Production):

   | Name | Value |
   |---|---|
   | `KEYSTATIC_GITHUB_CLIENT_ID` | (from 3b) |
   | `KEYSTATIC_GITHUB_CLIENT_SECRET` | (from 3b) |

   > **Important**: the var name is `KEYSTATIC_GITHUB_CLIENT_SECRET` — not
   > `KEYSTATIC_SECRET`. The Keystatic API will throw a 500 with
   > "Missing required config" if it's named wrong.

3. **Deployments** → **Redeploy** the latest one (so it picks up the new env vars)

### 3d. Test the admin

1. Visit `https://spring-massage-therapy.vercel.app/keystatic`
2. Click **Sign in with GitHub** → authorize the OAuth app
3. Edit a service or promotion → **Save**
4. Watch the GitHub repo — a new commit should appear within seconds
5. Cloudflare Pages auto-rebuilds (~90 sec) — the change goes live on the public site

If Zarah is the owner, **add her as a collaborator** on the GitHub repo so she
can authenticate to the admin.

---

## Phase 4 — Custom domain (20 min + DNS propagation)

### 4a. Public site → Cloudflare

1. Pages dashboard → your project → **Custom domains** → **Set up a custom domain**
2. Enter `springmassagetherapy.ca` → **Continue**
3. Cloudflare will show DNS records to add OR offer to handle it automatically
   if the domain is on Cloudflare DNS

You have two options:

**Option A — Keep current registrar, just add Cloudflare records**
- Cloudflare gives you `CNAME` records to add
- Log in to her current registrar, add the records exactly as shown
- Wait 5–60 min for propagation

**Option B — Transfer DNS to Cloudflare** (cheaper, faster, recommended)
- Cloudflare dashboard → **Add a Site** → enter `springmassagetherapy.ca`
- Choose Free plan
- Cloudflare scans existing DNS, shows you the records — verify they match
- Cloudflare gives you 2 nameservers (e.g. `xxx.ns.cloudflare.com`)
- Log in to her current registrar → change nameservers to Cloudflare's
- Wait 1–24 hrs for propagation (usually <2 hrs)

SSL is auto-provisioned within ~15 min of DNS propagation.

### 4b. Admin subdomain → Vercel (optional but nicer)

You can leave the admin at `spring-massage-therapy.vercel.app`, or give it a
subdomain like `admin.springmassagetherapy.ca`.

If using a subdomain:

1. Vercel project → **Settings** → **Domains** → add `admin.springmassagetherapy.ca`
2. Vercel will show the CNAME record needed
3. Add it in Cloudflare DNS:
   - Type: `CNAME`
   - Name: `admin`
   - Target: (whatever Vercel shows, e.g. `cname.vercel-dns.com`)
   - Proxy: **OFF** (gray cloud, not orange) — Vercel handles SSL
4. Wait for DNS propagation (~5 min)
5. **Update the GitHub OAuth app** (https://github.com/settings/developers):
   - Homepage URL → `https://admin.springmassagetherapy.ca`
   - Callback URL → `https://admin.springmassagetherapy.ca/api/keystatic/github/oauth/callback`

---

## Phase 5 — Final config (10 min)

### 5a. Update site URL

In Keystatic admin (now on `admin.springmassagetherapy.ca`):

1. **Site Branding** → set **Site URL** to `https://springmassagetherapy.ca`
2. Save

This updates canonical URLs, sitemap, and Open Graph absolute URLs.

### 5b. Submit to Google

See `SEO.md` for the full off-site SEO checklist. The first three things to do:

1. https://search.google.com/search-console — add property, verify, submit sitemap
2. Claim/update Google Business Profile
3. Add Cloudflare Web Analytics drop-in script (free, no cookies, GDPR-clean)

---

## Phase 6 — Hand off to Zarah (1 hour with her)

Sit with her and walk through:

1. **Visit `admin.springmassagetherapy.ca`** — log in with GitHub, edit one
   promotion, save, watch it go live (~90 sec build delay)
2. **Show her** how to upload an image (services, hero, about photos)
3. **Show her** how to add a new review
4. **Walk through** SEO.md — what to do about Google Business Profile
5. **Hand over the credentials**:
   - GitHub repo ownership
   - Cloudflare account access
   - Vercel account access
   - Domain registrar credentials
   - Cal.com account (when she creates her own)
6. **Add yourself** as a collaborator on the repo so you can still help

Tell her about the **90-second delay** between save and live so she doesn't
think it's broken.

---

## Going forward

| Task | Who | Where |
|---|---|---|
| Edit content (text, photos, prices, reviews) | Zarah | `admin.springmassagetherapy.ca/keystatic` |
| Add a new service or promotion | Zarah | same |
| Code changes / new features | You | local repo, push to GitHub |
| Bug fixes / urgent issues | You | same |
| Domain renewal | Zarah | annual, via registrar |
| Google Business Profile | Zarah | ongoing |

---

## Cost summary

| Item | Cost |
|---|---|
| Cloudflare Pages | $0 |
| Vercel Hobby | $0 |
| GitHub repo | $0 |
| Cloudflare DNS + SSL | $0 |
| Cal.com (free tier) | $0 |
| Domain (.ca) | ~$10/yr |

**Total: ~$10/year** — all of which is the domain.

---

## Emergency runbook

### The site is down

1. **Check Cloudflare Pages dashboard** — is the latest deploy green?
2. **If a deploy is red**: click into it, read the build log. Usually a syntax
   error or broken Markdoc. Fix locally, push to `main`.
3. **Roll back**: Cloudflare Pages → Deployments → find the last good one →
   **Manage** → **Rollback to this deployment**. Live again in 30s.

### The admin is broken

1. **Check Vercel dashboard** → Logs tab. The 500 stack trace will be there.
2. **Most common causes**:
   - Env var was deleted/renamed → re-add it, redeploy
   - GitHub OAuth app callback URL changed → update it on GitHub
   - GitHub revoked the OAuth grant (rare) → user re-authorizes
3. **Workaround**: edit content locally with `npm run dev`, push.
   The push triggers a Pages rebuild that goes live like normal.

### Domain issues

Check Cloudflare DNS dashboard. Most "site is down" issues at the DNS level
are propagation delays.

---

## Local development

```bash
npm install
npm run dev          # site at http://127.0.0.1:4321
                     # admin at http://127.0.0.1:4321/keystatic
```

Local `DEPLOY_TARGET` is unset → Node adapter, Keystatic admin in `local`
mode (writes directly to disk). No GitHub auth needed for local edits.

---

## Why this architecture

**Public site on Cloudflare Pages**: best CDN, generous free tier, pure
static = nothing to break.

**Admin on Vercel**: Astro+Keystatic SSR works out of the box on Vercel's
free tier. Doesn't fight Cloudflare's Workers runtime.

**Both build from the same repo**: every push to `main` triggers both
deploys. The Cloudflare deploy serves the *prerendered* HTML; the Vercel
deploy hosts the live admin that *writes* the content.

The only "weird" thing is Vercel rebuilds on every push even though only
the admin route is used — wasted compute, but it's free. If this ever
becomes a problem, we can split into two repos or use Vercel's path-filter
to only build when `keystatic.config.ts` or `src/lib/reader.ts` changes.
