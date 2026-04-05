import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты | Южный Континент",
  description: "Контакты Южного Континента: телефон 8 989 166-86-31, адрес Курортный проспект 47, Сочи. Свяжитесь с нами для бронирования экскурсии.",
  alternates: {
    canonical: "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/contact"
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
