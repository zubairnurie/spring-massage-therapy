# Open questions for Zarah

A running list of things that need her input before we finalize. Not
urgent — these are questions where my (Zubair's) guess could be wrong,
and her answer changes the website meaningfully.

Mark each as **Resolved** with a one-line note when she answers, so we
can see what's been decided and what's still open.

---

## How the practice actually works

These shape the structure of the services page, the booking flow, and
how the site presents her expertise. They're the most important to
answer before she takes the site over.

### 1. Modalities — does she offer distinct treatment types?

When a new client books, does she:

- **(a)** Ask them which modality they want — relaxation/Swedish,
  therapeutic/deep tissue, sports — and book that specific session?
- **(b)** Decide on the table, based on what their body needs that
  day, regardless of what they booked?

If **(a)**: we should restructure the services page to group by
modality, with duration as a sub-choice. ("Therapeutic massage —
60 min / 90 min" rather than "60 min full body massage" as a single
generic tile.) This matches how most established RMT and spa menus
work, helps SEO for searches like "deep tissue Westmount," and signals
trained expertise.

If **(b)**: keep the current "one-tile-per-session-length" approach.
Modality grouping would be performative — clients would book "Swedish
60 min" and she'd do whatever the body needs anyway.

**Status:** open

---

### 2. Specific modalities offered

If the answer to #1 is **(a)** — what does she actually offer?
We've heard:
- Relaxation / Swedish
- Therapeutic / deep tissue
- Sports

Are there others? Prenatal? Lymphatic? Reflexology? Hot stone (currently
its own service tile)? She might offer some only on request.

**Status:** open

---

### 3. Add-ons vs standalone services

Currently `therapeutic-deep-pressure-upgrade` is its own card with its
own price. Is that an *add-on* to a regular session ("upgrade to deep
pressure for +$15"), or a standalone service?

Same question for hot stone, foot, facial — all currently standalone
tiles. Some of these read like they could be add-ons.

**Status:** open

---

## Booking platform

### 4. Cal.com vs Acuity vs Jane App

We're currently embedding Cal.com on `/book`. Three real options:

- **Cal.com** (current) — free tier works, embed is OK, mostly developer-y
  branding under the hood. Fine for now.
- **Acuity Scheduling** — paid (~$16 USD/month), much better UX for
  spa/wellness, supports payment collection, intake forms, package
  pricing. Standard in the industry.
- **Jane App** — Canadian, designed for RMTs specifically, supports
  insurance receipts directly, charts/SOAP notes if she ever needs them.
  Most expensive (~$50 CAD/month) but most professional.

Which fits her practice + budget? If she's serious about insurance
receipts and growing past part-time, Jane is the right answer. If she's
keeping it small and personal, Acuity. If she's price-sensitive,
Cal.com works.

**Status:** open

---

### 5. Cal.com account ownership

The current Cal.com embed shows "Zubair Nurie" and a "Z" avatar — it's
on Zubair's account. Either:

- Transfer to Zarah's own Cal.com account (her name, her photo)
- Switch to a Cal.com team/organization profile branded as "Spring
  Massage Therapy" (no personal name)
- Replace with whichever platform she picks in #4 anyway

**Status:** open. Needs to happen before the site goes live on
springmassagetherapy.ca.

---

## Domain & hosting cutover

### 6. Network Solutions and HostGator credentials

The domain `springmassagetherapy.ca` is registered at Network Solutions
Canada; DNS currently points at HostGator (where the old WordPress
site lives). To make the new Cloudflare Pages site live on the real
domain, we need login access to one of these:

- **Network Solutions** (preferred) — change nameservers to Cloudflare,
  cancel HostGator entirely afterward. Cleaner.
- **HostGator cPanel** (fallback) — change just the A/CNAME records to
  point at Cloudflare Pages, leave Network Solutions delegating to
  HostGator. More fragile.

Does she have these credentials? If yes, this is a 30-minute working
session together to do the switch. If no, we'd need to reset/recover
them through her registrar email.

**Status:** open

---

### 7. Cancelling HostGator

Once DNS is moved, HostGator hosting can be cancelled (~$10–15/month
saved). Confirm she's OK losing the old WordPress site entirely (it
will go dark — no rollback). Anything in the WordPress admin worth
preserving first? (Old client data? MailPoet subscriber list?
WooCommerce orders if any?)

**Status:** open

---

## Content & photos

### 8. Real photos of the studio and treatment

The current site uses some atmospheric/stock-feeling photos for the
hero slideshow and service tiles. The site would feel meaningfully
more "hers" with:

- Hero slideshow: at least one photo showing **her hands giving a
  massage** or a **candle-lit treatment room with the table visible** —
  removes any ambiguity about what the site is for
- Studio gallery on About page: real photos of her actual studio
  (currently 2 photos work, could be replaced with her own)
- Service cards: a real photo for each modality if possible

A half-day shoot with a Montréal lifestyle/architectural photographer
(~$600–800) would do more for the site's perceived production value
than any code. Or a self-shoot with a tripod and natural light if budget
is tight.

**Status:** open

---

### 9. Her bio and credentials

The about page has fields for years of practice, association
membership, languages spoken, insurance receipts. She should fill in:

- How many years she's been practicing
- Whether she's a member of a professional association (FQM? RMT?
  AMTA equivalent in Quebec?) — this drives the "RMT" / "Registered"
  signaling that helps with insurance and trust
