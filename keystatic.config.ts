import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Storage strategy:
 *   - Local dev: kind 'local' — writes to disk, no auth needed
 *   - Production: kind 'github' — writes to GitHub repo via OAuth, triggers redeploy
 *
 * Switch via PUBLIC_KEYSTATIC_STORAGE_KIND env var. The PUBLIC_ prefix is
 * required for Vite/Astro to expose the variable to the browser bundle —
 * Keystatic's React admin runs client-side and needs to see this config.
 *
 * See SETUP.md for one-time GitHub App (NOT OAuth App) + secret setup.
 */
const storageKind = import.meta.env.PUBLIC_KEYSTATIC_STORAGE_KIND ?? 'local';
const repoOwner = import.meta.env.PUBLIC_KEYSTATIC_REPO_OWNER ?? 'your-github-username';
const repoName = import.meta.env.PUBLIC_KEYSTATIC_REPO_NAME ?? 'spring-massage';

const storage = storageKind === 'github'
  ? {
      kind: 'github' as const,
      repo: { owner: repoOwner, name: repoName },
    }
  : { kind: 'local' as const };

/**
 * Bilingual content: every translatable text/markdoc field comes as a pair —
 * `*En` (English, required) and `*Fr` (French, optional, falls back to EN).
 * Image fields are shared between languages.
 */

