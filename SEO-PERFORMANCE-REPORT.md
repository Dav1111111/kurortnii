# Аудит производительности — южный-континент.рф
**Дата:** 6 апреля 2026  
**Стек:** Next.js 14, Apache2 reverse proxy, Tailwind CSS, Framer Motion, SQLite (better-sqlite3)  
**Домен:** https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/  
**Метод анализа:** Статический аудит исходного кода (Bash-инструмент недоступен; network-данные расчётные/прогнозные на основе кода)

---

## 1. Сводка Core Web Vitals (прогноз)

| Метрика | Статус | Прогнозное значение | Порог "Good" |
|---------|--------|---------------------|--------------|
| **LCP** (Largest Contentful Paint) | РИСК | ~2.8–4.0 s | ≤ 2.5 s |
| **INP** (Interaction to Next Paint) | РИСК | ~200–350 ms | ≤ 200 ms |
| **CLS** (Cumulative Layout Shift) | РИСК | ~0.05–0.15 | ≤ 0.1 |
| **TTFB** | РИСК | ~600–1000 ms | ≤ 200 ms (рекомендуемый) |

> Примечание: FID был полностью удалён из всех инструментов Chrome (CrUX API, PageSpeed Insights, Lighthouse) 9 сентября 2024 г. Единственная метрика интерактивности — INP. Для получения реальных полевых данных используйте [CrUX Vis](https://cruxvis.withgoogle.com) или CrUX API.

---

## 2. LCP — Largest Contentful Paint

### Текущее состояние: КРИТИЧНО

**LCP-элемент:** Hero-изображение (`/zastavki-gas-kvas-com-ejm6-p-zastavki-na-rabochii-stol-sochi-5.jpg`)

#### Проблема 1: `images: { unoptimized: true }` в next.config.js

```js
// next.config.js — строка 7
images: {
  unoptimized: true,
},
```

Next.js Image Optimization полностью отключена. Это означает:
- Нет автоматической конвертации в WebP/AVIF
- Нет изменения размера под конкретный viewport
- Нет lazy loading по умолчанию (но `priority` установлен вручную на hero)
- Нет автоматического `srcset`

**Влияние на LCP:** Hero-изображение загружается в оригинальном формате (вероятно JPEG, 2–8 MB) вместо оптимизированного WebP ~300–500 KB.

#### Проблема 2: Hero-изображение внутри motion.div с parallax

```tsx
// components/hero.tsx — строки 44–54
<motion.div className="absolute inset-0 z-0" style={{ y: imgY }}>
  <Image
    src="/zastavki-gas-kvas-com-ejm6-p-zastavki-na-rabochii-stol-sochi-5.jpg"
    fill
    priority
    quality={92}
    ...
  />
</motion.div>
```

`motion.div` с `useTransform` для parallax-эффекта вызывает перерасчёт compositing-слоёв. Браузер не может определить LCP-элемент до того, как JS выполнит `useScroll` и применит `style={{ y: imgY }}`. Это задерживает фиксацию LCP.

**Дополнительно:** `quality={92}` при `unoptimized: true` игнорируется — Next.js не обрабатывает изображение.

#### Проблема 3: Нет `<link rel="preload">` для hero-изображения

Несмотря на `priority` на `<Image>`, при `unoptimized: true` Next.js не генерирует автоматически `<link rel="preload" as="image">` в `<head>`. Браузер обнаруживает изображение только при парсинге HTML, а не через preload-сканер.

#### Проблема 4: Параллельная загрузка Google Fonts (Raleway, 5 весов + 2 подмножества)

```tsx
// app/layout.tsx — строки 11–16
const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-raleway',
});
```

5 весов × 2 подмножества = до 10 отдельных font-файлов. Все они блокируют рендеринг текста (FOUT). Запрос к `fonts.googleapis.com` добавляет 1–2 RTT (round-trip) к критическому пути, особенно при российских IP через пуллы Google CDN.

#### Проблема 5: TTFB на Apache2 reverse proxy

Без edge-кэширования или CDN каждый запрос к `next start` (Node.js процесс) проходит через Apache2 → Node.js. При SSR страниц Next.js TTFB составляет 400–900 ms на типичном VPS без оптимизаций.

### Рекомендации по LCP (приоритет: КРИТИЧНО)

**R-LCP-1: Включить Next.js Image Optimization**

Убрать `unoptimized: true`. Если хостинг не поддерживает встроенную оптимизацию — добавить `loader` для внешнего сервиса:

```js
// next.config.js
const nextConfig = {
  images: {
    // Убрать: unoptimized: true
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // ...
};
```

Ожидаемый эффект: снижение размера hero-изображения с ~2–8 MB до ~200–400 KB (WebP) или ~100–200 KB (AVIF). Улучшение LCP на 0.8–2.0 s.

**R-LCP-2: Переименовать hero-изображение и добавить явный `<link rel="preload">`**

```tsx
// app/layout.tsx — внутри <head>
<link
  rel="preload"
  as="image"
  href="/hero-sochi.jpg"
  fetchpriority="high"
/>
```

При включённой оптимизации Next.js добавляет preload автоматически при `priority`. Без неё — обязателен ручной preload.

**R-LCP-3: Вынести hero-изображение из motion.div**

```tsx
// До (проблема):
<motion.div style={{ y: imgY }}>
  <Image src="..." fill priority />
</motion.div>

// После (решение):
<Image src="..." fill priority />
<motion.div
  className="absolute inset-0 z-0 pointer-events-none"
  style={{ y: imgY }}
  aria-hidden="true"
/>
```

Изображение загружается немедленно, параллакс применяется через отдельный слой. LCP-элемент фиксируется раньше.

**R-LCP-4: Сократить загружаемые веса Raleway**

```tsx
// Оставить только реально используемые веса
const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700', '800'], // убрать 500 и 600, заменить font-medium на font-normal где возможно
  display: 'swap',
  preload: true,
  variable: '--font-raleway',
});
```

Эффект: с 10 файлов до 6, экономия ~80–120 KB и 2–4 RTT.

**R-LCP-5: Настроить HTTP/2 Push или Early Hints на Apache2**

```apache
# /etc/apache2/sites-available/your-site.conf
Header always set Link "</fonts/raleway-400.woff2>; rel=preload; as=font; crossorigin"
Header always set Link "</hero-sochi.webp>; rel=preload; as=image"
```

Или использовать `103 Early Hints` (Apache 2.4.55+):
```apache
H2EarlyHints on
```

---

## 3. INP — Interaction to Next Paint

### Текущее состояние: РИСК

INP заменил FID 12 марта 2024 г. Метрика измеряет задержку от любого взаимодействия до следующего paint-а. Порог "Good" — ≤ 200 ms.

#### Проблема 1: Весь Header — client component с Framer Motion

```tsx
// components/header.tsx — строка 1
"use client";
// + useMotionValueEvent, useScroll, motion, AnimatePresence — всё на клиенте
```

`useScroll` + `useMotionValueEvent` запускают JS-обработчики на каждое событие scroll. При открытии мобильного меню `AnimatePresence` + `motion.div` с 5 × staggered анимациями выполняются синхронно на main thread.

#### Проблема 2: Hero — множественные параллельные motion-трансформации

```tsx
// components/hero.tsx — строки 27–29
const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
```

3 `useTransform` + `useScroll` на hero, плюс `useScroll` в header = 2 независимых scroll-listener-а. Каждый scroll-event вызывает перерасчёт нескольких CSS-переменных через JS (не CSS-only).

#### Проблема 3: Анимированное слово в hero (setInterval + AnimatePresence)

```tsx
// components/hero.tsx — строки 31–36
useEffect(() => {
  const id = setInterval(() => {
    setWordIndex((i) => (i + 1) % WORDS.length);
  }, 2800);
  return () => clearInterval(id);
}, []);
```

`setInterval` каждые 2.8 секунды запускает `setState` → re-render → `AnimatePresence` exit/enter анимацию. Если пользователь взаимодействует с кнопкой в момент перерендера — INP увеличивается.

#### Проблема 4: ThemeProvider блокирует первый рендер (hydration mismatch workaround)

```tsx
// components/providers.tsx — строки 9–14
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
if (!mounted) return <>{children}</>;
```

Паттерн `mounted` gate добавляет дополнительный рендер-цикл после гидратации. `ThemeProvider` с `defaultTheme="light"` и `enableSystem` всё равно считывает `prefers-color-scheme` в runtime, что вызывает layout thrashing при первой загрузке.

#### Проблема 5: Testimonials — клиентский fetch без Suspense

```tsx
// components/testimonials.tsx — строки 48–59
useEffect(() => {
  async function fetchReviews() {
    const res = await fetch("/api/reviews");
    if (res.ok) setReviews(await res.json());
  }
  fetchReviews();
}, []);
```

`/api/reviews` обращается к SQLite через `better-sqlite3` (синхронный I/O). На медленном диске или при большом количестве отзывов это может блокировать Node.js event loop и задерживать ответ, что вызовет layout shift при получении данных.

### Рекомендации по INP (приоритет: ВЫСОКИЙ)

**R-INP-1: Перевести scroll-логику header на CSS**

```tsx
// Убрать useScroll и useMotionValueEvent
// Заменить на CSS-класс через IntersectionObserver (0 JS на scroll)
useEffect(() => {
  const sentinel = document.getElementById('scroll-sentinel');
  const observer = new IntersectionObserver(
    ([entry]) => setIsScrolled(!entry.isIntersecting),
    { threshold: 0 }
  );
  if (sentinel) observer.observe(sentinel);
  return () => observer.disconnect();
}, []);
```

Эффект: eliminates scroll-JS на main thread, экономия ~15–30 ms на каждом scroll-событии.

**R-INP-2: Ограничить параллакс через CSS + `will-change`**

```tsx
// Добавить will-change для GPU-compositing
<motion.div
  className="absolute inset-0 z-0"
  style={{ y: imgY, willChange: 'transform' }}
>
```

И рассмотреть отключение параллакса на мобильных устройствах (экономия батареи + INP):
```tsx
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const imgY = useTransform(scrollYProgress, [0, 1], isMobile ? ["0%", "0%"] : ["0%", "20%"]);
```

**R-INP-3: Перенести Reviews на сервер (RSC)**

```tsx
// app/page.tsx
import { getApprovedReviews } from '@/lib/db';

export default async function Home() {
  const reviews = await getApprovedReviews(); // server-side, нет клиентского fetch
  return (
    <>
      <Hero />
      <Testimonials initialReviews={reviews} /> {/* prop-drilling, нет useEffect */}
    </>
  );
}
```

Убрать клиентский `useEffect` fetch из `Testimonials`. SQLite-запрос выполняется на сервере, результат рендерится в HTML — нет layout shift, нет дополнительного API-запроса от клиента.

**R-INP-4: Debounce анимации смены слов**

```tsx
// Использовать CSS animation вместо JS setInterval + AnimatePresence
// Или увеличить интервал до 4000ms и добавить requestIdleCallback
useEffect(() => {
  function tick() {
    requestIdleCallback(() => {
      setWordIndex((i) => (i + 1) % WORDS.length);
    });
  }
  const id = setInterval(tick, 4000);
  return () => clearInterval(id);
}, []);
```

---

## 4. CLS — Cumulative Layout Shift

### Текущее состояние: УМЕРЕННЫЙ РИСК

#### Проблема 1: Testimonials — layout shift при загрузке отзывов

```tsx
// components/testimonials.tsx — строки 112–133
{isLoading && <div className="flex justify-center py-16"><spinner /></div>}
{!isLoading && reviews.length === 0 && <EmptyState />}
{!isLoading && reviews.length > 0 && <ReviewsGrid />}
```

Три разных состояния с разной высотой: spinner (~64px), empty state (~200px), reviews grid (~600px+). При каждом переключении высота секции меняется, вызывая CLS.

**Решение:** Зарезервировать минимальную высоту секции:
```tsx
<section ref={ref} className="section bg-[#0A1628] relative overflow-hidden min-h-[400px]">
```

#### Проблема 2: `mounted` gate в Providers — hydration layout shift

```tsx
// components/providers.tsx
if (!mounted) return <>{children}</>;
// После mount — ThemeProvider оборачивает children, меняя DOM
```

`ThemeProvider` добавляет `class` к `<html>` после гидратации. При `defaultTheme="light"` и `suppressHydrationWarning` на `<html>` это обычно не вызывает CLS, но `enableSystem` может переключить тему после первого рендера, если у пользователя `prefers-color-scheme: dark`.

**Решение:** Убрать `enableSystem` или добавить CSS-переменную для предотвращения FOUC:
```html
<!-- В <head>, до CSS -->
<script>
  document.documentElement.className = localStorage.getItem('theme') || 'light';
</script>
```

#### Проблема 3: Изображения категорий без явных размеров

```tsx
// components/categories.tsx — строки 150–157
<Image
  src={cat.image}
  alt={cat.title + " " + cat.subtitle}
  fill
  className="object-cover"
  sizes="300px"
/>
```

`fill` с кириллическими URL-encoded путями (например `/images/Обзороное%20Комбо/photo_2025-09-21%2017.18.54.jpeg`). При `unoptimized: true` браузер не получает `width`/`height` атрибутов заранее — контейнер 260×380px зафиксирован через CSS, поэтому CLS минимален. Однако если Apache не корректно обрабатывает URL-encoded кириллические пути, изображения могут вернуть 404, что вызовет CLS при замене на broken-image placeholder.

#### Проблема 4: Кириллические имена папок в путях изображений

```
/images/Обзороное%20Комбо/photo_2025-09-21%2017.18.54.jpeg
/images/ГОСТЕПРИИМНАЯ%20АБХАЗИЯ/photo_2025-09-21%2018.12.38.jpeg
/images/Джиппинг%20в%20Абхазию/photo_2025-09-21%2018.26.31.jpeg
/images/Тур%20Ущелье%20ведьм/photo_2025-09-23%2014.10.08.jpeg
/images/Золотое%20кольцо%20абхазии/photo_2025-09-21%2018.00.24.jpeg
/images/Бигфут%20Квадры/photo_2025-09-23%2014.04.30.jpeg
```

Кириллические пути URL-encoded корректно в JSX. Риски:
- Apache2 может требовать `AcceptPathInfo On` и правильный `Alias` или `DocumentRoot` с поддержкой Unicode
- Некоторые версии Apache на Linux с `AllowEncodedSlashes NoDecode` могут блокировать URL с `%20`
- Имена файлов с пробелами и кириллицей в файловой системе Linux зависят от кодировки локали (`en_US.UTF-8` обязательна)

**Решение:** Переименовать все папки и файлы изображений в ASCII:
```
/images/city-tours/         (вместо Обзороное Комбо)
/images/abkhazia/           (вместо ГОСТЕПРИИМНАЯ АБХАЗИЯ)
/images/jeeping/            (вместо Джиппинг в Абхазию)
/images/witch-canyon/       (вместо Тур Ущелье ведьм)
/images/golden-ring/        (вместо Золотое кольцо абхазии)
/images/bigfoot/            (вместо Бигфут Квадры)
```

### Рекомендации по CLS (приоритет: СРЕДНИЙ)

**R-CLS-1:** Добавить `min-h-[400px]` к секции Testimonials.  
**R-CLS-2:** Перевести Testimonials на SSR (устраняет проблему одновременно с INP).  
**R-CLS-3:** Переименовать все изображения в ASCII-пути.  
**R-CLS-4:** Убрать `enableSystem` из ThemeProvider или добавить inline-скрипт для установки темы до рендера.

---

## 5. TTFB — Time to First Byte

### Текущее состояние: КРИТИЧНО (расчётно ~600–1000 ms)

### Архитектура: Apache2 → Node.js (next start)

```
Client → Apache2 (TLS termination) → Node.js :3000 (next start) → Response
```

#### Проблема 1: Нет edge CDN

Все запросы обслуживаются одним сервером. Для российских пользователей из регионов (Москва, Урал, Сибирь) при сервере в Сочи задержка сети составляет 30–100 ms только на RTT, плюс время обработки.

#### Проблема 2: SQLite при каждом запросе к /api/reviews

```tsx
// lib/db.ts — строки 1–5
import Database from 'better-sqlite3';
const dbPath = path.join(process.cwd(), 'reviews.db');
const db = new Database(dbPath); // Открывается при каждом импорте модуля
```

`better-sqlite3` — синхронный. При высокой нагрузке блокирует Node.js event loop. Модуль открывает БД при старте (singleton), что правильно, но `getApprovedReviews()` выполняет sync-запрос в async API-route.

#### Проблема 3: Cache-Control отсутствует на API-маршрутах

```tsx
// app/api/reviews/route.ts
export async function GET() {
  const reviews = getApprovedReviews();
  return NextResponse.json(reviews); // Нет Cache-Control header
}
```

Каждый запрос пользователя к `/api/reviews` вызывает SQLite-запрос. Отзывы — медленно меняющиеся данные, кэширование 60 секунд значительно снизило бы нагрузку.

### Рекомендации по TTFB (приоритет: ВЫСОКИЙ)

**R-TTFB-1: Включить кэширование API-ответов**

```tsx
// app/api/reviews/route.ts
export async function GET() {
  const reviews = getApprovedReviews();
  return NextResponse.json(reviews, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
```

**R-TTFB-2: Настроить Apache2 для кэширования статики**

```apache
# /etc/apache2/mods-enabled/headers.conf или .htaccess
<LocationMatch "\.(jpg|jpeg|png|webp|avif|woff2|css|js)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</LocationMatch>

<Location "/api/">
  Header set Cache-Control "no-store"
</Location>
```

**R-TTFB-3: Включить сжатие gzip/Brotli на Apache2**

```apache
# /etc/apache2/mods-available/deflate.conf
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html application/javascript text/css application/json
  DeflateCompressionLevel 6
</IfModule>

# Для Brotli (требует mod_brotli, Apache 2.4.26+)
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html application/javascript text/css application/json
  BrotliCompressionQuality 6
</IfModule>
```

Проверить статус сжатия:
```bash
curl -I -H "Accept-Encoding: br" https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/
# Ожидаем: Content-Encoding: br
curl -I -H "Accept-Encoding: gzip" https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/
# Ожидаем: Content-Encoding: gzip
```

**R-TTFB-4: Добавить Proxy Buffer для Apache2 → Node.js**

```apache
<VirtualHost *:443>
  ProxyPass / http://localhost:3000/
  ProxyPassReverse / http://localhost:3000/

  # Буферизация ответа Node.js
  ProxyBuffering On
  ProxyBufferSize 128k
  ProxyMaxForwards 10

  # Keepalive для снижения overhead
  ProxyPreserveHost On
  SetEnv proxy-nokeepalive 0
  SetEnv proxy-initial-response-buffer-size 128k
</VirtualHost>
```

**R-TTFB-5: Рассмотреть Cloudflare (бесплатный план)**

Cloudflare даёт:
- Edge-кэширование статики на ~300 PoP по всему миру
- Brotli-сжатие автоматически
- Anycast DNS для снижения DNS-lookup
- Защита от DDoS
- Автоматическое минирование HTML/CSS/JS

---

## 6. Размеры JavaScript бандлов

### Текущее состояние: ВЫСОКИЙ РИСК

#### Зависимости с большим весом (оценка)

| Пакет | Estimated gzip size | Использование |
|-------|---------------------|---------------|
| `framer-motion` ^11.0.8 | ~45–60 KB | Header, Hero, Categories, WhyUs, AboutSection, BookingForm, Testimonials, FAQ |
| `recharts` ^2.12.1 | ~85–110 KB | Нигде не найдено в просмотренных компонентах |
| `react-day-picker` ^8.10.0 | ~18–25 KB | Нигде не найдено в просмотренных компонентах |
| `embla-carousel-react` ^8.0.0 | ~12–18 KB | Нигде не найдено в просмотренных компонентах |
| `cmdk` ^0.2.1 | ~8–12 KB | Нигде не найдено |
| `@radix-ui/*` (20 пакетов) | ~30–50 KB суммарно | Частично используются |
| `react-resizable-panels` | ~15–20 KB | Нигде не найдено |
| `input-otp` | ~6–10 KB | Нигде не найдено |
| `vaul` | ~8–12 KB | Нигде не найдено |
| `next-seo` ^6.5.0 | ~8–12 KB | Нигде не найдено в просмотренных страницах |

#### Проблема 1: Мёртвые зависимости

`package.json` содержит `recharts`, `react-day-picker`, `embla-carousel-react`, `cmdk`, `react-resizable-panels`, `input-otp`, `vaul`, `next-seo` — эти пакеты установлены, но не используются ни в одном из просмотренных компонентов. Даже при tree-shaking они могут попасть в бандл через побочные эффекты.

**Оценка лишнего веса:** ~160–250 KB gzip.

#### Проблема 2: `@netlify/plugin-nextjs` в production-зависимостях

```json
"@netlify/plugin-nextjs": "^4.41.3",
```

Сайт деплоится на VPS (Apache2), а не на Netlify. Это мёртвая зависимость ~50–80 KB в node_modules. В бандл не попадает напрямую, но увеличивает размер `node_modules` и время сборки.

#### Проблема 3: Framer Motion — нет lazy loading

Все анимированные компоненты (Hero, Header, Categories, AboutSection, WhyUs, BookingForm, Testimonials) импортируют Framer Motion напрямую. Весь runtime Framer Motion (~45–60 KB gzip) загружается немедленно при первом рендере, включая анимации, которые пользователь видит только после scroll.

#### Проблема 4: `"use client"` везде

Header, Hero, Categories, AboutSection, WhyUs, BookingForm, Testimonials — все клиентские компоненты. Нет ни одного Server Component кроме `app/layout.tsx` и `app/page.tsx` (верхний уровень). Весь React-tree гидратируется на клиенте, что увеличивает объём JS, отправляемого браузеру.

### Рекомендации по JS-бандлам (приоритет: ВЫСОКИЙ)

**R-JS-1: Удалить неиспользуемые зависимости**

```bash
npm uninstall recharts react-day-picker embla-carousel-react cmdk react-resizable-panels input-otp vaul @netlify/plugin-nextjs next-seo
```

Ожидаемое снижение: 150–250 KB gzip из бандла, ускорение сборки на 20–40%.

**R-JS-2: Lazy-загрузка тяжёлых секций**

```tsx
// app/page.tsx
import dynamic from 'next/dynamic';

const WhyUs = dynamic(() => import('@/components/why-us'), { ssr: false });
const AboutSection = dynamic(() => import('@/components/about-section'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/testimonials'), { ssr: false });
const BookingForm = dynamic(() => import('@/components/booking-form'), { ssr: false });
const FAQ = dynamic(() => import('@/components/faq'), { ssr: false });

// Hero и Categories — оставить без dynamic (above the fold)
```

**R-JS-3: Использовать Framer Motion LazyMotion**

```tsx
// app/layout.tsx или отдельный MotionProvider
import { LazyMotion, domAnimation } from 'framer-motion';

// В layout:
<LazyMotion features={domAnimation} strict>
  {children}
</LazyMotion>
```

Заменить `motion.div` на `m.div` во всех компонентах. Это уменьшает начальный бандл Framer Motion с ~60 KB до ~6 KB, загружая полный runtime только по требованию.

**R-JS-4: Провести анализ бандла**

```bash
ANALYZE=true npm run build
# Или:
npx @next/bundle-analyzer
```

Добавить в `next.config.js`:
```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);
```

---

## 7. Загрузка шрифтов (Google Fonts — Raleway)

### Текущее состояние: УМЕРЕННЫЙ РИСК

```tsx
const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-raleway',
});
```

#### Анализ

| Параметр | Значение | Оценка |
|----------|----------|--------|
| `display: 'swap'` | Установлен | Хорошо — текст видим сразу (FOUT вместо FOIT) |
| `preload: true` | Не установлен явно | Next.js font по умолчанию preload не для всех весов |
| 5 весов × 2 подмножества | 10 файлов | Избыточно |
| `variable: '--font-raleway'` | Установлен | Хорошо — CSS variable для Tailwind |
| Self-hosted | Нет | Google CDN — дополнительный DNS+RTT |

#### Проблема 1: 5 весов избыточны

Просматривая использование в tailwind.config.ts:
- `font-normal` (400) — базовый текст
- `font-semibold` (600) — кнопки, навигация  
- `font-bold` (700) — заголовки
- `font-extrabold` (800) — hero, display

`weight: '500'` (font-medium) используется в header nav-links, но может быть заменён на 400 или 600. Это сэкономит 2 файла (~30–40 KB).

#### Проблема 2: Нет `preload` для критического веса

Next.js `next/font` автоматически preload-ит только первый вес при нескольких. При 5 весах Raleway cyrillic — наиболее критичный (400 cyrillic для основного текста) может не получить preload.

### Рекомендации по шрифтам (приоритет: СРЕДНИЙ)

**R-FONT-1: Сократить до 3 весов**

```tsx
const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700', '800'],
  display: 'swap',
  preload: true,
  variable: '--font-raleway',
});
```

**R-FONT-2: Self-host через `next/font` с локальными файлами**

Next.js автоматически self-host-ит Google Fonts при использовании `next/font/google` — шрифты скачиваются во время `npm run build` и раздаются с вашего домена. Это уже реализовано правильно. Убедитесь, что `fonts.googleapis.com` не запрашивается в runtime:

```bash
# Проверить в DevTools Network: не должно быть запросов к fonts.googleapis.com
```

**R-FONT-3: Добавить `font-display: optional` для некритичных весов**

Если латинское подмножество важно только для UI-элементов, можно использовать `display: 'optional'` вместо `swap` для снижения FOUT. Но для кириллического контента `swap` — правильный выбор.

---

## 8. Изображения — детальный анализ

### Текущее состояние: КРИТИЧНО

#### Инвентаризация изображений

| Компонент | Изображение | Проблемы |
|-----------|-------------|----------|
| Hero | `/zastavki-gas-kvas-com-ejm6-p-zastavki-na-rabochii-stol-sochi-5.jpg` | Нет оптимизации, нет preload, имя файла нечитаемое |
| Header (logo) | `/logo-new.png` | PNG лого — рассмотреть SVG |
| Categories (6 шт.) | `/images/[кириллица]/photo_*.jpeg` | Кириллические пути, нет оптимизации |
| AboutSection | Вероятно изображения | Не просмотрен полностью |

#### Проблема 1: `unoptimized: true` — повторение (критично)

Уже описана в разделе LCP. Все `<Image>` компоненты в проекте не получают никакой обработки от Next.js.

#### Проблема 2: JPEG с именем из стока для LCP

```
/zastavki-gas-kvas-com-ejm6-p-zastavki-na-rabochii-stol-sochi-5.jpg
```

Название содержит "zastavki-gas-kvas-com" — признак стокового изображения. Такие файлы часто весят 3–10 MB без оптимизации.

#### Проблема 3: Кириллические пути — риск 404

Apache2 на Linux с локалью `LANG=C` или `LANG=en_US` (без UTF-8) может некорректно обработать URL-encoded кириллицу. Запрос:
```
GET /images/Обзороное%20Комбо/photo_2025-09-21%2017.18.54.jpeg
```

Может вернуть 404 если:
- `mod_rewrite` не настроен для `[QSA,L]` с UTF-8
- Файловая система смонтирована без UTF-8 locale
- Apache `AllowEncodedSlashes` не установлен в `NoDecode`

#### Проблема 4: Нет AVIF

AVIF даёт 40–60% меньший размер по сравнению с WebP при том же качестве. Поддерживается в Chrome (79+), Firefox (93+), Safari (16.4+) — охват 95%+ аудитории.

### Рекомендации по изображениям (приоритет: КРИТИЧНО)

**R-IMG-1: Включить Next.js Image Optimization + AVIF**

Уже описано в R-LCP-1. Является наивысшим приоритетом.

**R-IMG-2: Переименовать все медиафайлы в ASCII**

```bash
# Скрипт переименования (запустить на сервере)
find public/images -name "*.jpg" -o -name "*.jpeg" | while read f; do
  dir=$(dirname "$f")
  base=$(basename "$f")
  # transliterate и убрать пробелы
  newname=$(echo "$base" | iconv -f UTF-8 -t ASCII//TRANSLIT | tr ' ' '-' | tr '[:upper:]' '[:lower:]')
  mv "$f" "$dir/$newname"
done
```

**R-IMG-3: Сжать hero-изображение вручную до включения оптимизации**

```bash
# Немедленное действие без изменения кода:
npx sharp-cli -i public/zastavki-*.jpg -o public/hero-sochi.webp --webp --quality 80 --resize 1920
```

Или через squoosh.app / imageoptim.

**R-IMG-4: Конвертировать лого в SVG**

`/logo-new.png` для вектора — всегда предпочтительно SVG:
- Нет потери качества при масштабировании
- Размер ~5–15 KB vs 50–200 KB для PNG
- Мгновенная загрузка без сетевого запроса (inline SVG)

```tsx
// components/header.tsx
import LogoSVG from '@/public/logo.svg'; // inline SVG component
// или
<img src="/logo.svg" alt="Южный Континент" width="208" height="56" />
```

---

## 9. Компрессия (gzip / Brotli)

### Текущее состояние: НЕИЗВЕСТНО — требует проверки

Next.js `next start` включает встроенное gzip-сжатие по умолчанию. Однако при использовании Apache2 как reverse proxy возможны конфликты:

#### Сценарий A: Apache2 сжимает повторно (double compression)
Node.js отдаёт gzip → Apache2 сжимает ещё раз → клиент получает некорректный ответ.

#### Сценарий B: Apache2 не передаёт `Accept-Encoding`
Если `ProxyPass` не передаёт заголовок `Accept-Encoding: gzip, br`, Node.js отдаёт несжатый ответ.

### Рекомендации по компрессии (приоритет: ВЫСОКИЙ)

**R-COMP-1: Отключить сжатие в Node.js, включить только в Apache2**

```js
// next.config.js
const nextConfig = {
  compress: false, // Отдаём Apache2 управление сжатием
  // ...
};
```

```apache
# Apache2 — включить Brotli и gzip
<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/css application/javascript application/json font/woff2
  BrotliCompressionQuality 6
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
  DeflateCompressionLevel 6
</IfModule>

# Передавать Accept-Encoding от клиента к Node.js
RequestHeader set Accept-Encoding "identity"
```

**R-COMP-2: Проверить заголовки ответа**

```bash
curl -v -H "Accept-Encoding: br,gzip,deflate" https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/ 2>&1 | grep -E "(Content-Encoding|Content-Length|Transfer-Encoding)"
```

Ожидаемый результат: `Content-Encoding: br` (Brotli) или `Content-Encoding: gzip`.

**R-COMP-3: Проверить Next.js static assets**

```bash
curl -v -H "Accept-Encoding: br" https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/_next/static/chunks/main.js 2>&1 | grep Content-Encoding
```

`_next/static/` уже имеет `Cache-Control: public, max-age=31536000, immutable` согласно `next.config.js` — убедитесь, что Apache2 не перезаписывает этот заголовок.

---

## 10. Специфические проблемы Next.js 14

### 10.1 App Router — избыточное использование "use client"

Просмотренные компоненты:
- `header.tsx` — "use client" (обоснованно: scroll, state)
- `hero.tsx` — "use client" (обоснованно: parallax, animation)
- `categories.tsx` — "use client" (НЕОБОСНОВАННО: только useInView + статические данные)
- `about-section.tsx` — "use client" (НЕОБОСНОВАННО: только useInView)
- `testimonials.tsx` — "use client" (НЕОБОСНОВАННО: можно SSR)
- `booking-form.tsx` — "use client" (обоснованно: форма)
- `why-us.tsx` — "use client" (НЕОБОСНОВАННО: только useInView + countUp)

**Рекомендация:** Разделить компоненты на Server Component (статический контент) + Client Component (анимация):

```tsx
// components/categories-server.tsx — Server Component
export function CategoriesServer() {
  return (
    <section className="section overflow-hidden">
      <CategoriesClient /> {/* только анимационная обёртка */}
    </section>
  );
}
```

### 10.2 Отсутствие `generateStaticParams` для статических страниц

Страницы `/about`, `/faq`, `/contact` вероятно являются полностью статическими, но рендерятся динамически при каждом запросе. Добавить:

```tsx
// app/about/page.tsx
export const dynamic = 'force-static'; // или revalidate = 86400
```

### 10.3 SQLite в production — ограничения масштабируемости

`better-sqlite3` — синхронный SQLite. При масштабировании:
- Нельзя запустить несколько Node.js-процессов с pm2 cluster mode (race conditions на .db файл)
- Файл `reviews.db` в корне проекта (не в `/tmp` или отдельной директории)
- `dev.db"DATABASE_URL="file:./` — судя по git status, есть проблема с файлом БД

Файл `"dev.db\"DATABASE_URL=\"file:./"` в git status — это некорректно созданный файл, возможно из-за ошибки в команде dotenv. Требует удаления.

---

## 11. Приоритизированный план действий

### Приоритет 1 — КРИТИЧНО (делать немедленно, влияние на LCP >1.5s)

| # | Действие | Файл | Ожидаемый эффект |
|---|----------|------|------------------|
| 1 | Убрать `unoptimized: true`, включить WebP/AVIF | `next.config.js` | LCP -1.5–2.5s |
| 2 | Сжать и переименовать hero-изображение | `public/` | LCP -0.5–1.0s |
| 3 | Вынести Image из motion.div в hero | `components/hero.tsx` | LCP -0.3–0.5s |
| 4 | Добавить `<link rel="preload">` для hero | `app/layout.tsx` | LCP -0.2–0.4s |
| 5 | Включить gzip/Brotli на Apache2 | Apache2 config | LCP -0.3s, JS -40–60% |

### Приоритет 2 — ВЫСОКИЙ (делать в первую неделю, влияние на INP/TTFB)

| # | Действие | Файл | Ожидаемый эффект |
|---|----------|------|------------------|
| 6 | Перевести Testimonials на SSR | `app/page.tsx`, `components/testimonials.tsx` | INP -50ms, CLS -0.05 |
| 7 | Удалить неиспользуемые npm-пакеты | `package.json` | JS бандл -150–250 KB |
| 8 | LazyMotion для Framer Motion | Все компоненты | JS бандл -40–50 KB |
| 9 | Добавить Cache-Control к /api/reviews | `app/api/reviews/route.ts` | TTFB /api -80% |
| 10 | Переименовать все изображения в ASCII | `public/images/`, компоненты | Надёжность +, потенциальные 404 |

### Приоритет 3 — СРЕДНИЙ (делать в первый месяц)

| # | Действие | Файл | Ожидаемый эффект |
|---|----------|------|------------------|
| 11 | Сократить Raleway до 3 весов | `app/layout.tsx` | LCP -0.1–0.2s, шрифты -40% |
| 12 | Конвертировать лого в SVG | `components/header.tsx` | FCP улучшение |
| 13 | Lazy-загрузка below-fold секций | `app/page.tsx` | JS parse time -30% |
| 14 | IntersectionObserver вместо useScroll в Header | `components/header.tsx` | INP -15–30ms |
| 15 | `export const dynamic = 'force-static'` на статичных страницах | `app/about/`, `app/faq/` | TTFB -400ms |

### Приоритет 4 — НИЗКИЙ (долгосрочная оптимизация)

| # | Действие | Ожидаемый эффект |
|---|----------|------------------|
| 16 | CDN (Cloudflare бесплатный план) | TTFB глобально -200–500ms |
| 17 | Разделить Server/Client компоненты (RSC) | JS бандл -20–30% |
| 18 | Переехать с SQLite на Postgres/Redis | Масштабируемость |
| 19 | Удалить `"dev.db\"DATABASE_URL=\"file:./"` из репозитория | Чистота репозитория |
| 20 | HTTP/2 Push / Early Hints на Apache2 | LCP -0.1–0.3s |

---

## 12. Быстрые победы (можно сделать за 1 час)

```bash
# 1. Удалить мусорный файл из репозитория
rm 'dev.db"DATABASE_URL="file:./'
git rm --cached 'dev.db"DATABASE_URL="file:./'

# 2. Удалить неиспользуемые зависимости
npm uninstall recharts react-day-picker embla-carousel-react cmdk react-resizable-panels input-otp vaul @netlify/plugin-nextjs

# 3. Добавить Cache-Control к API reviews (1 строка)
# В app/api/reviews/route.ts: добавить headers в NextResponse.json()

# 4. Добавить min-h к секции Testimonials (1 строка CSS)
# В components/testimonials.tsx: добавить min-h-[400px] к <section>
```

---

## 13. Инструменты для валидации

После внесения изменений проверить:

1. **CrUX Vis** (реальные полевые данные): https://cruxvis.withgoogle.com/#/?origin=https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai
2. **PageSpeed Insights**: https://pagespeed.web.dev/report?url=https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai
3. **Lighthouse 13.0 CLI** (lab-данные):
   ```bash
   npx lighthouse https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai --output html --output-path ./lighthouse-report.html
   ```
4. **WebPageTest** (waterfall анализ): https://webpagetest.org — выбрать локацию "Moscow, Russia"
5. **Bundle анализ**:
   ```bash
   npm install --save-dev @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

---

*Отчёт сгенерирован на основе статического анализа исходного кода. Для получения точных полевых данных (75-й перцентиль) используйте CrUX API или CrUX Vis. Метрика FID устарела и не используется с сентября 2024 г. — все рекомендации по интерактивности касаются исключительно INP.*
