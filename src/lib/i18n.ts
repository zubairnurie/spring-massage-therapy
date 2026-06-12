/**
 * Bilingual helpers — English (EN) is the default. French (FR) falls back to EN
 * when a translation is missing.
 *
 * URL strategy:
 *   /              → English homepage
 *   /fr/           → French homepage
 *   /services      → English services
 *   /fr/services   → French services
 */

export type Locale = 'en' | 'fr';

export const LOCALES: Locale[] = ['en', 'fr'];
export const DEFAULT_LOCALE: Locale = 'en';

/** Pick the right translation, falling back to English when FR is empty. */
export function t<T extends Record<string, any>>(
  obj: T | null | undefined,
  fieldBase: string,
  locale: Locale,
  fallback = ''
): string {
  if (!obj) return fallback;
  if (locale === 'fr') {
    const fr = (obj as any)[`${fieldBase}Fr`];
    if (fr && String(fr).trim()) return String(fr);
  }
  const en = (obj as any)[`${fieldBase}En`];
  return en ? String(en) : fallback;
}

/** True iff the FR translation is present and non-empty. */
export function hasFr<T extends Record<string, any>>(
  obj: T | null | undefined,
  fieldBase: string
): boolean {
  if (!obj) return false;
  const fr = (obj as any)[`${fieldBase}Fr`];
  return Boolean(fr && String(fr).trim());
}

/** Build the URL for a path in a given locale. */
export function localePath(path: string, locale: Locale): string {
  // Strip a leading /fr/ if present so we always start clean
  const cleaned = path.replace(/^\/fr(\/|$)/, '/');
  if (locale === 'en') return cleaned || '/';
  // Remove duplicate slashes
  if (cleaned === '/') return '/fr/';
  return `/fr${cleaned}`;
}

/** Detect the locale from a request pathname. */
export function localeFromPath(pathname: string): Locale {
  return pathname.startsWith('/fr/') || pathname === '/fr' ? 'fr' : 'en';
}

/** Strip the locale prefix from a pathname. */
export function pathWithoutLocale(pathname: string): string {
  if (pathname === '/fr' || pathname === '/fr/') return '/';
  if (pathname.startsWith('/fr/')) return pathname.slice(3);
  return pathname;
}

