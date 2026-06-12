# Production Setup — Spring Massage Therapy

This is the one-time setup to take the site from local-only to live on
`springmassagetherapy.ca`. Everything code-wise is already wired; this doc
covers the account-level + DNS work.

Estimated time end-to-end: **~90 minutes**, mostly waiting on DNS propagation.

---

## Prerequisites

You'll need:

- A GitHub account (Zarah's, ideally — she's the long-term owner)
- A Cloudflare account (free)
- Access to her domain registrar to update DNS for `springmassagetherapy.ca`
- Her phone for verification on Cloudflare

---

## Phase 1 — GitHub repository (10 min)

1. Sign in to https://github.com → click **+ → New repository**
2. **Name**: `spring-massage` (or `spring-massage-therapy`)
3. **Visibility**: Private (public works too, but private is safer for credentials)
4. Skip README/license — repo will be initialized from local
5. From the project root, push:

   ```bash
   cd ~/Documents/spring-massage
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin git@github.com:<your-username>/spring-massage.git
   git push -u origin main
   ```

6. Verify the push worked at `https://github.com/<your-username>/spring-massage`

---

## Phase 2 — Cloudflare Pages (15 min)

1. Sign in to https://dash.cloudflare.com → **Workers & Pages**
2. Click **Create application** → **Pages** → **Connect to Git**
3. Authorize Cloudflare to read your GitHub repo
4. Select `spring-massage` → **Begin setup**
5. Configure build:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist/client`
   - **Root directory**: `/` (default)
   - **Environment variables** (click "Add variable"):
     - `DEPLOY_TARGET` = `cloudflare`
     - `NODE_VERSION` = `22.12.0`
6. Click **Save and Deploy**
7. Wait ~2 minutes for the first build. You'll get a URL like
   `spring-massage.pages.dev`. Visit it — site should be live.

If the build fails, check the build log. Most common cause: the `@astrojs/cloudflare`
adapter requires SSR routes (Keystatic admin) — if it complains about missing env
vars, set them in step 3 of the next phase first, then re-trigger a deploy.

---

## Phase 3 — Keystatic GitHub mode (15 min)

This is what lets Zarah edit content from the live site. Without this, only
local edits work.

### 3a. Create a GitHub OAuth App

1. Go to https://github.com/settings/developers → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name**: `Spring Massage Therapy CMS`
   - **Homepage URL**: `https://springmassagetherapy.ca` (or your `*.pages.dev` URL for now)
   - **Authorization callback URL**: `https://springmassagetherapy.ca/api/keystatic/github/oauth/callback`
3. Click **Register application**
4. On the resulting page:
   - Copy the **Client ID**
   - Click **Generate a new client secret**, copy that too — you can't see it again

### 3b. Add secrets to Cloudflare Pages

1. In Cloudflare Pages dashboard → your project → **Settings** → **Environment variables**
2. Add (for **Production** environment):
   - `PUBLIC_KEYSTATIC_STORAGE_KIND` = `github`
   - `PUBLIC_KEYSTATIC_REPO_OWNER` = `<your-github-username-or-org>`
   - `PUBLIC_KEYSTATIC_REPO_NAME` = `spring-massage`
   - `KEYSTATIC_GITHUB_CLIENT_ID` = `<paste from 3a>`
   - `KEYSTATIC_SECRET` = `<paste from 3a>`
3. Trigger a redeploy: **Deployments** → **Retry deployment** on the latest

> **Note on the `PUBLIC_` prefix**: the storage-kind, repo owner, and repo
> name need to be visible to the browser (Keystatic's admin UI is React-based
> and runs client-side). Astro/Vite only exposes env vars prefixed with
> `PUBLIC_` to the browser. The Client ID and Secret stay server-side
> (no prefix) — they're used during the OAuth callback handler.

### 3c. Test the admin

1. Visit `https://your-site.pages.dev/keystatic`
2. Click **Sign in with GitHub** → authorize
3. Try editing a service or promotion → click **Save**
4. Watch the GitHub repo — a new commit should appear within seconds
5. Cloudflare Pages auto-rebuilds (~2 min) — the change goes live

If Zarah is the owner, **add her as a collaborator** on the GitHub repo so she
can authenticate to the admin.

---

## Phase 4 — Custom domain (20 min + propagation)

### 4a. Add the domain in Cloudflare Pages

1. Pages dashboard → your project → **Custom domains** → **Set up a custom domain**
2. Enter `springmassagetherapy.ca` → **Continue**
3. Cloudflare will show DNS records to add OR offer to handle it automatically
   if the domain is on Cloudflare DNS