- Languages she speaks (English, French, anything else?)
- Confirms insurance receipts are available

**Status:** open

---

### 10. Her own writing voice

The current `heroBody`, `storyBody`, and bio copy are placeholders /
my drafts. She should rewrite in her own voice when she's comfortable.
The Keystatic admin makes this easy — TRAINING.md walks through how.

Common areas to revise:
- Hero body ("You deserve more than a rushed massage...")
- "The yellow little castle" story
- About-the-studio copy
- Her bio

**Status:** open

---

## Marketing & visibility

### 11. Google Business Profile

The biggest single SEO lever for a local service business is the Google
Business Profile (Maps listing). Once the new site is live on
springmassagetherapy.ca:

- Update the website URL on her Google Business Profile to point at
  the new domain (currently points at the WordPress site)
- Confirm address, phone, hours, photos are current
- Encourage existing happy clients to leave a Google review (the site
  already has a "Leave a review" CTA wired to it)

**Status:** open. Must happen post-cutover.

---

### 12. Social media handles

The site has Facebook and Instagram icons in the header/footer when
URLs are set in Keystatic. Are her current social URLs correct? Does
she want to keep using them, or relaunch fresh accounts?

**Status:** open

---

### 13. Analytics

Once the custom domain is live, set up:

- Cloudflare Web Analytics (free, no cookies, no consent banner needed)
- Google Search Console (free, tells her how she's ranking and what
  searches bring people in)

Both are reviewer-friendly — she doesn't have to read them, but they're
there if she or a future helper wants to understand what's working.

**Status:** open. Blocked on custom domain cutover (#6).

---

## Logistics around handoff

### 14. Keystatic admin login

She'll need to log in to GitHub to use the Keystatic admin at
`https://spring-massage-therapy.vercel.app/keystatic`. Either:

- She creates her own GitHub account and we add her as a collaborator
  on the repo
- We give her access to a shared/dummy account just for editing

The collaborator route is more proper but requires her to manage a
GitHub account. The shared-account route is simpler but means we both
have access to the same login.

**Status:** open

---

### 15. Ongoing tech support

Who fixes things when something breaks? Some realistic scenarios:

- "The Keystatic admin won't load" → usually a Vercel issue, 1-line fix
- "I want to add a 5th studio photo" → small code change
- "I want to change the booking platform" → moderate work
- "I want to add a different service" → no code, just Keystatic

Are you (Zubair) on call for these? Free, paid, or "first six months
free then we'll see"? Worth setting expectations explicitly so she
doesn't feel awkward asking.

**Status:** open

---

## Lower priority / nice-to-have

### 16. PWA install on her phone

The Vercel admin has PWA support. She could add a "Spring Massage
Admin" icon to her phone home screen for one-tap access to editing.
Worth showing her in the handoff.

**Status:** open

### 17. Email forwarding

If she wants `hello@springmassagetherapy.ca` or similar, set up email
forwarding via Cloudflare Email Routing (free) once the domain is
live. Currently any inquiries go through phone or Cal.com.

**Status:** open

### 18. The blog

There's a `/blog` route stubbed out (EN-only) but no posts. Does she
want to write occasional posts? Even 4–6 short posts a year about
common conditions she treats (back pain, sciatica, headaches, sports
recovery) would help SEO meaningfully. If she's not into writing, we
can hide the route entirely.

**Status:** open
