import toursData from "@/data/tours.json";

const BASE_URL = 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai';
const ORG_ID = `${BASE_URL}/#organization`;

// Дата окончания действия цен: всегда конец текущего года
function getPriceValidUntil(): string {
  const year = new Date().getFullYear();
  return `${year}-12-31`;
}

// Динамически вычисляем агрегированный рейтинг из tours.json
function getAggregateRating() {
  const tours = toursData.tours;
  const total = tours.reduce((s, t) => s + (t.reviewCount ?? 0), 0);
  const weightedSum = tours.reduce((s, t) => s + (t.rating * (t.reviewCount ?? 0)), 0);
  const avg = total > 0 ? Math.round((weightedSum / total) * 10) / 10 : 4.8;
  return { total, avg };
}

interface TourSchemaProps {
  tour: {
    title: string;
    description: string;
    priceRub: number;
    rating: number;
    reviewCount: number;
    durationHours: number;
    image: string;
    slug: string;
    category?: string;
  };
}

export function TourSchema({ tour }: TourSchemaProps) {
  const tourUrl = `${BASE_URL}/tours/${tour.slug}`;
  const imageUrl = tour.image.startsWith('http') ? tour.image : `${BASE_URL}${tour.image}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${tourUrl}#trip`,
    "name": tour.title,
    "description": tour.description,
    "image": imageUrl,
    "url": tourUrl,
    "touristType": [{ "@type": "Audience", "audienceType": "Туристы" }],
    "location": {
      "@type": "Place",
      "name": "Сочи и окрестности",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Сочи",
        "addressRegion": "Краснодарский край",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "43.585472",
        "longitude": "39.723098"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": tour.priceRub,
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock",
      "url": tourUrl,
      "priceValidUntil": getPriceValidUntil(),
      "seller": { "@type": "Organization", "@id": ORG_ID }
    },
    ...(tour.reviewCount > 0 && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": tour.rating,
        "reviewCount": tour.reviewCount,
        "bestRating": 5,
        "worstRating": 1
      }
    }),
    "duration": `PT${tour.durationHours}H`,
    "provider": { "@type": "TravelAgency", "@id": ORG_ID },
    "isAccessibleForFree": false
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── OrganizationSchema ───────────────────────────────────────────────────────

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    "name": "Южный Континент",
    "alternateName": "Южный Континент Сочи",
    "description": "Экскурсионное агентство в Сочи — авторские маршруты по Сочи, Красной Поляне, Абхазии и Адлеру с 2014 года",
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/logo.png`,
      "width": 200,
      "height": 60
    },
    "image": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/og-image.jpg`,
      "width": 1200,
      "height": 630
    },
    "telephone": "+79891668631",
    "foundingDate": "2014",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Курортный проспект, 47",
      "addressLocality": "Сочи",
      "addressRegion": "Краснодарский край",
      "postalCode": "354000",
      "addressCountry": "RU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "43.585472",
      "longitude": "39.723098"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "09:00",
        "closes": "20:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday","Sunday"],
        "opens": "10:00",
        "closes": "18:00"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Сочи" },
      { "@type": "City", "name": "Адлер" },
      { "@type": "City", "name": "Красная Поляна" },
      { "@type": "Country", "name": "Абхазия" }
    ],
    "priceRange": "₽–₽₽₽",
    "currenciesAccepted": "RUB",
    "paymentAccepted": "Cash, Credit Card, СБП",
    "sameAs": [
      "https://t.me/yug_kontinent"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": getAggregateRating().avg,
      "reviewCount": getAggregateRating().total,
      "bestRating": 5,
      "worstRating": 1
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── WebSiteSchema ────────────────────────────────────────────────────────────
// SearchAction для Sitelinks Search Box

export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    "url": BASE_URL,
    "name": "Южный Континент",
    "publisher": { "@type": "Organization", "@id": ORG_ID },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/tours?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── BreadcrumbSchema ─────────────────────────────────────────────────────────

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── ToursItemListSchema ──────────────────────────────────────────────────────

interface ToursListItem {
  title: string;
  slug: string;
  image: string;
  priceRub: number;
}

interface ToursItemListSchemaProps {
  tours: ToursListItem[];
}

export function ToursItemListSchema({ tours }: ToursItemListSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Экскурсии в Сочи — Южный Континент",
    "description": "Полный каталог экскурсий по Сочи, Красной Поляне и Абхазии",
    "url": `${BASE_URL}/tours`,
    "numberOfItems": tours.length,
    "itemListElement": tours.map((tour, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `${BASE_URL}/tours/${tour.slug}`,
      "name": tour.title,
      "image": tour.image.startsWith('http') ? tour.image : `${BASE_URL}${tour.image}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── FAQSchema ────────────────────────────────────────────────────────────────

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": { "@type": "Answer", "text": item.answer }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ReviewsPageSchema removed — aggregateRating now lives on TravelAgency in OrganizationSchema
// to avoid @type conflict between LocalBusiness and TravelAgency sharing the same @id.

// ─── AboutPageSchema ──────────────────────────────────────────────────────────
// Тип AboutPage — не дублирует TravelAgency из layout

export function AboutPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE_URL}/about#aboutpage`,
    "url": `${BASE_URL}/about`,
    "name": "О компании Южный Континент",
    "description": "Локальное экскурсионное агентство в Сочи. Авторские маршруты, малые группы, гиды — местные жители. С 2014 года.",
    "about": { "@type": "TravelAgency", "@id": ORG_ID },
    "publisher": { "@type": "Organization", "@id": ORG_ID }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
