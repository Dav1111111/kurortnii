import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О нас | Южный Континент",
  description: "Узнайте о команде Южного Континента — профессиональных гидов и организаторов экскурсий в Сочи, Абхазии и на Красной Поляне с опытом более 10 лет.",
  alternates: {
    canonical: "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/about"
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
