import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Экскурсии в Сочи 2026 — Цены от 900 ₽ | Бронирование онлайн',
  description: 'Лучшие экскурсии в Сочи и Адлере 2026 ⭐ Красная Поляна, 33 водопада, Абхазия, Роза Хутор. Предоплата 20%, остаток на месте. Отмена за 24 часа. Цены от 900 ₽.',
  keywords: [
    'экскурсии в Сочи',
    'экскурсии Адлер 2026',
    'туры по Сочи',
    'экскурсии Красная Поляна',
    'экскурсии Роза Хутор',
    '33 водопада экскурсия',
    'экскурсии в Абхазию из Сочи',
    'бронирование экскурсий Сочи',
    'групповые экскурсии Сочи',
    'джип туры Сочи',
    'морские прогулки Сочи'
  ],
  openGraph: {
    title: 'Экскурсии в Сочи 2026 — Цены от 900 ₽ | Южный Континент',
    description: 'Лучшие экскурсии в Сочи и Адлере 2026 ⭐ Красная Поляна, 33 водопада, Абхазия. Предоплата 20%, остаток на месте.',
    url: 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours',
    siteName: 'Южный Континент',
    locale: 'ru_RU',
    type: 'website',
  },
  alternates: {
    canonical: 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/tours',
  },
};

export default function ToursLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
