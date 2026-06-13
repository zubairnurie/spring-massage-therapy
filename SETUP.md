# Production Setup — Spring Massage Therapy

One-time setup to take the site from local-only to live on
`springmassagetherapy.ca`. The code is wired; this doc covers the
account-level + DNS work.

Estimated time end-to-end: **~90 minutes**, mostly waiting on DNS and the
GitHub App's permission acceptance step.

---

## Architecture

We use two free hosts. The public site is pure static on Cloudflare Pages.
The Keystatic admin lives on Vercel because it needs server-side rendering
for the GitHub auth callback.

```
┌────────────────────────────────────────────────────────────┐
│  springmassagetherapy.ca   →  Cloudflare Pages             │
│                                pure static HTML in dist/   │
│                                NO SSR adapter, NO admin    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  spring-massage-therapy.vercel.app   →  Vercel             │
│  (or admin.springmassagetherapy.ca)                        │
│                                Astro SSR (@astrojs/vercel) │
│                                /keystatic admin route      │
│                                /api/keystatic GitHub App   │
│                                  OAuth callback            │
│                                vercel.json 307s every      │
│                                  other path back to        │
│                                  the public site           │
└────────────────────────────────────────────────────────────┘
                  │ commit on save
                  ▼
              GitHub repo  ──► push triggers BOTH deploys
                                ├─ Cloudflare rebuilds public site
                                └─ Vercel rebuilds admin (cosmetic only)
```

### Why two hosts (the actual reasons we discovered)

We tried single-host setups first. Both failed for specific reasons that are
worth recording:

1. **Cloudflare Workers** auto-injects `astro add cloudflare` mid-deploy via
   `wrangler deploy`, which mutates `astro.config.mjs` on the build agent and
   produces a corrupted config. Use **Pages**, not Workers.
2. **Cloudflare Pages with the `@astrojs/cloudflare` adapter** runs Astro's
   prerender pass inside miniflare. miniflare doesn't expose `node:path` or
   `node:fs/promises`. Keystatic's reader (`src/lib/reader.ts`) imports those
   at build-time. Result: build fails with `No such module 'node:path'`. We
   removed the Cloudflare adapter; the public site is **pure static** with no
   adapter at all.
3. **Vercel for everything** would work, but Cloudflare Pages has a better
   free tier, better edge network, and pure-static = nothing to break. Splitting
   is essentially free.

### How `DEPLOY_TARGET` selects the build

`astro.config.mjs` reads `DEPLOY_TARGET` at build time and chooses adapter +
integrations:

| `DEPLOY_TARGET` | Adapter        | Output    | Keystatic admin? | Used by              |
|-----------------|----------------|-----------|------------------|----------------------|
| `cloudflare`    | none           | static    | no               | Cloudflare Pages     |
| `vercel`        | `@astrojs/vercel` | server | yes              | Vercel (admin)       |
| (unset)         | `@astrojs/node`| static    | yes              | Local dev            |

The Cloudflare build deliberately omits the Keystatic integration so the
admin is not exposed publicly and the build doesn't try to load Keystatic's
server code in the static pipeline.

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
4. Skip README / license — repo is initialized from local
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
2. **Create application** → **Pages** tab (NOT Workers) → **Connect to Git**
3. Authorize Cloudflare to read the GitHub repo
4. Select `spring-massage-therapy` → **Begin setup**
5. Configure build:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
     *(NOT `dist/client` — that path only applies when an SSR adapter is
     used. Our Cloudflare build is pure static, so output goes straight
     into `dist/`.)*
   - **Root directory**: `/` (default)
   - **Environment variables**:

     | Name            | Value         |
     |-----------------|---------------|
     | `DEPLOY_TARGET` | `cloudflare`  |
     | `NODE_VERSION`  | `22.16.0`     |

6. **Save and Deploy**
7. Wait ~90 seconds for the first build. You'll get a URL like
   `spring-massage-therapy.pages.dev`. Visit it — site should be live.

