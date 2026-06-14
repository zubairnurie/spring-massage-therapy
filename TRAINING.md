# Training Guide — Spring Massage Therapy Website

Hi Zarah. This guide walks you through editing your own website. You don't
need to know any code. Read it once start to finish, then keep it open as a
reference whenever you do something new. There are no dumb questions —
this guide tries to anticipate them.

---

## What this document is

You can change almost anything on `springmassagetherapy.ca` yourself —
prices, text, photos, hours, promotions, reviews — without asking anyone.
This guide explains how.

If you ever feel unsure, slow down and read the relevant section. If
you're still stuck, message Zubair (contact at the bottom). It's better to
ask than to guess.

---

## What you can edit

Everything below is yours to change at any time:

- **Service names, prices, descriptions, photos, and the order they appear in**
- **Sale prices** (with start and end dates so the sale ends automatically)
- **Promotions** that show on the homepage and the Promotions page
- **Hero text and photos** on the homepage (the big top section)
- **The "yellow little castle" story section** on the homepage
- **Hero slideshow images** (you can add several photos that fade between each other)
- **Your bio and the studio description** on the About page
- **Studio photos**
- **Address shown on the map**
- **Phone number**, hours, address, social media links
- **Cal.com booking username** and per-service event slugs
- **Google rating and review count** displayed on the site
- **Client reviews** that appear on the homepage carousel and reviews page
- **Logo, favicon, and the social-share image**
- **Default page description** (the text Google shows under your site in search results)
- **Custom Pages** — make a brand-new page (e.g. "Studio Policies", "Gift Cards", "FAQ") that you can link to from anywhere
- **All of the above in French** as well

---

## What you cannot edit (these need a developer)

- The visual layout of the pages
- Adding new pages or new sections to existing pages
- Colours, fonts, spacing
- Anything code-related

If you want one of these changed, message Zubair and describe what you'd
like in plain English.

---

## Important words to know (one-page glossary)

You'll bump into these. They're explained in plain English here so you
don't have to look them up later.

- **Admin / admin panel** — the page where you edit your site:
  `springmassagetherapy.ca/keystatic`. Only you can sign in.
- **Save** — clicking the green Save button stores your change.
- **Deploy / build** — the website re-builds itself with your new content
  after you save. Takes about 90 seconds. Until then, the live site still
  shows the old version.
- **Slug** — a short URL-friendly version of a name. The service "Deep
  Tissue Massage" might have the slug `deep-tissue-massage`, which means
  it lives at `springmassagetherapy.ca/services/deep-tissue-massage`.
  Don't change a slug after a service is published, or old links break.
- **EN / FR** — English and French. Most fields have an EN box and an FR
  box. Fill the EN box always. The FR box is optional.
- **Alt text** — a short description of a photo, used by blind visitors'
  screen readers and by Google. The system pre-fills sensible defaults;
  you can refine them.
- **Markdoc** — a simple way to format text (bold, italics, lists, links).
  You don't need to learn it; the editor has buttons for everything.
- **Cal.com event slug** — the short identifier for a booking in your
  Cal.com account. You'll see why later in this guide.
- **GitHub** — the place your website code lives. Your account there is
  what you use to sign in to the admin. It's free.
- **Singleton** — a one-of-a-kind page section, like the homepage hero or
  the contact info. Only one exists.
- **Collection** — a list of similar things, like services or reviews,
  where you add or remove entries.

---

## First time signing in

You only do this once per device.

1. Open your browser and go to **`springmassagetherapy.ca/keystatic`**
2. You'll see a button: **"Sign in with GitHub"**. Click it.
3. If you don't already have a GitHub account, GitHub will ask you to
   create one. It's free, takes ~2 minutes. Sign up at
   **https://github.com/signup**.
4. GitHub asks: "Authorize Spring Massage Therapy CMS?" — click **Authorize**.
5. You're taken back to the admin. You'll see a sidebar on the left and
   nothing in the middle.

If sign-in stops working later, you've probably been signed out of GitHub
itself. Sign back in at `github.com` and try again.

---

## A tour of the admin

When you open the admin you'll see:

- **Left sidebar**: a list of everything you can edit, grouped into
  **Singletons** (one-off pages) and **Collections** (lists).
- **Main area**: shows whatever you clicked. When you open a Singleton,
  the form fills the whole area. When you open a Collection, you see the
  list, and clicking an entry opens its edit form.
