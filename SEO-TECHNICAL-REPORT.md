# Технический SEO-аудит: Южный Континент (южный-континент.рф)

**Домен:** https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai (южный-континент.рф)
**Дата аудита:** 06 апреля 2026 г.
**Стек:** Next.js 14 · Ubuntu VPS · Apache2 reverse proxy → PM2 → Node.js :3000
**Аудитор:** Claude Code (claude-sonnet-4-6)

---

## Сводная оценка

| Категория              | Статус | Балл |
|------------------------|--------|------|
| Crawlability           | PASS   | 88   |
| Indexability           | WARN   | 72   |
| Security Headers       | PASS   | 85   |
| URL Structure          | PASS   | 90   |
| Mobile Optimization    | PASS   | 91   |
| Core Web Vitals        | WARN   | 63   |
| Structured Data        | PASS   | 82   |
| JavaScript Rendering   | PASS   | 85   |
| IndexNow Protocol      | FAIL   | 0    |
| **Итоговый балл**      |        | **73/100** |

---

## 1. Crawlability (robots.txt, sitemaps, noindex)

**Статус: PASS — 88/100**

### robots.txt

Файл `/robots.txt` обнаружен в `public/robots.txt`. Содержимое:

```
User-agent: *
Allow: /
Disallow: /api/

User-agent: Yandex
Allow: /

Host: https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai

Sitemap: https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/sitemap.xml
```

**Хорошо:**
- API-маршруты правильно закрыты от индексации (`Disallow: /api/`)
- Директива `Sitemap:` указана
- Директива `Host:` задана для Яндекса (Яндекс.Вебмастер рекомендует её при IDN-домене)

**Проблемы:**

КРИТИЧНО — Директива `Host:` использует punycode вместо кириллического домена. Яндекс ожидает основной домен в формате IDN:
```
# ТЕКУЩЕЕ (неверно)
Host: https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai

# ДОЛЖНО БЫТЬ
Host: южный-континент.рф
```

НИЗКИЙ ПРИОРИТЕТ — Нет отдельных правил для AI-краулеров (GPTBot, ClaudeBot, PerplexityBot). При необходимости их блокировки следует добавить:
```
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /
```

### Sitemap

Реализован через `app/sitemap.ts` — динамический серверный роут, доступный по `/sitemap.xml`.

**Хорошо:**
- Все статические страницы включены: `/`, `/tours`, `/about`, `/contact`, `/faq`, `/reviews`, `/privacy`, `/terms`
- Динамические страницы туров генерируются из `data/tours.json` через `generateStaticParams`
- Корректные значения `priority` и `changeFrequency`
- `lastModified` задаётся динамически (текущая дата)

**Проблемы:**

СРЕДНИЙ — URL в sitemap используют punycode:
```
https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours
```
Яндекс корректно обрабатывает punycode, Google тоже. Это технически допустимо, но для Яндекса предпочтительнее IDN-форма. Рассмотрите `https://южный-континент.рф/tours`.

НИЗКИЙ — `lastModified` — всегда текущая дата (`new Date().toISOString()`). Это означает, что все страницы выглядят как «только что обновлённые» при каждом запросе sitemap. Для страниц с `changeFrequency: 'monthly'` (privacy, terms) это несоответствие может снизить доверие краулеров. Используйте статические даты последнего реального изменения.

**Отсутствие статического sitemap.xml** в `public/` — файл `public/sitemap.xml` показан в git status как неотслеживаемый файл. Если это устаревший статический sitemap, необходимо либо удалить его (чтобы избежать конфликта с динамическим `/sitemap.xml`), либо обновить. Наличие двух sitemap с разным содержимым создаёт дублирование.

### Noindex-теги

По всему коду не обнаружено ни одного `noindex`, `nofollow` или robots meta-тега с ограничительными директивами. Все страницы открыты для индексации.

---

## 2. Indexability (canonicals, дублирование, тонкий контент)

**Статус: WARN — 72/100**

### Canonical-теги

Canonical-теги установлены на всех страницах через Next.js Metadata API. Карта canonical URL:

| Страница         | Canonical                                              | Статус  |
|------------------|--------------------------------------------------------|---------|
| /                | https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai            | WARN    |
| /tours           | https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours      | WARN    |
| /about           | https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/about      | WARN    |
| /contact         | https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/contact    | WARN    |
| /faq             | https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/faq        | WARN    |
| /reviews         | https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/reviews    | WARN    |
| /privacy         | https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/privacy    | WARN    |
| /terms           | _(не задан)_                                           | FAIL    |
| /tours/[slug]    | https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours/slug | PASS    |

