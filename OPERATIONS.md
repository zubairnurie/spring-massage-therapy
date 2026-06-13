# Operations — Spring Massage Therapy

Day-2 maintenance reference. `SETUP.md` covers the one-time install;
this doc covers the things you'll need to do periodically or in
response to specific events.

---

## Rotating the GitHub App client secret

Do this if the secret leaks, or annually as hygiene.

1. Go to **https://github.com/settings/apps** → click the
   `Spring Massage Therapy CMS` app
2. Scroll to **Client secrets** → **Generate a new client secret**
3. Copy the new secret (40 hex chars). Verify length — paste into a text
   editor and count if unsure. Trailing whitespace = silent auth failure.
4. Vercel → project → **Settings → Environment Variables**
5. Edit `KEYSTATIC_GITHUB_CLIENT_SECRET` → paste the new value → save
6. **Deployments → Redeploy** the latest production deployment
7. Test sign-in at the admin URL once the redeploy is green
8. Once the new secret works, **delete the old client secret** on the
   GitHub App settings page

If you forget to delete the old secret, the App keeps both active until
you do — which is fine but defeats the rotation.

---

## Rotating the OAuth callback URL

You'll need this when:
- Adding a custom subdomain like `admin.springmassagetherapy.ca`
- Migrating to a different host
- The Vercel preview URL ever needs to be the production URL

Procedure:

1. **GitHub App settings** → **General**:
   - **Homepage URL** → new URL (e.g. `https://admin.springmassagetherapy.ca`)
   - **Callback URL** → new URL + `/api/keystatic/github/oauth/callback`
   - Save changes
2. **Vercel** → project → **Settings → Domains** → add the new domain
   if it isn't already there; confirm DNS propagation
3. If you're updating `vercel.json`'s redirect destination (e.g. moving
   the public site), commit + push the change
4. Test: open the new admin URL, sign in with GitHub, edit a value, save,
   verify a commit appears on the repo

The previous URL keeps working until you remove it from the App / from
Vercel — so this can be done with overlap.

---

## Rolling back a bad deploy

### Cloudflare Pages (public site)

1. Cloudflare dashboard → **Workers & Pages** → `spring-massage-therapy`
2. **Deployments** tab → find the last known-good deployment
3. **⋯** menu → **Rollback to this deployment**
4. Live in ~30 seconds

This does NOT change the GitHub repo. To make the rollback permanent,
revert the bad commit locally (`git revert <sha>` or edit and recommit)
and push.

### Vercel (admin)

1. Vercel dashboard → project → **Deployments**
2. Find the last known-good deployment
3. **⋯** menu → **Promote to Production**
4. Live in seconds

Same caveat: the GitHub repo is unchanged. Revert via Git for a
permanent fix.

### Reverting via Git (permanent)

```bash
git log --oneline                  # find the bad commit
git revert <sha>                   # creates a new commit that undoes it
git push origin main
```

Both hosts pick up the push and rebuild automatically. This is
preferable to a host-side rollback because it keeps the repo and the
live site in sync.

---

## Updating the Node version

Node should match across local, Cloudflare, and Vercel.

1. Update `engines.node` in `package.json` to the new minimum
2. **Cloudflare Pages** → project → **Settings → Environment Variables**
   → edit `NODE_VERSION` → exact pinned version (e.g. `22.18.0`)
3. **Vercel** → project → **Settings → General → Node.js Version** →
   pick the matching major version. Vercel doesn't accept arbitrary
   patch versions; it offers a list.
4. Push a no-op commit (or wait for the next push) to trigger rebuilds
   on both hosts
5. Verify both deploys go green

Don't update Node and a major dependency in the same commit — if it
breaks, you won't know which caused it.

---

## Enabling Cloudflare Web Analytics

Free, cookie-less, GDPR-clean. Drop-in script.

