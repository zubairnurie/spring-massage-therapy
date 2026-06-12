# Spring Massage Therapy — Owner's Guide

A friendly walkthrough for editing your website. **No coding required.** If
something here doesn't make sense, that's a doc bug — let me know.

---

## The big picture

Your website lives at `https://springmassagetherapy.ca`.

Your **admin panel** lives at `https://springmassagetherapy.ca/keystatic`.
Sign in with GitHub (you'll do this once on each device).

Anything you change in the admin saves automatically and appears on the live
site within about a minute.

---

## How to sign in

1. Go to `https://springmassagetherapy.ca/keystatic`
2. Click **"Sign in with GitHub"**
3. Authorize the connection (one-time)
4. You're in

If sign-in stops working, the most likely cause is that you logged out of
GitHub itself. Sign back in at `https://github.com` and try again.

---

## What you can edit, and where

When you open the admin, you'll see two sections in the left sidebar:

### Singletons (one-of-each pages)

| Item | What lives there |
|---|---|
| **Home Page** | Hero text ("Welcome to our..."), the "yellow little castle" story, button labels, hero/story images |
| **About Page** | Your bio, the studio description, your portrait, two studio photos, map address |
| **Contact Info** | Phone, address, hours, social URLs, **Cal.com username**, **Google review URL**, your displayed Google rating + review count |
| **Site Branding** | Logo, favicon, default page description (used for SEO when a page doesn't set its own), social share image (1200×630, used on Facebook/iMessage previews), price range ($$/$$$) |

### Collections (lists of things)

| Item | What lives there |
|---|---|
| **Services** | All your services with names, prices, descriptions, photos, and Cal.com event slugs |
| **Promotions** | Active promotions shown on the homepage and `/promotions` page |
| **Page Tiles** | Custom blocks you can drop on the home/about/services pages (advanced) |
| **Reviews** | Curated client reviews displayed on the homepage carousel and `/reviews` page |

---

## Common tasks — step by step

### Add a new promotion

1. Admin → **Promotions** → **Add new**
2. Fill in:
   - **Title** (English) — used as the heading and URL
   - **Title (FR)** — French version (optional, falls back to English)
   - **Tag** — the small ribbon label (e.g. "Summer Promo", "New Service")
   - **Subtitle** — small caps text under the brand name
   - **Active** — leave checked to show on the site
   - **CTA label** — what the button says ("Call Now")
   - **CTA link** — where the button goes (e.g. `tel:+15793664118`)
   - **Photo** (optional)
   - **Body** — the description, supports basic formatting (bold, italics, links)
3. Click **Save**

It'll appear on the live site within a minute.

To **end a promotion**: open it in the admin, uncheck **Active**, save. It
disappears immediately. You don't need to delete it; you can reactivate it
seasonally.

### Add a new service

1. Admin → **Services** → **Add new**
2. **Service name** — used as the URL handle (e.g. "thai-foot-massage")
3. **Service name (FR)** — display name in French
4. **Price** — free-form text, works best as `$80`, `from $40`, `On request`, etc.
5. **Display order** — lower numbers show first
6. **Featured on homepage** — tick to show in the homepage's 3-card preview
7. **Cal.com event slug** — leave empty if you only want phone bookings
8. **Photo** — optional but really helps the listing pop
9. **Description** — the body text

### Update your Google review count

Every few months, glance at your Google Business Profile to see the real number:

1. Admin → **Contact Info**
2. Find **"Google rating to display"** and **"Google review count to display"**
3. Update them to match Google
4. Save

The homepage and `/reviews` page automatically show "5.0 average from N reviews"
based on what you put here.

### Add a customer review to the website

When someone leaves a great Google/Yelp review you'd love to highlight:

1. Admin → **Reviews** → **Add new**
2. **Reviewer name** — first name + initial works (e.g. "Sarah M.")
3. **Rating** — 1–5
4. **Review date** — when they wrote it
5. **Source** — Google / Yelp / etc.
6. **Featured on homepage** — tick to put it in the homepage carousel
7. **Review text** — paste the review

Reviews are **never auto-translated**. If a French client wrote in French,
keep the original. Both languages can coexist on the page.

### Upload a photo

Inside almost any field labeled "Photo" or "Image":

1. Click the upload icon
2. Either drag-and-drop a file or click to browse
3. The image saves to your project automatically — you don't need to manage
   files anywhere
4. Save the entry

**Tip on photo size**: phones often produce 5MB+ photos. The site will still
work, but mobile visitors will wait longer to load. If you're uploading a lot,
consider using your phone's "small" or "medium" photo option, or a free tool
like [TinyPNG](https://tinypng.com/) to compress first.

### Change your phone number

1. Admin → **Contact Info** → **Phone** → save

This updates the header, footer, contact page, and `tel:` links across the
site. The promotion **"Call Now"** buttons hardcode the phone in their CTA
link — you'd want to also edit each promo's **CTA link** field if you change
your number.

### Set up online booking (Cal.com)

You only do this once. Then services get a "Book →" button on the live site.

1. Sign up free at https://cal.com
2. Pick a username — e.g. `zarah-bellamy`
3. Create one **event type** for each service:
   - Title (e.g. "60-min Full Body Massage — $80")
   - Duration matching your real session length
   - URL slug (e.g. `60min-full-body`)
4. Open admin → **Contact Info** → paste your Cal.com username → save
5. For each service that's bookable online: admin → **Services** → that
   service → paste the matching event slug into **"Cal.com event slug"** → save

The `/book` page picks up automatically. Services with a slug get a
**"Book →"** button; ones without keep their **"Call to book"** fallback.

### Edit hero text on the homepage

Admin → **Home Page** → edit any of:
- **Hero eyebrow** — the small script line ("Welcome to our")
- **Hero title** — the big serif line ("Spring Massage Therapy")
- **Hero subtitle** — the longer italic body
- **Primary CTA** label and link
- **Secondary CTA** label and link

Each has an EN and FR variant. If FR is empty, the French page falls back to
English with a small "Translation coming soon" notice.

### Translate to French

Every translatable field has two boxes side-by-side: `Field — EN` and `Field — FR`.
Fill in the FR side whenever you have time; until then, French visitors see
English with a polite notice.

You don't have to translate everything at once. The site will mix and match
gracefully.

---

## What you should NOT do (yet)

These break the site if done casually. Talk to your developer first:

- **Don't change the URL slug** of an existing service or promotion — it
  breaks any links Google has indexed and any bookmarks clients have
- **Don't delete the placeholder reviews until you've added real ones** —
  the homepage carousel hides if there are zero reviews
- **Don't paste raw HTML into description fields** — Markdoc takes care of
  basic formatting; raw HTML can break the layout

If you ever want to do one of these — ask me first, takes 30 seconds.

---

## Tips for keeping the site fresh

Search engines reward active sites. Easy wins, in order of impact:

1. **Add a monthly promotion** — even a small "Spring deep tissue special"
   signals an active business
2. **Add a new review every couple weeks** when great Google reviews come in
3. **Update your Google rating + review count** quarterly to match Google
4. **Swap the hero photo** seasonally — fall greens, winter snow, spring blooms
5. **Tweak the about page bio** when something changes — new certification,
   new specialty, etc.

---

## When something goes wrong

| Symptom | Likely cause | Fix |
|---|---|---|
| "Save failed" in admin | GitHub session expired | Sign out, sign back in |
| Edit doesn't appear on live site | Build is still running | Wait 1-2 min, refresh |
| Edit STILL doesn't appear | Build failed | Contact your developer |
| Site is down completely | Cloudflare or DNS issue | Contact your developer |
| Photo won't upload | File too big (>10MB) | Compress with TinyPNG or your phone's "smaller size" option |
| Promo card looks wrong | Body has weird characters | Strip the body to plain text and try again |

---

## Who owns what

| Thing | You own | Where |
|---|---|---|
| Domain `springmassagetherapy.ca` | ✅ | Your registrar account |
| Cloudflare account (hosting) | ✅ | https://dash.cloudflare.com |
| GitHub repo (the code) | ✅ | https://github.com |
| Cal.com account | ✅ | https://cal.com |
| Google Business Profile | ✅ | https://business.google.com |
| The site code itself | ✅ | It's your repo |

If you ever need to switch developers, all of the above stays with you.

---

## What I do, what you do

| Task | Who |
|---|---|
| Edit text, photos, prices, promotions, reviews | **You** (admin panel) |
| Add new pages or change layout | **Developer** |
| Upgrade dependencies / fix bugs | **Developer** |
| Domain renewal | **You** (annual) |
| Reply to clients / book sessions | **You** |
| Google Business Profile updates | **You** |
| Refresh the SEO checklist | **You** quarterly (see SEO.md) |

---

## Help

- Stuck on a specific edit → check this guide first
- Site behavior seems wrong → contact your developer
- Want a new feature → describe it in plain English; we'll figure out the
  technical side