**КРИТИЧНО — Punycode vs IDN в canonical-тегах:**

Все canonical URL сконфигурированы с punycode-хостом (`xn----jtbbjdhsdbbg3ce9iub.xn--p1ai`), тогда как реальный домен — `южный-континент.рф`. Если Apache2 принимает трафик на оба хоста (IDN и punycode), браузер может отправить запрос на один вариант, а получить canonical другого. Это создаёт потенциальный сигнал дублирования для поисковиков.

**Рекомендация:** Выберите один канонический хост и настройте 301-редиректы в Apache2:

```apache
# Вариант 1: использовать IDN как основной
<VirtualHost *:443>
    ServerName южный-континент.рф
    ServerAlias xn----jtbbjdhsdbbg3ce9iub.xn--p1ai
    RewriteEngine On
    RewriteCond %{HTTP_HOST} ^xn----jtbbjdhsdbbg3ce9iub\.xn--p1ai$ [NC]
    RewriteRule ^(.*)$ https://южный-континент.рф$1 [R=301,L]
</VirtualHost>
```

Либо остаться на punycode и убедиться, что IDN-версия всегда делает 301 на punycode. Главное — единообразие.

**ВЫСОКИЙ — Canonical на /terms отсутствует:**

В `app/terms/page.tsx` нет `alternates.canonical`. Это единственная контентная страница без canonical-тега. Добавьте:
```typescript
export const metadata = {
  alternates: {
    canonical: 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/terms'
  }
}
```

**СРЕДНИЙ — Canonical задан в двух местах для /tours:**

Canonical для `/tours` задан и в `app/tours/layout.tsx`, и в `app/tours/page.tsx`. Next.js объединяет metadata, что может привести к конфликту. Оставьте canonical только в `page.tsx`, уберите из `layout.tsx`.

### Дублирование контента

**ВЫСОКИЙ — Страница /faq содержит дублированные данные:**

FAQ-вопросы определены в `app/faq/page.tsx` как массив `faqItems`, но компонент `<FAQ />` в конце страницы, судя по структуре, тоже рендерит FAQ-вопросы из другого источника. Необходимо убедиться, что на одной странице FAQ-контент не дублируется.

**СРЕДНИЙ — Тонкий контент на страницах /privacy и /terms:**

Страница `/privacy` содержит стандартный шаблонный текст с упоминанием punycode-домена в теле страницы (`xn----jtbbjdhsdbbg3ce9iub.xn--p1ai`). Это технически корректно, но выглядит непрофессионально. Замените на кириллический домен `южный-континент.рф` в пользовательском тексте.

### Параметры URL и фильтрация

На странице `/tours` реализованы URL-параметры фильтрации (`/tours?category=city`). Это клиентский компонент (`ToursClient`). Фильтр применяется без изменения URL в Next.js `useSearchParams`. Необходимо убедиться, что поисковики не получают бесконечные комбинации параметров. Поскольку фильтр — клиентский, краулеры без JS увидят полный список туров без фильтрации — это приемлемо.

---

## 3. Security Headers

**Статус: PASS — 85/100**

### Заголовки в next.config.js

Настроены через `async headers()` в `next.config.js`:

| Заголовок                    | Значение                                    | Оценка |
|-----------------------------|---------------------------------------------|--------|
| X-Frame-Options             | SAMEORIGIN                                  | PASS   |
| X-Content-Type-Options      | nosniff                                     | PASS   |
| Referrer-Policy             | strict-origin-when-cross-origin             | PASS   |
| Permissions-Policy          | camera=(), microphone=(), geolocation=()    | PASS   |
| Strict-Transport-Security   | max-age=63072000; includeSubDomains; preload | PASS   |

**PASS — HSTS настроен корректно:**
- `max-age=63072000` (2 года) — соответствует рекомендациям для HSTS Preload List
- `includeSubDomains` — защищает все поддомены
- `preload` — позволяет добавить домен в браузерные preload-списки

**ВЫСОКИЙ — Content-Security-Policy (CSP) отсутствует:**

Нет заголовка `Content-Security-Policy`. Это наиболее значимый пропуск с точки зрения безопасности. Сайт использует:
- Yandex Metrika (внешний скрипт)
- Google Maps iframe (контакты)
- Framer Motion (инлайн-стили)
- WhatsApp внешние ссылки

