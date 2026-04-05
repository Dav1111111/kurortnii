# Schema.org Аудит — Южный Континент
**Сайт:** https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai (https://южный-континент.рф)  
**Дата аудита:** 2026-04-06  
**Аудитор:** Claude Schema.org Specialist  
**Стек:** Next.js 14, JSON-LD через `<script type="application/ld+json">`

---

## Итоговая оценка

| Категория | Статус |
|---|---|
| Формат (JSON-LD vs Microdata) | PASS |
| @context | PASS |
| @type корректность | PASS с оговорками |
| Обязательные поля | ЧАСТИЧНО — 3 критические ошибки |
| Рекомендуемые поля | ЧАСТИЧНО — 5 предупреждений |
| Дублирование схем | FAIL — 2 конфликта |
| Rich Results потенциал (Google) | СРЕДНИЙ |
| Rich Results потенциал (Яндекс) | ВЫСОКИЙ |

---

## 1. Инвентаризация схем по страницам

### `/` (Главная)
| Схема | Источник | Статус |
|---|---|---|
| `TravelAgency` | `OrganizationSchema` в `layout.tsx` | Есть, глобальная |
| `FAQPage` | Компонент `<FAQ>` | ОТСУТСТВУЕТ — компонент FAQ рендерится на главной, но FAQSchema НЕ подключена |

### `/tours` (Каталог)
| Схема | Источник | Статус |
|---|---|---|
| `TravelAgency` | `layout.tsx` (глобальная) | Есть |
| `ItemList` | `ToursItemListSchema` | Есть |

### `/tours/witch-gorge` (и все страницы туров)
| Схема | Источник | Статус |
|---|---|---|
| `TravelAgency` | `layout.tsx` (глобальная) | Есть |
| `TouristTrip` + `Offer` + `AggregateRating` | `TourSchema` | Есть |
| `BreadcrumbList` | `BreadcrumbSchema` | Есть |

### `/faq`
| Схема | Источник | Статус |
|---|---|---|
| `TravelAgency` | `layout.tsx` (глобальная) | Есть |
| `FAQPage` | `FAQSchema` | Есть |

### `/about`
| Схема | Источник | Статус |
|---|---|---|
| `TravelAgency` | `layout.tsx` (глобальная) | Есть (глобальная, полная) |
| `TravelAgency` | `AboutPageSchema` | ДУБЛЬ — вторая TravelAgency без полных данных |

### `/reviews`
| Схема | Источник | Статус |
|---|---|---|
| `TravelAgency` | `layout.tsx` (глобальная) | Есть |
| `TravelAgency` + `AggregateRating` | `ReviewsPageSchema` | ДУБЛЬ — конфликт с глобальной |

---

## 2. Критические ошибки (FAIL)

### ОШИБКА 1: Дублирование TravelAgency на `/about` и `/reviews`

**Файл:** `components/tour-schema.tsx` — `AboutPageSchema()` и `ReviewsPageSchema()`

На каждой странице одновременно рендерятся два блока `TravelAgency`:
- Глобальный (из `layout.tsx` через `OrganizationSchema`) — полный, с адресом, гео, часами работы
- Страничный (`AboutPageSchema` / `ReviewsPageSchema`) — неполный, без адреса и geo

Google Search Console и валидатор schema.org воспринимают это как два разных объекта одного типа. Это снижает определённость для парсера и может отменить rich result для LocalBusiness.

**Решение:**

На `/about` — заменить `AboutPageSchema` на `AboutPage` WebPage schema и вынести данные о сотрудниках в отдельный граф:

```json
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/about",
  "name": "О компании — Южный Континент",
  "description": "Локальное экскурсионное агентство в Сочи с 2014 года",
  "mainEntity": {
    "@type": "TravelAgency",
    "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#organization",
    "employee": [
      {
        "@type": "Person",
        "name": "РЕАЛЬНОЕ ИМЯ",
        "jobTitle": "Генеральный директор"
      }
    ]
  }
}
```

На `/reviews` — убрать `ReviewsPageSchema` как отдельный компонент. Вместо этого добавить `aggregateRating` в глобальный `OrganizationSchema` в `tour-schema.tsx` или рендерить его через `@id`-ссылку:

```json
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#organization",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.8,
    "reviewCount": 1759,
    "bestRating": 5,
    "worstRating": 1
  }
}
```

---

### ОШИБКА 2: FAQSchema отсутствует на главной странице, хотя FAQ-компонент там рендерится

**Файл:** `app/page.tsx`

Компонент `<FAQ>` выводится на главной странице (строка 6 и 15), но `FAQSchema` нигде не подключена для `/`. В `app/faq/page.tsx` схема есть, но там другой набор вопросов (7 штук vs 5 на главной).

Это означает, что FAQ-контент главной страницы не размечен структурно. Для Яндекс ИИ и LLM-поиска это упущенная возможность.

**Важно:** Для Google FAQPage rich results ограничены государственными и медицинскими сайтами с августа 2023 года. Для коммерческого сайта Google не покажет rich result из FAQPage, однако Яндекс и AI-агрегаторы (Perplexity, ChatGPT) продолжают использовать FAQPage для формирования ответов.

**Решение:** Добавить `FAQSchema` в `app/page.tsx` с вопросами из компонента `faq.tsx`:

```tsx
import { FAQSchema } from "@/components/tour-schema";

// В Home():
<FAQSchema items={[
  { question: "Какие способы оплаты вы принимаете?", answer: "..." },
  // ... остальные из components/faq.tsx
]} />
```

---

### ОШИБКА 3: `TouristTrip` — отсутствует поле `touristType` с корректным значением + нет `location`

**Файл:** `components/tour-schema.tsx`, функция `TourSchema()`

Текущий код:
```json
"touristType": [{ "@type": "Audience", "audienceType": "Туристы" }]
```

Проблемы:
1. `touristType` в схеме `TouristTrip` ожидает тип `Audience` или `Text`. Использование `Audience` с полем `audienceType` технически допустимо, но Google Structured Data Testing Tool воспринимает это как предупреждение, ожидая чистый текст или известный enum.
2. Отсутствует обязательное (для Google rich results) поле `location` — физическое место проведения тура.

**Решение:**

```json
{
  "@type": "TouristTrip",
  "touristType": "Туристы",
  "location": {
    "@type": "Place",
    "name": "Сочи, Краснодарский край",
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
  }
}
```

---

## 3. Предупреждения (WARNING)

### ПРЕДУПРЕЖДЕНИЕ 1: `sameAs` — пустой массив в OrganizationSchema

**Файл:** `components/tour-schema.tsx`, строки 150–154

```js
"sameAs": [
  // "https://vk.com/yug_kontinent",
  // закомментировано
]
```

Пустой `sameAs: []` не влияет на валидацию, но снижает E-E-A-T сигналы. Google использует `sameAs` для Entity disambiguation — привязки организации к Knowledge Graph. Для российского рынка ВКонтакте и Telegram особенно важны.

**Решение:** Как только появятся реальные страницы — добавить. Временно удалить пустой массив.

---

### ПРЕДУПРЕЖДЕНИЕ 2: Фиктивные данные сотрудников в `AboutPageSchema`

**Файл:** `components/tour-schema.tsx`, строки 318–346

Имена "Анна Петрова", "Михаил Иванов", "Елена Смирнова" — вымышленные (об этом есть TODO-комментарий в коде). Публикация фиктивных Person данных в schema.org является нарушением Google Quality Guidelines. Если Google обнаружит несоответствие между разметкой и реальным контентом страницы, это может привести к мануальным санкциям.

**Решение:** До замены на реальные данные — полностью убрать блок `employee` из схемы или закомментировать его.

---

### ПРЕДУПРЕЖДЕНИЕ 3: `foundingDate` конфликтует с данными на странице

**Файл:** `components/tour-schema.tsx`, строка 97 и 316

В `OrganizationSchema` указано `"foundingDate": "2010"`.  
В `AboutPageSchema` тоже `"foundingDate": "2010"`.  
Однако на странице `/about` в `timeline` первая запись — `{ year: "2014", title: "Основание компании" }`, а в тексте: "С 2014 года помогаем туристам".

Три разных источника, три потенциально разных даты. Google парсит и сравнивает текстовый контент с разметкой. Несоответствие — негативный сигнал.

**Решение:** Определить единую дату основания и синхронизировать её во всех местах: схемах, тексте страниц, метаданных.

---

### ПРЕДУПРЕЖДЕНИЕ 4: `witch-gorge` — `reviewCount: 0`, но `AggregateRating` всё равно рассчитывается

**Файл:** `data/tours.json`, тур `witch-gorge`

```json
"rating": 4.8,
"reviewCount": 0
```

В `TourSchema` есть условие `...(tour.reviewCount > 0 && { "aggregateRating": ... })` — это правильно, рейтинг не выводится. Однако `rating: 4.8` при `reviewCount: 0` — бессмысленное значение, которое может быть использовано ошибочно в будущем (например, при изменении условия). Также это влияет на `ReviewsPageSchema`: среднее рейтинга организации (4.8) может некорректно включать туры с 0 отзывами.

**Решение:** Установить `"rating": null` или `"rating": 0` для туров без отзывов в `data/tours.json`.

---

### ПРЕДУПРЕЖДЕНИЕ 5: `ItemList` на `/tours` — элементы списка не содержат `item` с вложенной схемой

**Файл:** `components/tour-schema.tsx`, функция `ToursItemListSchema()`

Текущий вариант:
```json
{
  "@type": "ItemList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "url": "https://.../.../tours/witch-gorge",
    "name": "Тур Ущелье ведьм",
    "image": "..."
  }]
}
```

`ListItem` в `ItemList` поддерживает либо поле `url` (для "Carousel" rich result), либо поле `item` (со вложенным объектом схемы). Использование `url` напрямую — допустимо для Google Carousel, но Google требует, чтобы каждый `ListItem` вёл на отдельную страницу с собственной разметкой типа `TouristTrip`. Это условие выполнено. Проблема в другом: поле `image` не является стандартным полем `ListItem` — оно игнорируется парсером.

**Решение:** Переместить `image` внутрь вложенного объекта `item`:

```json
{
  "@type": "ListItem",
  "position": 1,
  "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours/witch-gorge",
  "name": "Тур Ущелье ведьм",
  "item": {
    "@type": "TouristTrip",
    "name": "Тур Ущелье ведьм",
    "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours/witch-gorge",
    "image": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/images/..."
  }
}
```

---

## 4. Упущенные возможности

### ВОЗМОЖНОСТЬ 1: `WebSite` + `SearchAction` (Sitelinks Search Box)

Google показывает поле поиска прямо в SERP для сайтов с разметкой `SearchAction`. Для каталога туров это критически ценно.

**Рекомендация:** Добавить в `layout.tsx` рядом с `OrganizationSchema`:

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#website",
  "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai",
  "name": "Южный Континент",
  "description": "Экскурсии в Сочи 2026 от 900 ₽",
  "inLanguage": "ru-RU",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

### ВОЗМОЖНОСТЬ 2: `Review` объекты на страницах туров

На страницах туров отображается `AggregateRating`, но не выводятся отдельные объекты `Review`. Google требует наличия хотя бы одного `Review` для показа звёздного рейтинга в сниппете для типа `TouristTrip`.

Текущий `AggregateRating` на страницах туров опирается на статичные данные из `tours.json` (не на реальные отзывы из БД). Если Google не найдёт ни одного `Review` объекта, он может проигнорировать `AggregateRating`.

**Рекомендация:** Добавить в `TourSchema` массив `review` с 2–3 реальными отзывами:

```json
{
  "@type": "TouristTrip",
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Мария К." },
      "datePublished": "2025-08-15",
      "reviewBody": "Отличная экскурсия, очень понравилось!",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": 5,
        "bestRating": 5,
        "worstRating": 1
      }
    }
  ]
}
```

---

### ВОЗМОЖНОСТЬ 3: `BreadcrumbList` отсутствует на `/tours`, `/faq`, `/about`, `/reviews`

**Файл:** `app/tours/page.tsx`, `app/faq/page.tsx`, `app/about/page.tsx`, `app/reviews/page.tsx`

`BreadcrumbSchema` подключена только на страницах конкретных туров (`/tours/[slug]`). На остальных страницах второго уровня хлебные крошки отсутствуют. Это упущение — Google показывает хлебные крошки в сниппете вместо URL, что повышает CTR.

**Рекомендация:** Добавить `BreadcrumbSchema` на все страницы:

```tsx
// app/tours/page.tsx
<BreadcrumbSchema items={[
  { name: "Главная", url: "/" },
  { name: "Все экскурсии", url: "/tours" }
]} />

// app/faq/page.tsx
<BreadcrumbSchema items={[
  { name: "Главная", url: "/" },
  { name: "Вопросы и ответы", url: "/faq" }
]} />

// app/about/page.tsx
<BreadcrumbSchema items={[
  { name: "Главная", url: "/" },
  { name: "О компании", url: "/about" }
]} />

// app/reviews/page.tsx
<BreadcrumbSchema items={[
  { name: "Главная", url: "/" },
  { name: "Отзывы", url: "/reviews" }
]} />
```

---

### ВОЗМОЖНОСТЬ 4: `Service` схема для категорий туров

На главной и на `/tours` отображаются категории (городские, горные, морские, детские, джипинг, Абхазия). Каждая категория — это отдельный `Service` агентства. Разметка `Service` повышает релевантность по коммерческим запросам и улучшает понимание структуры бизнеса поисковиком.

**Рекомендация:** Добавить на главную страницу или в `OrganizationSchema` блок `hasOfferCatalog`:

```json
{
  "@type": "TravelAgency",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Экскурсии в Сочи",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Городские экскурсии по Сочи",
          "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Экскурсии в Абхазию",
          "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Джипинг в горах Сочи",
          "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours"
        }
      }
    ]
  }
}
```

---

### ВОЗМОЖНОСТЬ 5: `@id` для связывания объектов (Linked Data Graph)

Текущие схемы существуют как изолированные блоки JSON-LD. Ни один объект не имеет `@id`, поэтому Google не может связать `TravelAgency` из `layout.tsx` с `TravelAgency` из `ReviewsPageSchema` — они воспринимаются как два разных субъекта.

**Рекомендация:** Добавить `@id` к ключевым объектам:

```json
// OrganizationSchema в layout.tsx
{
  "@type": "TravelAgency",
  "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#organization"
}

// ReviewsPageSchema — ссылка через @id
{
  "@type": "TravelAgency",
  "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#organization",
  "aggregateRating": { ... }
}

// TourSchema — ссылка на провайдера
{
  "provider": {
    "@type": "TravelAgency",
    "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#organization"
  }
}
```

---

## 5. Валидация ключевых полей

### `OrganizationSchema` (TravelAgency) — глобальная

| Поле | Значение | Статус |
|---|---|---|
| `@context` | `https://schema.org` | PASS |
| `@type` | `TravelAgency` | PASS — является подтипом LocalBusiness |
| `name` | "Южный Континент" | PASS |
| `url` | Абсолютный URL | PASS |
| `telephone` | `+79891668631` | PASS — формат E.164 |
| `address.addressCountry` | `RU` | PASS — ISO 3166-1 alpha-2 |
| `geo` | GeoCoordinates с lat/lon | PASS |
| `openingHoursSpecification` | Полная неделя 09:00–21:00 | PASS |
| `logo` | ImageObject с width/height | PASS |
| `foundingDate` | `"2010"` | WARNING — конфликт с контентом (2014) |
| `sameAs` | `[]` (пустой) | WARNING — лучше убрать |
| `@id` | отсутствует | WARNING — нет Linked Data |
| `priceRange` | `"₽–₽₽₽"` | INFO — нестандартный формат; Google ожидает `"₽"` или диапазон числами |

### `TouristTrip` (страницы туров)

| Поле | Значение | Статус |
|---|---|---|
| `@context` | `https://schema.org` | PASS |
| `@type` | `TouristTrip` | PASS |
| `name` | Из `tour.title` | PASS |
| `description` | Из `tour.description` | PASS |
| `image` | Абсолютный URL | PASS |
| `url` | Абсолютный URL | PASS |
| `offers.@type` | `Offer` | PASS |
| `offers.price` | Число (не строка) | PASS |
| `offers.priceCurrency` | `"RUB"` | PASS |
| `offers.availability` | `InStock` | PASS |
| `offers.priceValidUntil` | Динамически `YYYY-12-31` | PASS — хорошее решение |
| `aggregateRating` | Условный (reviewCount > 0) | PASS |
| `aggregateRating.bestRating` | 5 | PASS |
| `aggregateRating.worstRating` | 1 | PASS |
| `duration` | `PT{N}H` | PASS — ISO 8601 duration |
| `location` | отсутствует | FAIL — обязательное поле для rich result |
| `touristType` | `Audience` объект | WARNING — предпочтителен Text |
| `review` (массив) | отсутствует | WARNING — нужен для отображения звёзд |

### `BreadcrumbList`

| Поле | Значение | Статус |
|---|---|---|
| `@context` | `https://schema.org` | PASS |
| `@type` | `BreadcrumbList` | PASS |
| `itemListElement[].@type` | `ListItem` | PASS |
| `itemListElement[].position` | Начинается с 1 | PASS |
| `itemListElement[].name` | Текст | PASS |
| `itemListElement[].item` | Абсолютный URL | PASS — `.startsWith('http')` проверка |
| Охват страниц | Только `/tours/[slug]` | FAIL — отсутствует на /tours, /faq, /about, /reviews |

### `ItemList` (каталог туров)

| Поле | Значение | Статус |
|---|---|---|
| `@context` | `https://schema.org` | PASS |
| `@type` | `ItemList` | PASS |
| `numberOfItems` | `tours.length` | PASS |
| `itemListElement[].image` | На ListItem | WARNING — нестандартное поле для ListItem |
| Ссылки на страницы с TouristTrip | Есть (через url) | PASS |

### `FAQPage`

| Поле | Значение | Статус |
|---|---|---|
| `@context` | `https://schema.org` | PASS |
| `@type` | `FAQPage` | PASS |
| `mainEntity[].@type` | `Question` | PASS |
| `mainEntity[].name` | Текст вопроса | PASS |
| `mainEntity[].acceptedAnswer.@type` | `Answer` | PASS |
| `mainEntity[].acceptedAnswer.text` | Текст ответа | PASS |
| Google Rich Result | Ограничен (коммерческий сайт) | INFO |
| Яндекс / AI цитирование | Активно | PASS |
| Наличие на главной странице | Отсутствует при наличии FAQ | FAIL |

---

## 6. Rich Results потенциал

### Google

| Тип Rich Result | Страница | Потенциал | Препятствие |
|---|---|---|---|
| Sitelinks Search Box | Все | ВЫСОКИЙ | Нет `WebSite` + `SearchAction` |
| Breadcrumbs | `/tours/[slug]` | АКТИВЕН | Нужно добавить на остальные |
| Product/Service Carousel | `/tours` | СРЕДНИЙ | `ItemList` есть, `image` в не том месте |
| Star Ratings (TouristTrip) | `/tours/[slug]` | СРЕДНИЙ | Нет `Review` объектов, нет `location` |
| Local Business Panel | Все | ВЫСОКИЙ | Нет `@id`, дублирование TravelAgency |
| FAQPage | `/faq` | ОГРАНИЧЕН | Коммерческий сайт — Google не показывает |

### Яндекс

| Тип | Страница | Потенциал | Примечание |
|---|---|---|---|
| Организация в колдунщике | Все | ВЫСОКИЙ | OrganizationSchema полная |
| Звёздный рейтинг в сниппете | `/tours/[slug]` | ВЫСОКИЙ | Яндекс лояльнее к TouristTrip |
| Хлебные крошки в URL | `/tours/[slug]` | АКТИВЕН | Работает |
| Быстрые ответы (FAQ) | `/faq` | ВЫСОКИЙ | Яндекс не ограничивал FAQPage |
| Карточка компании | Все | ВЫСОКИЙ | LocalBusiness/TravelAgency с geo |

---

## 7. Приоритизированный план исправлений

### Приоритет 1 — Критические (исправить немедленно)

1. **Убрать фиктивные данные сотрудников** из `AboutPageSchema` — риск мануальных санкций Google
2. **Устранить дублирование TravelAgency** на `/about` и `/reviews` — заменить на `AboutPage` WebPage и использовать `@id` ссылку
3. **Добавить `location`** в `TouristTrip` — без него Google не активирует rich result для туров
4. **Синхронизировать `foundingDate`** — выбрать одну дату (2014 по контенту страницы) и установить везде

### Приоритет 2 — Важные (исправить в течение недели)

5. **Добавить `@id`** к `OrganizationSchema` и ссылаться на него из `TourSchema.provider` и `ReviewsPageSchema`
6. **Добавить `BreadcrumbSchema`** на страницы `/tours`, `/faq`, `/about`, `/reviews`
7. **Добавить `WebSite` + `SearchAction`** в `layout.tsx` для Sitelinks Search Box
8. **Добавить `FAQSchema`** на главную страницу (вопросы из `components/faq.tsx`)

### Приоритет 3 — Улучшения (исправить при возможности)

9. **Добавить `Review` объекты** в `TourSchema` (2–3 реальных отзыва из БД) для активации звёзд
10. **Исправить `ItemList`** — убрать `image` из `ListItem` или вложить в `item` объект
11. **Исправить `touristType`** — использовать строку вместо объекта `Audience`
12. **Добавить `sameAs`** с реальными соцсетями или убрать пустой массив
13. **Добавить `hasOfferCatalog`** в OrganizationSchema с категориями услуг
14. **Исправить `priceRange`** — изменить `"₽–₽₽₽"` на стандартный `"₽₽"` или числовой диапазон

---

## 8. Готовые исправленные блоки JSON-LD

### `WebSiteSchema` — новый компонент для `layout.tsx`

```tsx
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#website",
    "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai",
    "name": "Южный Континент",
    "description": "Экскурсии в Сочи 2026 от 900 ₽",
    "inLanguage": "ru-RU",
    "publisher": {
      "@type": "TravelAgency",
      "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours?q={search_term_string}"
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
```

### Исправленный `OrganizationSchema` (добавить `@id`, исправить `foundingDate`, убрать пустой `sameAs`)

```tsx
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#organization",
    "name": "Южный Континент",
    "alternateName": "Южный Континент Сочи",
    "description": "Экскурсионное агентство в Сочи: групповые и индивидуальные туры по Сочи, Красной Поляне, Абхазии и Адлеру с 2014 года",
    "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai",
    "logo": {
      "@type": "ImageObject",
      "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/logo.png",
      "width": 200,
      "height": 60
    },
    "image": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/og-image.jpg",
    "telephone": "+79891668631",
    "email": "info@south-continent.ru",
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
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday",
          "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "areaServed": [
      { "@type": "City", "name": "Сочи" },
      { "@type": "City", "name": "Адлер" },
      { "@type": "City", "name": "Красная Поляна" }
    ],
    "priceRange": "₽₽",
    "currenciesAccepted": "RUB",
    "paymentAccepted": "Cash, Credit Card, СБП"
  };
  // sameAs: добавить когда появятся реальные соцсети

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Исправленный `TourSchema` (добавить `location`, `@id` провайдера, исправить `touristType`)

```tsx
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
    "touristType": "Туристы",
    "location": {
      "@type": "Place",
      "name": "Сочи, Краснодарский край, Россия",
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
      "seller": {
        "@type": "TravelAgency",
        "@id": `${BASE_URL}/#organization`
      }
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
    "provider": {
      "@type": "TravelAgency",
      "@id": `${BASE_URL}/#organization`
    },
    "isAccessibleForFree": false
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Исправленный `ReviewsPageSchema` (через `@id` вместо дублирования)

```tsx
export function ReviewsPageSchema() {
  const totalReviewCount = 1759;
  const averageRating = 4.8;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#organization",
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
```

### Заменить `AboutPageSchema` на корректную `AboutPage` WebPage

```tsx
export function AboutPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/about#webpage",
    "url": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/about",
    "name": "О компании — Южный Континент",
    "description": "Локальное экскурсионное агентство в Сочи с 2014 года. Авторские маршруты, малые группы, гиды — местные жители.",
    "inLanguage": "ru-RU",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#website"
    },
    "about": {
      "@type": "TravelAgency",
      "@id": "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/#organization"
    }
  };
  // Блок employee добавить только с реальными данными

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## 9. Инструменты для проверки

| Инструмент | URL | Что проверять |
|---|---|---|
| Google Rich Results Test | https://search.google.com/test/rich-results | TouristTrip, BreadcrumbList, FAQPage |
| Schema.org Validator | https://validator.schema.org | Все типы, включая нестандартные |
| Google Search Console | Отчёт "Расширенные результаты" | Реальные ошибки после индексации |
| Яндекс Вебмастер | Микроразметка → Проверка | LocalBusiness, FAQPage для Яндекса |
| structured-data-testing-tool | Архивная версия | Детальный разбор по полям |

---

*Отчёт сгенерирован автоматически на основе анализа исходного кода проекта. Все рекомендации соответствуют актуальным требованиям Google (апрель 2026) и спецификации Schema.org.*
