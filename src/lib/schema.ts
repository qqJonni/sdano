// Конструкторы Schema.org (JSON-LD). Данные — из site.ts.
import { site } from '../data/site';

export const SITE_URL = 'https://sdano-perm.ru';
const abs = (path = '/') => new URL(path, SITE_URL).href;
const ORG_ID = `${SITE_URL}/#organization`;

// Достаём число из строки цены («от 18 000 ₽/м²» -> 18000)
export function priceNumber(s?: string): number | null {
  if (!s) return null;
  const digits = s.replace(/[^\d]/g, '');
  return digits ? Number(digits) : null;
}

// Глобальная организация — подрядчик по ремонту (LocalBusiness → GeneralContractor)
export function organization() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: SITE_URL,
    logo: abs('/logo.svg'),
    image: abs('/og/default.jpg'),
    telephone: site.phone,
    email: site.email,
    priceRange: 'от 6 000 ₽/м²',
    areaServed: { '@type': 'City', name: site.city },
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: 'RU',
      streetAddress: site.address.replace(/^г\.\s*Пермь,\s*/i, ''),
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [site.telegram.url, site.max.url],
  };
}

export interface Crumb {
  name: string;
  path: string;
}
export function breadcrumbs(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function service(opts: {
  name: string;
  serviceType?: string;
  description?: string;
  path: string;
  priceFrom?: string;
}) {
  const price = priceNumber(opts.priceFrom);
  const node: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType ?? opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'City', name: site.city },
    url: abs(opts.path),
  };
  if (price) {
    node.offers = {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price,
        priceCurrency: 'RUB',
        // «от» — минимальная цена
        minPrice: price,
        unitText: 'м²',
      },
      availability: 'https://schema.org/InStock',
    };
  }
  return node;
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
}

// Объект портфолио — CreativeWork с изображением
export function creativeWork(opts: {
  name: string;
  description: string;
  path: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    ...(opts.image ? { image: opts.image } : {}),
    creator: { '@id': ORG_ID },
  };
}
