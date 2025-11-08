import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ScrollToTop } from '@/components/scroll-to-top';
import { YandexMetrika } from '@/components/yandex-metrika';
import { OrganizationSchema } from '@/components/tour-schema';

export const metadata: Metadata = {
  title: {
    default: 'Экскурсии в Сочи 2025 — от 900 ₽ | Южный Континент',
    template: '%s | Южный Континент'
  },
  description: 'Лучшие экскурсии в Сочи и Адлере 2025 ⭐ Красная Поляна, 33 водопада, Абхазия, Роза Хутор. Групповые и индивидуальные туры. Без предоплаты. Бронирование онлайн от 900 ₽.',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['сочи', 'курорт', 'отдых', 'черное море', 'отель', 'бронирование', 'экскурсии в Сочи', 'туры в Красную Поляну', 'экскурсии Сочи', 'Красная Поляна', 'отдых в Сочи 2025', 'туры по Сочи'],
  authors: [{ name: 'Южный Континент' }],
  verification: {
    yandex: 'YANDEX_VERIFICATION_CODE', // Заменить на реальный код из Яндекс Вебмастера
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai',
    siteName: 'Южный Континент',
    title: 'Экскурсии в Сочи 2025 — от 900 ₽ | Южный Континент',
    description: 'Лучшие экскурсии в Сочи и Адлере 2025 ⭐ Красная Поляна, 33 водопада, Абхазия, Роза Хутор. Групповые и индивидуальные туры. Без предоплаты. Бронирование онлайн от 900 ₽.',
    images: [
      {
        url: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
        width: 1200,
        height: 630,
        alt: 'Южный Континент - Премиум отдых на Черном море'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Экскурсии в Сочи 2025 — от 900 ₽ | Южный Континент',
    description: 'Лучшие экскурсии в Сочи и Адлере 2025 ⭐ Красная Поляна, 33 водопада, Абхазия, Роза Хутор. Групповые и индивидуальные туры. Без предоплаты.',
    images: ['https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg']
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
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
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