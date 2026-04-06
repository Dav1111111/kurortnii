import type { Metadata } from "next";
import { AboutPageSchema } from "@/components/tour-schema";

export const metadata: Metadata = {
  title: "О нас — 12 лет экскурсий в Сочи",
  description: "Узнайте о команде Южного Континента — профессиональных гидов и организаторов экскурсий в Сочи, Абхазии и на Красной Поляне с опытом более 12 лет.",
  alternates: {
    canonical: "https://xn----jtbbjdhsdbbg3ce9iub.xn--p1ai/about"
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AboutPageSchema />
      {children}
    </>
  );
}