- **Top right of any form**: a green **Save** button. **Always click Save
  after making changes.** If you navigate away without saving, your
  changes are lost.

### Singletons (one-of-each pages)

| Item | What's inside |
|---|---|
| **Home Page** | Hero text and photos, the "yellow little castle" story, button labels |
| **About Page** | Your bio, studio description, your portrait, two studio photos, map address |
| **Contact Info** | Phone, address, hours, social links, Cal.com username, Google review URL, Google rating + count to display |
| **Site Branding** | Logo, favicon, default page description (used by Google), social-share image (1200×630, used in iMessage / Facebook previews), price range ($$/$$$) |

### Collections (lists)

| Item | What's inside |
|---|---|
| **Services** | Every service: name, group, price, sale price + dates, photo, description, Cal.com event slug |
| **Promotions** | Active promos shown on the homepage and `/promotions` page |
| **Custom Pages** | Standalone pages you create yourself (e.g. "Studio Policies", "Gift Cards", "FAQ") |
| **Reviews** | Client reviews shown on the homepage carousel and `/reviews` page |

---

## How to do common things

### Update a service price

1. Sidebar → **Services**
2. Click the service you want to edit
3. Find the **Price** field — change it (e.g. from `$80` to `$85`)
4. **Save** (top right, green)
5. Wait ~90 seconds, then refresh the live site

### Rename a service (without breaking its URL)

The slug field at the top — labelled **Service name (EN, used as URL)** —
is part of the page's web address. Don't change it once a service is
published, or old links and bookmarks break.

To change just the visible name:

1. Sidebar → **Services** → click the service
2. Fill in **Service name (EN, displayed)** — this is what visitors see on
   the site. Leave blank to keep using the slug-derived default
   (e.g. "60 Min Full Body Massage").
3. For the French name, use **Service name — FR** as before.
4. **Save**

The same applies to **Promotions** — there's a **Promotion title
(EN, displayed)** field. Use that to rename a promotion. Don't touch the
slug.

### Run a sale on a service

You can put any service on sale and have the sale end automatically on a
date. The site handles all the on/off toggling for you.

1. Sidebar → **Services** → click the service
2. **Sale price** — enter the new (lower) price, e.g. `$60`. Leave empty
   when there's no sale.
3. **Sale is active** — leave checked. Untick to pause a sale early
   without losing the sale price or dates (handy if you want to bring it
   back later with one click).
4. **Sale note — EN** — optional small italic line under the sale price.
   Example: `Summer 2026 — save $20`.
5. **Sale starts (optional)** — leave empty to start now, or pick a date.
6. **Sale ends (optional)** — pick the date the sale should automatically
   stop. Leave empty for no end date (rarely a good idea — sales should
   end).
7. **Save**

The website automatically:
- Shows the regular price with a strikethrough
- Highlights the sale price
- Removes the sale automatically after the end date — you don't have to
  remember to take it down

To **pause a sale early** (e.g. you want to stop offering it but keep the
price and dates around for later): open the service, untick **Sale is
active**, save. Re-tick when you want it back.

### Add a new promotion

Promotions are general announcements (a seasonal special, a new package,
a holiday-only offer). They show as cards on the homepage and the
Promotions page.

1. Sidebar → **Promotions** → **Add new** (top of the list)
2. Fill in:
   - **Title (EN)** — used as the heading and as the URL. Keep it short.
   - **Title (FR)** — French version, optional.
   - **Tag (EN)** — small ribbon label, e.g. `Summer Promo` or `New`.
   - **Subtitle (EN)** — small caps text under the title.
   - **Active** — leave checked. Uncheck to hide without deleting.
   - **Starts (optional)** — promo only shows on or after this date. Leave
     empty to start immediately.
   - **Ends (optional)** — promo automatically stops showing after this
     date. **Use this** so promotions don't outstay their welcome.
   - **CTA label (EN)** — what the button says, e.g. `Call Now`
   - **CTA link** — where the button goes. For phone calls use
     `tel:+15793664118`. For booking, use `/book`.
   - **Photo** (optional but helps).
   - **Photo alt text** — defaults to the title. Refine it if the image
     is important.
   - **Body (EN)** — the description. The editor has buttons for bold,
     italics, links, lists. **Don't paste raw HTML.**
3. **Save**

To **end a promotion** before its end date: open it, uncheck **Active**,
save. To **bring it back** later: re-check **Active**, optionally update
dates.

### Replace a photo