/** UI strings — site chrome (nav, buttons, etc) that aren't in Keystatic. */
export const ui = {
  en: {
    nav: {
      home: 'Home',
      promotions: 'Promotions',
      services: 'Services',
      reviews: 'Reviews',
      about: 'About',
      contact: 'Contact',
    },
    bookNow: 'Book Now',
    bookSession: 'Book a Session',
    bookThis: 'Book →',
    callToBook: 'Call to book',
    leaveReview: 'Leave a review',
    seeAllOnGoogle: 'See all on Google →',
    averageFrom: (rating: string, count: number | string) => `${rating} average from ${count} reviews`,
    translationComingSoon: 'Translation coming soon — showing English content for now.',
    seeFullMenu: 'See full menu',
    readMore: 'Read more →',
    callPhone: (phone: string) => `Call ${phone}`,
    orCall: (phone: string) => `Or call ${phone}`,
    makeAppointment: 'Make an Appointment',
    youOweYourself: 'You owe yourself this moment',
    ourSpecialOffer: 'Our special offer',
    comeAndUnwind: 'Come and unwind',
    openHours: 'Open Hours',
    contactLabel: 'Contact',
    welcome: 'Welcome — entrance via the staircase',
    welcomeFr: "Bienvenue! Entré du studio par l'escalier",
    findUs: 'Find us',
    inMontreal: 'Made with care in Montréal',
    allRights: '© {year} Spring Massage Therapy — All rights reserved.',
    pricingPlan: 'Pricing plan',
    servicesAndPricing: 'Services & pricing',
    currentPromotions: 'Current promotions',
    summerPromotionsTitle: 'Summer 2026 Promotions',
    giftToYourself: 'Gift to yourself or to a significant other',
    kindWords: 'Kind words',
    whatClientsSay: 'What clients say',
    kindWordsFromClients: 'Kind words from clients',
    trustedByMontrealers: 'Trusted by Montréalers',
    aboutZarah: 'About Zarah',
    massageTherapist: 'Massage Therapist',
    aPeacefulRetreat: 'A peaceful retreat',
    aboutTheStudio: 'About the Studio',
    hiddenGem: 'A hidden gem in the heart of the city, for you to discover.',
    finalNote: 'I look forward to welcoming you. Please feel free to reach out if you have any questions or would like to know more.',
    aHiddenGem: 'A hidden gem',
    reachOut: 'Reach out',
    getInTouch: 'Get in touch',
    getInTouchBody: 'It is my pleasure to answer any of your questions and inquiries on the latest discounts.',
    call: 'Call',
    visit: 'Visit',
    hoursLabel: 'Hours',
    haveAQuestion: (phone: string) => `Have a question? Call ${phone} — happy to help.`,
    inTheirOwnWords: 'In their own words',
    clientReviews: 'Client reviews',
    reviewsIntro: "Massage therapy is deeply personal. The kindest thing I can share are the words of clients who've sat with me — thank you for trusting me with your time.",
    onlineBookingComingSoon: "Online booking is being set up. In the meantime, please call or text and we'll find a time that works for you.",
    pickATime: "Pick a time that works for you. If you don't see a slot you need, please call",
    chooseASession: 'Choose a session',
    preferToTalk: 'Prefer to talk to a human?',
    bookYourSession: 'Book your session',
    bookingNoScript: 'Booking requires JavaScript. Please call',
    tailoredToYourNeeds: 'Tailored to your needs',
    everySession: 'Every session is approached with warmth and mindfulness, thoughtfully tailored to your individual needs and rhythms.',
    bookAnySession: 'Book Any Session',
    noActivePromos: 'No active promotions right now — check back soon!',
    siteFooterTagline: 'A hidden gem in the heart of Montréal. Massage tailored to your needs — for relaxation, healing, and pain relief.',
    serviceGroups: {
      'full-body': 'Full Body Massage',
      'specialty': 'Specialty Sessions',
      'targeted': 'Targeted & Add-ons',
      'other': 'Other Services',
    },
  },
  fr: {
    nav: {
      home: 'Accueil',
      promotions: 'Promotions',
      services: 'Services',
      reviews: 'Avis',
      about: 'À propos',
      contact: 'Contact',
    },
    bookNow: 'Réserver',
    bookSession: 'Réserver une séance',
    bookThis: 'Réserver →',
    callToBook: 'Appeler pour réserver',
    leaveReview: 'Laisser un avis',
    seeAllOnGoogle: 'Voir tous les avis sur Google →',
    averageFrom: (rating: string, count: number | string) => `${rating} de moyenne sur ${count} avis`,
    translationComingSoon: 'Traduction à venir — affichage du contenu anglais pour le moment.',
    seeFullMenu: 'Voir le menu complet',
    readMore: 'En savoir plus →',
    callPhone: (phone: string) => `Appeler ${phone}`,
    orCall: (phone: string) => `Ou appeler ${phone}`,
    makeAppointment: 'Prendre rendez-vous',
    youOweYourself: 'Vous méritez ce moment',
    ourSpecialOffer: 'Notre offre spéciale',
    comeAndUnwind: 'Venez vous détendre',
    openHours: 'Heures d\'ouverture',
    contactLabel: 'Contact',
    welcome: "Bienvenue — entrée par l'escalier",
    welcomeFr: "Bienvenue! Entré du studio par l'escalier",
    findUs: 'Nous trouver',
    inMontreal: 'Fait avec soin à Montréal',
    allRights: '© {year} Spring Massage Therapy — Tous droits réservés.',
    pricingPlan: 'Tarifs',
    servicesAndPricing: 'Services et tarifs',
    currentPromotions: 'Promotions en cours',
    summerPromotionsTitle: 'Promotions été 2026',
    giftToYourself: "Offrez-vous, ou à un être cher",
    kindWords: 'Mots gentils',
    whatClientsSay: 'Ce que disent les client·es',
    kindWordsFromClients: 'Mots gentils de nos client·es',
    trustedByMontrealers: 'La confiance des Montréalais·es',
    aboutZarah: 'À propos de Zarah',
    massageTherapist: 'Massothérapeute',
    aPeacefulRetreat: 'Un havre de paix',
    aboutTheStudio: 'À propos du studio',
    hiddenGem: 'Un trésor caché au cœur de la ville, à découvrir.',
    finalNote: "Je serai heureuse de vous accueillir. N'hésitez pas à m'écrire si vous avez des questions.",
    aHiddenGem: 'Un trésor caché',
    reachOut: 'Contactez-moi',
    getInTouch: 'Entrer en contact',
    getInTouchBody: "C'est avec plaisir que je réponds à vos questions et vous informe sur les promotions en cours.",
    call: 'Appeler',
    visit: 'Visiter',
    hoursLabel: 'Heures',
    haveAQuestion: (phone: string) => `Une question ? Appelez ${phone} — je suis là pour vous.`,
    inTheirOwnWords: 'Dans leurs mots',
    clientReviews: 'Avis de clients',
    reviewsIntro: "La massothérapie est une expérience profondément personnelle. Voici les mots de personnes qui sont venues me rencontrer — merci de m'avoir accordé votre confiance.",
    onlineBookingComingSoon: "La réservation en ligne arrive bientôt. En attendant, appelez ou écrivez-moi et nous trouverons un moment qui vous convient.",
    pickATime: "Choisissez l'heure qui vous convient. Si vous ne voyez pas le créneau souhaité, appelez",
    chooseASession: 'Choisir une séance',
    preferToTalk: 'Vous préférez parler à une personne ?',
    bookYourSession: 'Réservez votre séance',
    bookingNoScript: 'La réservation nécessite JavaScript. Appelez',
    tailoredToYourNeeds: 'Adapté à vos besoins',
    everySession: "Chaque séance est abordée avec chaleur et attention, soigneusement adaptée à vos besoins et à votre rythme.",
    bookAnySession: 'Réserver',
    noActivePromos: 'Aucune promotion en cours — revenez bientôt !',
    siteFooterTagline: 'Un trésor caché au cœur de Montréal. Massothérapie adaptée à vos besoins — pour la détente, la guérison et le soulagement de la douleur.',
    serviceGroups: {
      'full-body': 'Massage complet du corps',
      'specialty': 'Séances spécialisées',
      'targeted': 'Ciblé et compléments',
      'other': 'Autres services',
    },
  },
} as const;

export function strings(locale: Locale) {
  return ui[locale];
}