1. Cloudflare dashboard → **Analytics & Logs → Web Analytics**
2. **Add a site** → enter `springmassagetherapy.ca`
3. Cloudflare gives you a `<script>` snippet — copy it
4. Add the snippet to `src/layouts/BaseLayout.astro`, just before the
   closing `</body>` tag, wrapped so it only loads on production builds
   (don't pollute analytics with local dev visits):

   ```astro
   {import.meta.env.PROD && (
     <script defer src="https://static.cloudflareinsights.com/beacon.min.js"
       data-cf-beacon='{"token": "<your-token-here>"}' />
   )}
   ```

5. Commit + push. Cloudflare Pages rebuilds.
6. Visit the live site once. Within ~5 minutes the dashboard shows the
   first hit.

The same script works for the Vercel admin deploy, but there's no value
in tracking admin traffic — leave it off.

---

## Adding a team member

Three places need access. Add them to all three.

### GitHub repo

1. https://github.com/<owner>/spring-massage-therapy → **Settings →
   Collaborators → Add people**
2. Choose access level:
   - **Write** for someone who'll edit content/code
   - **Admin** only if they need to manage settings / secrets / collaborators
3. They accept the invite from email

### Cloudflare Pages

1. Cloudflare dashboard → top-right account menu → **Members**
2. **Invite** → enter email → choose role (`Member` is enough for
   day-to-day; `Administrator` for full control)
3. Once they accept, they see all Pages projects on this account

### Vercel

1. Vercel dashboard → team settings → **Members**
2. **Invite** → email → role
3. Vercel free tier (Hobby) is single-user. To add a member you'll need
   a Pro team ($20/user/month). For occasional access, share the GitHub
   account credentials securely instead. <!-- TODO: confirm whether to upgrade or share creds -->

### GitHub App

The App was created on Zarah's (or the dev's) GitHub account. Other
team members don't need to interact with it directly; they sign in to
the admin with their own GitHub account, and the App authorizes them as
long as they have access to the repo.

---

## Backups

**The entire site is the GitHub repo.** A full clone is a complete
backup — code, content, images, schema. No separate database. No
external CMS state.

Recommended:
- Push `main` regularly (you do this anyway by saving in Keystatic)
- Periodically clone the repo to a local backup location:

  ```bash
  git clone --mirror git@github.com:<owner>/spring-massage-therapy.git \
    ~/Backups/spring-massage-therapy-$(date +%Y%m%d).git
  ```

- Or rely on GitHub's own redundancy + your local working copy

To restore from a clone, push the mirror back to a fresh GitHub repo,
update the App's repo permissions to point at the new repo, redeploy
both hosts. Total downtime: ~15 minutes.

---

## Domain renewal

`springmassagetherapy.ca` is registered annually at <!-- TODO: confirm registrar -->.

1. The registrar emails Zarah ~30 and ~7 days before expiry
2. Renew within the email link, or via the registrar dashboard
3. Cost is ~$10 CAD/year
4. Set a calendar reminder a week before expiry as a backup

If the domain ever expires accidentally, there's typically a 30-day
grace period to recover it without losing it. Don't panic; renew.

---

## Cal.com credential rotation

If Zarah's Cal.com password leaks, or the account is shared and you
want to lock it down:

1. Sign in at https://cal.com → **Settings → Account → Password**
2. Change password
3. Enable **Two-factor authentication** while you're there
4. The site reads only the public username + event slugs from
   Keystatic, so no credentials live in the repo or env vars — nothing
   else to update

If the Cal.com account is migrated to a different username:
1. Update **Contact Info → Cal.com username** in Keystatic
2. Update each service's **Cal.com event slug** if needed
3. Save

The site will pick up the change on the next rebuild.

---

## Periodic checks

A short list of things worth glancing at every quarter:

| What | Where | Why |
|---|---|---|
| Cloudflare Pages deploys all green | Cloudflare dashboard | Catch silent build failures |
| Vercel deploys all green | Vercel dashboard | Same |
| GitHub App installation still active | https://github.com/settings/installations | Ensure no accidental uninstall |
| Domain expiry date | Registrar | Catch surprise lapses |
| Cloudflare Web Analytics | Dashboard | Spot traffic anomalies |
| `npm outdated` | local | See what's drifted; major bumps need a dev session |
| Lighthouse score | https://pagespeed.web.dev/ | Performance regression check |

---

## Useful one-liners

```bash
# Run a build locally targeting Cloudflare's pure-static config
DEPLOY_TARGET=cloudflare npm run build

# Run a build locally targeting Vercel's SSR config
DEPLOY_TARGET=vercel npm run build

# Find which page introduced a build error fast
npm run build 2>&1 | grep -iE 'error|warn'

# Check that the Cloudflare build actually emits dist/ (not dist/client)
DEPLOY_TARGET=cloudflare npm run build && ls dist/
```

---

## Escalation contacts

<!-- TODO: confirm contacts -->

- **Domain registrar support**: see registrar's contact page
- **Cloudflare support**: free tier is community-only; check
  https://community.cloudflare.com
- **Vercel support**: Hobby tier is community-only; check
  https://vercel.com/help
- **GitHub support**: https://support.github.com (free for App issues)
