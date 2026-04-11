import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Raleway } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ScrollToTop } from '@/components/scroll-to-top';
import { WhatsAppFab } from '@/components/whatsapp-fab';
import { YandexMetrika } from '@/components/yandex-metrika';
import { OrganizationSchema, WebSiteSchema } from '@/components/tour-schema';

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600', '800'],
  display: 'swap',
  variable: '--font-raleway',
});

const BASE_URL = 'https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai';

export const metadata: Metadata = {
  title: {
    default: 'Экскурсии в Сочи 2026 — от 900 ₽ | Южный Континент',
    template: '%s | Южный Континент'
  },
  description: 'Экскурсии в Сочи 2026 — Красная Поляна, 33 водопада, Абхазия, Роза Хутор. Групповые и индивидуальные туры от 900 руб. Предоплата 20%.',
  manifest: '/manifest.json',
  authors: [{ name: 'Южный Континент' }],
  ...(process.env.YANDEX_VERIFICATION_CODE && {
    verification: {
      yandex: process.env.YANDEX_VERIFICATION_CODE,
    },
  }),
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: BASE_URL,
    siteName: 'Южный Континент',
    title: 'Экскурсии в Сочи 2026 — от 900 ₽ | Южный Континент',
    description: 'Экскурсии в Сочи 2026 — Красная Поляна, 33 водопада, Абхазия, Роза Хутор. Групповые и индивидуальные туры от 900 руб.',
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
    description: 'Экскурсии в Сочи 2026 — Красная Поляна, 33 водопада, Абхазия, Роза Хутор. Групповые и индивидуальные туры от 900 руб.',
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
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="preload" as="image" href="/hero-828.webp" media="(max-width: 828px)" type="image/webp" />
        <link rel="preload" as="image" href="/hero-1920.webp" media="(min-width: 829px)" type="image/webp" />
      </head>
      <body className="font-sans antialiased">
        <OrganizationSchema />
        <WebSiteSchema />
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ScrollToTop />
          <WhatsAppFab />
        </Providers>
        <YandexMetrika />
      </body>
    </html>
  );
}
