import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ScrollToTop } from '@/components/scroll-to-top';
import { YandexMetrika } from '@/components/yandex-metrika';

export const metadata: Metadata = {
  title: {
    default: 'Южный Континент | Премиум отдых на Черном море',
    template: '%s | Южный Континент'
  },
  description: 'Забронируйте идеальный отдых в курортном Сочи. Лучшие отели, пляжи и развлечения на побережье Черного моря. Экскурсии в Красную Поляну, туры по достопримечательностям.',
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
    url: 'https://kurortny-sochi.ru',
    siteName: 'Южный Континент',
    title: 'Южный Континент | Премиум отдых на Черном море',
    description: 'Забронируйте идеальный отдых в курортном Сочи. Лучшие отели, пляжи и развлечения на побережье Черного моря.',
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
    title: 'Южный Континент | Премиум отдых на Черном море',
    description: 'Забронируйте идеальный отдых в курортном Сочи. Лучшие отели, пляжи и развлечения на побережье Черного моря.',
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