Inside any photo / image field:

1. Click the upload area
2. Either drag-and-drop a file from your Finder/Files app, or click to
   browse
3. The image is saved into your project automatically — you don't manage
   files anywhere
4. **Save** the entry

### Update business hours

1. Sidebar → **Contact Info**
2. **Hours summary — EN**: e.g. `Mon–Sun · 8:00 AM – 9:00 PM`
3. **Hours summary — FR**: e.g. `Lun–Dim · 8h00 – 21h00`
4. **Save**

This text appears in the header strip, footer, and contact page.

### Update your phone number

1. Sidebar → **Contact Info** → **Phone** → change → **Save**

This updates the header, footer, contact page, and `tel:` links across
the site.

> **Note**: each promotion has its own **CTA link** field. If you change
> your phone number, also open each active promotion and update its CTA
> link if it points at the old number (e.g.
> `tel:+15793664118`).

### Add a new client review

When someone leaves a great Google or Yelp review you'd love to highlight:

1. Sidebar → **Reviews** → **Add new**
2. **Reviewer name** — first name + initial works (`Sarah M.`)
3. **Rating** — 1 to 5
4. **Review date** — when they wrote it
5. **Source** — Google / Yelp / Facebook / In person / Other
6. **Featured on homepage** — tick to put it in the homepage carousel
7. **Review text** — paste the review

> Reviews are **never auto-translated**. If a French client wrote in
> French, keep the original. Both languages can coexist on the page.

### Update Cal.com booking link

You only do this once. Then services get a **Book →** button.

1. Sign up free at **https://cal.com**
2. Choose a username — `zarah-bellamy` or `springmassage` work well
3. Create one **event type** for each service:
   - Title (e.g. `60-min Full Body Massage — $80`)
   - Duration matching the real session
   - URL slug (e.g. `60min-full-body`)
4. Open admin → **Contact Info** → paste your Cal.com username → **Save**
5. For each bookable service: admin → **Services** → that service → paste
   the matching event slug into **Cal.com event slug** → **Save**

The `/book` page picks up automatically. Services with a slug get a
**Book →** button; ones without keep their **Call to book** fallback.

### Add your Google Business Profile links (do this — it matters)

The site has two CTAs that drive new bookings:

- **"Leave a review"** button on the reviews page — clients tap it and
  land directly on your Google review form.
- **"See all on Google →"** link near the rating — visitors click it to
  read every review on Google.

**Both stay hidden until you fill in the URLs below.** Right now they're
blank, so the site is missing two of its strongest conversion CTAs.

How to get the URLs:

1. Sign in to your **Google Business Profile** at
   **https://business.google.com/**
2. Click **"Get more reviews"** or follow Google's guide here:
   **https://support.google.com/business/answer/7035772** — this gives
   you a short review URL like `https://g.page/r/...` that drops people
   straight into the review form.
3. Copy your **Business Profile URL** as well — it's the one Google shows
   when someone searches your business name. It looks like
   `https://www.google.com/maps/place/...` or `https://g.page/...`.

Then in the admin:

1. Sidebar → **Contact Info**
2. Paste the review URL into **Google "Leave a Review" URL**
3. Paste the profile URL into **Google Business Profile URL**
4. **Save**

Why this matters: people who search "massage Montréal" → click your site
→ read a review they like → click "See all on Google" → see 30+ five-star
reviews → book. That funnel doesn't work without these URLs.

### Edit hero text on the homepage

1. Sidebar → **Home Page** → change any of:
   - **Hero eyebrow** — the small script line ("Welcome to our")
   - **Hero title** — the big serif line ("Spring Massage Therapy")
   - **Hero subtitle** — the longer body paragraph
   - **Primary / Secondary CTA** label and link
2. **Save**

Each text field has an EN and FR variant. If FR is empty, French visitors
see English with a small "Translation coming soon" notice.

### Update the homepage slideshow images

The hero on the homepage can be a single photo or a fading slideshow.

1. Sidebar → **Home Page**
2. Scroll to **Hero slideshow images**
3. Click **Add** to add an image, fill in alt text. Repeat for each.
4. **Slideshow interval** — how many seconds each image stays visible (2
   to 60). Default is 6.
5. **Save**

If you have 0 or 1 slideshow images, the **Hero background image** above
is used as a static photo instead.

### Edit the about page