Начальный CSP для данного стека:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://mc.yandex.ru; img-src 'self' data: https://mc.yandex.ru; frame-src https://www.google.com; connect-src 'self' https://api.telegram.org https://mc.yandex.ru; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com;
```

**СРЕДНИЙ — X-XSS-Protection устарел, не включён:**

Заголовок `X-XSS-Protection: 0` (явное отключение) рекомендуется современными гайдами безопасности, так как устаревший XSS-фильтр в IE мог создавать уязвимости. Добавьте:
```
{ key: 'X-XSS-Protection', value: '0' }
```

**Кэширование активов:**

Настроено корректно:
- `/_next/static/` — `public, max-age=31536000, immutable` (1 год, контент-адресуемые хэши)
- `/images/` — `public, max-age=31536000, immutable` (1 год)
- Фавиконы — 1 неделя с `stale-while-revalidate`

**СРЕДНИЙ — Изображения в `public/images/` помечены как `immutable`:**

Папка `/images/` содержит файлы с кириллическими именами (`Обзороное Комбо`, `Золотое кольцо абхазии` и т.д.) и временными метками в имени. Поскольку имена файлов не меняются при обновлении контента (в отличие от хэшированных `_next/static/` файлов), директива `immutable` означает, что браузеры не будут перепроверять файлы после первого кэширования. Если изображения когда-либо заменятся с тем же именем, старые версии останутся в кэше. Рассмотрите `public, max-age=2592000` (30 дней) вместо `immutable` для этой директории.

---

## 4. URL Structure

**Статус: PASS — 90/100**

### Структура URL

| URL-паттерн         | Пример                                     | Оценка |
|---------------------|--------------------------------------------|--------|
| Главная             | /                                          | PASS   |
| Каталог туров       | /tours                                     | PASS   |
| Страница тура       | /tours/olympic-evening-fountains           | PASS   |
| О компании          | /about                                     | PASS   |
| Контакты            | /contact                                   | PASS   |
| FAQ                 | /faq                                       | PASS   |
| Отзывы              | /reviews                                   | PASS   |
| Конфиденциальность  | /privacy                                   | PASS   |
| Условия             | /terms                                     | PASS   |

**Хорошо:**
- URL структурированы логично, соответствуют иерархии контента
- Slug туров на латинице, семантически описательны: `golden-ring-abkhazia`, `jeep-33-waterfalls-show`, `witch-gorge-6in1`
- Нет параметров сессий, токенов или случайных ID в URL
- Нет URL с прописными буквами (потенциальный источник дублей)

**ВЫСОКИЙ — Slug туров не содержат русских ключевых слов:**

Все slug туров — транслитерированные латинские строки: `jeeping-abkhazia`, `golden-ring-abkhazia`. Google и Яндекс отдают предпочтение URL, в которых ключевые слова на языке сайта. Для Яндекса особенно важна русскоязычная семантика в URL.

Рассмотрите переход на кириллические slug с URL-кодированием:
```
/tours/джипинг-абхазия
/tours/золотое-кольцо-абхазии
/tours/33-водопада
```
Это требует 301-редиректов со старых URL и обновления sitemap.

**НИЗКИЙ — Фильтр категорий на /tours использует query-параметры:**

`/tours?category=city` — параметр обрабатывается только клиентским JS. Это приемлемо с точки зрения SEO (поисковики увидят полный список), но упущена возможность индексации отдельных категорий. Если категории значимы (джипинг, Абхазия, горы), рассмотрите создание статических страниц категорий: `/tours/jeeping`, `/tours/abkhazia`.

---

## 5. HTTPS и редиректы

**Статус: PASS — 90/100**

**Хорошо:**
- HSTS настроен с `max-age=63072000; includeSubDomains; preload`
- Все внутренние ссылки в коде используют относительные пути или абсолютные HTTPS
- `Strict-Transport-Security` передаётся через Next.js headers (до Apache2 — убедитесь, что Apache2 не дублирует этот заголовок)

**СРЕДНИЙ — Возможное дублирование HSTS:**

Если Apache2 тоже устанавливает `Strict-Transport-Security` (что типично для VPS-конфигураций), будут передаваться два одинаковых заголовка. Проверьте конфиг Apache2:
```bash
grep -r "Strict-Transport" /etc/apache2/
```
Если дублирование есть — удалите из одного места (предпочтительно оставить в Apache2, убрать из Next.js).

**СРЕДНИЙ — Цепочка редиректов HTTP → HTTPS не верифицирована:**

Apache2 должен выполнять 301-редирект с `http://` на `https://`. Убедитесь в отсутствии цепочки: `http → https → www` или другой промежуточной ступени.

**НИЗКИЙ — www vs non-www не определён явно в коде:**

Canonical URL содержат non-www: `https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai`. Убедитесь, что Apache2 выполняет 301 с `www.xn----jtbbjdhsdbbg3ce9iub.xn--p1ai` на non-www версию.

---

## 6. Mobile Optimization

**Статус: PASS — 91/100**

