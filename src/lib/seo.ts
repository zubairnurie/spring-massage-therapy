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

export function buildLocalBusinessJsonLd(input: LocalBusinessInput): string {
  const sameAs = [input.facebook, input.instagram].filter(Boolean);

  // Address parsing — assume "<street>, <city>, <region>" format with sane fallbacks.
  const parts = (input.address ?? '').split(',').map(s => s.trim());
  const street = parts[0] || '';
  const city = parts[1] || 'Montréal';
  const region = parts[2] || 'Quebec';

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

  return buildLocalBusinessJsonLd({
    url: absoluteUrl,
    description: site?.defaultDescription ?? 'Massage therapy in Montréal.',
    phone: contact?.phone,
    address: contact?.address,
    hours: contact?.hours,
    priceRange: site?.priceRange ?? '$$',
    socialImage,
    facebook: contact?.facebook ?? null,
    instagram: contact?.instagram ?? null,
  });
}
