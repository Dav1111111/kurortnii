import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Raleway } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ScrollToTop } from '@/components/scroll-to-top';
import { YandexMetrika } from '@/components/yandex-metrika';
import { OrganizationSchema } from '@/components/tour-schema';

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-raleway',
});

const BASE_URL = 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai';

export const metadata: Metadata = {
  title: {
    default: 'Экскурсии в Сочи 2026 — от 900 ₽ | Южный Континент',
    template: '%s | Южный Континент'
  },
  description: 'Лучшие экскурсии в Сочи и Адлере 2026 ⭐ Красная Поляна, 33 водопада, Абхазия, Роза Хутор. Групповые и индивидуальные туры. Предоплата 20%, остаток на месте. Бронирование онлайн от 900 ₽.',
  manifest: '/manifest.json',
  keywords: [
    'экскурсии в Сочи', 'туры в Сочи', 'отдых в Сочи 2026', 'экскурсии Сочи 2026', 'экскурсии Адлер',
    'Красная Поляна', 'Роза Хутор', 'Олимпийский парк', '33 водопада', 'Абхазия', 'озеро Рица',
    'Новый Афон', 'Гагра', 'Ущелье ведьм', 'Гегский водопад', 'парк Ривьера',
    'джипинг Сочи', 'джиппинг в Абхазию', 'джип туры', 'морская прогулка Сочи',
    'обзорная экскурсия Сочи', 'вечерний Сочи', 'шоу фонтанов Сочи',
    'аквапарк Наутилус', 'дельфинарий Сочи', 'океанариум Сочи', 'экскурсии для детей',
    'экскурсии в Абхазию', 'Золотое кольцо Абхазии', 'Гостеприимная Абхазия',
    'Новоафонская пещера', 'Голубое озеро', 'Юпшарский каньон',
    'водопад Девичьи слёзы', 'водопад Любви', 'чайные плантации Сочи',
    'горы Сочи', 'горные туры', 'каньоны Сочи',
    'групповые экскурсии', 'индивидуальные туры',
    'бронирование экскурсий', 'цены на экскурсии Сочи'
  ],
  authors: [{ name: 'Южный Континент' }],
  verification: {
    yandex: 'YANDEX_VERIFICATION_CODE',
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: BASE_URL,
    siteName: 'Южный Континент',
    title: 'Экскурсии в Сочи 2026 — от 900 ₽ | Южный Континент',
    description: 'Лучшие экскурсии в Сочи и Адлере 2026 ⭐ Красная Поляна, 33 водопада, Абхазия, Роза Хутор. Групповые и индивидуальные туры. Предоплата 20%, остаток на месте. Бронирование онлайн от 900 ₽.',
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Южный Континент — Экскурсии в Сочи'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Экскурсии в Сочи 2026 — от 900 ₽ | Южный Континент',
    description: 'Лучшие экскурсии в Сочи и Адлере 2026 ⭐ Красная Поляна, 33 водопада, Абхазия, Роза Хутор. Групповые и индивидуальные туры.',
    images: [`${BASE_URL}/og-image.jpg`]
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  }
};

export const viewport: Viewport = {
  themeColor: '#40E0D0',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={raleway.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body className="font-sans antialiased">
        <OrganizationSchema />
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ScrollToTop />
        </Providers>
        <YandexMetrika />
      </body>
    </html>
  );
}