### Viewport и мета-теги

```typescript
// app/layout.tsx
export const viewport: Viewport = {
  themeColor: '#40E0D0',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};
```

**Хорошо:**
- `width=device-width, initial-scale=1` — корректная конфигурация viewport
- `maximumScale: 5` — разрешает масштабирование (важно для доступности)
- `themeColor` задан для браузерного chrome на Android
- Шрифт Raleway загружается с `display: 'swap'` — предотвращает FOIT

### Touch и адаптивность

**Хорошо:**
- CSS `font-size: 16px` принудительно установлен для `input`, `textarea`, `select` на экранах до 640px — предотвращает автозум в iOS Safari
- Tap-targets стилизованы с `-webkit-tap-highlight-color`
- Responsive grid используется повсеместно: `grid-cols-1 lg:grid-cols-[1fr_360px]` на страницах туров
- Мобильная версия формы бронирования отделена от десктопной (`lg:hidden` vs `hidden lg:block`)
- Контейнер Tailwind использует `padding: 1.25rem` на мобильных

**СРЕДНИЙ — Hero-секция на мобильных:**

`Hero` компонент использует parallax-анимации (`useScroll`, `useTransform` от Framer Motion) с `transform: translateY()`. На слабых мобильных устройствах это может вызывать пропуск кадров и ухудшать INP. Рассмотрите `will-change: transform` для parallax-элемента и деградацию через `prefers-reduced-motion`.

**НИЗКИЙ — Apple Touch Icon:**

`apple-touch-icon.png` указан в `<head>`, но файл не обнаружен в `public/` директории через glob. Проверьте наличие файла `/public/apple-touch-icon.png`. Отсутствие этого файла не влияет на SEO, но ухудшает отображение при добавлении сайта на главный экран iOS.

**НИЗКИЙ — PWA Manifest недостаточно заполнен:**

```json
{
  "short_name": "Южный Континент",
  "icons": [{ "src": "/ChatGPT%20Image%20Sep%2021,%202025,%2006_54_42%20PM.png", "sizes": "512x512" }]
}
```
- Имя файла иконки (`ChatGPT Image Sep 21...`) неприемлемо для продакшена
- Отсутствуют иконки 192x192 и 384x384
- Нет `screenshots` для install prompt
- Нет `categories: ["travel"]`

---

## 7. Core Web Vitals

**Статус: WARN — 63/100**

Живые данные из CrUX/PageSpeed недоступны (нет Bash). Оценка основана на статическом анализе исходного кода.

**Пороговые значения 2026:**
- LCP: Хорошо < 2.5 с, Требует улучшения 2.5–4 с, Плохо > 4 с
- INP: Хорошо < 200 мс, Требует улучшения 200–500 мс, Плохо > 500 мс
- CLS: Хорошо < 0.1, Требует улучшения 0.1–0.25, Плохо > 0.25

### LCP (Largest Contentful Paint)

**КРИТИЧНО — Hero-изображение не оптимизировано:**

```typescript
// next.config.js
images: {
  unoptimized: true,
}
```

Флаг `images.unoptimized: true` отключает оптимизацию изображений Next.js (`<Image>` компонент). Это означает:
- Нет автоматической конвертации в WebP/AVIF
- Нет lazy-loading через Content Delivery
- Нет автоматического `srcset` по разрешениям
- LCP-изображение (hero) отдаётся в оригинальном JPEG качестве 92%

Файл `/public/zastavki-gas-kvas-com-ejm6-p-zastavki-na-rabochii-stol-sochi-5.jpg` — LCP-кандидат на главной странице. Без оптимизации его вес может превышать 500 КБ–2 МБ.

**Рекомендация:** Включите оптимизацию изображений Next.js:
```javascript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  // unoptimized: true  — удалить эту строку
},
```

Если оптимизация была отключена из-за статического экспорта — убедитесь, что `output: 'export'` не используется (в текущем конфиге его нет, то есть оптимизацию можно включить).

**ВЫСОКИЙ — Нет `<link rel="preload">` для LCP-изображения:**

Hero-компонент — клиентский (`"use client"`). Это означает, что браузер не может обнаружить LCP-изображение в первоначальном HTML. Добавьте preload в `app/layout.tsx`:
```html
<link rel="preload" as="image" href="/zastavki-gas-kvas-com-ejm6-p-zastavki-na-rabochii-stol-sochi-5.jpg" />
```

**СРЕДНИЙ — Шрифт Raleway загружается с Google Fonts:**

```typescript
const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});
```

