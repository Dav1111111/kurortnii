const BASE_URL = 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai';

// Дата окончания действия цен: всегда конец текущего года
function getPriceValidUntil(): string {
  const year = new Date().getFullYear();
  return `${year}-12-31`;
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
  };
}

export function TourSchema({ tour }: TourSchemaProps) {
  const tourUrl = `${BASE_URL}/tours/${tour.slug}`;
  const imageUrl = tour.image.startsWith('http') ? tour.image : `${BASE_URL}${tour.image}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.description,
    "image": imageUrl,
    "url": tourUrl,
    "offers": {
      "@type": "Offer",
      "price": tour.priceRub,
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock",
      "url": tourUrl,
      // Дата рассчитывается динамически — не протухнет при деплое
      "priceValidUntil": getPriceValidUntil(),
      "seller": {
        "@type": "Organization",
        "name": "Южный Континент",
        "url": BASE_URL
      }
    },
    // AggregateRating выводим только если есть хотя бы один отзыв
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
    "provider": {
      "@type": "TravelAgency",
      "name": "Южный Континент",
      "url": BASE_URL,
      "telephone": "+79891668631", // TODO: заменить на реальный номер
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Сочи",
        "addressRegion": "Краснодарский край",
        "addressCountry": "RU"
      }
    },
    "touristType": [
      {
        "@type": "Audience",
        "audienceType": "Туристы"
      }
    ],
    "isAccessibleForFree": false
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── OrganizationSchema (LocalBusiness / TravelAgency) ───────────────────────
// Используется в app/layout.tsx — выводится на каждой странице сайта

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Южный Континент",
    "alternateName": "Южный Континент Сочи",
    "description": "Экскурсионное агентство в Сочи: групповые и индивидуальные туры по Сочи, Красной Поляне, Абхазии и Адлеру с 2010 года",
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/logo.png`,
      "width": 200,
      "height": 60
    },
    "image": `${BASE_URL}/og-image.jpg`,
    "telephone": "+79891668631",
    "email": "info@south-continent.ru",
    "foundingDate": "2010",
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
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday",
          "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "areaServed": [
      {
        "@type": "City",
        "name": "Сочи"
      },
      {
        "@type": "City",
        "name": "Адлер"
      },
      {
        "@type": "City",
        "name": "Красная Поляна"
      }
    ],
    "priceRange": "₽–₽₽₽",
    "currenciesAccepted": "RUB",
    "paymentAccepted": "Cash, Credit Card, СБП",
    // TODO: добавьте реальные ссылки на соцсети когда появятся
    "sameAs": [
      // "https://vk.com/yug_kontinent",
      // "https://t.me/yug_kontinent",
      // "https://www.instagram.com/yug_kontinent/"
    ]
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
  items: Array<{
    name: string;
    url: string;
  }>;
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
// Используется на странице /tours для вывода всех туров списком
// Позволяет Google показывать карусель туров в выдаче

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
// Используется на странице /faq
// Google ограничил FAQPage rich results для коммерческих сайтов (август 2023),
// однако schema.org FAQPage по-прежнему улучшает видимость в LLM/AI-поиске
// (Яндекс ИИ, ChatGPT, Perplexity, Google SGE).

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── ReviewsPageSchema ────────────────────────────────────────────────────────
// Агрегированный рейтинг организации на странице /reviews
// Опирается на суммарные данные по всем турам

export function ReviewsPageSchema() {
  // Суммарные данные по всем 15 турам из tours.json
  // reviewCount = 245+134+320+210+180+90+60+234+120+110+56 (туры с ненулевыми reviewCount)
  // Туры с reviewCount:0 (witch-gorge, bus-33-waterfalls, witch-gorge-6in1, bigfoot-quads) не учитываются
  const totalReviewCount = 1759; // TODO: вычислять динамически из tours.json
  const averageRating = 4.8;     // TODO: вычислять динамически

  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Южный Континент",
    "url": BASE_URL,
    "telephone": "+79891668631",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "reviewCount": totalReviewCount,
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

// ─── AboutPageSchema ──────────────────────────────────────────────────────────
// Схема для страницы /about: организация + сотрудники (Person)
// ВАЖНО: teamMembers в about/page.tsx содержат вымышленные данные.
// Замените на реальные имена и фото перед публикацией.

export function AboutPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Южный Континент",
    "url": BASE_URL,
    "foundingDate": "2010",
    "description": "Локальное экскурсионное агентство, основанное в 2010 году профессиональными гидами-энтузиастами Сочи",
    "employee": [
      // TODO: заменить на реальные данные команды
      {
        "@type": "Person",
        "name": "Анна Петрова",
        "jobTitle": "Генеральный директор",
        "worksFor": {
          "@type": "TravelAgency",
          "name": "Южный Континент"
        }
      },
      {
        "@type": "Person",
        "name": "Михаил Иванов",
        "jobTitle": "Руководитель экскурсионного отдела",
        "worksFor": {
          "@type": "TravelAgency",
          "name": "Южный Континент"
        }
      },
      {
        "@type": "Person",
        "name": "Елена Смирнова",
        "jobTitle": "Главный гид-экскурсовод",
        "worksFor": {
          "@type": "TravelAgency",
          "name": "Южный Континент"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