> If the build fails with `No such module 'node:path'`, the Cloudflare
> adapter has crept back into `astro.config.mjs`. Remove
> `@astrojs/cloudflare` from imports and from the adapter selection — the
> Cloudflare branch must be pure static (no adapter).

---

## Phase 3 — Vercel (admin, 20 min)

This is where the `/keystatic` admin lives.

### 3a. Create the Vercel project

1. Sign in to https://vercel.com with GitHub
2. **Add New** → **Project** → import `spring-massage-therapy`
3. **Framework Preset**: Astro (auto-detected)
4. Expand **Environment Variables** and add (Production):

   | Name                              | Value                          |
   |-----------------------------------|--------------------------------|
   | `DEPLOY_TARGET`                   | `vercel`                       |
   | `PUBLIC_KEYSTATIC_STORAGE_KIND`   | `github`                       |
   | `PUBLIC_KEYSTATIC_REPO_OWNER`     | `<your-github-username>`       |
   | `PUBLIC_KEYSTATIC_REPO_NAME`     | `spring-massage-therapy`        |

   Leave the GitHub App secrets out for now — they're added in Phase 4 once
   the app exists.

5. **Deploy**. Wait ~90 seconds. You'll get a URL like
   `spring-massage-therapy.vercel.app`. Note it down.

> The root URL `/` will redirect (307) to the public Cloudflare site —
> that's the `vercel.json` rule. Only `/keystatic`, `/api`, `/_astro`,
> `/_image`, `/favicon.*` and `/robots.txt` are kept on Vercel.

### 3b. Verify the redirect rule

Open `vercel.json`. It must look like this:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/((?!keystatic|api|_astro|_image|favicon\\.|robots\\.txt).*)",
      "destination": "https://springmassagetherapy.ca/$1",
      "permanent": false
    }
  ]
}
```

> **Critical**: `_astro` MUST be in the negative-lookahead. Keystatic's
> admin loads its hashed JS/CSS bundles from `/_astro/...`. If those are
> redirected to the public site you'll see CORS errors and "Module source
> URI is not allowed" messages, and the admin will silently fail to
> hydrate.

---

## Phase 4 — GitHub App (NOT OAuth App, 25 min)

> **Read this first.** Keystatic uses GitHub for storage and for admin
> auth. There are two kinds of GitHub integrations: **OAuth Apps** and
> **GitHub Apps**. They are different things. Keystatic's token validator
> (in `node_modules/@keystatic/core/dist/keystatic-core-api-generic.node.js`,
> roughly line 390) strictly requires the token-exchange response to
> contain `access_token`, `expires_in`, `refresh_token`,
> `refresh_token_expires_in`, `scope`, and `token_type: 'bearer'`.
>
> **OAuth Apps don't return `expires_in` or `refresh_token`.** Only
> **GitHub Apps** do. If you use an OAuth App, Keystatic returns a generic
> `401 Authorization failed` with no further context, and you will spend
> a day debugging.

### 4a. Create the GitHub App

1. Go to **https://github.com/settings/apps** (NOT
   `https://github.com/settings/developers`, which is OAuth Apps).
2. Click **New GitHub App**.
3. Fill in:

   | Field | Value |
   |---|---|
   | **GitHub App name** | `Spring Massage Therapy CMS` (must be globally unique on GitHub — append your username if needed) |
   | **Homepage URL** | `https://spring-massage-therapy.vercel.app` (or `https://admin.springmassagetherapy.ca` once the custom subdomain exists) |
   | **Callback URL** | `<homepage>/api/keystatic/github/oauth/callback` |
   | **Request user authorization (OAuth) during installation** | **Enabled** (checkbox) |
   | **Webhook → Active** | **Disabled** (uncheck) |
   | **Where can this GitHub App be installed?** | **Only on this account** |