5 весов шрифта × 2 подмножества = до 10 шрифтовых файлов. Next.js автоматически самостоятельно хостит Google Fonts (font optimization), что устраняет DNS-lookup на `fonts.googleapis.com`. Это сделано правильно. Однако загрузка 5 весов увеличивает TTFB при первой загрузке — рассмотрите сокращение до 3 весов (400, 600, 800).

### INP (Interaction to Next Paint)

**ВЫСОКИЙ — Framer Motion на критическом пути:**

Hero-компонент — клиентский с тяжёлыми Framer Motion анимациями:
- `useScroll` + `useTransform` — подписка на scroll events
- `AnimatePresence` + `motion.span` с анимацией текста каждые 2.8 с
- Parallax эффект на изображении

На слабых мобильных устройствах это увеличивает время выполнения JS и может ухудшать INP.

**СРЕДНИЙ — About и Contact страницы — полностью клиентские:**

```typescript
// app/about/page.tsx
'use client';
```

```typescript
// app/contact/page.tsx
"use client";
```

Страницы `/about` и `/contact` помечены `'use client'` целиком, хотя большая часть их контента статична. Это означает, что весь HTML этих страниц генерируется клиентским JS, а не SSR. Поисковики с поддержкой JS (Googlebot, Яндекс) рендерят их, но это замедляет первую отрисовку и увеличивает TBT.

**Рекомендация:** Разделите статический и интерактивный контент. Оставьте страницы серверными, вынесите только форму и анимации в отдельные client-компоненты:
```typescript
// app/contact/page.tsx — серверный компонент
import { ContactForm } from '@/components/contact-form'; // 'use client'
```

### CLS (Cumulative Layout Shift)

**СРЕДНИЙ — Изображения в TourGallery без заданных размеров:**

```typescript
// components/tour-gallery.tsx
<Image
  src={images[currentIndex]}
  fill
  priority
/>
```

Атрибут `fill` без явного контейнера с `aspect-ratio` или фиксированной высотой может вызывать CLS. Контейнер задан как `h-[60vh] min-h-[500px]` — это хорошо, но `min-h` без `aspect-ratio` может давать скачки при разных viewport-высотах.

**ХОРОШО — Шрифт с `display: swap`:**

`font-display: swap` предотвращает FOIT, но может вызывать небольшой CLS при замене системного шрифта на Raleway. Рассмотрите `font-display: optional` для минимального CLS.

**ХОРОШО — Нет неразмеченных изображений без размеров:**

`<Image>` компонент Next.js с `fill` или явными `width/height` предотвращает классический CLS от изображений без атрибутов.

---

## 8. Structured Data

**Статус: PASS — 82/100**

### Реализованные схемы

| Схема              | Страница               | Тип                          | Статус |
|--------------------|------------------------|------------------------------|--------|
| OrganizationSchema | Все страницы (layout)  | TravelAgency + LocalBusiness | PASS   |
| TourSchema         | /tours/[slug]          | TouristTrip + Offer          | PASS   |
| BreadcrumbSchema   | /tours/[slug]          | BreadcrumbList               | PASS   |
| ToursItemListSchema| /tours                 | ItemList                     | PASS   |
| FAQSchema          | /faq                   | FAQPage                      | PASS   |
| ReviewsPageSchema  | /reviews               | TravelAgency + AggregateRating | WARN |
| AboutPageSchema    | /about                 | TravelAgency + Person        | WARN   |

### Проблемы со Structured Data

**ВЫСОКИЙ — OrganizationSchema: foundingDate несоответствие:**

В `OrganizationSchema` (`components/tour-schema.tsx`):
```
"foundingDate": "2010"
```
В тексте страницы About:
```
"Экскурсии в Сочи 2026 — от 900 ₽"  (шаблон заголовка)
"10 лет опыта" (статистика: основан в ~2014-2016 по timeline)
```
В timeline страницы `/about` первая запись — 2014 год. В `OrganizationSchema` — 2010. В тексте контакт-страницы — "С 2014 года". Выберите единую дату основания и используйте её везде.

**ВЫСОКИЙ — AboutPageSchema содержит вымышленные данные сотрудников:**

```typescript
// В коде явный TODO-комментарий:
// TODO: заменить на реальные данные команды
{ "@type": "Person", "name": "Анна Петрова", "jobTitle": "Генеральный директор" }
{ "@type": "Person", "name": "Михаил Иванов", ... }
{ "@type": "Person", "name": "Елена Смирнова", ... }
```

Вымышленные данные в структурированной разметке нарушают Google Quality Guidelines и могут привести к мануальному штрафу. Немедленно удалите блок `employee` до замены на реальные данные.

**ВЫСОКИЙ — ReviewsPageSchema использует хардкодированные значения:**