Sidebar → **About Page** → edit any of:
- **Portrait** + alt text
- **Zarah's bio (EN/FR)** — long paragraph(s)
- **About the studio (EN/FR)**
- **Studio photo 1 / 2** + alt text
- **Map address** — what shows on the embedded map

**Save** when done.

---

### Set your credentials and trust signals

These small facts help new clients trust you before they book. They appear:
- as a small horizontal "trust strip" near the top of the home page
- in a credentials line right under your bio on the About page

Sidebar → **About Page**:
- **Years of practice** — e.g. `8`. Renders as "8+ years of practice". Leave blank to hide.
- **Professional association membership** — e.g. `CMTQ` or `Member of FQM`. Shown on the About page. Leave blank to skip.
- **Languages spoken** — e.g. `English, French`. Shown on the About page.
- **Insurance receipts available** — tick this if clients can submit receipts to their insurance. Adds a "Receipts for insurance reimbursement" line. **This is one of the strongest signals for new clients in Quebec — if you can do receipts, definitely tick it.**

**Save** when done.

### Hide or show the home-page trust strip and pull-quote

If you ever want to clean up the home page (e.g. while you're rewriting other content), you can temporarily hide:

Sidebar → **Home Page**:
- **Show trust strip on home page** — untick to hide the small row of facts under the hero
- **Show featured pull-quote on home page** — untick to hide the big quote section
- **Featured pull-quote review** — pick which review appears as the big quote. The same review still also shows in the carousel below.

**Save**.

---

### Create a brand-new custom page

Sometimes you want a whole page that doesn't fit anywhere else: studio
policies, gift card terms, an FAQ, a notice about parking. The **Custom
Pages** collection lets you make one yourself.

1. Sidebar → **Custom Pages** → **+ Create**
2. Fill in:
   - **Page title (EN, used as URL)** — e.g. `Studio Policies`. This becomes
     the URL: `/pages/studio-policies`. Don't change it after publishing or
     old links break.
   - **Page title — FR** — French version, e.g. `Politiques du studio`. Optional.
   - **Short intro / subtitle** — one line under the title. Optional.
   - **Hero image** — optional photo at the top.
   - **Hide from search engines** — tick this if the page is "internal" (e.g.
     only linked from the booking flow) and shouldn't show up in Google.
   - **Body — EN** — write the page content using the toolbar.
   - **Body — FR** — French version. Plain text. Leave blank to fall back to English.
3. **Save**.

**Where the new page appears:**
- It's reachable directly at `/pages/<slug>` (or `/fr/pages/<slug>`)
- It does **not** automatically appear in the navigation. To link to it from
  somewhere else (a promo CTA, the footer, a service description), copy its
  URL and paste it in.

**Example use cases:**
- "Studio Policies" → linked from the bottom of `/book`
- "Gift Cards" → linked from a promotion CTA
- "What to expect at your first session" → linked from a service description
- "Holiday hours" → linked from a banner or just shared by URL

If you want a custom page added to the main navigation (header or footer),
ask Zubair — that part requires a small code change.

---

## Best practices

### Image sizes

- Aim for **1600×1000 px or larger**, **JPG or PNG**, **under 2 MB**.
- Most modern phones take photos around this size. If your photo is
  bigger, that's fine — the website will still load it, just a touch
  slower for visitors on weaker phone signal.
- If a photo is 5 MB+, run it through **https://tinypng.com/** (free,
  no signup). It typically cuts file size by 60-80% with no visible
  quality loss.
- The **social share image** in **Site Branding** should be exactly
  **1200 × 630 px** — that's what Facebook and iMessage previews use.

### Alt text

Every photo has an **alt text** field. It's a short description, used by:
- Blind and low-vision visitors using screen readers
- Google, when it indexes your images

Defaults are pre-filled for you. For important photos (hero, portrait,
each service photo), refine the default to something more specific —
e.g. `Zarah Bellamy giving a deep-tissue massage in a candle-lit studio`.
For decorative photos, the default is fine.

### Translations (EN / FR)

Every translatable field has both an EN box and an FR box. Always fill
EN. FR is optional. If a French visitor lands on a page where the FR is
empty, they see the English version with a small polite note that French
is coming. Nothing breaks.

You don't have to translate everything at once. Translate when you have
the time and energy.

> **About the blog**: the **Blog** link in the footer (and the posts at
> `/blog`) is intentionally English-only and managed in code by Zubair.
> You don't need to think about it — the FR site simply won't show a Blog
> link, and the EN/FR toggle still behaves correctly.