4. **Permissions** (scroll down, "Repository permissions" section):

   | Permission | Access |
   |---|---|
   | Contents | **Read and write** |
   | Metadata | Read-only (auto-set) |
   | Pull requests | Read and write |

   Without `Contents: Read and write`, save commits will fail with
   "GitHub App is unable to commit to the repository".

5. **Create GitHub App**.

### 4b. Copy the Client ID and generate a Client Secret

On the App settings page that appears after creation:

1. **Client ID** is visible at the top — copy it.
   - Modern GitHub App client IDs start with `Iv2.` or `Ov2`. Older docs
     may show `Iv1.` — both still work but new apps will be `Iv2.`/`Ov2`.
2. **Generate a new client secret** → copy it immediately.
   - Should be **exactly 40 hex characters**. If you paste it into your env
     var manager and the field is 41 chars, you have a stray newline or
     space. **Re-paste cleanly.** A trailing whitespace causes
     `incorrect_client_credentials` from GitHub with no other diagnostics.

### 4c. Install the App on the repo

Creating the App is not enough. It must be **installed** on the repo:

1. Same App settings page → **Install App** in the left sidebar
2. Click **Install** next to your account
3. **Only select repositories** → choose `spring-massage-therapy`
4. **Install**

If you skip this step, Keystatic shows "Repo not found" after sign-in.

### 4d. Add the GitHub App secrets to Vercel

Vercel project → **Settings** → **Environment Variables** → add (Production):

| Name | Value |
|---|---|
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | The slug from the App's URL (e.g. for `https://github.com/apps/spring-massage-therapy-cms` the slug is `spring-massage-therapy-cms`) |
| `KEYSTATIC_GITHUB_CLIENT_ID` | From step 4b |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | From step 4b — exactly 40 chars, no whitespace |

> The variable name is `KEYSTATIC_GITHUB_CLIENT_SECRET`. Not
> `KEYSTATIC_SECRET`. Not `GITHUB_CLIENT_SECRET`. Keystatic's API throws
> `Missing required config: clientSecret` if it can't find this exact name.

Then **Deployments → Redeploy** the latest deployment so it picks up the
new env vars.

### 4e. Re-accept permissions (if you change anything later)

If you ever modify the App's permissions (e.g. add Pull Requests later),
GitHub will not apply them to the existing installation until you accept
them:

1. Go to **https://github.com/settings/installations**
2. Find the app → **Configure**
3. There will be a banner near the top: "Review request" — click and
   approve
4. Without this step, you'll see "GitHub App unable to commit" even though
   the App settings page shows the new permission

### 4f. Test the admin

1. Visit `https://spring-massage-therapy.vercel.app/keystatic`
2. Click **Sign in with GitHub** → authorize
3. Edit a service → **Save**
4. Watch the GitHub repo — a new commit should appear within seconds
5. Cloudflare Pages auto-rebuilds (~90 s). The change is live on the
   public site.

If Zarah is the owner, **add her as a collaborator** on the GitHub repo so
she can authenticate to the admin under her own account.

---

## Phase 5 — Custom domain (20 min + DNS propagation)

### 5a. Public site → Cloudflare

1. Pages dashboard → project → **Custom domains** → **Set up a custom domain**
2. Enter `springmassagetherapy.ca` → **Continue**
3. Cloudflare shows DNS records to add, OR offers to handle DNS
   automatically if the domain is on Cloudflare DNS

Two options:

**Option A — Keep current registrar, just add Cloudflare records**
- Cloudflare gives `CNAME` records to add
- Log in to the registrar, add the records exactly as shown
- Wait 5–60 min for propagation

**Option B — Transfer DNS to Cloudflare** (recommended)
- Cloudflare dashboard → **Add a Site** → enter `springmassagetherapy.ca`
- Free plan
- Cloudflare scans existing DNS, shows the records — verify they match
- Cloudflare gives 2 nameservers (e.g. `xxx.ns.cloudflare.com`)
- Log in to registrar → change nameservers to Cloudflare's
- Wait 1–24 hrs for propagation (usually <2 hrs)

