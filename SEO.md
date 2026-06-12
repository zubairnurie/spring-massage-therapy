# SEO Guide — Spring Massage Therapy

This codebase handles **on-page SEO** automatically (sitemap, structured data, meta tags, fast pages). What it can't do is **off-site SEO** — those tasks live in third-party tools and require Zarah's credentials.

This guide is the punch list of things to do *outside* the code to make the site actually rank for searches like "massage near me" in Montréal.

---

## On-page SEO already handled by the code

- ✅ Static HTML, fast load times (Astro)
- ✅ Per-page `<title>` and `<meta description>`
- ✅ `LocalBusiness` JSON-LD structured data on every page (powers Google Knowledge Panel)
- ✅ Open Graph + Twitter card tags (link previews on iMessage / Instagram / Facebook)
- ✅ Canonical URLs (no duplicate-content penalties)
- ✅ Auto-generated `sitemap-index.xml`
- ✅ `robots.txt` allowing crawl, blocking `/keystatic` admin
- ✅ Mobile responsive (Google ranks mobile-first)
- ✅ `lang="en"` and `og:locale="en_CA"`
- ✅ `/book` page set to `noindex` (no need to clutter search results with a booking widget)

You can edit the **default description**, **price range**, and **social share image** in Keystatic → Site Branding.

---

## Off-page SEO — what Zarah needs to do

### 1. Google Business Profile (most impactful, ~30 minutes)

This is **THE** thing for local businesses. It's what makes the map pin show up when someone searches "massage Montréal".

1. Go to [google.com/business](https://www.google.com/business/) and sign in with the account she wants to manage from
2. Search for "Spring Massage Therapy" — if the listing already exists (it likely does from her old site), claim it. Otherwise, create it.
3. Complete every field:
   - Business name: **Spring Massage Therapy**
   - Category: **Massage Therapist** (primary), **Day Spa** (secondary)
   - Address: 2229 Hawarden, Montréal, QC
   - Phone: (579) 366-4118
   - Website: `https://springmassagetherapy.ca`
   - Hours: Mon–Sun 8 AM – 9 PM
   - Services: list every service from the site
   - Photos: upload at least 10 (interior, exterior, decor, Zarah)
4. Verify the listing (Google sends a postcard or phone call)

**Then keep it active**: post a new photo or update once a month. Google rewards activity.

### 2. Bing Places for Business (15 min)

Same idea, smaller traffic, but free and ~10% of searches. Go to [bingplaces.com](https://www.bingplaces.com/) and import from Google Business Profile (one click).

### 3. Submit sitemap to Google Search Console (10 min, post-deploy)

After deploying:

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property: `springmassagetherapy.ca`
3. Verify (DNS or HTML file method — Cloudflare DNS verification is fastest)
4. **Sitemaps** → submit `https://springmassagetherapy.ca/sitemap-index.xml`
5. Request indexing of the homepage

### 4. Build local citations (~1 hour, free)

"Citations" = mentions of business name + address + phone on directory sites. Google reads these as trust signals.

Free directories worth submitting to:
- [Yelp](https://biz.yelp.com/) — set up a free business page
- [Yellow Pages Canada](https://www.yellowpages.ca/) (PagesJaunes)
- [Foursquare](https://foursquare.com/business/)
- [Apple Business Connect](https://businessconnect.apple.com/) — for Apple Maps

**Critical**: name, address, phone must be **exactly identical** across all listings. "Spring Massage Therapy" and "Spring Massage" are different to Google.

### 5. Get reviews (ongoing)

Reviews are the single biggest ranking factor for local search after Google Business Profile completeness.

- After each session, Zarah can send the client a quick "Thanks! If you enjoyed your visit, a Google review means the world: [link to her Google Business Profile review URL]"
- Aim for ~10 in the first month, then 1–2/week
- Always respond to reviews (positive and negative) — Google rewards engagement

### 6. Keep content fresh

- Add a **promotion** monthly via Keystatic (signals an active business)
- Consider a basic **blog** page for posts like "5 stretches between massage sessions" (this is a free content idea generator for searches like "neck stretches Montréal massage")
- Update the homepage hero seasonally

---

## Things NOT to bother with

- **Buying SEO services / link-building packages.** Most are spam-adjacent and Google penalizes them. For a local massage business, GBP + reviews + good local citations are 95% of the win.
- **Stuffing keywords** like "massage Montréal massage Montréal massage Montréal" in alt text or copy. Modern Google ignores or penalizes this.
- **Aggressive popups** ("subscribe now!"). Hurts rankings.
- **Schema markup beyond LocalBusiness** for now — overkill for a single-location practice.

---

## Measuring success

After 2–4 weeks of running:

- **Google Search Console** → Search results report → see what queries are bringing impressions/clicks
- **Google Business Profile dashboard** → calls, direction requests, photo views
- **Cloudflare Web Analytics** (free, no cookies, drop-in script) → page views, top pages, devices

If "massage near me" or "massage Montréal" doesn't show impressions within 8 weeks, the issue is almost always either: (a) Google Business Profile isn't fully completed, or (b) too few reviews relative to competitors. Not the website code.

---

## Bilingual SEO (FR translation)

The site is built English-only for now. When the French version is added:

- Use `hreflang` tags in `<head>` to tell Google there are two versions
- French URLs at `/fr/...` (or `springmassagetherapy.ca/fr/services`)
- Set `og:locale:alternate` to `fr_CA`
- Submit both languages in Search Console
- Update Google Business Profile to indicate bilingual service

I'll wire this when the FR translations are ready — it's ~30 min of code work once content exists.
