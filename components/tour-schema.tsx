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
  };
}

export function TourSchema({ tour }: TourSchemaProps) {
  const baseUrl = 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai';
  const tourUrl = `${baseUrl}/tours/${tour.slug}`;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.description,
    "image": tour.image.startsWith('http') ? tour.image : `${baseUrl}${tour.image}`,
    "url": tourUrl,
    "offers": {
      "@type": "Offer",
      "price": tour.priceRub,
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock",
      "url": tourUrl,
      "priceValidUntil": "2025-12-31",
      "seller": {
        "@type": "Organization",
        "name": "Южный Континент",
        "url": baseUrl
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": tour.rating,
      "reviewCount": tour.reviewCount,
      "bestRating": 5,
      "worstRating": 1
    },
    "duration": `PT${tour.durationHours}H`,
    "provider": {
      "@type": "Organization",
      "name": "Южный Континент",
      "url": baseUrl,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Сочи",
        "addressRegion": "Краснодарский край",
        "addressCountry": "RU"
      }
    },
    "touristType": "Туристы",
    "isAccessibleForFree": false
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Схема для организации (LocalBusiness)
export function OrganizationSchema() {
  const baseUrl = 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Южный Континент",
    "description": "Премиум экскурсии и туры по Сочи, Адлеру, Красной Поляне и Абхазии",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "image": `${baseUrl}/logo.png`,
    "telephone": "+7-XXX-XXX-XX-XX",
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
    },
    "areaServed": {
      "@type": "City",
      "name": "Сочи"
    },
    "priceRange": "₽₽",
    "sameAs": [
      // Добавьте ссылки на соцсети если есть
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Схема для хлебных крошек
interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const baseUrl = 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