### 4b. Point DNS at Cloudflare

You have two options. Option B is recommended.

**Option A — Keep current registrar, just add Cloudflare records**
- Cloudflare gives you `CNAME` records to add
- Log in to her current registrar (Namecheap, GoDaddy, etc.)
- Add the records exactly as shown
- Wait 5–60 min for propagation

**Option B — Transfer DNS to Cloudflare** (cheaper, faster, recommended)
- Cloudflare dashboard → **Add a Site** → enter `springmassagetherapy.ca`
- Choose Free plan
- Cloudflare scans existing DNS and shows you the records — verify they match
- Cloudflare gives you 2 nameservers (e.g. `xxx.ns.cloudflare.com`)
- Log in to her current registrar → change nameservers to Cloudflare's
- Wait 1–24 hrs for propagation (usually <2 hrs)
- Domain transfer registration is optional but saves $5-10/yr

### 4c. SSL

- Cloudflare auto-provisions a free Let's Encrypt SSL cert within ~15 min of DNS propagation
- Site will be accessible at `https://springmassagetherapy.ca`
- The `www.` subdomain is auto-redirected to apex (or vice versa) — Cloudflare picks for you

---

## Phase 5 — Final config (10 min)

### 5a. Update site URL

In Keystatic admin (now on the live site):
1. **Site Branding** → set **Site URL** to `https://springmassagetherapy.ca`
2. Save

This updates canonical URLs, sitemap, and Open Graph absolute URLs.

### 5b. Update GitHub OAuth callback

Now that the real domain is live:
1. https://github.com/settings/developers → your OAuth app → **Update**
2. Change **Homepage URL** to `https://springmassagetherapy.ca`
3. Change **Authorization callback URL** to
   `https://springmassagetherapy.ca/api/keystatic/github/oauth/callback`
4. Save

### 5c. Submit to Google

See `SEO.md` for the full off-site SEO checklist. The first three things to do:

1. https://search.google.com/search-console — add property, verify, submit sitemap
2. Claim/update Google Business Profile
3. Add Cloudflare Web Analytics drop-in script (free, no cookies, GDPR-clean)

---

## Phase 6 — Hand off to Zarah (1 hour with her)

Sit with her and walk through:

1. **`/keystatic`** — log in with GitHub, edit one promotion, save, watch it go live
2. **Show her** how to upload an image (services, hero, about photos)
3. **Show her** how to add a new review
4. **Walk through** SEO.md — what to do about Google Business Profile
5. **Hand over the credentials**:
   - GitHub repo ownership
   - Cloudflare account access
   - Domain registrar credentials
   - Cal.com account (when she creates her own)
6. **Add yourself** as a collaborator on the repo so you can still help

---

## Going forward

| Task | Who | Where |
|---|---|---|
| Edit content (text, photos, prices, reviews) | Zarah | `/keystatic` |
| Add a new service or promotion | Zarah | `/keystatic` |
| Code changes / new features | You | local repo, push to GitHub |
| Bug fixes / urgent issues | You | same |
| Domain renewal | Zarah | annual, via registrar |
| Google Business Profile | Zarah | ongoing |

---

## Emergency runbook

If the site is down:

1. **Check Cloudflare Pages dashboard** — is the latest deploy green?
2. **If a deploy is red**: click into it, read the build log. Usually a syntax
   error or broken Markdoc. Fix locally, push to `main`.
3. **Roll back**: in Cloudflare Pages → Deployments → find the last good one →
   **Manage** → **Rollback to this deployment**. Site is live again in 30s.
4. **If admin is broken**: login locally with `npm run dev` and edit content
   directly. The next push will sync.
5. **Domain issues**: check Cloudflare DNS dashboard. Most "site is down"
   issues at the DNS level are propagation delays.

---

## Phase 0 — If Cloudflare adapter has issues

The Cloudflare + React + Workers SSR runtime has occasional friction. We
already handle this by routing prod through the Cloudflare adapter and dev
through Node. If a build fails specifically with `module is not defined`
errors during `prerendering`:

- The `@astrojs/cloudflare` adapter is incompatible with that specific
  build path; switch to **Cloudflare Workers Sites** mode in the Pages
  settings, or fall back to deploying as pure static (`output: 'static'`,
  no adapter) and host the Keystatic admin separately.

This shouldn't happen with the current config but flagging it because we
hit it during initial setup.