export default config({
  storage,
  ui: {
    brand: { name: 'Spring Massage Therapy' },
  },
  singletons: {
    home: singleton({
      label: 'Home Page',
      path: 'src/content/home/',
      schema: {
        // Hero
        heroEyebrowEn: fields.text({ label: 'Hero eyebrow — EN', defaultValue: 'Welcome to our' }),
        heroEyebrowFr: fields.text({ label: 'Hero eyebrow — FR', defaultValue: 'Bienvenue dans notre' }),
        heroTitleEn: fields.text({ label: 'Hero title — EN', defaultValue: 'Spring Massage Therapy' }),
        heroTitleFr: fields.text({ label: 'Hero title — FR', defaultValue: 'Spring Massage Therapy' }),
        heroBodyEn: fields.text({
          label: 'Hero subtitle — EN',
          multiline: true,
          defaultValue: "You deserve more than a rushed massage. I'm Zarah, and every session is delivered with care — focusing on nurturing your mind and body, whether for short-term relief or long-term wellness.",
        }),
        heroBodyFr: fields.text({
          label: 'Hero subtitle — FR',
          multiline: true,
          defaultValue: '',
        }),
        heroImage: fields.image({
          label: 'Hero background image (shared) — fallback if no slideshow images set',
          directory: 'public/images/hero',
          publicPath: '/images/hero/',
        }),
        heroImageAlt: fields.text({
          label: 'Hero image alt text',
          description: 'Describes the fallback hero image for screen readers and SEO. Pre-filled with a sensible default — feel free to refine.',
          defaultValue: 'Spring Massage Therapy studio in Montréal',
        }),
        heroImages: fields.array(
          fields.object({
            image: fields.image({
              label: 'Slideshow image',
              directory: 'public/images/hero',
              publicPath: '/images/hero/',
            }),
            alt: fields.text({
              label: 'Alt text',
              description: 'Describes this image for screen readers and SEO.',
              defaultValue: 'Spring Massage Therapy studio in Montréal',
            }),
          }),
          {
            label: 'Hero slideshow images',
            description: 'Add 2+ images to enable a crossfading slideshow. With 0 or 1 images, the single Hero background image above is used.',
            itemLabel: (props) => props.fields.image.value?.filename ?? props.fields.alt.value ?? 'Slideshow image',
          },
        ),
        heroIntervalSeconds: fields.integer({
          label: 'Slideshow interval (seconds)',
          description: 'How long each image is shown before crossfading to the next. Only used when 2+ slideshow images are set.',
          defaultValue: 6,
          validation: { min: 2, max: 60 },
        }),
        ctaPrimaryEn: fields.text({ label: 'Primary CTA — EN', defaultValue: 'Book a Session' }),
        ctaPrimaryFr: fields.text({ label: 'Primary CTA — FR', defaultValue: 'Réserver' }),
        ctaPrimaryHref: fields.text({ label: 'Primary CTA link', defaultValue: '/book' }),
        ctaSecondaryEn: fields.text({ label: 'Secondary CTA — EN', defaultValue: 'Explore Services' }),
        ctaSecondaryFr: fields.text({ label: 'Secondary CTA — FR', defaultValue: 'Voir les services' }),
        ctaSecondaryHref: fields.text({ label: 'Secondary CTA link', defaultValue: '/services' }),
        // Story
        storyEyebrowEn: fields.text({ label: 'Story eyebrow — EN', defaultValue: 'A hidden gem' }),
        storyEyebrowFr: fields.text({ label: 'Story eyebrow — FR', defaultValue: 'Un trésor caché' }),
        storyTitleEn: fields.text({ label: 'Story title — EN', defaultValue: 'The yellow little castle' }),
        storyTitleFr: fields.text({ label: 'Story title — FR', defaultValue: 'Le petit château jaune' }),
        storyBodyEn: fields.text({
          label: 'Story body — EN',
          multiline: true,
          defaultValue: 'The studio is tucked away in a magical corner of the city — a heritage manor from around 1840, surrounded by greenery in the heart of downtown Montréal.\n\nTime-worn stone, tall windows, and peaceful energy woven into the very walls. It is a place where history, nature, and care come together to hold sanctuary.',
        }),
        storyBodyFr: fields.text({
          label: 'Story body — FR',
          multiline: true,
          defaultValue: '',
        }),
        storyImage: fields.image({
          label: 'Story image (shared)',
          directory: 'public/images/home',
          publicPath: '/images/home/',
        }),
        storyImageAlt: fields.text({
          label: 'Story image alt text',
          description: 'Describes the story image for screen readers and SEO.',
          defaultValue: 'Heritage Tudor manor housing Spring Massage Therapy',
        }),
        // Trust strip — small horizontal row of credibility signals shown
        // below the hero. Only renders when `showTrustStrip` is on.
        showTrustStrip: fields.checkbox({
          label: 'Show trust strip on home page',
          description: 'A small row right below the hero with credibility signals (years of practice, hours, rating, insurance receipts). Untick to hide.',
          defaultValue: true,
        }),
        // Pull-quote — pick a single review to feature prominently between
        // the Story section and Featured Services. Only renders when
        // `showPullQuote` is on AND a review is selected.
        showPullQuote: fields.checkbox({
          label: 'Show featured pull-quote on home page',
          description: 'A large italic quote from a single review, between the story section and featured services. Untick to hide.',
          defaultValue: true,
        }),
        pullQuoteReview: fields.relationship({
          label: 'Featured pull-quote review',
          description: 'Pick which review to feature as the big pull-quote. The selected review still also appears in the carousel.',
          collection: 'reviews',
        }),
      },
    }),
    about: singleton({
      label: 'About Page',
      path: 'src/content/about/',
      schema: {
        zarahPortrait: fields.image({
          label: 'Portrait of Zarah (shared)',
          directory: 'public/images/about',
          publicPath: '/images/about/',
        }),
        zarahPortraitAlt: fields.text({
          label: 'Portrait alt text',
          description: 'Describes the portrait for screen readers and SEO.',
          defaultValue: 'Zarah Bellamy, massage therapist at Spring Massage Therapy',
        }),
        zarahBioEn: fields.text({ label: 'Zarah\'s bio — EN', multiline: true, defaultValue: '' }),
        zarahBioFr: fields.text({ label: 'Zarah\'s bio — FR', multiline: true, defaultValue: '' }),
        // Credentials & insurance — used on the About page (under the bio)
        // and the home page trust strip. Each field is optional; only
        // populated values render. Receipts checkbox controls the
        // insurance line specifically.
        yearsExperience: fields.number({
          label: 'Years of practice',
          description: 'Used in the trust strip ("X+ years of practice"). Leave blank to hide that fact.',
          validation: { min: 0, max: 80 },
        }),
        associationMembership: fields.text({
          label: 'Professional association membership',
          description: 'e.g. "CMTQ", "Member of FQM". Shown on the About page under credentials. Leave blank to skip.',
          defaultValue: '',
        }),
        languagesSpoken: fields.text({
          label: 'Languages spoken',
          description: 'e.g. "English, French, Spanish". Shown in the credentials line on the About page.',
          defaultValue: 'English, French',
        }),
        insuranceReceiptsAvailable: fields.checkbox({
          label: 'Insurance receipts available',
          description: 'When ticked, shows "Receipts available for insurance reimbursement" on the trust strip and About page. Major signal for new clients in Quebec.',
          defaultValue: true,
        }),
        studioBodyEn: fields.text({ label: 'About the studio — EN', multiline: true, defaultValue: '' }),
        studioBodyFr: fields.text({ label: 'About the studio — FR', multiline: true, defaultValue: '' }),
        studioImage1: fields.image({
          label: 'Studio photo 1 (shared)',
          directory: 'public/images/about',
          publicPath: '/images/about/',
        }),
        studioImage1Alt: fields.text({
          label: 'Studio photo 1 alt text',
          defaultValue: 'Spring Massage Therapy studio interior',
        }),
        studioImage2: fields.image({
          label: 'Studio photo 2 (shared)',
          directory: 'public/images/about',
          publicPath: '/images/about/',
        }),
        studioImage2Alt: fields.text({
          label: 'Studio photo 2 alt text',
          defaultValue: 'Spring Massage Therapy studio courtyard',
        }),
        mapAddress: fields.text({
          label: 'Map address',
          defaultValue: '2229 Hawarden, Montreal, QC',
        }),
      },
    }),
    contactInfo: singleton({
      label: 'Contact Info',
      path: 'src/content/contact-info/',
      schema: {
        phone: fields.text({ label: 'Phone', defaultValue: '(579) 366-4118' }),
        addressEn: fields.text({ label: 'Address — EN', defaultValue: '2229 Hawarden, Montréal, Québec' }),
        addressFr: fields.text({ label: 'Address — FR', defaultValue: '2229 Hawarden, Montréal, Québec' }),
        hoursEn: fields.text({ label: 'Hours summary — EN', defaultValue: 'Mon–Sun · 8:00 AM – 9:00 PM' }),
        hoursFr: fields.text({ label: 'Hours summary — FR', defaultValue: 'Lun–Dim · 8h00 – 21h00' }),
        facebook: fields.url({ label: 'Facebook URL' }),
        instagram: fields.url({ label: 'Instagram URL' }),
        bookingHandle: fields.text({
          label: 'Cal.com username',
          description: 'Username portion only, e.g. "zarah-bellamy".',
          defaultValue: '',
        }),
        googleReviewUrl: fields.text({
          label: 'Google "Leave a Review" URL',
          defaultValue: '',
        }),
        googleProfileUrl: fields.text({
          label: 'Google Business Profile URL',
          defaultValue: '',
        }),
        googleRating: fields.text({
          label: 'Google rating to display',
          defaultValue: '5.0',
        }),
        googleReviewCount: fields.number({
          label: 'Google review count to display',
          defaultValue: 48,
        }),
      },
    }),
    site: singleton({
      label: 'Site Branding',
      path: 'src/content/site/',
      schema: {
        siteUrl: fields.text({
          label: 'Site URL (production)',
          defaultValue: 'https://springmassagetherapy.ca',
        }),
        defaultDescriptionEn: fields.text({
          label: 'Default meta description — EN',
          multiline: true,
          defaultValue: 'A peaceful retreat in the heart of Montréal. Tailored massage therapy by Zarah Bellamy in a heritage Tudor manor — open every day 8 AM to 9 PM.',
        }),
        defaultDescriptionFr: fields.text({
          label: 'Default meta description — FR',
          multiline: true,
          defaultValue: 'Un havre de paix au cœur de Montréal. Massothérapie sur mesure par Zarah Bellamy dans un manoir Tudor patrimonial — ouvert tous les jours de 8h à 21h.',
        }),
        socialImage: fields.image({
          label: 'Social share image (1200×630, shared)',
          directory: 'public/images/site',
          publicPath: '/images/site/',
        }),
        priceRange: fields.text({
          label: 'Price range (Google)',
          defaultValue: '$$',
        }),
        logo: fields.image({
          label: 'Logo (shared)',
          directory: 'public/images/site',
          publicPath: '/images/site/',
        }),
        favicon: fields.image({
          label: 'Favicon (shared)',
          directory: 'public/images/site',
          publicPath: '/images/site/',
        }),
      },
    }),
  },
  collections: {
    services: collection({
      label: 'Services',
      slugField: 'name',
      path: 'src/content/services/*',
      format: { contentField: 'descriptionEn' },
      schema: {
        name: fields.slug({ name: { label: 'Service name (EN, used as URL)' } }),
        displayNameEn: fields.text({
          label: 'Service name (EN, displayed)',
          description: 'The visible English name. Leave blank to derive it from the URL slug above. Edit this when you want to rename the service without changing its URL.',
          defaultValue: '',
        }),
        nameFr: fields.text({ label: 'Service name — FR', defaultValue: '' }),
        group: fields.select({
          label: 'Group',
          description: 'How this service is grouped on the /services page. Lets visitors scan at a glance.',
          options: [
            { label: 'Full Body Massage', value: 'full-body' },
            { label: 'Specialty', value: 'specialty' },
            { label: 'Targeted & Add-ons', value: 'targeted' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'other',
        }),
        price: fields.text({ label: 'Price', description: 'e.g. $60, from $40, On request' }),
        salePrice: fields.text({
          label: 'Sale price (optional)',
          description: 'When set, the regular price is shown with a strikethrough and this price is highlighted. Use values like "Free", "$0", or a discounted dollar amount. Leave empty when there is no active promotion.',
          defaultValue: '',
        }),
        saleActive: fields.checkbox({
          label: 'Sale is active',
          description: 'Untick to pause this sale without losing the sale price/dates.',
          defaultValue: true,
        }),
        saleNoteEn: fields.text({
          label: 'Sale note — EN (optional)',
          description: 'Small italic line under the sale price (e.g. "Summer 2026 — save $20"). Leave empty if no sale.',
          defaultValue: '',
        }),
        saleNoteFr: fields.text({
          label: 'Sale note — FR (optional)',
          defaultValue: '',
        }),
        saleStartsAt: fields.date({
          label: 'Sale starts (optional)',
          description: 'Sale price will only show on or after this date. Leave empty to start immediately.',
        }),
        saleEndsAt: fields.date({
          label: 'Sale ends (optional)',
          description: 'Sale price will automatically stop showing after this date. Leave empty for no expiry.',
        }),
        order: fields.number({ label: 'Display order', defaultValue: 0 }),
        featured: fields.checkbox({ label: 'Featured on homepage' }),
        bookingSlug: fields.text({
          label: 'Cal.com event slug (optional)',
          defaultValue: '',
        }),
        image: fields.image({
          label: 'Photo (shared)',
          directory: 'public/images/services',
          publicPath: '/images/services/',
        }),
        imageAlt: fields.text({
          label: 'Photo alt text',
          description: 'Describes this service photo for screen readers and SEO. Leave blank to use the service name.',
          defaultValue: '',
        }),
        descriptionFr: fields.text({ label: 'Description — FR', multiline: true, defaultValue: '' }),
        descriptionEn: fields.markdoc({ label: 'Description — EN' }),
      },
    }),
    promotions: collection({
      label: 'Promotions',
      slugField: 'title',
      path: 'src/content/promotions/*',
      format: { contentField: 'bodyEn' },
      schema: {
        title: fields.slug({ name: { label: 'Title (EN, used as URL)' } }),
        displayTitleEn: fields.text({
          label: 'Promotion title (EN, displayed)',
          description: 'The visible English title. Leave blank to derive it from the URL slug above. Edit this when you want to rename the promotion without changing its URL.',
          defaultValue: '',
        }),
        titleFr: fields.text({ label: 'Title — FR', defaultValue: '' }),
        tagEn: fields.text({ label: 'Tag (corner ribbon) — EN', defaultValue: 'Promo' }),
        tagFr: fields.text({ label: 'Tag (corner ribbon) — FR', defaultValue: 'Promo' }),
        subtitleEn: fields.text({ label: 'Subtitle — EN', defaultValue: '' }),
        subtitleFr: fields.text({ label: 'Subtitle — FR', defaultValue: '' }),
        active: fields.checkbox({
          label: 'Active',
          description: 'Manual on/off switch. Untick to pause without changing dates.',
          defaultValue: true,
        }),
        startsAt: fields.date({
          label: 'Starts (optional)',
          description: 'Promo will only show on or after this date. Leave empty to start immediately.',
        }),
        endsAt: fields.date({
          label: 'Ends (optional)',
          description: 'Promo will automatically stop showing after this date. Leave empty for no expiry.',
        }),
        ctaLabelEn: fields.text({ label: 'CTA label — EN', defaultValue: 'Call Now' }),
        ctaLabelFr: fields.text({ label: 'CTA label — FR', defaultValue: 'Appeler' }),
        ctaHref: fields.text({ label: 'CTA link', defaultValue: 'tel:+15793664118' }),
        image: fields.image({
          label: 'Photo (shared)',
          directory: 'public/images/promotions',
          publicPath: '/images/promotions/',
        }),
        imageAlt: fields.text({
          label: 'Photo alt text',
          description: 'Describes this promo photo for screen readers and SEO. Leave blank to use the promo title.',
          defaultValue: '',
        }),
        bodyFr: fields.text({ label: 'Body — FR', multiline: true, defaultValue: '' }),
        bodyEn: fields.markdoc({ label: 'Body — EN' }),
      },
    }),
    pages: collection({
      label: 'Custom Pages',
      slugField: 'title',
      path: 'src/content/pages/*',
      format: { contentField: 'bodyEn' },
      schema: {
        title: fields.slug({
          name: { label: 'Page title (EN, used as URL)' },
          description: 'The title becomes the URL — e.g. "Studio Policies" → /pages/studio-policies. Avoid changing it after publishing or old links will break.',
        }),
        titleFr: fields.text({
          label: 'Page title — FR',
          description: 'French version of the page title. Leave blank to fall back to English.',
          defaultValue: '',
        }),
        intro: fields.text({
          label: 'Short intro / subtitle',
          description: 'One-line subtitle that appears under the title. Optional.',
          defaultValue: '',
        }),
        introFr: fields.text({ label: 'Short intro / subtitle — FR', defaultValue: '' }),
        image: fields.image({
          label: 'Hero image (optional)',
          description: 'Optional photo at the top of the page. Skip for text-only pages.',
          directory: 'public/images/pages',
          publicPath: '/images/pages/',
        }),
        imageAlt: fields.text({
          label: 'Hero image alt text',
          description: 'Describes the image for screen readers and SEO. Leave blank to use the page title.',
          defaultValue: '',
        }),
        noindex: fields.checkbox({
          label: 'Hide from search engines',
          description: 'Tick this for internal pages (e.g. "Booking Policies" linked only from the booking page) you do not want Google to index.',
          defaultValue: false,
        }),
        bodyFr: fields.text({
          label: 'Body — FR',
          multiline: true,
          defaultValue: '',
          description: 'French body. Plain text with paragraph breaks. Leave blank to fall back to English.',
        }),
        bodyEn: fields.markdoc({
          label: 'Body — EN',
          description: 'Page content. Use the toolbar for formatting.',
        }),
      },
    }),
    reviews: collection({
      label: 'Reviews',
      slugField: 'reviewer',
      path: 'src/content/reviews/*',
      format: { contentField: 'body' },
      schema: {
        reviewer: fields.slug({
          name: { label: 'Reviewer name' },
          description: 'First name or "First L." (e.g. "Sarah M.").',
        }),
        rating: fields.number({
          label: 'Rating (1-5)',
          defaultValue: 5,
          validation: { min: 1, max: 5 },
        }),
        date: fields.date({
          label: 'Review date',
        }),
        source: fields.select({
          label: 'Source',
          options: [
            { label: 'Google', value: 'google' },
            { label: 'Yelp', value: 'yelp' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'In person', value: 'in-person' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'google',
        }),
        featured: fields.checkbox({
          label: 'Featured on homepage',
        }),
        body: fields.markdoc({
          label: 'Review text',
          description: 'Reviews are NOT translated — preserve the original language the client wrote in.',
        }),
      },
    }),
  },
});