SSL is auto-provisioned within ~15 min of DNS propagation.

### 5b. Admin subdomain → Vercel (optional but nicer)

You can leave the admin at `spring-massage-therapy.vercel.app`, or give it
a subdomain like `admin.springmassagetherapy.ca`.

If using a subdomain:

1. Vercel project → **Settings** → **Domains** → add
   `admin.springmassagetherapy.ca`
2. Vercel shows the CNAME record needed
3. Add it in Cloudflare DNS:
   - Type: `CNAME`
   - Name: `admin`
   - Target: (whatever Vercel shows, e.g. `cname.vercel-dns.com`)
   - Proxy: **OFF** (gray cloud, not orange) — Vercel handles SSL
4. Wait ~5 min for DNS propagation
5. **Update the GitHub App** at https://github.com/settings/apps:
   - Homepage URL → `https://admin.springmassagetherapy.ca`
   - Callback URL →
     `https://admin.springmassagetherapy.ca/api/keystatic/github/oauth/callback`
6. **Update the redirect target in `vercel.json`** if you're keeping the
   public site at the root domain — the rule already redirects to
   `https://springmassagetherapy.ca`, which is what you want.

See `OPERATIONS.md` for the full callback-URL rotation procedure.

---

## Phase 6 — Final config (10 min)

### 6a. Update Site URL in Keystatic

1. Open admin → **Site Branding** → **Site URL** → set to
   `https://springmassagetherapy.ca`
2. Save

This drives canonical URLs, sitemap absolutes, and Open Graph URLs.

### 6b. Submit to Google

See `SEO.md` for the full off-site SEO checklist. The first three things:

1. https://search.google.com/search-console — add property, verify, submit
   sitemap
2. Claim / update Google Business Profile
3. Add Cloudflare Web Analytics drop-in script (see `OPERATIONS.md`)

---

## Phase 7 — Hand off to Zarah (1 hour with her)

Sit with her, walk through:

1. Visit `admin.springmassagetherapy.ca/keystatic` — log in with GitHub,
   edit a promotion, save, watch it go live (~90 s build delay)
2. Show her how to upload an image
3. Show her how to add a new review
4. Walk through `SEO.md` — what to do about Google Business Profile
5. Hand over credentials:
   - GitHub repo ownership
   - Cloudflare account access
   - Vercel account access
   - Domain registrar credentials
   - Cal.com account
6. Add yourself as a collaborator on the repo so you can still help

Tell her about the **90-second delay** between Save and live so she
doesn't think it's broken. Hand her `TRAINING.md`.

---

## Going forward

| Task | Who | Where |
|---|---|---|
| Edit content (text, photos, prices, reviews) | Zarah | `/keystatic` |
| Add a new service or promotion | Zarah | same |
| Code changes / new features | Dev | local repo, push to GitHub |
| Bug fixes / urgent issues | Dev | same |
| Domain renewal | Zarah | annual, via registrar |
| Google Business Profile | Zarah | ongoing |
| Secret/credential rotation | Dev | see `OPERATIONS.md` |

---

## Cost summary

| Item | Cost |
|---|---|
| Cloudflare Pages | $0 |
| Vercel Hobby | $0 |
| GitHub repo | $0 |
| GitHub App | $0 |
| Cloudflare DNS + SSL | $0 |
| Cal.com (free tier) | $0 |
| Domain (`.ca`) | ~$10/yr |

**Total: ~$10/year** — all of which is the domain.

---

## Local development

```bash
npm install
npm run dev          # site at http://127.0.0.1:4321
                     # admin at http://127.0.0.1:4321/keystatic
```