```typescript
const totalReviewCount = 1759; // TODO: вычислять динамически
const averageRating = 4.8;     // TODO: вычислять динамически
```

Хардкодированные агрегированные рейтинги, не совпадающие с реальными данными в `tours.json`, могут быть расценены как манипуляция. Необходимо вычислять динамически.

**СРЕДНИЙ — OrganizationSchema: sameAs — пустой массив:**

```typescript
"sameAs": [
  // "https://vk.com/yug_kontinent",
  // "https://t.me/yug_kontinent",
]
```
Все ссылки закомментированы. `sameAs: []` — допустимо, но если соцсети существуют — добавьте их. Это усиливает Entity Authority в Knowledge Graph.

**СРЕДНИЙ — TourSchema тип:**

Используется `@type: "TouristTrip"`. Google поддерживает этот тип в Rich Results. Для усиления рассмотрите добавление `@type: ["TouristTrip", "Product"]` для туров с ценой — это повышает шанс появления в Google Shopping.

**НИЗКИЙ — BreadcrumbSchema использует относительные URL:**

```typescript
"item": item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
```
Логика корректна: относительные URL получают BASE_URL. Но базовый URL — punycode. При переходе на IDN обновите BASE_URL в `tour-schema.tsx`.

---

## 9. JavaScript Rendering

**Статус: PASS — 85/100**

### SSR vs CSR анализ

| Страница         | Тип рендеринга | Примечание                              |
|------------------|----------------|-----------------------------------------|
| /                | SSR + CSR      | Layout SSR, Hero — CSR клиентский       |
| /tours           | SSR + CSR      | H1 и JSON-LD — SSR, фильтр — CSR        |
| /tours/[slug]    | SSG (статика)  | generateStaticParams — все туры         |
| /about           | CSR            | Вся страница 'use client' — ПРОБЛЕМА    |
| /contact         | CSR            | Вся страница 'use client' — ПРОБЛЕМА    |
| /faq             | SSR            | Серверный компонент                     |
| /reviews         | SSR + CSR      | Metadata SSR, контент — CSR             |
| /privacy         | SSR            | Серверный компонент                     |

**ХОРОШО — /tours использует гибридный подход:**

```typescript
// app/tours/page.tsx — серверный компонент
// H1 и JSON-LD рендерятся на сервере
<ToursItemListSchema tours={toursData.tours} />
<section>
  <h1>Все экскурсии <span>в Сочи</span></h1>
</section>

// Клиентский фильтр — отдельно
<Suspense><ToursClient /></Suspense>
```

Это образцовый паттерн: критический контент (H1, schema) доступен без JS.

**ХОРОШО — /tours/[slug] статически генерируется:**

`generateStaticParams()` генерирует все страницы туров во время сборки. Это обеспечивает мгновенную отдачу без SSR overhead.

**КРИТИЧНО — /about полностью клиентский:**

`app/about/page.tsx` начинается с `'use client'`. Это означает:
- Google/Яндекс получают пустой HTML при первом запросе
- Контент рендерится только после загрузки и выполнения JS
- H1 "Южный Континент — 10 лет в Сочи" недоступен для парсинга без JS

Исправление — разделить файл:
```typescript
// app/about/page.tsx — серверный (убрать 'use client')
import { AboutAnimations } from '@/components/about-animations'; // 'use client'

export default function AboutPage() {
  return (
    <div>
      <h1>Южный Континент — 10 лет в Сочи</h1>
      <AboutAnimations /> {/* FadeIn-анимации */}
    </div>
  );
}
```

**КРИТИЧНО — /contact полностью клиентский:**

Аналогично `/about`. Форма контакта требует `'use client'`, но Hero-секция с H1 и контактными данными может быть серверной.

**СРЕДНИЙ — Framer Motion не оптимизирован для SSR:**

Hero-компонент с `useScroll` и `useTransform` — клиентский. Это приводит к гидратации без анимаций при первой загрузке, что может вызывать небольшой CLS. Используйте `LazyMotion` с `domAnimation` вместо полной библиотеки Framer Motion для уменьшения bundle size:

```typescript
import { LazyMotion, domAnimation, m } from 'framer-motion';
// Заменить motion.div на m.div
```

---

## 10. IndexNow Protocol

**Статус: FAIL — 0/100**

**ВЫСОКИЙ — IndexNow не реализован:**

На сайте полностью отсутствует интеграция протокола IndexNow (Bing, Yandex, Naver). Поиск по коду (`indexNow`, `IndexNow`) — 0 результатов.

IndexNow позволяет мгновенно уведомлять поисковики об изменениях контента без ожидания обхода краулером. Особенно важно для:
- Добавления новых туров
- Обновления цен
- Публикации отзывов

