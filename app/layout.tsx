import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: {
    default: 'Курортный Сочи | Премиум отдых на Черном море',
    template: '%s | Курортный Сочи'
  },
  description: 'Забронируйте идеальный отдых в курортном Сочи. Лучшие отели, пляжи и развлечения на побережье Черного моря. Экскурсии в Красную Поляну, туры по достопримечательностям.',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['сочи', 'курорт', 'отдых', 'черное море', 'отель', 'бронирование', 'экскурсии в Сочи', 'туры в Красную Поляну'],
  authors: [{ name: 'Курортный Сочи' }],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://kurortny-sochi.ru',
    siteName: 'Курортный Сочи',
    title: 'Курортный Сочи | Премиум отдых на Черном море',
    description: 'Забронируйте идеальный отдых в курортном Сочи. Лучшие отели, пляжи и развлечения на побережье Черного моря.',
    images: [
      {
        url: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
        width: 1200,
        height: 630,
        alt: 'Курортный Сочи - Премиум отдых на Черном море'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Курортный Сочи | Премиум отдых на Черном море',
    description: 'Забронируйте идеальный отдых в курортном Сочи. Лучшие отели, пляжи и развлечения на побережье Черного моря.',
    images: ['https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg']
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
        </Providers>
      </body>
    </html>
  );
}