Local `DEPLOY_TARGET` is unset → Node adapter, Keystatic admin in `local`
mode (writes directly to disk in `src/content/`). No GitHub auth needed
for local edits.

---

## Troubleshooting

The errors below all cost real time to figure out. Read the "what it
actually meant" column.

### Build errors

| Error | What it actually meant |
|---|---|
| `Cannot use server-rendered pages without an adapter` (Cloudflare build) | A page in `src/pages/` had `export const prerender = false`. The Cloudflare build is pure static — no SSR pages allowed. We hit this with a temporary `src/pages/api/debug-oauth.ts` endpoint that's since been removed. |
| `No such module 'node:path'` (Cloudflare build) | The `@astrojs/cloudflare` adapter has been re-added to `astro.config.mjs`. The Cloudflare branch must be pure static — no adapter. Remove the import and the adapter selection. |
| `Build output directory not found` (Cloudflare) | Output dir is set to `dist/client`. Change it to `dist`. `dist/client` only applies when an SSR adapter is used; the Cloudflare build has no adapter. |

### Admin / auth errors

| Error | What it actually meant |
|---|---|
| `Missing required config: clientSecret` (500 from `/api/keystatic`) | The env var is named wrong. It must be `KEYSTATIC_GITHUB_CLIENT_SECRET`, not `KEYSTATIC_SECRET` or `GITHUB_CLIENT_SECRET`. |
| `401 Authorization failed` with no other context (after clicking Sign in with GitHub) | Almost certainly **OAuth App vs GitHub App**. You created an OAuth App. Keystatic's token validator demands `expires_in` and `refresh_token` in the token response, which only GitHub Apps return. Recreate as a GitHub App at `https://github.com/settings/apps`. |
| `incorrect_client_credentials` from GitHub | The client secret has a stray newline or space. Re-paste it cleanly — should be exactly 40 hex chars. |
| `Repo not found` after sign-in succeeds | The GitHub App was created but never **installed** on the repo. Settings page → Install App → select repo. |
| `GitHub App is unable to commit to the repository` on Save | The App is missing `Contents: Read and write`, OR you added the permission but the existing installation hasn't accepted the new permission set. Go to `https://github.com/settings/installations` → Configure → review request banner → accept. |
| Console shows "Module source URI is not allowed" / CORS errors when loading `/keystatic` | The `vercel.json` redirect rule is too aggressive and is bouncing `/_astro/*` to the public site. The negative-lookahead must include `_astro`. |
| Admin loads but every save 404s | OAuth callback URL on GitHub doesn't match the actual hosted URL. Check that `Callback URL` on the App matches `<actual-host>/api/keystatic/github/oauth/callback`. |
| `Iv1.` vs `Iv2.` confusion | Old docs sometimes mention `Iv1.`-prefixed client IDs. Modern GitHub Apps use `Iv2.` or `Ov2`. Both work; just don't be alarmed by the prefix. |

---

## Emergency runbook

### The site is down

1. Check **Cloudflare Pages** dashboard — is the latest deploy green?
2. If a deploy is red, click into it, read the build log. Usually a syntax
   error or broken Markdoc. Fix locally, push to `main`.
3. Roll back: Cloudflare Pages → Deployments → last good one →
   **Manage** → **Rollback to this deployment**. Live again in ~30 s.

### The admin is broken

1. Check **Vercel** dashboard → Logs tab. The 500 stack trace is there.
2. Common causes:
   - Env var was deleted / renamed → re-add, redeploy
   - GitHub App callback URL changed → update on the App settings page
   - GitHub revoked the install (rare) → reinstall
3. Workaround: edit content locally with `npm run dev`, push. The push
   triggers a Pages rebuild that goes live like normal.

### Domain issues

Check Cloudflare DNS dashboard. Most "site is down" issues at the DNS
level are propagation delays.

For credential rotation, custom domain changes, Node version bumps,
analytics setup, and adding team members, see `OPERATIONS.md`.