**Реализация для Next.js:**

1. Создайте ключ на https://www.bing.com/indexnow
2. Разместите файл верификации: `public/{ключ}.txt` с содержимым ключа
3. Добавьте API-эндпоинт для уведомлений:

```typescript
// app/api/indexnow/route.ts
export async function POST(request: Request) {
  const key = process.env.INDEXNOW_KEY;
  const { urls } = await request.json();
  
  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'xn----jtbbjdhsdbbg3ce9iub.xn--p1ai',
      key,
      keyLocation: `https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/${key}.txt`,
      urlList: urls
    })
  });
}
```

4. Вызывайте этот эндпоинт при публикации нового контента.

---

## 11. Hreflang

**Статус: N/A**

Сайт монолингвален (только русский язык), поэтому hreflang не требуется. Атрибут `lang="ru"` корректно установлен на `<html>` теге:

```typescript
<html lang="ru" className={raleway.variable} suppressHydrationWarning>
```

Yandex Webmaster верификация реализована условно через `YANDEX_VERIFICATION_CODE` env-переменную — это правильный подход.

---

## 12. Meta-теги и Open Graph

**Статус: PASS — 86/100**

### Title-теги

| Страница   | Title                                                              | Длина | Статус |
|------------|--------------------------------------------------------------------|-------|--------|
| /          | Экскурсии в Сочи 2026 — от 900 ₽ \| Южный Континент              | 52 зн | PASS   |
| /tours     | Экскурсии в Сочи 2026 — Цены от 900 ₽ \| Бронирование онлайн     | 60 зн | PASS   |
| /about     | О нас — 10 лет экскурсий в Сочи                                   | 36 зн | PASS   |
| /contact   | Контакты и бронирование в Сочи                                    | 35 зн | PASS   |
| /faq       | Вопрос–Ответ об экскурсиях в Сочи                                 | 37 зн | PASS   |
| /reviews   | Отзывы об экскурсиях в Сочи                                       | 32 зн | PASS   |
| /tours/slug| {tour.title} — от {price} ₽ \| Экскурсии Сочи 2026               | ~60 зн | PASS  |

**СРЕДНИЙ — Дублирующийся год "2026" в заголовках:**

Заголовки содержат "2026" как статически захардкоденный текст. Когда наступит 2027 год, заголовки устареют без обновления кода. Используйте динамический год:
```typescript
const currentYear = new Date().getFullYear();
title: `Экскурсии в Сочи ${currentYear}`
```

### Description

Главная страница: 216 символов — несколько длинновато для отображения в SERP (рекомендуется 120-160 символов). Яндекс и Google всё равно обрежут до ~155 символов.

### Open Graph

**Хорошо:**
- `og:type`, `og:url`, `og:title`, `og:description`, `og:image` — все установлены
- `og:locale: ru_RU` задан корректно
- `og:image` ссылается на `{BASE_URL}/og-image.jpg` с корректными размерами 1200×630

**КРИТИЧНО — og-image.jpg отсутствует:**

Файл `public/og-image.jpg` не обнаружен через glob. Все OG-теги и Twitter Cards ссылаются на несуществующий файл:
```
url: `${BASE_URL}/og-image.jpg`
```
При расшаривании в социальных сетях отображается сломанная картинка. Создайте `/public/og-image.jpg` размером 1200×630.

### Twitter Cards

- `twitter:card: summary_large_image` — корректно
- `twitter:image` ссылается на тот же несуществующий `og-image.jpg`

### Keywords

Мета-тег keywords содержит 40+ ключевых слов на главной и 11 на странице туров. Google игнорирует keywords, Яндекс использует их как слабый сигнал. Не критично, но текущий список чрезмерно длинный. Яндекс рекомендует до 10-15 релевантных keywords.

---

## 13. Дополнительные замечания

### Телефон в схеме
В `OrganizationSchema` телефон: `+79891668631`
В тексте контактной страницы: `89891668631` (Дианита) и `89885007418` (Андрей)
В схеме указан только один номер. Добавьте массив:
```json
"telephone": ["+79891668631", "+79885007418"]
```

### .DS_Store файлы в public/images/
В папке `public/images/` обнаружены файлы `.DS_Store` (артефакты macOS). Они доступны по URL вида `/images/Обзороное%20Комбо/.DS_Store`. Добавьте в `.gitignore` и удалите из репозитория:
```
# .gitignore
**/.DS_Store
```
В robots.txt при желании можно заблокировать: `Disallow: /.DS_Store` (хотя это некорректный синтаксис для вложенных путей).