### Tips for bilingual writing

- Keep important info short (especially headlines). Translations don't
  always come out the same length.
- Don't translate your reviews. Keep clients' words in whatever language
  they wrote.
- Don't translate your name or the business name.
- For prices, use the same numerals: `$80` works in both languages.

### SEO (so Google finds you)

You don't need to think about SEO much. The website handles it. Two
things you control that matter:

1. The **Default meta description** in **Site Branding** is what Google
   shows as the preview text under your site in search results. Make
   it warm, specific, and under ~155 characters.
2. The **Site URL** in **Site Branding** must be
   `https://springmassagetherapy.ca` — already set.

Other than that, just keep your **Google Business Profile** updated (see
the SEO guide separately) — that's where 80% of the impact lives.

### Photo quality matters

Real, well-lit photos of your studio beat stock photos every time. Your
studio is the asset — the boho/zen interior, the lilac trees outside, the
candles, the macramé. Show those.

Tips:
- Natural daylight > artificial light
- Tidy the frame — remove clutter that doesn't belong
- Shoot at the same time of day for consistent feel across photos
- Don't over-edit; keep the warm, calm tone

### Promo writing

Specific beats vague. Compare:
- Vague: `Special offer!`
- Better: `Save $20 on a deep-tissue session this week`

Warm-but-specific copy converts. Mention the season, the saving, or the
reason if there is one ("treat yourself before the holidays").

### Further reading

- **[Therapy practices: small CRO wins for higher conversions](https://alwaysopen.design/therapy-practices-cro-wins/)**
  — Practical, plain-language tips for getting more inquiries from the
  visitors you already have. Focuses on trust signals, readability,
  and reducing friction in the booking flow. Good 10-minute read when
  you have time.

---

## What happens when you click Save

When you click **Save**, your change does NOT appear on the live site
immediately. Here's what happens behind the scenes:

1. Your change is saved into the project's records on GitHub.
2. The website is automatically rebuilt with your new content.
3. The new version is uploaded to the hosts (Cloudflare and Vercel).
4. The live site updates.

This takes **about 90 seconds**, sometimes up to 2 minutes if the system
is busy. **If you refresh the live site too fast, you'll still see the
old content — that's normal.** Wait 2 minutes, then check.

The admin itself updates instantly when you Save, so you can keep editing
other things while the site is rebuilding.

---

## What if something goes wrong

Stay calm. Almost nothing you can do in the admin actually breaks the
site. The worst case is a typo on a live page that you can fix in 30
seconds.

### "I clicked Save and nothing happened"

1. Check your internet connection
2. Refresh the page
3. Try again
4. If it still fails, take a screenshot of any error and message Zubair

### "I made a mistake and want to undo my change"

There's no undo button. Two options:
1. **Re-edit it** to whatever it was before. This is the easiest path.
2. If the change was destructive (you deleted something or pasted over a
   long passage), message Zubair. He can revert your change in ~5 minutes
   using GitHub's history.

### "The admin won't let me sign in"

1. Make sure you're signed in to GitHub at `github.com`
2. Try in a different browser or in a private/incognito window
3. If still broken, message Zubair — usually a credential issue on his
   end, easy to fix

### "I see an error message I don't understand"

Take a screenshot of the whole screen, including the URL bar, and send to
Zubair.

### "The live site looks broken"

If `springmassagetherapy.ca` itself isn't loading or looks wrong, message
Zubair right away. Don't try to fix it from the admin.

---

## Things you should NOT do

- **Don't paste raw HTML** (`<div>`, `<span>`, etc.) into description
  fields. Use the editor's bold/italic/link buttons. Curly quotes ("smart
  quotes") and em-dashes are fine — those are normal text.
- **Don't change a service's slug** after it's published. The slug is the
  URL identifier; old links to that service will break.
- **Don't delete a service** that's referenced by a promotion's CTA link.
  Update the promotion first, then delete the service.
- **Don't upload images larger than ~10 MB.** They'll fail. Compress with
  TinyPNG first.
- **Don't share your GitHub password** with anyone. The admin sign-in is
  only as secure as your GitHub account. Turn on two-factor auth on
  GitHub if you haven't.

---

## Who to contact

**Zubair** — <!-- TODO: confirm preferred contact: phone? email? Signal? -->

When messaging:
- Briefly describe what you tried to do
- Include a screenshot if there's an error message
- Mention whether the issue is in the admin or on the live site
