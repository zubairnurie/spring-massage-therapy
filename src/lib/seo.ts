/**
 * Build LocalBusiness JSON-LD structured data for Google.
 * Returns a JSON string ready for <script type="application/ld+json">.
 */
import { reader } from './reader';

export interface LocalBusinessInput {
  name?: string;
  url: string;
  description: string;
  phone?: string;
  address?: string;
  hours?: string;
  priceRange?: string;
  socialImage?: string | null;
  facebook?: string | null;
  instagram?: string | null;
}

/**
 * Parse a free-form address like "2229 Hawarden, Montréal, Québec" into
 * structured parts. Falls back to sane defaults for the practice if parts
 * are missing.
 */
function parseAddress(raw: string | undefined) {
  const parts = (raw ?? '').split(',').map(s => s.trim()).filter(Boolean);
  return {
    street: parts[0] || '2229 Hawarden',
    city: parts[1] || 'Montréal',
    region: parts[2] || 'Québec',
  };
}

export function buildLocalBusinessJsonLd(input: LocalBusinessInput): string {
  const sameAs = [input.facebook, input.instagram].filter(Boolean);
  const { street, city, region } = parseAddress(input.address);

  const data: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'MassageTherapy',
    '@id': input.url,
    name: input.name ?? 'Spring Massage Therapy',
    url: input.url,
    description: input.description,
    priceRange: input.priceRange ?? '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: city,
      addressRegion: region,
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 45.4878,
      longitude: -73.6051,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '21:00',
      },
    ],
  };

  if (input.phone) data.telephone = input.phone;
  if (input.socialImage) data.image = input.socialImage;
  if (sameAs.length > 0) data.sameAs = sameAs;

  return JSON.stringify(data);
}

/**
 * Default description used in JSON-LD when the editor hasn't set one.
 * Long-form, keyword-rich for local SEO.
 */
const FALLBACK_DESCRIPTION_EN =
  'Spring Massage Therapy is a peaceful retreat in Montréal offering Swedish, deep tissue, hot stone, facial, foot, and couples massage by Zarah Bellamy. Located in a heritage Tudor manor at 2229 Hawarden, open every day 8 AM to 9 PM. Walk-ins and online booking welcome.';

/**
 * Convenience: read all the singletons we need and produce the JSON-LD string.
 */
export async function buildJsonLdFromContent(absoluteUrl: string): Promise<string> {
  const [contact, site] = await Promise.all([
    reader.singletons.contactInfo.read(),
    reader.singletons.site.read(),
  ]);

  const socialImage = site?.socialImage
    ? new URL(site.socialImage, absoluteUrl).toString()
    : null;

  // Prefer the editor-set EN description; if blank, use the keyword-rich fallback.
  const description = (site?.defaultDescriptionEn ?? '').trim() || FALLBACK_DESCRIPTION_EN;

  // Use the EN address (structured fields aren't translated).
  const address = (contact?.addressEn ?? '').trim() || '2229 Hawarden, Montréal, Québec';
  const hours = (contact?.hoursEn ?? '').trim();

  return buildLocalBusinessJsonLd({
    url: absoluteUrl,
    description,
    phone: contact?.phone,
    address,
    hours,
    priceRange: site?.priceRange ?? '$$',
    socialImage,
    facebook: contact?.facebook ?? null,
    instagram: contact?.instagram ?? null,
  });
}