### Файл с некорректным именем в git status
В git status присутствует: `"dev.db\"DATABASE_URL=\"file:./"`
Это выглядит как случайно созданный файл или ошибка конфигурации. Проверьте и удалите.

### База данных SQLite в корне проекта
`reviews.db` находится в корне проекта (отслеживается git status). Не добавляйте БД в git-репозиторий — добавьте в `.gitignore`:
```
# .gitignore
*.db
*.sqlite
dev.db
```

---

## Приоритизированный план действий

### Критичные (исправить немедленно)

1. **Создать `/public/og-image.jpg` (1200×630)**
   - Все социальные шеры показывают сломанную картинку
   - Влияет на CTR из социальных сетей

2. **Включить оптимизацию изображений Next.js**
   - Удалить `images: { unoptimized: true }` из `next.config.js`
   - Добавить `formats: ['image/avif', 'image/webp']`
   - Ожидаемое улучшение LCP: 30-50%

3. **Удалить вымышленные данные сотрудников из AboutPageSchema**
   - Нарушение Google Quality Guidelines
   - Риск мануального штрафа

4. **Исправить директиву Host в robots.txt**
   - Заменить punycode на `Host: южный-континент.рф`

5. **Исправить canonical на /terms**
   - Добавить `alternates.canonical` в `app/terms/page.tsx`

### Высокий приоритет (исправить в течение 1-2 недель)

6. **Конвертировать /about и /contact в SSR + CSR гибрид**
   - Вынести только интерактивные компоненты в `'use client'`
   - Улучшит LCP, индексацию контента

7. **Добавить `<link rel="preload">` для hero-изображения**
   - Улучшит LCP на главной странице

8. **Исправить ReviewsPageSchema**
   - Вычислять `totalReviewCount` и `averageRating` динамически из `tours.json`

9. **Внедрить IndexNow**
   - Создать ключ, разместить файл, добавить API-эндпоинт

10. **Устранить конфликт canonical в /tours (layout.tsx + page.tsx)**
    - Оставить canonical только в `page.tsx`

### Средний приоритет (в течение месяца)

11. **Реализовать Content-Security-Policy**
    - Начать с `Content-Security-Policy-Report-Only` для сбора нарушений
    - Затем включить enforce-режим

12. **Удалить static sitemap.xml из public/**
    - Или синхронизировать с динамическим `/sitemap.xml`

13. **Исправить `lastModified` в sitemap.ts**
    - Использовать статические даты для pages с `changeFrequency: 'monthly'`

14. **Динамически вычислять год в заголовках**
    - `new Date().getFullYear()` вместо хардкода "2026"

15. **Удалить .DS_Store файлы и добавить в .gitignore**

16. **Создать корректный apple-touch-icon.png (180×180)**

17. **Исправить manifest.json**
    - Переименовать иконку, добавить 192px вариант

### Низкий приоритет (backlog)

18. Рассмотреть кириллические slug для туров
19. Рассмотреть страницы категорий `/tours/jeeping`, `/tours/abkhazia`
20. Добавить `sameAs` в OrganizationSchema (соцсети)
21. Синхронизировать `foundingDate` (2010 vs 2014)
22. Рассмотреть `LazyMotion` вместо полного Framer Motion
23. Добавить `X-XSS-Protection: 0` в headers

---

## Файлы для первоочередного исправления

- `/Users/davidgevorgan/Downloads/project 2/next.config.js` — включить image optimization
- `/Users/davidgevorgan/Downloads/project 2/public/robots.txt` — исправить директиву Host
- `/Users/davidgevorgan/Downloads/project 2/app/layout.tsx` — добавить preload для LCP-img
- `/Users/davidgevorgan/Downloads/project 2/app/sitemap.ts` — исправить lastModified
- `/Users/davidgevorgan/Downloads/project 2/app/terms/page.tsx` — добавить canonical
- `/Users/davidgevorgan/Downloads/project 2/app/about/page.tsx` — разделить SSR/CSR
- `/Users/davidgevorgan/Downloads/project 2/app/contact/page.tsx` — разделить SSR/CSR
- `/Users/davidgevorgan/Downloads/project 2/components/tour-schema.tsx` — удалить вымышленные данные, исправить ReviewsPageSchema
- `/Users/davidgevorgan/Downloads/project 2/app/tours/layout.tsx` — убрать дублирующийся canonical
- `/Users/davidgevorgan/Downloads/project 2/.gitignore` — добавить *.db, .DS_Store

---

_Отчёт сгенерирован на основе статического анализа исходного кода. Для полноты аудита рекомендуется дополнительно проверить живые HTTP-заголовки через curl, запустить Google PageSpeed Insights и Яндекс.Вебмастер для получения реальных CrUX-данных._
